import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';
import { EditorComponent } from './editor.component';

import SpyObj = jasmine.SpyObj;
// tslint:disable: no-magic-numbers

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let resizeDrawingService: ResizeDrawingService;
    let style: CSSStyleDeclaration;
    let newdrawServiceSpy: SpyObj<NewDrawingService>;

    beforeEach(async(() => {
        resizeDrawingService = new ResizeDrawingService();
        newdrawServiceSpy = jasmine.createSpyObj('newDrawingService', ['openWarning']);

        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: ResizeDrawingService, useValue: resizeDrawingService },
                { provide: NewDrawingService, useValue: newdrawServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        style = {
            display: 'none',
        } as CSSStyleDeclaration;

        component.previewDiv = {
            style,
        } as HTMLDivElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should click brush button', () => {
        const keyEvent = {
            key: 'w',
        } as KeyboardEvent;
        const brushButton = document.querySelector('#Pinceau') as HTMLElement;
        const spy = spyOn(brushButton, 'click');
        component.handleKeyUp(keyEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call toolSectionService.currentTool.onKeyUp', () => {
        const keyEvent = {
            key: 'shift',
        } as KeyboardEvent;
        const spy = spyOn(component.toolSelectionService.currentTool, 'onKeyUp');
        component.handleKeyUp(keyEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call toolSectionService.currentTool.onKeyDown', () => {
        const keyEvent = {
            key: 'shift',
        } as KeyboardEvent;
        const spy = spyOn(component.toolSelectionService.currentTool, 'onKeyDown');
        component.handleKeyDown(keyEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should set previewDiv display to block', () => {
        const canvasResizePoint = fixture.debugElement.nativeElement.querySelector('.canvasResizePoint');
        canvasResizePoint.dispatchEvent(new Event('mousedown'));
        expect(component.previewDiv.style.display).toEqual('block');
    });

    it('should call resizeDrawingService.onMouseDown', () => {
        const mouseEvent = {} as MouseEvent;
        const spy = spyOn(component.resizeDrawingService, 'onMouseDown');
        component.onMouseDown(mouseEvent);
        expect(spy).toHaveBeenCalledWith(mouseEvent);
    });

    it('should call resizeDrawingService.resizeCanvas on mousemove', () => {
        const spy = spyOn(component.resizeDrawingService, 'resizeCanvas');
        fixture.debugElement.nativeElement.dispatchEvent(new Event('mousemove'));
        expect(spy).toHaveBeenCalled();
    });

    it('should not resize canvas if resizeDrawingService.mouseDown is false', () => {
        const expectedResult = component.canvasSize;
        component.previewSize = { x: 500, y: 500 };
        component.resizeDrawingService.mouseDown = false;
        const mouseEvent = {} as MouseEvent;
        component.onMouseUp(mouseEvent);
        expect(component.canvasSize).toEqual(expectedResult);
    });

    it('should resize canvas onMouseUp if resizeDrawingService.mouseDown is false', () => {
        const expectedResult = { x: 500, y: 500 };
        component.previewSize = { x: 500, y: 500 };
        component.resizeDrawingService.mouseDown = true;
        const mouseEvent = {} as MouseEvent;
        component.onMouseUp(mouseEvent);
        expect(component.canvasSize).toEqual(expectedResult);
    });

    it('canvas should have same context after resize', () => {
        const ctxBeforeResize = component.drawingComponent.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctxBeforeResize.beginPath();
        ctxBeforeResize.rect(0, 0, 10, 15);
        ctxBeforeResize.fillRect(0, 0, 10, 15);
        ctxBeforeResize.stroke();
        const imageBeforeResize = ctxBeforeResize.getImageData(0, 0, 20, 20);

        component.previewSize = { x: 500, y: 500 };
        component.resizeDrawingService.mouseDown = true;
        const mouseEvent = {} as MouseEvent;
        component.onMouseUp(mouseEvent);

        const ctxAfterResize = component.drawingComponent.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const imageAfterResize = ctxAfterResize.getImageData(0, 0, 20, 20);
        expect(imageAfterResize).toEqual(imageBeforeResize);
    });

    it('should set previewDiv display to none', () => {
        component.previewDiv.style.display = 'block';
        component.resizeDrawingService.mouseDown = true;
        const mouseEvent = {} as MouseEvent;
        component.onMouseUp(mouseEvent);

        expect(component.previewDiv.style.display).toEqual('none');
    });

    it('should set canvas size depending on workspaceSize', () => {
        const workSpaceSize = component.getWorkSpaceSize();
        expect(component.canvasSize).toEqual({ x: workSpaceSize.x / 2, y: workSpaceSize.y / 2 });
    });

    it('should call openDialog when ctrl+0 press', () => {
        const keyEvent = { key: '0', ctrlKey: true } as KeyboardEvent;
        component.handleKeyDown(keyEvent);
        expect(newdrawServiceSpy.openWarning).toHaveBeenCalled();
    });
});

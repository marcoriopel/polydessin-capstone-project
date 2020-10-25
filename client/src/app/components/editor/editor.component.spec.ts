import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';
import { EditorComponent } from './editor.component';

import SpyObj = jasmine.SpyObj;
// tslint:disable: no-magic-numbers
class KeyEventMock {
    key: string = 'o';
    ctrlKey: boolean = true;
    // tslint:disable-next-line: no-empty
    preventDefault(): void {}
}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let resizeDrawingService: ResizeDrawingService;
    let style: CSSStyleDeclaration;
    let matDialog: MatDialog;
    let newdrawServiceSpy: SpyObj<NewDrawingService>;
    let drawServiceSpy: SpyObj<DrawingService>;

    beforeEach(async(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['initializeBaseCanvas']);
        resizeDrawingService = new ResizeDrawingService(drawServiceSpy as DrawingService);
        newdrawServiceSpy = jasmine.createSpyObj('newDrawingService', ['openWarning']);
        matDialog = {} as MatDialog;

        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: ResizeDrawingService, useValue: resizeDrawingService },
                { provide: NewDrawingService, useValue: newdrawServiceSpy },
                { provide: MatDialog, useValue: matDialog },
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

    it('should call resizeDrawingService.onMouseUp on mouseUp', () => {
        const eventSpy = spyOn(resizeDrawingService, 'onMouseUp');
        component.resizeDrawingService.mouseDown = true;
        const mouseEvent = {} as MouseEvent;
        component.onMouseUp(mouseEvent);
        expect(eventSpy).toHaveBeenCalled();
    });

    it('should set previewDiv display to none', () => {
        const eventSpy = spyOn(resizeDrawingService, 'onMouseUp');
        component.previewDiv.style.display = 'block';
        component.resizeDrawingService.mouseDown = true;
        const mouseEvent = {} as MouseEvent;
        component.onMouseUp(mouseEvent);

        expect(eventSpy).toHaveBeenCalled();
        expect(component.previewDiv.style.display).toEqual('none');
    });

    it('should call event.preventDefault when ctrl+o press', () => {
        const keyEvent = new KeyEventMock() as KeyboardEvent;
        const eventSpy = spyOn(keyEvent, 'preventDefault');
        component.handleKeyDown(keyEvent);
        expect(eventSpy).toHaveBeenCalled();
    });

    it('should call openDialog when ctrl+o press', () => {
        const keyEvent = new KeyEventMock() as KeyboardEvent;
        component.handleKeyDown(keyEvent);
        expect(newdrawServiceSpy.openWarning).toHaveBeenCalled();
    });
});

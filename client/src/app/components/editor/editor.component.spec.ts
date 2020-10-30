import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { Subject } from 'rxjs';
import { EditorComponent } from './editor.component';

import SpyObj = jasmine.SpyObj;
// tslint:disable: no-magic-numbers

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let resizeDrawingServiceSpy: SpyObj<ResizeDrawingService>;
    let style: CSSStyleDeclaration;
    let hotkeyServiceSpy: SpyObj<HotkeyService>;
    let toolSelectionServiceSpy: SpyObj<ToolSelectionService>;
    let obs: Subject<string>;
    let keyboardEvent: KeyboardEvent;

    beforeEach(async(() => {
        toolSelectionServiceSpy = jasmine.createSpyObj('ToolSelectionService', [
            'currentToolKeyUp',
            'currentToolKeyDown',
            'changeTool',
            'setCurrentToolCursor',
            'currentToolMouseMove',
            'currentToolMouseDown',
            'currentToolMouseUp',
            'currentToolMouseLeave',
        ]);
        resizeDrawingServiceSpy = jasmine.createSpyObj('ResizeDrawingService', ['onMouseDown', 'resizeCanvas', 'onMouseUp', 'setDefaultCanvasSize']);

        hotkeyServiceSpy = jasmine.createSpyObj('HotkeyService', ['onKeyDown', 'getKey']);
        obs = new Subject<string>();
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());

        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: HotkeyService, useValue: hotkeyServiceSpy },
                { provide: ToolSelectionService, useValue: toolSelectionServiceSpy },
                { provide: ResizeDrawingService, useValue: resizeDrawingServiceSpy },
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
        keyboardEvent = new KeyboardEvent('keydown', { key: 'w' });
        const eventSpy = spyOn(keyboardEvent, 'preventDefault');
        component.onKeyDown(keyboardEvent);
        expect(hotkeyServiceSpy.onKeyDown).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalled();
    });

    it('should call toolSectionService.currentTool.onKeyUp', () => {
        const keyEvent = {
            key: 'shift',
        } as KeyboardEvent;
        component.onKeyUp(keyEvent);
        expect(toolSelectionServiceSpy.currentToolKeyUp).toHaveBeenCalled();
    });

    it('should call toolSectionService.currentToolKeyDown', () => {
        keyboardEvent = new KeyboardEvent('keydown', { key: 'u' });
        const eventSpy = spyOn(keyboardEvent, 'preventDefault');
        component.onKeyDown(keyboardEvent);
        expect(toolSelectionServiceSpy.currentToolKeyDown).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalled();
    });

    it('should set previewDiv display to block', () => {
        const canvasResizePoint = fixture.debugElement.nativeElement.querySelector('.canvasResizePoint');
        canvasResizePoint.dispatchEvent(new Event('mousedown'));
        expect(component.previewDiv.style.display).toEqual('block');
    });

    it('should call resizeDrawingService.onMouseDown', () => {
        const mouseEvent = {} as MouseEvent;
        component.onMouseDown(mouseEvent);
        expect(resizeDrawingServiceSpy.onMouseDown).toHaveBeenCalledWith(mouseEvent);
    });

    it('should call resizeDrawingService.resizeCanvas on mousemove', () => {
        fixture.debugElement.nativeElement.dispatchEvent(new Event('mousemove'));
        expect(resizeDrawingServiceSpy.resizeCanvas).toHaveBeenCalled();
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
        component.resizeDrawingService.mouseDown = true;
        const mouseEvent = {} as MouseEvent;
        component.onMouseUp(mouseEvent);
        expect(resizeDrawingServiceSpy.onMouseUp).toHaveBeenCalled();
    });

    it('should set previewDiv display to none', () => {
        component.previewDiv.style.display = 'block';
        component.resizeDrawingService.mouseDown = true;
        const mouseEvent = {} as MouseEvent;
        component.onMouseUp(mouseEvent);
        expect(resizeDrawingServiceSpy.onMouseUp).toHaveBeenCalled();
        expect(component.previewDiv.style.display).toEqual('none');
    });

    it('should call event.preventDefault when pressing a', () => {
        keyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
        const eventSpy = spyOn(keyboardEvent, 'preventDefault');
        component.onKeyDown(keyboardEvent);
        expect(eventSpy).toHaveBeenCalled();
    });
});

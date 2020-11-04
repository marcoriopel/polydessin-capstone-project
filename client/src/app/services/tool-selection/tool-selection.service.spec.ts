import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { SavingComponent } from '@app/components/saving/saving.component';
import { SIDEBAR_ELEMENTS } from '@app/ressources/global-variables/sidebar-elements';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { BrushService } from '@app/services/tools/brush.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { FillService } from '@app/services/tools/fill.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { SquareService } from '@app/services/tools/square.service';
import { Subject } from 'rxjs';
import { SelectionService } from '../tools/selection.service';

import SpyObj = jasmine.SpyObj;

class MockTool extends Tool {
    constructor(name: string) {
        super({} as DrawingService);
        this.name = name;
    }
}

describe('ToolSelectionService', () => {
    let service: ToolSelectionService;
    let hotkeyServiceSpy: SpyObj<HotkeyService>;
    let matdialogSpy: SpyObj<MatDialog>;
    let newDrawingServiceSpy: SpyObj<NewDrawingService>;
    let drawingServiceSpy: SpyObj<DrawingService>;
    let obs: Subject<string>;
    let keyboardEvent: KeyboardEvent;
    beforeEach(() => {
        obs = new Subject<string>();
        matdialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        newDrawingServiceSpy = jasmine.createSpyObj('NewDrawingService', ['openWarningModal']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['openWarning', 'clearCanvas']);
        hotkeyServiceSpy = jasmine.createSpyObj('HotkeyService', ['getKey']);
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: HotkeyService, useValue: hotkeyServiceSpy },
                { provide: MatDialog, useValue: matdialogSpy },
                { provide: NewDrawingService, useValue: newDrawingServiceSpy },
                { provide: PencilService, useValue: new MockTool(TOOL_NAMES.PENCIL_TOOL_NAME) },
                { provide: SelectionService, useValue: new MockTool(TOOL_NAMES.SELECTION_TOOL_NAME) },
                { provide: EraserService, useValue: new MockTool(TOOL_NAMES.ERASER_TOOL_NAME) },
                { provide: BrushService, useValue: new MockTool(TOOL_NAMES.BRUSH_TOOL_NAME) },
                { provide: SquareService, useValue: new MockTool(TOOL_NAMES.SQUARE_TOOL_NAME) },
                { provide: CircleService, useValue: new MockTool(TOOL_NAMES.CIRCLE_TOOL_NAME) },
                { provide: LineService, useValue: new MockTool(TOOL_NAMES.LINE_TOOL_NAME) },
                { provide: FillService, useValue: new MockTool(TOOL_NAMES.FILL_TOOL_NAME) },
            ],
        });
        service = TestBed.inject(ToolSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change tool', () => {
        service.changeTool(TOOL_NAMES.ERASER_TOOL_NAME);
        expect(service.currentTool.name).toBe(TOOL_NAMES.ERASER_TOOL_NAME);
    });

    it('should clear canvas when tool change', () => {
        service.changeTool(TOOL_NAMES.ERASER_TOOL_NAME);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should get current tool', () => {
        expect(service.getCurrentToolName()).toBe(service.currentTool.name);
    });

    it('should not change current tool if changeTool is called with an invalid tool name', () => {
        service.changeTool('invalid tool name');
        expect(service.currentTool.name).toBe(TOOL_NAMES.PENCIL_TOOL_NAME);
    });

    it('should change current tool if changeTool is called with a valid tool name', () => {
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(TOOL_NAMES.ERASER_TOOL_NAME);
        expect(service.currentTool.name).toBe(TOOL_NAMES.ERASER_TOOL_NAME);
    });

    it('should call openWarning of newdrawing on newDrawing call', () => {
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(SIDEBAR_ELEMENTS.NEW_DRAWING_NAME);
        expect(newDrawingServiceSpy.openWarningModal).toHaveBeenCalled();
    });

    it('should open carousel component on call', () => {
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(SIDEBAR_ELEMENTS.CAROUSEL_NAME);
        expect(matdialogSpy.open).toHaveBeenCalledWith(CarouselComponent);
    });

    it('should open save component on call', () => {
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(SIDEBAR_ELEMENTS.SAVE_SERVER_NAME);
        expect(matdialogSpy.open).toHaveBeenCalledWith(SavingComponent);
    });

    it('should call current tool keyup on keyup event', () => {
        keyboardEvent = new KeyboardEvent('keyup', { key: 'w' });
        const keyUpSpy = spyOn(service.currentTool, 'onKeyUp');
        service.currentToolKeyUp(keyboardEvent);
        expect(keyUpSpy).toHaveBeenCalledWith(keyboardEvent);
    });

    it('should call current tool keydown on keydown event', () => {
        keyboardEvent = new KeyboardEvent('keydown', { key: 'w' });
        const keyDownSpy = spyOn(service.currentTool, 'onKeyDown');
        service.currentToolKeyDown(keyboardEvent);
        expect(keyDownSpy).toHaveBeenCalledWith(keyboardEvent);
    });

    it('should call current tool mousemove on mousemove event', () => {
        const event = {} as MouseEvent;
        const mouseMoveSpy = spyOn(service.currentTool, 'onMouseMove');
        service.currentToolMouseMove(event);
        expect(mouseMoveSpy).toHaveBeenCalledWith(event);
    });

    it('should call current tool mousedown on mousedown event', () => {
        const event = {} as MouseEvent;
        const mouseDownSpy = spyOn(service.currentTool, 'onMouseDown');
        service.currentToolMouseDown(event);
        expect(mouseDownSpy).toHaveBeenCalledWith(event);
    });

    it('should call current tool mouseup on mouseup event', () => {
        const event = {} as MouseEvent;
        const mouseUpSpy = spyOn(service.currentTool, 'onMouseUp');
        service.currentToolMouseUp(event);
        expect(mouseUpSpy).toHaveBeenCalledWith(event);
    });

    it('should call current tool onMouseLeave on onMouseLeave event', () => {
        const mouseLeaveSpy = spyOn(service.currentTool, 'onMouseLeave');
        service.currentToolMouseLeave();
        expect(mouseLeaveSpy).toHaveBeenCalled();
    });

    it('should call setCursor on call', () => {
        const cursorSpy = spyOn(service.currentTool, 'setCursor');
        service.setCurrentToolCursor();
        expect(cursorSpy).toHaveBeenCalled();
    });
});

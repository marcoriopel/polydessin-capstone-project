import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SIDEBAR_ELEMENTS } from '@app/ressources/global-variables/sidebar-elements';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { Subject } from 'rxjs';

import SpyObj = jasmine.SpyObj;

describe('ToolSelectionService', () => {
    let service: ToolSelectionService;
    let eraserService: EraserService;
    let pencilService: PencilService;
    let hotkeyServiceSpy: SpyObj<HotkeyService>;
    let matdialogSpy: SpyObj<MatDialog>;
    let newDrawingServiceSpy: SpyObj<NewDrawingService>;
    let obs: Subject<string>;
    let keyboardEvent: KeyboardEvent;

    beforeEach(() => {
        obs = new Subject<string>();
        matdialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        newDrawingServiceSpy = jasmine.createSpyObj('NewDrawingService', ['openWarning']);
        hotkeyServiceSpy = jasmine.createSpyObj('HotkeyService', ['getKey']);
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        TestBed.configureTestingModule({
            providers: [
                { provide: HotkeyService, useValue: hotkeyServiceSpy },
                { provide: MatDialog, useValue: matdialogSpy },
                { provide: NewDrawingService, useValue: newDrawingServiceSpy },
            ],
        });
        service = TestBed.inject(ToolSelectionService);
        eraserService = TestBed.inject(EraserService);
        pencilService = TestBed.inject(PencilService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change tool', () => {
        service.changeTool(TOOL_NAMES.ERASER_TOOL_NAME);
        expect(service.currentTool).toBe(eraserService);
    });

    it('should get current tool', () => {
        expect(service.getCurrentToolName()).toBe(pencilService.name);
    });

    it('should not change current tool if changeTool is called with an invalid tool name', () => {
        service.currentTool = pencilService;
        service.changeTool('invalid tool name');
        expect(service.currentTool).toBe(pencilService);
    });

    it('should change current tool if changeTool is called with a valid tool name', () => {
        service.currentTool = pencilService;
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(TOOL_NAMES.ERASER_TOOL_NAME);
        expect(service.currentTool).toBe(eraserService);
    });

    it('should call openWarning of newdrawing on newDrawing call', () => {
        service.currentTool = pencilService;
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(SIDEBAR_ELEMENTS.NEW_DRAWING_NAME);
        expect(newDrawingServiceSpy);
    });

    it('should open carousel component on call', () => {
        service.currentTool = pencilService;
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(SIDEBAR_ELEMENTS.CAROUSEL_NAME);
        expect(matdialogSpy);
    });

    it('should open save component on call', () => {
        service.currentTool = pencilService;
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(SIDEBAR_ELEMENTS.SAVE_SERVER_NAME);
        expect(matdialogSpy);
    });

    it('should call current tool keyup on keyup event', () => {
        keyboardEvent = new KeyboardEvent('keyup', { key: 'w' });
        service.currentToolKeyUp(keyboardEvent);
        expect(pencilService.onKeyUp).toHaveBeenCalledWith(keyboardEvent);
    });
});

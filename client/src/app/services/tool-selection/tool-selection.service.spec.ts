import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { Subject } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('ToolSelectionService', () => {
    let service: ToolSelectionService;
    let eraserService: EraserService;
    let pencilService: PencilService;
    let drawingServiceSpy: SpyObj<DrawingService>;
    let hotkeyServiceSpy: SpyObj<HotkeyService>;
    let matdialogSpy: SpyObj<MatDialog>;
    let obs: Subject<string>;

    beforeEach(() => {
        obs = new Subject<string>();
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        matdialogSpy = jasmine.createSpyObj('dialog', ['open']);
        hotkeyServiceSpy = jasmine.createSpyObj('HotkeyService', ['getKey']);
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: HotkeyService, useValue: hotkeyServiceSpy },
                { provide: MatDialog, useValue: matdialogSpy },
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

    it('should clear canvas when tool change', () => {
        service.changeTool(TOOL_NAMES.ERASER_TOOL_NAME);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should get current tool', () => {
        expect(service.getCurrentToolName()).toBe(pencilService.name);
    });

    it('should not change current tool if changeTool is called with an invalid tool name', () => {
        service.currentTool = pencilService;
        service.changeTool('invalid tool name');
        expect(service.currentTool).toBe(pencilService);
    });
});

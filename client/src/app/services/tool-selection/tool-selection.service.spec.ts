import { TestBed } from '@angular/core/testing';
import { TOOL_NAMES } from '@app/ressources/global-variables';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { PencilService } from '@app/services/tools/pencil-service';

describe('ToolSelectionService', () => {
    let service: ToolSelectionService;
    let eraserService: EraserService;
    let pencilService: PencilService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolSelectionService);
        eraserService = TestBed.inject(EraserService);
        pencilService = TestBed.inject(PencilService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change tool', () => {
        service.onToolChange(TOOL_NAMES.ERASER_TOOL_NAME);
        expect(service.currentTool).toBe(eraserService);
    });

    it('should get current tool', () => {
        expect(service.getCurrentToolName()).toBe(pencilService.name);
    });
});

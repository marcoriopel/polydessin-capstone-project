import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class FillService extends Tool {
    name: string = TOOL_NAMES.FILL_TOOL_NAME;
    tolerance: number = 0;

    constructor(public drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }

    handleCursor(): void {
        const previewCanvas = this.drawingService.previewCanvas;
        previewCanvas.style.cursor = 'crosshair';
    }
}

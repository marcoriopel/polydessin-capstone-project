import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { TOOL_NAMES } from '@app/ressources/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    name: string = TOOL_NAMES.ERASER_TOOL_NAME;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }
}

import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ColorSelectionService } from '../color-selection/color-selection.service';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PenService extends Tool {
    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }
}

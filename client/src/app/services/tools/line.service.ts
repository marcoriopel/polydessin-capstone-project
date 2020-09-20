import { Injectable } from '@angular/core';
import { TOOL_NAMES } from '@app/../ressources/global-variables';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    name: string = TOOL_NAMES.LINE_TOOL_NAME;
    startingMousePosition: Vec2;
    endingCoordinates: Vec2;
    isFirstClick: boolean = true;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isFirstClick) {
            this.startingMousePosition = this.getPositionFromMouse(event);
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.moveTo(this.startingMousePosition.x, this.startingMousePosition.y);
            this.isFirstClick = false;
        } else {
            this.endingCoordinates = this.getPositionFromMouse(event);
            this.drawingService.previewCtx.lineTo(this.endingCoordinates.x, this.endingCoordinates.y);
            this.drawingService.previewCtx.stroke();
            this.isFirstClick = true;
        }
    }
}

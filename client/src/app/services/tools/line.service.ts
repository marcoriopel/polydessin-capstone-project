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
    endingMousePosition: Vec2;
    isDrawing: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        if (!this.isDrawing) {
            // Record beginning of line position
            this.startingMousePosition = this.getPositionFromMouse(event);
            this.isDrawing = true;
        } else {
            // Record end of line position and draw line on base canvas
            this.endingMousePosition = this.getPositionFromMouse(event);
            this.drawLine(this.startingMousePosition, this.endingMousePosition, false);
            this.isDrawing = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.isDrawing) return;
        // Clear the old line preview
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        // Get new coordinates for end of line
        this.endingMousePosition = this.getPositionFromMouse(event);

        // Draw the new line preview
        this.drawLine(this.startingMousePosition, this.endingMousePosition, true);
    }

    drawLine(startingPoint: Vec2, endingPoint: Vec2, isPreview: boolean): void {
        if (isPreview) {
            // Using the preview canvas
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.moveTo(startingPoint.x, startingPoint.y);
            this.drawingService.previewCtx.lineTo(endingPoint.x, endingPoint.y);
            this.drawingService.previewCtx.stroke();
        } else {
            // Using the base canvas
            this.drawingService.baseCtx.beginPath();
            this.drawingService.baseCtx.moveTo(startingPoint.x, startingPoint.y);
            this.drawingService.baseCtx.lineTo(endingPoint.x, endingPoint.y);
            this.drawingService.baseCtx.stroke();
        }
    }
}

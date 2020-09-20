import { Injectable } from '@angular/core';
import { TOOL_NAMES } from '@app/../ressources/global-variables';
import { Line } from '@app/classes/line';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    name: string = TOOL_NAMES.LINE_TOOL_NAME;
    isDrawing: boolean = false;
    numberOfClicks: number = 0;
    mouseClicks: Vec2[] = [];
    storedLines: Line[] = [];
    line: Line;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.isDrawing = true;
        this.mouseClicks.push(this.getPositionFromMouse(event));
        this.numberOfClicks = this.mouseClicks.length;

        // Check if it's a new line
        if (this.numberOfClicks > 1) {
            // Check if it is a double click
            if (this.checkIfDoubleClick(event)) {
                this.isDrawing = false;

                // Draw line on base canvas
                this.storedLines.forEach((line) => {
                    this.drawLine(line.startingPoint, line.endingPoint, false);
                });

                // Clear the preview canvas and the mouse clicks used to create the previous line
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseClicks = [];
                return;
            }

            if (this.isDrawing) {
                // Create a new line segment
                this.line = {
                    startingPoint: this.mouseClicks[this.numberOfClicks - 2],
                    endingPoint: this.mouseClicks[this.numberOfClicks - 1],
                };

                // Draw the line with the new segment
                this.drawLine(this.line.startingPoint, this.line.endingPoint, true);

                // Add the new line segment to stored lines
                this.storedLines.push(this.line);
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.isDrawing) return;

        // Clear the old line segment preview
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        // Restore previous line segments
        this.storedLines.forEach((line) => {
            this.drawLine(line.startingPoint, line.endingPoint, true);
        });

        // Get new coordinates for end of line
        const endingClickCoordinates = this.getPositionFromMouse(event);

        // Draw the new line preview
        this.drawLine(this.mouseClicks[this.numberOfClicks - 1], endingClickCoordinates, true);
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

    checkIfDoubleClick(event: MouseEvent): boolean {
        const previousClickX = this.mouseClicks[this.numberOfClicks - 2].x;
        const previousClickY = this.mouseClicks[this.numberOfClicks - 2].y;
        const currentClickX = this.mouseClicks[this.numberOfClicks - 1].x;
        const currentClickY = this.mouseClicks[this.numberOfClicks - 1].y;

        if (previousClickX === currentClickX && previousClickY === currentClickY) {
            return true;
        }
        return false;
    }
}

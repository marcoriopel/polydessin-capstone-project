import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';

@Injectable({
    providedIn: 'root',
})
export class SquareService extends Tool {
    name: string = TOOL_NAMES.SQUARE_TOOL_NAME;
    mouseDown: boolean;
    width: number = 1;
    lastPoint: Vec2;
    firstPoint: Vec2;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.mouseDown = false;
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.firstPoint = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastPoint = this.getPositionFromMouse(event);
            const topLeftPoint = this.findTopLeftPoint(this.firstPoint, this.lastPoint);
            this.drawRectangle(this.drawingService.baseCtx, topLeftPoint);
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastPoint = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const topLeftPoint = this.findTopLeftPoint(this.firstPoint, this.lastPoint);
            this.drawRectangle(this.drawingService.previewCtx, topLeftPoint);
        }
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, point: Vec2): void {
        ctx.beginPath();
        ctx.rect(point.x, point.y, this.rectangleWidth, this.rectangleHeight);
        ctx.fillRect(point.x, point.y, this.rectangleWidth, this.rectangleHeight);
        ctx.stroke();
    }

    /*
     to find the top left point of the rectangle or the square
     */
    private findTopLeftPoint(point1: Vec2, point2: Vec2): Vec2 {
        let x = point1.x;
        let y = point1.y;
        // in the left edge
        if (point1.x > point2.x && point1.y > point2.y) {
            x = point2.x;
            y = point2.y;
        } else if (point1.x > point2.x && point1.y < point2.y) {
            x = point2.x;
            y = point1.y;
        } else if (point1.x < point2.x && point1.y > point2.y) {
            x = point1.x;
            y = point2.y;
        }

        return { x, y };
    }

    get rectangleWidth(): number {
        return Math.abs(this.firstPoint.x - this.lastPoint.x);
    }

    get rectangleHeight(): number {
        return Math.abs(this.firstPoint.y - this.lastPoint.y);
    }

    get squareWidth(): number {
        return this.width > this.rectangleHeight ? this.width : this.rectangleHeight;
    }
}

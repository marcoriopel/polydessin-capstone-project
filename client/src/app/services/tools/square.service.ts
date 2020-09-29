import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SquareService extends Tool {
    name: string = TOOL_NAMES.SQUARE_TOOL_NAME;
    mouseDown: boolean;
    isShiftKeyDown: boolean = false;
    width: number = 1;
    lastPoint: Vec2;
    firstPoint: Vec2;
    previewLayer: HTMLElement | null;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
        this.mouseDown = false;
    }

    handleCursor(): void {
        const previewCanvas = this.drawingService.previewCanvas;
        if (previewCanvas) {
            previewCanvas.style.cursor = 'crosshair';
        }
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
            this.drawShape(this.drawingService.baseCtx, topLeftPoint);
            this.mouseDown = false;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftKeyDown = true;
            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                const topLeftPoint = this.findTopLeftPoint(this.firstPoint, this.lastPoint);
                this.drawShape(this.drawingService.previewCtx, topLeftPoint);
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftKeyDown = false;
            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                const topLeftPoint = this.findTopLeftPoint(this.firstPoint, this.lastPoint);
                this.drawShape(this.drawingService.previewCtx, topLeftPoint);
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastPoint = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const topLeftPoint = this.findTopLeftPoint(this.firstPoint, this.lastPoint);
            this.drawShape(this.drawingService.previewCtx, topLeftPoint);
        }
    }

    private drawShape(ctx: CanvasRenderingContext2D, point: Vec2): void {
        ctx.fillStyle = this.colorSelectionService.primaryColor;
        ctx.strokeStyle = this.colorSelectionService.secondaryColor;
        ctx.globalAlpha = this.colorSelectionService.primaryOpacity;
        ctx.lineWidth = this.width;
        ctx.beginPath();

        if (this.isShiftKeyDown) {
            this.drawSquare(ctx, point);
        } else {
            this.drawRectangle(ctx, point);
        }

        ctx.stroke();
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, point: Vec2): void {
        ctx.rect(point.x, point.y, this.rectangleWidth, this.rectangleHeight);
        ctx.fillRect(point.x, point.y, this.rectangleWidth, this.rectangleHeight);
    }

    private drawSquare(ctx: CanvasRenderingContext2D, point: Vec2): void {
        if (this.rectangleWidth <= this.rectangleHeight) {
            ctx.rect(point.x, point.y, this.rectangleWidth, this.rectangleWidth);
            ctx.fillRect(point.x, point.y, this.rectangleWidth, this.rectangleWidth);
        } else if (this.rectangleHeight < this.rectangleWidth) {
            ctx.rect(point.x, point.y, this.rectangleHeight, this.rectangleHeight);
            ctx.fillRect(point.x, point.y, this.rectangleHeight, this.rectangleHeight);
        }
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
}

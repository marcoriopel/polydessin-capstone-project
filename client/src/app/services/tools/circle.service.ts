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
export class CircleService extends Tool {
    name: string = TOOL_NAMES.CIRCLE_TOOL_NAME;
    mouseDown: boolean;
    isShiftKeyDown: boolean = false;
    width: number = 1;
    lastPoint: Vec2;
    firstPoint: Vec2;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
        this.mouseDown = false;
    }

    handleCursor(): void {
        const previewLayer = document.getElementById('previewLayer');
        if (previewLayer) {
            previewLayer.style.cursor = 'crosshair';
        }
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            if (this.mouseDown) {
                this.isShiftKeyDown = true;
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
        ctx.setLineDash([0]);

        if (this.isShiftKeyDown) {
            this.drawCircle(ctx, point);
        } else {
            this.drawEllipse(ctx, point);
        }

        if (ctx === this.drawingService.previewCtx) {
            ctx.beginPath();
            ctx.setLineDash([5, 3]);
            ctx.rect(point.x, point.y, this.circleWidth, this.circleHeight);
            ctx.stroke();
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    private drawCircle(ctx: CanvasRenderingContext2D, point: Vec2): void {
        const ellipseRadiusX = this.circleWidth / 2;
        const ellipseRadiusY = this.circleHeight / 2;
        const ellipseCenterX = point.x + ellipseRadiusX;
        const ellipseCenterY = point.y + ellipseRadiusY;

        if (this.circleWidth >= this.circleHeight) {
            ctx.beginPath();
            ctx.arc(ellipseCenterX, ellipseCenterY, ellipseRadiusY, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
        } else if (this.circleWidth < this.circleHeight) {
            ctx.beginPath();
            ctx.arc(ellipseCenterX, ellipseCenterY, ellipseRadiusX, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
        }
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, point: Vec2): void {
        const ellipseRadiusX = this.circleWidth / 2;
        const ellipseRadiusY = this.circleHeight / 2;
        const ellipseCenterX = point.x + ellipseRadiusX;
        const ellipseCenterY = point.y + ellipseRadiusY;

        ctx.beginPath();
        ctx.ellipse(ellipseCenterX, ellipseCenterY, ellipseRadiusX, ellipseRadiusY, 0, 0, Math.PI * 2, false);
        ctx.fill();
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

    get circleWidth(): number {
        return Math.abs(this.firstPoint.x - this.lastPoint.x);
    }

    get circleHeight(): number {
        return Math.abs(this.firstPoint.y - this.lastPoint.y);
    }
}

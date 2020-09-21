import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { TOOL_NAMES } from '@app/ressources/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from 'src/ressources/global-variables';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private pathData: Vec2[];
    name: string = TOOL_NAMES.ERASER_TOOL_NAME;
    width: number = 5;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    handleCursor(): void {
        const previewLayer = document.getElementById('previewLayer');
        if (previewLayer) {
            previewLayer.style.cursor = 'none';
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.drawRect(this.drawingService.previewCtx, this.pathData);
        }
        this.squareCursor(event);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            console.log(this.width);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
        this.squareCursor(event);
    }
    private squareCursor(event: MouseEvent): void {
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.strokeRect(
            this.getPositionFromMouse(event).x - this.width / 2,
            this.getPositionFromMouse(event).y - this.width / 2,
            this.width,
            this.width,
        );
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }
    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = 'white';
        ctx.lineCap = 'square';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private drawRect(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.beginPath();
        for (const point of path) {
            ctx.rect(point.x - this.width / 2, point.y - this.width / 2, this.width, this.width);
        }
        ctx.fill();
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}

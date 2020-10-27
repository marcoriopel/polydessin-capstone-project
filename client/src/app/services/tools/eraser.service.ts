import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Eraser } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    name: string = TOOL_NAMES.ERASER_TOOL_NAME;
    private eraserData: Eraser;
    private pathData: Vec2[];
    width: number = 5;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    setCursor(): void {
        const previewCanvas = this.drawingService.previewCanvas;
        previewCanvas.style.cursor = 'none';
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button !== MouseButton.LEFT) {
            return;
        } else {
            this.mouseDown = true;
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
            this.updateEraserData();
            this.drawingService.drawEraserStroke(this.drawingService.baseCtx, this.eraserData);
            this.drawingService.updateStack(this.eraserData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseLeave(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.updateEraserData();
        this.drawingService.drawEraserStroke(this.drawingService.baseCtx, this.eraserData);
    }

    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.updateEraserData();
            this.drawingService.drawEraserStroke(this.drawingService.previewCtx, this.eraserData);
        }
        this.squareCursor(event);
    }

    private squareCursor(event: MouseEvent): void {
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.fillStyle = 'white';
        this.drawingService.previewCtx.strokeRect(
            this.getPositionFromMouse(event).x - this.width / 2,
            this.getPositionFromMouse(event).y - this.width / 2,
            this.width,
            this.width,
        );
        this.drawingService.previewCtx.fillRect(
            this.getPositionFromMouse(event).x - this.width / 2,
            this.getPositionFromMouse(event).y - this.width / 2,
            this.width,
            this.width,
        );
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
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

    private updateEraserData(): void {
        this.eraserData = {
            type: 'eraser',
            path: this.pathData,
            lineWidth: this.width,
            lineCap: 'square',
            fillStyle: 'white',
            primaryColor: 'white',
        };
    }

    private clearPath(): void {
        this.pathData = [];
    }
}

import { Injectable } from '@angular/core';
import { Brush, Eraser, Fill, Line, Pencil, Resize, Shape } from '@app/classes/tool-properties';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    undoStack: (Pencil | Brush | Shape | Eraser | Line | Resize | Fill)[] = [];
    redoStack: (Pencil | Brush | Shape | Eraser | Line | Resize | Fill)[] = [];

    constructor(){}

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    isCanvasBlank(context: CanvasRenderingContext2D): boolean {
        const blank = document.createElement('canvas');
        blank.width = this.canvas.width;
        blank.height = this.canvas.height;

        return context.canvas.toDataURL() === blank.toDataURL();
    }

    updateStack(modification: Pencil | Brush | Shape | Eraser | Line | Resize | Fill): void {
        this.undoStack.push(modification);
        if (this.redoStack.length !== 0) {
            this.redoStack = [];
        }
    }

    drawLineStroke(ctx: CanvasRenderingContext2D, pencil: Pencil): void {
        ctx.lineWidth = pencil.lineWidth;
        ctx.strokeStyle = pencil.primaryColor;
        ctx.lineCap = ctx.lineJoin = 'round';
        ctx.beginPath();
        for (const point of pencil.path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
}

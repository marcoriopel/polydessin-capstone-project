import { Injectable } from '@angular/core';
import { LineStroke, Fill, Line, Resize, Shape } from '@app/classes/tool-properties';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    undoStack: (LineStroke | Shape | Line | Resize | Fill)[] = [];
    redoStack: (LineStroke | Shape | Line | Resize | Fill)[] = [];

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

    updateStack(modification: LineStroke | Shape | Line | Resize | Fill): void {
        this.undoStack.push(modification);
        if (this.redoStack.length !== 0) {
            this.redoStack = [];
        }
    }

    drawLineStroke(ctx: CanvasRenderingContext2D, lineStroke: LineStroke): void {
        ctx.lineWidth = lineStroke.lineWidth;
        ctx.strokeStyle = lineStroke.primaryColor;
        ctx.lineJoin = 'round';
        ctx.lineCap = lineStroke.lineCap as CanvasLineCap;
        if (lineStroke.pattern === 'none') {
            ctx.filter = lineStroke.pattern;
        } else {
            ctx.filter = 'url(/assets/patterns.svg#' + lineStroke.pattern + ')';
        }
        ctx.beginPath();
        for (const point of lineStroke.path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
}

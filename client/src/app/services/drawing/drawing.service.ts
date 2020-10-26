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
    undoStack: (Pencil | Brush | Eraser | Shape | Line | Resize | Fill)[] = [];
    redoStack: (Pencil | Brush | Eraser | Shape | Line | Resize | Fill)[] = [];

    constructor() {}

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    isCanvasBlank(context: CanvasRenderingContext2D): boolean {
        const blank = document.createElement('canvas');
        blank.width = this.canvas.width;
        blank.height = this.canvas.height;

        return context.canvas.toDataURL() === blank.toDataURL();
    }

    updateStack(modification: Pencil | Brush | Eraser | Shape | Line | Resize | Fill): void {
        this.undoStack.push(modification);
        if (this.redoStack.length !== 0) {
            this.redoStack = [];
        }
    }

    drawPencilStroke(ctx: CanvasRenderingContext2D, pencil: Pencil): void {
        ctx.lineWidth = pencil.lineWidth;
        ctx.strokeStyle = pencil.primaryColor;
        ctx.lineJoin = 'round';
        ctx.lineCap = pencil.lineCap as CanvasLineCap;
        ctx.beginPath();
        for (const point of pencil.path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    drawBrushStroke(ctx: CanvasRenderingContext2D, brush: Brush): void {
        ctx.lineWidth = brush.lineWidth;
        ctx.strokeStyle = brush.primaryColor;
        ctx.lineJoin = 'round';
        ctx.lineCap = brush.lineCap as CanvasLineCap;
        if (brush.pattern === 'none') {
            this.baseCtx.filter = 'none';
            this.previewCtx.filter = 'none';
        } else {
            this.baseCtx.filter = 'url(/assets/patterns.svg#' + brush.pattern + ')';
            this.previewCtx.filter = 'url(/assets/patterns.svg#' + brush.pattern + ')';
        }
        // Les deux lignes ci-dessous servent a faire rafraichir les canvas pour appliquer le filtre
        this.baseCtx.strokeRect(-this.baseCtx.lineWidth, 0, 1, 0);
        this.previewCtx.strokeRect(-this.previewCtx.lineWidth, 0, 1, 0);
        ctx.beginPath();
        for (const point of brush.path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        this.baseCtx.filter = 'none';
        this.previewCtx.filter = 'none';
    }

    drawEraserStroke(ctx: CanvasRenderingContext2D, eraser: Eraser): void {
        ctx.lineWidth = eraser.lineWidth;
        ctx.strokeStyle = 'white';
        ctx.lineCap = 'square';
        ctx.beginPath();
        for (const point of eraser.path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    drawLine(ctx: CanvasRenderingContext2D, line: Line): void {
        line.storedLines.forEach((element) => {
            ctx.strokeStyle = line.primaryColor;
            ctx.lineCap = 'round';
            ctx.lineWidth = line.lineWidth;
            ctx.beginPath();
            ctx.moveTo(element.startingPoint.x, element.startingPoint.y);
            ctx.lineTo(element.endingPoint.x, element.endingPoint.y);
            ctx.stroke();
        });

        if (line.isDot) {
            const LAST_DOT = line.mouseClicks.length;

            // Remove the double click that doesnt need to be drawed on the canvas
            line.mouseClicks[line.mouseClicks.length - 2] = line.mouseClicks[line.mouseClicks.length - 1];
            line.mouseClicks.pop();

            // If it's a double click holding shift adjust ending dot
            if (line.isShiftDoubleClick) {
                line.mouseClicks[line.mouseClicks.length - 1] = line.storedLines[line.storedLines.length - 1].endingPoint;
            }

            for (let i = 0; i < LAST_DOT - 1; i++) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = line.secondaryColor;
                ctx.fillStyle = line.secondaryColor;
                ctx.beginPath();
                ctx.arc(line.mouseClicks[i].x, line.mouseClicks[i].y, line.dotWidth / 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}

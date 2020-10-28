import { Injectable } from '@angular/core';
import { Brush, Ellipse, Eraser, Fill, Line, Pencil, Rectangle, Resize, Shape } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    undoStack: (Pencil | Brush | Eraser | Shape | Line | Resize | Fill | Rectangle | Ellipse)[] = [];
    redoStack: (Pencil | Brush | Eraser | Shape | Line | Resize | Fill | Rectangle | Ellipse)[] = [];

    constructor() {}

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    initializeBaseCanvas(): void {
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    isCanvasBlank(context: CanvasRenderingContext2D): boolean {
        const blank = document.createElement('canvas');
        blank.width = this.canvas.width;
        blank.height = this.canvas.height;
        const blankCtx = blank.getContext('2d') as CanvasRenderingContext2D;
        blankCtx.fillStyle = 'white';
        blankCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        return context.canvas.toDataURL() === blank.toDataURL();
    }

    updateStack(modification: Pencil | Brush | Eraser | Shape | Line | Resize | Fill | Rectangle | Ellipse): void {
        this.undoStack.push(modification);
        console.log(this.undoStack);
        if (this.redoStack.length !== 0) {
            this.redoStack = [];
        }
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

    resizeCanvas(resize: Resize): void {
        console.log('did something');
        const tempCanvas: HTMLCanvasElement = document.createElement('canvas');
        tempCanvas.width = resize.canvasSize.x;
        tempCanvas.height = resize.canvasSize.y;
        const tempCanvasCtx: CanvasRenderingContext2D = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
        tempCanvasCtx.drawImage(this.canvas, 0, 0);
        setTimeout(() => {
            this.initializeBaseCanvas();
            let baseCtx: CanvasRenderingContext2D;
            baseCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
            baseCtx.drawImage(tempCanvas, 0, 0);
        });
        // this.canvas.width = resize.canvasSize.x;
        // this.canvas.height = resize.canvasSize.y;
        // this.baseCtx.putImageData(resize.imageData, 0, 0);
    }

    drawFill(fill: Fill): void {
        this.baseCtx.putImageData(fill.imageData, 0, 0);
    }

    getPixelData(pixelCoord: Vec2): Uint8ClampedArray {
        const pixelData = this.baseCtx.getImageData(pixelCoord.x, pixelCoord.y, 1, 1).data;
        return pixelData;
    }

    getCanvasData(): ImageData {
        const canvasData = this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        return canvasData;
    }
}

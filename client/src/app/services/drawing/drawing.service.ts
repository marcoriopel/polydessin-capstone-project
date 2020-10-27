import { Injectable } from '@angular/core';
import { Brush, Ellipse, Eraser, Fill, Line, Pencil, Rectangle, Resize, Shape } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';

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
            let doubleClickPoint: Vec2 | undefined;

            // Remove the double click that doesnt need to be drawed on the canvas
            if (line.hasLastPointBeenChaged) {
                line.mouseClicks[line.mouseClicks.length - 2] = line.mouseClicks[line.mouseClicks.length - 1];
                doubleClickPoint = line.mouseClicks.pop();
            }
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

            if (line.hasLastPointBeenChaged) {
                line.mouseClicks.push(doubleClickPoint as Vec2);
            }
        }
    }

    drawRectangle(ctx: CanvasRenderingContext2D, rectangle: Rectangle): void {
        ctx.fillStyle = rectangle.primaryColor;
        ctx.strokeStyle = rectangle.secondaryColor;
        ctx.lineWidth = rectangle.lineWidth;
        if (rectangle.fillStyle === FILL_STYLES.FILL) {
            ctx.strokeStyle = rectangle.primaryColor;
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.rect(rectangle.topLeftPoint.x, rectangle.topLeftPoint.y, rectangle.width, rectangle.height);
        if (rectangle.fillStyle !== FILL_STYLES.BORDER) {
            ctx.fillRect(rectangle.topLeftPoint.x, rectangle.topLeftPoint.y, rectangle.width, rectangle.height);
        }
        ctx.stroke();
    }

    drawEllipse(ctx: CanvasRenderingContext2D, ellipse: Ellipse): void {
        ctx.fillStyle = ellipse.primaryColor;
        ctx.strokeStyle = ellipse.secondaryColor;
        ctx.lineWidth = ellipse.lineWidth;

        if (ellipse.fillStyle === FILL_STYLES.FILL) {
            ctx.strokeStyle = ellipse.primaryColor;
            ctx.lineWidth = 1;
        }

        ctx.beginPath();
        if (ellipse.isShiftDown) {
            ctx.arc(ellipse.center.x, ellipse.center.y, Math.min(ellipse.radius.x, ellipse.radius.y), 0, Math.PI * 2, false);
        } else {
            ctx.ellipse(ellipse.center.x, ellipse.center.y, ellipse.radius.x, ellipse.radius.y, 0, 0, Math.PI * 2, false);
        }
        if (ellipse.fillStyle !== FILL_STYLES.BORDER) {
            ctx.fill();
        }
        ctx.stroke();
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

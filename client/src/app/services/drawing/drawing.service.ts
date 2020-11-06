import { Injectable } from '@angular/core';
import { Brush, Ellipse, Eraser, Fill, Line, Pencil, Polygone, Rectangle, Resize, Selection } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    undoStack: (Pencil | Brush | Eraser | Polygone | Line | Resize | Fill | Rectangle | Ellipse | Selection)[] = [];
    redoStack: (Pencil | Brush | Eraser | Polygone | Line | Resize | Fill | Rectangle | Ellipse | Selection)[] = [];
    isToolInUse: Subject<boolean> = new Subject<boolean>();

    setIsToolInUse(isInUse: boolean): void {
        this.isToolInUse.next(isInUse);
    }

    getIsToolInUse(): Observable<boolean> {
        return this.isToolInUse.asObservable();
    }

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

    updateStack(modification: Pencil | Brush | Eraser | Polygone | Line | Resize | Fill | Rectangle | Ellipse | Selection): void {
        this.undoStack.push(modification);
        if (this.redoStack.length) {
            this.redoStack = [];
        }
    }

    drawFill(fill: Fill): void {
        this.baseCtx.putImageData(fill.imageData, 0, 0);
    }

    restoreSelection(selection: Selection): void {
        this.baseCtx.putImageData(selection.imageData, 0, 0);
    }

    getPixelData(pixelCoord: Vec2): Uint8ClampedArray {
        const pixelData = this.baseCtx.getImageData(pixelCoord.x, pixelCoord.y, 1, 1).data;
        return pixelData;
    }

    getCanvasData(): ImageData {
        const canvasData = this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        return canvasData;
    }

    getPreviewData(): ImageData {
        const canvasData = this.previewCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        return canvasData;
    }
}

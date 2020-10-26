import { Injectable } from '@angular/core';
import { Brush, Eraser, Fill, Line, Pencil, Resize, Shape } from '@app/classes/tool-properties';
// import { Brush, Eraser, Fill, Line, Pencil, Resize, Shape } from '@app/classes/tool-properties';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {

    constructor(public drawingService: DrawingService) {}

    undo(): void {
        const modification = this.drawingService.undoStack.pop();
        if (modification !== undefined) {
            this.drawingService.redoStack.push(modification);
        }
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.undoStack.forEach((element) => {
            this.drawElement(element);
        });
    }

    redo(): void {
        const redoStackLength = this.drawingService.redoStack.length;
        const element = this.drawingService.redoStack[ redoStackLength - 1];
        if (redoStackLength) {
            this.drawElement(element);
            const modification = this.drawingService.redoStack.pop();
            if (modification !== undefined) {
                this.drawingService.undoStack.push(modification);
            }
        }
    }

    drawElement(element: Pencil | Brush | Eraser | Shape | Line | Resize | Fill): void {
        switch (element.type) {
            case 'pencil':
                this.drawingService.drawPencilStroke(this.drawingService.baseCtx, element as Pencil);
                break;
            case 'brush':
                this.drawingService.drawBrushStroke(this.drawingService.baseCtx, element as Brush);
                break;
            case 'eraser':
                this.drawingService.drawEraserStroke(this.drawingService.baseCtx, element as Eraser);
        }
    }
}

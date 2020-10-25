import { Injectable } from '@angular/core';
// import { Brush, Eraser, Fill, Line, Pencil, Resize, Shape } from '@app/classes/tool-properties';
import { Pencil } from '@app/classes/tool-properties';

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
            switch (element.type) {
                case 'pencil':
                    this.drawingService.drawLineStroke(this.drawingService.baseCtx, element as Pencil);
            }
        });
    }

    redo(): void {
        const redoStackLength = this.drawingService.redoStack.length;
        const element = this.drawingService.redoStack[ redoStackLength - 1];
        if (redoStackLength) {
            switch (element.type) {
                case 'pencil':
                    this.drawingService.drawLineStroke(this.drawingService.baseCtx, element as Pencil);
            }
            const modification = this.drawingService.redoStack.pop();
            if (modification !== undefined) {
                this.drawingService.undoStack.push(modification);
            }
        }
    }
}

import { Injectable } from '@angular/core';
import { Brush, Ellipse, Eraser, Fill, Line, Pencil, Rectangle, Resize, Shape } from '@app/classes/tool-properties';
// import { Brush, Eraser, Fill, Line, Pencil, Resize, Shape } from '@app/classes/tool-properties';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { SquareService } from '@app/services/tools/square.service';
import { BrushService } from '../tools/brush.service';
@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    constructor(
        public drawingService: DrawingService,
        public circleService: CircleService,
        public resizeDrawingService: ResizeDrawingService,
        public squareService: SquareService,
        public pencilService: PencilService,
        public eraserService: EraserService,
        public lineService: LineService,
        public brushService: BrushService,
    ) {}

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
        this.resizeDrawingService.setDefaultCanvasSize();
        const redoStackLength = this.drawingService.redoStack.length;
        const element = this.drawingService.redoStack[redoStackLength - 1];
        if (redoStackLength) {
            this.drawElement(element);
            const modification = this.drawingService.redoStack.pop();
            if (modification !== undefined) {
                this.drawingService.undoStack.push(modification);
            }
        }
    }

    drawElement(element: Pencil | Brush | Eraser | Shape | Line | Resize | Fill | Rectangle | Ellipse): void {
        switch (element.type) {
            case 'pencil':
                this.pencilService.drawPencilStroke(this.drawingService.baseCtx, element as Pencil);
                break;
            case 'brush':
                this.brushService.drawLine(this.drawingService.baseCtx, element as Brush);
                break;
            case 'eraser':
                this.eraserService.drawEraserStroke(this.drawingService.baseCtx, element as Eraser);
                break;
            case 'line':
                this.lineService.drawFullLine(this.drawingService.baseCtx, element as Line);
                break;
            case 'rectangle':
                this.squareService.drawRectangle(this.drawingService.baseCtx, element as Rectangle);
                break;
            case 'ellipse':
                this.circleService.drawEllipse(this.drawingService.baseCtx, element as Ellipse);
                break;
            case 'fill':
                this.drawingService.drawFill(element as Fill);
                break;
            case 'resize':
                const resizeData = element as Resize;
                this.resizeDrawingService.resizeCanvas(resizeData.mouseEvent);
                break;
        }
    }
}

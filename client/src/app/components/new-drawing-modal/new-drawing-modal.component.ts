import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';

@Component({
    selector: 'app-new-drawing-modal',
    templateUrl: './new-drawing-modal.component.html',
    styleUrls: ['./new-drawing-modal.component.scss'],
})
export class NewDrawingModalComponent {
    constructor(public drawingService: DrawingService, public resizeDrawingService: ResizeDrawingService) {}

    createNewDrawing(): void {
        this.resizeDrawingService.setDefaultCanvasSize();
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}

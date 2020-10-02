import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-new-drawing-modal',
    templateUrl: './new-drawing-modal.component.html',
    styleUrls: ['./new-drawing-modal.component.scss'],
})
export class NewDrawingModalComponent {
    constructor(public drawingService: DrawingService) {}

    createNewDrawing(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}

import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-new-drawing',
    templateUrl: './new-drawing.component.html',
    styleUrls: ['./new-drawing.component.scss'],
})
export class NewDrawingComponent {
    constructor(public drawingService: DrawingService) {}

    createNewDrawing(): void {
        this.drawingService.baseCtx.clearRect(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        this.drawingService.previewCtx.clearRect(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
    }
}

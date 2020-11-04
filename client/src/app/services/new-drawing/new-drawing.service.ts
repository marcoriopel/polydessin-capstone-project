import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewDrawingModalComponent } from '@app/components/new-drawing-modal/new-drawing-modal.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class NewDrawingService {
    constructor(public drawingService: DrawingService, public dialog: MatDialog) {}

    openWarningModal(): void {
        const isNewDrawingModalOpen = document.querySelector('.newDrawingModal') !== null;
        if (!this.drawingService.isCanvasBlank(this.drawingService.baseCtx) && !isNewDrawingModalOpen) {
            this.dialog.open(NewDrawingModalComponent);
        }
    }
}

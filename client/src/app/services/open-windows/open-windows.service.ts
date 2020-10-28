import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { ExportComponent } from '@app/components/export/export.component';
import { NewDrawingModalComponent } from '@app/components/new-drawing-modal/new-drawing-modal.component';
import { SavingComponent } from '@app/components/saving/saving.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class OpenWindowsService {
    constructor(public dialog: MatDialog, public drawingService: DrawingService) {}

    openExportWindow(): void {
        this.dialog.open(ExportComponent);
    }

    openSaveWindow(): void {
        this.dialog.open(SavingComponent);
    }

    openCarouselWindow(): void {
        this.dialog.open(CarouselComponent);
    }

    openWarningWindow(): void {
        const isNewDrawingModalOpen = document.querySelector('.newDrawingModal') !== null;
        if (!this.drawingService.isCanvasBlank(this.drawingService.baseCtx) && !isNewDrawingModalOpen) {
            this.dialog.open(NewDrawingModalComponent);
        }
    }
}

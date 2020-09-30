import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewDrawingComponent } from '@app/components/new-drawing/new-drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class NewDrawingService {
    constructor(public drawingService: DrawingService, public dialog: MatDialog) {}

    openWarning(): void {
        if (!this.drawingService.isCanvasBlank(this.drawingService.baseCtx)) {
            this.dialog.open(NewDrawingComponent);
        }
    }
}

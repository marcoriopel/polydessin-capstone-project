import { Injectable } from '@angular/core';
import { Rectangle } from '@app/classes/rectangle';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CircleService } from '@app/services/tools/circle.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { SelectionService } from './selection.service';

@Injectable({
    providedIn: 'root',
})
export class CircleSelectionService extends SelectionService {
    constructor(drawingService: DrawingService, public circleService: CircleService, public moveService: MoveService) {
        super(drawingService, moveService);
        super.underliyingService = circleService;
    }

    initialize(): void {
    //   this.moveService.isRectangleSelection = false;
      super.initialize();
    }

    setSelectionData(selection: Rectangle): void {
        this.selectionImage.width = selection.width;
        this.selectionImage.height = selection.height;
        const selectionImageCtx = this.selectionImage.getContext('2d') as CanvasRenderingContext2D;

        selectionImageCtx.beginPath();
        selectionImageCtx.ellipse(selection.width / 2, selection.height / 2, selection.width / 2, selection.height / 2, 0, 0, Math.PI * 2);
        selectionImageCtx.clip();
        selectionImageCtx.closePath();

        selectionImageCtx.drawImage(
            this.drawingService.canvas,
            selection.startingPoint.x,
            selection.startingPoint.y,
            selection.width,
            selection.height,
            0,
            0,
            selection.width,
            selection.height,
        );
        this.moveService.initialize(selection, this.selectionImage);
    }

    strokeSelection(): void {
        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.ellipse(
            this.selection.startingPoint.x + this.selection.width / 2,
            this.selection.startingPoint.y + this.selection.height / 2,
            this.selection.width / 2,
            this.selection.height / 2,
            0,
            0,
            Math.PI * 2,
        );
        this.drawingService.previewCtx.stroke();
    }
}

import { Injectable } from '@angular/core';
import { Rectangle } from '@app/classes/rectangle';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareService } from '@app/services/tools/square.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { SelectionService } from './selection.service';

@Injectable({
    providedIn: 'root',
})
export class CircleSelectionService extends SelectionService {
    constructor(drawingService: DrawingService, public squareService: SquareService, public moveService: MoveService) {
        super(drawingService, squareService, moveService);
    }

    initialize(): void {
      this.moveService.isRectangleSelection = false;
    }

    setSelectionData(selection: Rectangle): void {
        this.selectionImage.width = this.selection.width;
        this.selectionImage.height = this.selection.height;
        const selectionImageCtx = this.selectionImage.getContext('2d') as CanvasRenderingContext2D;

        selectionImageCtx.beginPath();
        selectionImageCtx.ellipse(
            this.selection.width / 2,
            this.selection.height / 2,
            this.selection.width / 2,
            this.selection.height / 2,
            0,
            0,
            Math.PI * 2,
        );
        selectionImageCtx.clip();
        selectionImageCtx.closePath();

        selectionImageCtx.drawImage(
            this.drawingService.canvas,
            this.selection.startingPoint.x,
            this.selection.startingPoint.y,
            this.selection.width,
            this.selection.height,
            0,
            0,
            this.selection.width,
            this.selection.height,
        );
        this.moveService.initialize(this.selection, this.selectionImage, this.isRectangleSelection);
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

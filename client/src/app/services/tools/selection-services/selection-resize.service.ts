import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionResizeService {
    initialSelection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selection: SelectionBox;
    isTransformationOver: boolean = true;
    selectionImage: HTMLCanvasElement = document.createElement('canvas');
    selectionImageCtx: CanvasRenderingContext2D;
    constructor(public drawingService: DrawingService) {}

    initialize(selection: SelectionBox, selectionImage: HTMLCanvasElement): void {
        this.initialSelection.startingPoint.x = selection.startingPoint.x;
        this.initialSelection.startingPoint.y = selection.startingPoint.y;
        this.initialSelection.height = selection.height;
        this.initialSelection.width = selection.width;
        this.selection = selection;
        this.selectionImage = selectionImage;
        this.selectionImageCtx = selectionImage.getContext('2d') as CanvasRenderingContext2D;
    }

    resizeSelection(currentPoint: number): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        // this.clearSelectionBackground();
        this.drawingService.previewCtx.save();
        this.drawingService.previewCtx.scale(2, 2);
        this.drawingService.previewCtx.drawImage(this.selectionImage, this.selection.startingPoint.x, this.selection.startingPoint.y);
        this.drawingService.previewCtx.restore();
    }
}

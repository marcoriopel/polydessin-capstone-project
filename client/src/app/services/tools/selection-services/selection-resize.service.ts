import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
@Injectable({
    providedIn: 'root',
})
export class SelectionResizeService {
    initialSelection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selection: SelectionBox;
    selectionImage: HTMLCanvasElement = document.createElement('canvas');
    selectionImageCtx: CanvasRenderingContext2D;
    constructor(public drawingService: DrawingService, public moveService: MoveService) {}

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
        console.log('resizing');
    }
}

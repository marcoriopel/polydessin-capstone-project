import { Injectable } from '@angular/core';
import { SelectionBox, SelectionObject } from '@app/classes/selection-box';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    selection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selectionImage: HTMLCanvasElement = document.createElement('canvas');
    selectionType: number;

    constructor(public drawingService: DrawingService) {}

    cut(selection: SelectionBox, selectionImage: HTMLCanvasElement): void {
        this.setSelection(this.selection, selection);
        this.selectionImage = selectionImage;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    copy(selection: SelectionBox, selectionImage: HTMLCanvasElement): void {
        this.setSelection(this.selection, selection);
        this.selectionImage = selectionImage;
    }

    paste(): SelectionObject {
        return { selectionBox: this.selection, selectionImage: this.selectionImage };
    }

    private setSelection(internalSelection: SelectionBox, incomingSelection: SelectionBox): void {
        internalSelection.startingPoint.x = incomingSelection.startingPoint.x;
        internalSelection.startingPoint.y = incomingSelection.startingPoint.y;
        internalSelection.height = incomingSelection.height;
        internalSelection.width = incomingSelection.width;
    }
}

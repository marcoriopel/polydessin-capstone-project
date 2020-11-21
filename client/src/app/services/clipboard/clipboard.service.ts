import { Injectable } from '@angular/core';
import { SelectionBox, SelectionObject } from '@app/classes/selection-box';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    selection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    clipBoardCanvas: HTMLCanvasElement = document.createElement('canvas');
    selectionType: number;

    constructor(public drawingService: DrawingService) {}

    cut(selection: SelectionBox, selectionImage: HTMLCanvasElement): void {
        this.setSelection(selection);
        this.clipBoardCanvas.width = this.selection.width;
        this.clipBoardCanvas.height = this.selection.height;
        const selectionImageCtx = this.clipBoardCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectionImageCtx.drawImage(selectionImage, 0, 0);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    // copy(selection: SelectionBox, selectionImage: HTMLCanvasElement): void {
    //     this.setSelection(selection);
    //     const selectionImageCtx = this.selectionImage.getContext('2d') as CanvasRenderingContext2D;
    //     selectionImageCtx.drawImage(selectionImage, 0, 0);
    // }

    paste(): SelectionObject {
        return { selectionBox: this.selection, selectionImage: this.clipBoardCanvas };
    }

    private setSelection(selection: SelectionBox): void {
        this.selection.startingPoint.x = selection.startingPoint.x;
        this.selection.startingPoint.y = selection.startingPoint.y;
        this.selection.height = selection.height;
        this.selection.width = selection.width;
    }
}

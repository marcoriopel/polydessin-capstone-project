import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    selection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    clipBoardCanvas: HTMLCanvasElement = document.createElement('canvas');
    angle: number;
    selectionType: number;
    isPasteAvailableSubject: Subject<boolean> = new Subject<boolean>();

    constructor(public drawingService: DrawingService) {
        this.isPasteAvailableSubject.next(false);
    }

    copy(selection: SelectionBox, selectionImage: HTMLCanvasElement, angle: number): void {
        this.setSelection(selection);
        this.isPasteAvailableSubject.next(true);
        this.clipBoardCanvas.width = this.selection.width;
        this.clipBoardCanvas.height = this.selection.height;
        const selectionImageCtx = this.clipBoardCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectionImageCtx.drawImage(selectionImage, 0, 0);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.angle = angle;
    }

    private setSelection(selection: SelectionBox): void {
        this.selection.startingPoint.x = selection.startingPoint.x;
        this.selection.startingPoint.y = selection.startingPoint.y;
        this.selection.height = selection.height;
        this.selection.width = selection.width;
    }

    getIsPasteAvailableSubject(): Observable<boolean> {
        return this.isPasteAvailableSubject.asObservable();
    }
}

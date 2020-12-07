import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { SELECTION_POINTS_NAMES } from '@app/classes/selection-points';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { RotateService } from '../transformation-services/rotate.service';
@Injectable({
    providedIn: 'root',
})
export class SelectionResizeService {
    initialSelection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    newSelection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selection: SelectionBox;
    selectionImage: HTMLCanvasElement = document.createElement('canvas');
    selectionImageCtx: CanvasRenderingContext2D;
    newWidth: number = 0;
    newHeight: number = 0;
    constructor(public drawingService: DrawingService, public moveService: MoveService, public rotateService: RotateService) {}

    initialize(selection: SelectionBox, selectionImage: HTMLCanvasElement): void {
        this.initialSelection.startingPoint.x = selection.startingPoint.x;
        this.initialSelection.startingPoint.y = selection.startingPoint.y;
        this.initialSelection.height = selection.height;
        this.initialSelection.width = selection.width;
        this.selection = selection;
        this.selectionImage = selectionImage;
        this.selectionImageCtx = selectionImage.getContext('2d') as CanvasRenderingContext2D;
    }

    printSelectionOnBaseCtx(): void {
        this.drawingService.applyPreview();
    }

    resizeSelection(mouseCoordinates: Vec2, selectionPoint: number): SelectionBox {
        this.newSelection.width = mouseCoordinates.x - this.selection.startingPoint.x;
        this.newSelection.height = mouseCoordinates.y - this.selection.startingPoint.y;
        switch (selectionPoint) {
            case SELECTION_POINTS_NAMES.BOTTOM_RIGHT: {
                return this.resizeBottomLeft(mouseCoordinates);
            }
        }
        return this.newSelection;
    }
    resizeBottomLeft(mouseCoordinates: Vec2): SelectionBox {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.moveService.clearSelectionBackground();
        this.drawingService.previewCtx.save();
        this.rotateService.rotatePreviewCanvas();
        if (this.newSelection.width < 0 && this.newSelection.height > 0) {
            this.drawingService.previewCtx.scale(-1, 1);
            this.drawingService.previewCtx.drawImage(
                this.selectionImage,
                -this.selection.startingPoint.x,
                this.selection.startingPoint.y,
                -this.newSelection.width,
                this.newSelection.height,
            );
        } else if (this.newSelection.height < 0 && this.newSelection.width > 0) {
            this.drawingService.previewCtx.scale(1, -1);
            this.drawingService.previewCtx.drawImage(
                this.selectionImage,
                this.selection.startingPoint.x,
                -this.selection.startingPoint.y,
                this.newSelection.width,
                -this.newSelection.height,
            );
        } else if (this.newSelection.height < 0 && this.newSelection.width < 0) {
            this.drawingService.previewCtx.scale(-1, -1);
            this.drawingService.previewCtx.drawImage(
                this.selectionImage,
                -this.selection.startingPoint.x,
                -this.selection.startingPoint.y,
                -this.newSelection.width,
                -this.newSelection.height,
            );
        } else {
            this.drawingService.previewCtx.drawImage(
                this.selectionImage,
                this.selection.startingPoint.x,
                this.selection.startingPoint.y,
                this.newSelection.width,
                this.newSelection.height,
            );
        }

        const newSelection: SelectionBox = {
            startingPoint: {
                x: this.selection.startingPoint.x,
                y: this.selection.startingPoint.y,
            },
            width: this.newSelection.width,
            height: this.newSelection.height,
        };

        this.drawingService.previewCtx.restore();

        return newSelection;
    }
}

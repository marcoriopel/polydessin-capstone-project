import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareService } from '@app/services/tools/square.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { RotateService } from '@app/services/tools/transformation-services/rotate.service';
import { SelectionService } from './selection.service';

@Injectable({
    providedIn: 'root',
})
export class SquareSelectionService extends SelectionService {
    name: string = TOOL_NAMES.SQUARE_SELECTION_TOOL_NAME;
    constructor(
        drawingService: DrawingService,
        public squareService: SquareService,
        public moveService: MoveService,
        public rotateService: RotateService,
    ) {
        super(drawingService, moveService, rotateService);
        super.underlyingService = squareService;
    }

    setSelectionData(selection: SelectionBox): void {
        this.selectionImage.width = selection.width;
        this.selectionImage.height = selection.height;
        const selectionImageCtx = this.selectionImage.getContext('2d') as CanvasRenderingContext2D;
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
        this.rotateService.initialize(selection, this.selectionImage);
    }

    setMagnetismAlignment(alignment: string): void {
        this.currentAlignment = alignment;
    }

    strokeSelection(): void {
        if (this.selection.height !== 0 && this.selection.width !== 0) {
            this.drawingService.previewCtx.save();
            this.rotateService.rotatePreviewCanvas();
            this.drawingService.previewCtx.strokeRect(
                this.selection.startingPoint.x,
                this.selection.startingPoint.y,
                this.selection.width,
                this.selection.height,
            );
            this.drawingService.previewCtx.restore();
        }
    }
}

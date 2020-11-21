import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CircleService } from '@app/services/tools/circle.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { RotateService } from '@app/services/tools/transformation-services/rotate.service';
import { SelectionService } from './selection.service';

@Injectable({
    providedIn: 'root',
})
export class CircleSelectionService extends SelectionService {
    name: string = TOOL_NAMES.CIRCLE_SELECTION_TOOL_NAME;
    constructor(
        drawingService: DrawingService,
        public circleService: CircleService,
        public moveService: MoveService,
        public rotateService: RotateService,
        public clipboardService: ClipboardService,
    ) {
        super(drawingService, moveService, rotateService, clipboardService);
        super.underlyingService = circleService;
    }

    setSelectionData(selection: SelectionBox): void {
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
        this.rotateService.initialize(selection, this.selectionImage);
    }

    strokeSelection(): void {
        if (this.selection.height !== 0 && this.selection.width !== 0) {
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.save();
            this.rotateService.rotatePreviewCanvas();
            this.drawingService.previewCtx.ellipse(
                this.selection.startingPoint.x + this.selection.width / 2,
                this.selection.startingPoint.y + this.selection.height / 2,
                this.selection.width / 2,
                this.selection.height / 2,
                0,
                0,
                Math.PI * 2,
            );
            this.drawingService.previewCtx.strokeRect(
                this.moveService.selection.startingPoint.x,
                this.moveService.selection.startingPoint.y,
                this.selection.width,
                this.selection.height,
            );
            this.drawingService.previewCtx.restore();
            this.drawingService.previewCtx.stroke();
        }
    }
}

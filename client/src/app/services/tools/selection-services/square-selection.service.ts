import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareService } from '@app/services/tools/square.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { RotateService } from '@app/services/tools/transformation-services/rotate.service';
import { MagnetismService } from './magnetism.service';
import { SelectionResizeService } from './selection-resize.service';
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
        public clipboardService: ClipboardService,
        public magnetismService: MagnetismService,
        public selectionResizeService: SelectionResizeService,
    ) {
        super(drawingService, moveService, rotateService, clipboardService, magnetismService, selectionResizeService);
        super.underlyingService = squareService;
    }

    setSelectionData(): void {
        this.selectionImage.width = this.selection.width;
        this.selectionImage.height = this.selection.height;
        const selectionImageCtx = this.selectionImage.getContext('2d') as CanvasRenderingContext2D;
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
        this.moveService.initialize(this.selection, this.selectionImage);
        this.rotateService.initialize(this.selection, this.selectionImage);
        this.selectionResizeService.initialize(this.selection, this.selectionImage);
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

            const radius = Math.sqrt(this.selection.width * this.selection.width + this.selection.height * this.selection.height);
            const selectionCenterX = this.selection.startingPoint.x + this.selection.width / 2;
            const selectionCenterY = this.selection.startingPoint.y + this.selection.height / 2;
            const selectionCenter: Vec2 = { x: selectionCenterX, y: selectionCenterY };

            // BOITE ENGLOBANTE ICI!
            this.drawingService.previewCtx.strokeRect(selectionCenter.x - radius / 2, selectionCenter.y - radius / 2, radius, radius);
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.arc(selectionCenter.x, selectionCenter.y, radius / 2, 0, 2 * Math.PI);
            this.drawingService.previewCtx.stroke();
            this.setSelectionPoint();
        }
    }
}

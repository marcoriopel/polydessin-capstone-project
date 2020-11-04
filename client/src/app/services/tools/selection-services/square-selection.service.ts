import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareService } from '@app/services/tools/square.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { SelectionService } from './selection.service';

@Injectable({
    providedIn: 'root',
})
export class SquareSelectionService extends SelectionService {
    constructor(drawingService: DrawingService, public squareService: SquareService, public moveService: MoveService) {
        super(drawingService, moveService);
        super.underliyingService = squareService;
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
    }

    strokeSelection(): void {
        this.drawingService.previewCtx.strokeRect(
            this.selection.startingPoint.x,
            this.selection.startingPoint.y,
            this.selection.width,
            this.selection.height,
        );
    }

    setSelectionPoint(): void {
        const topY: number = this.selection.startingPoint.y - 3;
        const middleY: number = this.selection.startingPoint.y + this.selection.height / 2 - 3;
        const bottomY: number = this.selection.startingPoint.y + this.selection.height - 3;
        const leftX: number = this.selection.startingPoint.x - 3;
        const middleX: number = this.selection.startingPoint.x + this.selection.width / 2 - 3;
        const rightX: number = this.selection.startingPoint.x + this.selection.width - 3;

        const topLeftPoint: Vec2 = { x: leftX, y: topY };
        const topMiddlePoint: Vec2 = { x: middleX, y: topY };
        const topRightPoint: Vec2 = { x: rightX, y: topY };
        const middleLeftPoint: Vec2 = { x: leftX, y: middleY };
        const middleRightPoint: Vec2 = { x: rightX, y: middleY };
        const bottomLeftPoint: Vec2 = { x: leftX, y: bottomY };
        const bottomMiddlePoint: Vec2 = { x: middleX, y: bottomY };
        const bottomRightPoint: Vec2 = { x: rightX, y: bottomY };

        this.drawingService.previewCtx.fillStyle = '#09acd9';
        this.drawingService.previewCtx.fillRect(topLeftPoint.x, topLeftPoint.y, 6, 6);
        this.drawingService.previewCtx.fillRect(topMiddlePoint.x, topMiddlePoint.y, 6, 6);
        this.drawingService.previewCtx.fillRect(topRightPoint.x, topRightPoint.y, 6, 6);
        this.drawingService.previewCtx.fillRect(middleLeftPoint.x, middleLeftPoint.y, 6, 6);
        this.drawingService.previewCtx.fillRect(middleRightPoint.x, middleRightPoint.y, 6, 6);
        this.drawingService.previewCtx.fillRect(bottomLeftPoint.x, bottomLeftPoint.y, 6, 6);
        this.drawingService.previewCtx.fillRect(bottomMiddlePoint.x, bottomMiddlePoint.y, 6, 6);
        this.drawingService.previewCtx.fillRect(bottomRightPoint.x, bottomRightPoint.y, 6, 6);
    }
}

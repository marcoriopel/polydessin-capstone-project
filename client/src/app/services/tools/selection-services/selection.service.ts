import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { Tool } from '@app/classes/tool';
import { Selection } from '@app/classes/tool-properties';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { DASH_LENGTH, DASH_SPACE_LENGTH, MouseButton } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CircleService } from '@app/services/tools/circle.service';
import { SquareService } from '@app/services/tools/square.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    initialSelection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selectionImage: HTMLCanvasElement = document.createElement('canvas');
    transormation: string = '';
    underliyingService: SquareService | CircleService;
    isEscapeKeyPressed: boolean;
    isShiftKeyDown: boolean;
    selectionData: Selection;
    canvasData: ImageData;

    constructor(drawingService: DrawingService, public moveService: MoveService) {
        super(drawingService);
    }

    initialize(): void {
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.setLineDash([DASH_LENGTH, DASH_SPACE_LENGTH]);
    }

    onMouseDown(event: MouseEvent): void {
        this.initialize();
        if (!this.isInSelection(event)) {
            this.mouseDown = event.button === MouseButton.LEFT;
            if (this.mouseDown) {
                if (!this.moveService.isTransformationOver) {
                    this.moveService.isTransformationOver = true;
                    this.moveService.printSelectionOnPreview();
                    this.applyPreview();
                }
                this.selection = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.underliyingService.onMouseDown(event);
            }
        } else {
            this.transormation = 'move';
            this.moveService.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            // setUp underlying service
            this.underliyingService.lastPoint = this.getPositionFromMouse(event);
            const currentFillStyle = this.underliyingService.fillStyle;
            this.underliyingService.fillStyle = FILL_STYLES.DASHED;
            // draw selection
            this.selection = this.underliyingService.drawShape(this.drawingService.previewCtx);
            if (this.selection.height !== 0 && this.selection.width !== 0) {
                this.setInitialSelection(this.selection);
                this.setSelectionData(this.selection);
            }
            // reset underlying service to original form
            this.underliyingService.fillStyle = currentFillStyle;
            this.mouseDown = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        } else if (this.transormation === 'move') {
            this.transormation = '';
        }
        this.strokeSelection();
        this.setSelectionPoint();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const currentFillStyle = this.underliyingService.fillStyle;
            this.underliyingService.fillStyle = FILL_STYLES.BORDER;
            this.underliyingService.onMouseMove(event);
            this.underliyingService.fillStyle = currentFillStyle;
        } else if (this.transormation === 'move') {
            this.moveService.onMouseMove(event);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.selection.height !== 0 || this.selection.height !== 0) {
            this.moveService.onKeyDown(event);
        }
        if (this.mouseDown) {
            this.underliyingService.fillStyle = FILL_STYLES.DASHED;
            this.underliyingService.onKeyDown(event);
        }
        if (event.key === 'Escape') {
            this.isEscapeKeyPressed = true;
            this.reset();
        }
        switch (event.key) {
            case 'Escape': {
                this.isEscapeKeyPressed = true;
                this.reset();
                break;
            }
            case 'Shift': {
                this.isShiftKeyDown = true;
                break;
            }
        }
    }

    selectAll(): void {
        this.selection = {
            startingPoint: { x: 0, y: 0 },
            width: this.drawingService.canvas.width,
            height: this.drawingService.canvas.height,
        };
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.underliyingService.firstPoint = { x: 0, y: 0 };
        this.underliyingService.lastPoint = { x: this.drawingService.canvas.width, y: this.drawingService.canvas.height };
        this.underliyingService.fillStyle = FILL_STYLES.DASHED;
        this.selection = this.underliyingService.drawShape(this.drawingService.previewCtx);
        this.setInitialSelection(this.selection);
        this.setSelectionData(this.selection);
        this.setSelectionPoint();
    }

    onKeyUp(event: KeyboardEvent): void {
        this.moveService.onKeyUp(event);
        if (!this.isShiftKeyDown) {
            this.underliyingService.onKeyUp(event);
            this.strokeSelection();
        }
        if (event.key === 'Shift') {
            if (this.mouseDown) {
                this.underliyingService.onKeyUp(event);
            }
            this.underliyingService.isShiftKeyDown = false;
            this.isShiftKeyDown = false;
        }
        this.setSelectionPoint();
    }

    private isInSelection(event: MouseEvent): boolean {
        const currentPosition = this.getPositionFromMouse(event);
        if (
            currentPosition.x > this.selection.startingPoint.x &&
            currentPosition.x < this.selection.startingPoint.x + this.selection.width &&
            currentPosition.y > this.selection.startingPoint.y &&
            currentPosition.y < this.selection.startingPoint.y + this.selection.height
        ) {
            return true;
        } else {
            return false;
        }
    }

    reset(): void {
        if (this.selection.height !== 0 && this.selection.height !== 0 && !this.isEscapeKeyPressed) {
            this.moveService.printSelectionOnPreview();
            this.applyPreview();
        }
        this.selection = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
        this.moveService.initialSelection = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
        this.mouseDown = false;
        this.transormation = '';
        this.moveService.isTransformationOver = true;
        this.drawingService.previewCtx.setLineDash([0]);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    setInitialSelection(selection: SelectionBox): void {
        this.initialSelection.startingPoint.x = selection.startingPoint.x;
        this.initialSelection.startingPoint.y = selection.startingPoint.y;
        this.initialSelection.width = selection.width;
        this.initialSelection.height = selection.height;
    }

    setSelectionData(selection: SelectionBox): void {}

    strokeSelection(): void {}

    applyPreview(): void {
        this.drawingService.baseCtx.drawImage(this.drawingService.previewCanvas, 0, 0);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.canvasData = this.drawingService.getCanvasData();
        this.updateSelectionData();
        this.drawingService.updateStack(this.selectionData);
    }

    updateSelectionData(): void {
        this.selectionData = {
            type: 'selection',
            imageData: this.canvasData,
        };
    }

    setSelectionPoint(): void {
        if (this.selection.height !== 0 && this.selection.width !== 0) {
            const topY: number = this.selection.startingPoint.y - 3;
            const middleY: number = this.selection.startingPoint.y + this.selection.height / 2 - 3;
            const bottomY: number = this.selection.startingPoint.y + this.selection.height - 3;
            const leftX: number = this.selection.startingPoint.x - 3;
            const middleX: number = this.selection.startingPoint.x + this.selection.width / 2 - 3;
            const rightX: number = this.selection.startingPoint.x + this.selection.width - 3;

            this.drawingService.previewCtx.fillStyle = '#09acd9';
            this.drawingService.previewCtx.fillRect(leftX, topY, 6, 6);
            this.drawingService.previewCtx.fillRect(middleX, topY, 6, 6);
            this.drawingService.previewCtx.fillRect(rightX, topY, 6, 6);
            this.drawingService.previewCtx.fillRect(leftX, middleY, 6, 6);
            this.drawingService.previewCtx.fillRect(rightX, middleY, 6, 6);
            this.drawingService.previewCtx.fillRect(leftX, bottomY, 6, 6);
            this.drawingService.previewCtx.fillRect(middleX, bottomY, 6, 6);
            this.drawingService.previewCtx.fillRect(rightX, bottomY, 6, 6);
        }
    }
}

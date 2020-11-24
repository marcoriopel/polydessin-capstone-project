import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { Tool } from '@app/classes/tool';
import { Selection } from '@app/classes/tool-properties';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import {
    ANGLE_HALF_TURN,
    DASH_LENGTH,
    DASH_SPACE_LENGTH,
    MouseButton,
    SELECTION_POINT_WIDTH,
} from '@app/ressources/global-variables/global-variables';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CircleService } from '@app/services/tools/circle.service';
import { SquareService } from '@app/services/tools/square.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { RotateService } from '@app/services/tools/transformation-services/rotate.service';
@Injectable({
    providedIn: 'root',
})

// disabling ts lint because methods have to be empty since they are implemented in the inhereting classes (polymorphism)
// tslint:disable:no-empty
export class SelectionService extends Tool {
    initialSelection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selectionImage: HTMLCanvasElement = document.createElement('canvas');
    transormation: string = '';
    underlyingService: SquareService | CircleService;
    isEscapeKeyPressed: boolean;
    isShiftKeyDown: boolean;
    selectionData: Selection;
    canvasData: ImageData;
    isNewSelection: boolean = false;
    isSelectionOver: boolean = true;

    constructor(
        public drawingService: DrawingService,
        public moveService: MoveService,
        public rotateService: RotateService,
        public clipboardService: ClipboardService,
    ) {
        super(drawingService);
    }

    initialize(): void {
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.setLineDash([DASH_LENGTH, DASH_SPACE_LENGTH]);
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button !== MouseButton.LEFT) return;
        if (!this.isInSelection(event)) {
            this.isNewSelection = true; // Réinitialisation pour une nouvelle selection
            if (!this.moveService.isTransformationOver) {
                // A l'exterieur de la selection
                this.moveService.isTransformationOver = true;
                this.moveService.printSelectionOnPreview();
                this.applyPreview();
            }
            if (!this.rotateService.isRotationOver) {
                this.rotateService.restoreSelection();
                this.applyPreview();
            }
            this.isSelectionOver = true;
            this.selection = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.underlyingService.onMouseDown(event);
        } else {
            this.isSelectionOver = false;
            this.transormation = 'move';
            this.moveService.onMouseDown(event);
        }
        this.drawingService.setIsToolInUse(true);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.isNewSelection) {
            // setUp underlying service

            this.underlyingService.lastPoint = this.getPositionFromMouse(event);
            const currentFillStyle = this.underlyingService.fillStyle;
            this.underlyingService.fillStyle = FILL_STYLES.DASHED;
            // draw selection
            this.selection = this.underlyingService.drawShape(this.drawingService.previewCtx);
            if (this.selection.height !== 0 && this.selection.width !== 0) {
                this.isSelectionOver = false;
                this.setSelection(this.initialSelection, this.selection);
                this.setSelectionData(this.selection);
            }
            // reset underlying service to original form
            this.underlyingService.fillStyle = currentFillStyle;
            this.isNewSelection = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        } else if (this.transormation === 'move') {
            this.transormation = '';
        }
        this.strokeSelection();
        this.setSelectionPoint();
        this.drawingService.setIsToolInUse(false);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isNewSelection) {
            const currentFillStyle = this.underlyingService.fillStyle;
            this.underlyingService.fillStyle = FILL_STYLES.BORDER;
            this.underlyingService.onMouseMove(event);
            this.underlyingService.fillStyle = currentFillStyle;
        } else if (this.transormation === 'move') {
            this.moveService.onMouseMove(event);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        this.rotateService.onKeyDown(event);
        if (event.ctrlKey) {
            this.ctrlKeyDown(event);
        }
        if (this.selection.height !== 0 || this.selection.height !== 0) {
            this.moveService.onKeyDown(event);
        }
        if (this.isNewSelection) {
            this.underlyingService.fillStyle = FILL_STYLES.DASHED;
            this.underlyingService.onKeyDown(event);
        }
        switch (event.key) {
            case 'Escape': {
                this.isEscapeKeyPressed = true;
                this.reset();
                break;
            }
            case 'Shift': {
                this.isShiftKeyDown = true;
                this.underlyingService.isShiftKeyDown = true;
                break;
            }
            case 'Delete': {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.moveService.clearSelectionBackground();
                this.applyPreview();
                this.selection = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
                const selectionImageCtx = this.selectionImage.getContext('2d') as CanvasRenderingContext2D;
                selectionImageCtx.clearRect(0, 0, this.selectionImage.width, this.selectionImage.height);
                this.moveService.initialize(this.selection, this.selectionImage);
                this.moveService.isTransformationOver = true;
                break;
            }
        }
    }

    ctrlKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'x': {
                if (this.selection.height !== 0 || this.selection.height !== 0) {
                    this.clipboardService.copy(this.selection, this.selectionImage, this.rotateService.angle);
                    this.moveService.clearSelectionBackground();
                    this.applyPreview();
                    this.selection = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
                    this.moveService.isTransformationOver = true;
                }
                break;
            }
            case 'c': {
                if (this.selection.height !== 0 || this.selection.height !== 0) {
                    this.clipboardService.copy(this.selection, this.selectionImage, this.rotateService.angle);
                    this.moveService.printSelectionOnPreview();
                }
                break;
            }
            case 'v': {
                if (this.clipboardService.selection.height !== 0 || this.clipboardService.selection.height !== 0) {
                    if (!this.moveService.isTransformationOver || !this.isSelectionOver) {
                        this.moveService.clearSelectionBackground();
                        this.moveService.printSelectionOnPreview();
                        this.applyPreview();
                    }
                    this.setSelection(this.selection, this.clipboardService.selection);
                    this.setSelectionImage(this.clipboardService.clipBoardCanvas);
                    this.rotateService.initialize(this.selection, this.selectionImage);
                    this.rotateService.angle = this.clipboardService.angle;
                    this.rotateService.initialSelection = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
                    this.isSelectionOver = false;
                    this.moveService.initialize(this.selection, this.selectionImage);
                    this.moveService.initialSelection = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
                    this.moveService.printSelectionOnPreview();
                    this.moveService.isTransformationOver = false;
                    this.strokeSelection();
                    this.setSelectionPoint();
                }
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
        this.underlyingService.firstPoint = { x: 0, y: 0 };
        this.underlyingService.lastPoint = { x: this.drawingService.canvas.width, y: this.drawingService.canvas.height };
        this.underlyingService.fillStyle = FILL_STYLES.DASHED;
        this.selection = this.underlyingService.drawShape(this.drawingService.previewCtx);
        this.setSelection(this.initialSelection, this.selection);
        this.setSelectionData(this.selection);
        this.setSelectionPoint();
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'z') {
            console.log(this.initialSelection.startingPoint);
            console.log(this.selection.startingPoint);
        }
        this.moveService.onKeyUp(event);
        this.rotateService.onKeyUp(event);
        if (!this.isShiftKeyDown) {
            this.underlyingService.onKeyUp(event);
            this.strokeSelection();
        }
        if (event.key === 'Shift') {
            if (this.isNewSelection) {
                this.underlyingService.onKeyUp(event);
            }
            this.underlyingService.isShiftKeyDown = false;
            this.isShiftKeyDown = false;
        }
        this.setSelectionPoint();
    }

    isInSelection(event: MouseEvent): boolean {
        const currentPosition = this.getPositionFromMouse(event);
        if (this.rotateService.mouseWheel) {
            const angleRad = this.rotateService.angle * (Math.PI / ANGLE_HALF_TURN);
            const sin = Math.sin(angleRad);
            const cos = Math.cos(angleRad);
            const x =
                cos * (currentPosition.x - this.rotateService.calculateCenter().x) +
                sin * (currentPosition.y - this.rotateService.calculateCenter().y) +
                this.rotateService.calculateCenter().x;
            const y =
                cos * (currentPosition.y - this.rotateService.calculateCenter().y) -
                sin * (currentPosition.x - this.rotateService.calculateCenter().x) +
                this.rotateService.calculateCenter().y;
            currentPosition.x = x;
            currentPosition.y = y;
        }
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

    setSelection(selection: SelectionBox, incomingSelection: SelectionBox): void {
        selection.startingPoint.x = incomingSelection.startingPoint.x;
        selection.startingPoint.y = incomingSelection.startingPoint.y;
        selection.width = incomingSelection.width;
        selection.height = incomingSelection.height;
    }

    setSelectionImage(selectionImage: HTMLCanvasElement): void {
        this.selectionImage.width = selectionImage.width;
        this.selectionImage.height = selectionImage.height;
        const selectionImageCtx = this.selectionImage.getContext('2d') as CanvasRenderingContext2D;
        selectionImageCtx.drawImage(selectionImage, 0, 0);
    }

    setSelectionData(selection: SelectionBox): void {}

    strokeSelection(): void {}

    applyPreview(): void {
        this.drawingService.applyPreview();
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
            const topY: number = this.selection.startingPoint.y - SELECTION_POINT_WIDTH / 2;
            const middleY: number = this.selection.startingPoint.y + this.selection.height / 2 - SELECTION_POINT_WIDTH / 2;
            const bottomY: number = this.selection.startingPoint.y + this.selection.height - SELECTION_POINT_WIDTH / 2;
            const leftX: number = this.selection.startingPoint.x - SELECTION_POINT_WIDTH / 2;
            const middleX: number = this.selection.startingPoint.x + this.selection.width / 2 - SELECTION_POINT_WIDTH / 2;
            const rightX: number = this.selection.startingPoint.x + this.selection.width - SELECTION_POINT_WIDTH / 2;

            this.drawingService.previewCtx.save();
            this.rotateService.rotatePreviewCanvas();
            this.drawingService.previewCtx.fillStyle = '#09acd9';
            this.drawingService.previewCtx.fillRect(leftX, topY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(middleX, topY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(rightX, topY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(leftX, middleY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(rightX, middleY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(leftX, bottomY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(middleX, bottomY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(rightX, bottomY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.restore();
        }
    }

    onWheelEvent(event: WheelEvent): void {
        if (!this.isSelectionOver) {
            this.rotateService.onWheelEvent(event);
            this.strokeSelection();
            this.setSelectionPoint();
        }
    }
}

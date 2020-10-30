import { Injectable } from '@angular/core';
import { Rectangle } from '@app/classes/rectangle';
import { Tool } from '@app/classes/tool';
import { ARROW_KEYS } from '@app/ressources/global-variables/arrow-keys';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class MoveService extends Tool {
    selection: Rectangle;
    selectionData: ImageData;
    transformationOver: boolean = true;
    isArrowKeyLeftPressed: boolean = false;
    isArrowKeyUpPressed: boolean = false;
    isArrowKeyRightPressed: boolean = false;
    isArrowKeyDownPressed: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    initialize(selection: Rectangle, selectionData: ImageData): void {
        this.selection = selection;
        this.selectionData = selectionData;
    }

    onMouseDown(event: MouseEvent): void {
        if (this.transformationOver) {
            this.transformationOver = false;
            this.clearSelectionBackground();
            this.printSelectionOnPreview();
        }
    }

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selection.startingPoint.x += event.movementX;
        this.selection.startingPoint.y += event.movementY;
        this.printSelectionOnPreview();
    }

    onKeyDown(event: KeyboardEvent): void {
        let isArrowKey = false;

        switch (event.key) {
            case ARROW_KEYS.LEFT:
                this.isArrowKeyLeftPressed = true;
                isArrowKey = true;
                break;
            case ARROW_KEYS.UP:
                this.isArrowKeyUpPressed = true;
                isArrowKey = true;
                break;
            case ARROW_KEYS.RIGHT:
                this.isArrowKeyRightPressed = true;
                isArrowKey = true;
                break;
            case ARROW_KEYS.DOWN:
                this.isArrowKeyDownPressed = true;
                isArrowKey = true;
                break;
        }

        if (this.isArrowKeyLeftPressed) {
            this.selection.startingPoint.x -= 3;
        }
        if (this.isArrowKeyUpPressed) {
            this.selection.startingPoint.y -= 3;
        }
        if (this.isArrowKeyRightPressed) {
            this.selection.startingPoint.x += 3;
        }
        if (this.isArrowKeyDownPressed) {
            this.selection.startingPoint.y += 3;
        }

        if (isArrowKey) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.printSelectionOnPreview();
            if (this.transformationOver) {
                this.transformationOver = false;
                this.clearSelectionBackground();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case ARROW_KEYS.LEFT:
                this.isArrowKeyLeftPressed = false;
                break;
            case ARROW_KEYS.UP:
                this.isArrowKeyUpPressed = false;
                break;
            case ARROW_KEYS.RIGHT:
                this.isArrowKeyRightPressed = false;
                break;
            case ARROW_KEYS.DOWN:
                this.isArrowKeyDownPressed = false;
                break;
        }
    }

    clearSelectionBackground(): void {
        const currentFillStyle = this.drawingService.baseCtx.fillStyle;
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(
            this.selection.startingPoint.x,
            this.selection.startingPoint.y,
            this.selection.width,
            this.selection.height,
        );
        this.drawingService.baseCtx.fillStyle = currentFillStyle;
    }

    printSelectionOnPreview(): void {
        this.drawingService.previewCtx.putImageData(this.selectionData, this.selection.startingPoint.x, this.selection.startingPoint.y);
    }
}

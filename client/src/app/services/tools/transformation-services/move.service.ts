import { Injectable } from '@angular/core';
import { Rectangle } from '@app/classes/rectangle';
import { Tool } from '@app/classes/tool';
import { ARROW_KEYS } from '@app/ressources/global-variables/arrow-keys';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class MoveService extends Tool {
    initialSelection: Rectangle = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selection: Rectangle;
    selectionData: ImageData;
    transformationOver: boolean = true;
    isArrowKeyLeftPressed: boolean = false;
    isArrowKeyUpPressed: boolean = false;
    isArrowKeyRightPressed: boolean = false;
    isArrowKeyDownPressed: boolean = false;
    intervalId: number = 0;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    initialize(selection: Rectangle, selectionData: ImageData): void {
        this.initialSelection.startingPoint.x = selection.startingPoint.x;
        this.initialSelection.startingPoint.y = selection.startingPoint.y;
        this.initialSelection.height = selection.height;
        this.initialSelection.width = selection.width;
        this.selection = selection;
        this.selectionData = selectionData;
    }

    onMouseDown(event: MouseEvent): void {
        if (this.transformationOver) {
            this.transformationOver = false;
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
                if (this.isArrowKeyLeftPressed === false) {
                    this.selection.startingPoint.x -= 3;
                }
                this.isArrowKeyLeftPressed = true;
                isArrowKey = true;
                break;
            case ARROW_KEYS.UP:
                if (this.isArrowKeyUpPressed === false) {
                    this.selection.startingPoint.y -= 3;
                }
                this.isArrowKeyUpPressed = true;
                isArrowKey = true;
                break;
            case ARROW_KEYS.RIGHT:
                if (this.isArrowKeyRightPressed === false) {
                    this.selection.startingPoint.x += 3;
                }
                this.isArrowKeyRightPressed = true;
                isArrowKey = true;
                break;
            case ARROW_KEYS.DOWN:
                if (this.isArrowKeyDownPressed === false) {
                    this.selection.startingPoint.y += 3;
                }
                this.isArrowKeyDownPressed = true;
                isArrowKey = true;
                break;
        }

        setTimeout(() => {
            if (
                this.isArrowKeyDownPressed === true ||
                this.isArrowKeyRightPressed === true ||
                this.isArrowKeyUpPressed === true ||
                this.isArrowKeyLeftPressed === true
            ) {
                if (this.intervalId === 0) {
                    this.intervalId = setInterval(this.move, 100, this);
                }
            }
        }, 500);

        if (isArrowKey) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.printSelectionOnPreview();
            if (this.transformationOver) {
                this.transformationOver = false;
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

        if (this.intervalId !== 0) {
            if (
                this.isArrowKeyDownPressed === false &&
                this.isArrowKeyRightPressed === false &&
                this.isArrowKeyUpPressed === false &&
                this.isArrowKeyLeftPressed === false
            ) {
                clearInterval(this.intervalId);
                this.intervalId = 0;
            }
        }
    }

    clearSelectionBackground(ctx: CanvasRenderingContext2D): void {
        const currentFillStyle = ctx.fillStyle;
        ctx.fillStyle = 'white';
        ctx.fillRect(
            this.initialSelection.startingPoint.x,
            this.initialSelection.startingPoint.y,
            this.initialSelection.width,
            this.initialSelection.height,
        );
        ctx.fillStyle = currentFillStyle;
    }

    printSelectionOnPreview(): void {
        this.clearSelectionBackground(this.drawingService.previewCtx);
        this.drawingService.previewCtx.putImageData(this.selectionData, this.selection.startingPoint.x, this.selection.startingPoint.y);
    }

    private move(self: MoveService): void {
        if (self.isArrowKeyLeftPressed) {
            self.selection.startingPoint.x -= 3;
        }
        if (self.isArrowKeyUpPressed) {
            self.selection.startingPoint.y -= 3;
        }
        if (self.isArrowKeyRightPressed) {
            self.selection.startingPoint.x += 3;
        }
        if (self.isArrowKeyDownPressed) {
            self.selection.startingPoint.y += 3;
        }

        self.drawingService.clearCanvas(self.drawingService.previewCtx);
        self.printSelectionOnPreview();
        if (self.transformationOver) {
            self.transformationOver = false;
        }
    }
}

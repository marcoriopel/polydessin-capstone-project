import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { ARROW_KEYS } from '@app/ressources/global-variables/arrow-keys';
import { CONFIRM_KEY_PRESS_DURATION, KEY_PRESS_INTERVAL_DURATION, SELECTION_MOVE_STEP_SIZE } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RotateService } from './rotate.service';

@Injectable({
    providedIn: 'root',
})
export class MoveService {
    initialSelection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selection: SelectionBox;
    isTransformationOver: boolean = true;
    pressedKeys: Map<string, boolean> = new Map([
        [ARROW_KEYS.LEFT, false],
        [ARROW_KEYS.UP, false],
        [ARROW_KEYS.RIGHT, false],
        [ARROW_KEYS.DOWN, false],
    ]);
    intervalId: ReturnType<typeof setTimeout> | undefined = undefined;
    selectionImage: HTMLCanvasElement = document.createElement('canvas');

    constructor(public drawingService: DrawingService, public rotateService: RotateService) {}

    initialize(selection: SelectionBox, selectionImage: HTMLCanvasElement): void {
        this.setSelection(this.initialSelection, selection);
        this.selection = selection;
        this.selectionImage = selectionImage;
    }

    onMouseDown(event: MouseEvent): void {
        this.isTransformationOver = false;
    }

    onMouseMove(event: MouseEvent): void {
        this.selection.startingPoint.x += event.movementX;
        this.selection.startingPoint.y += event.movementY;
        this.printSelectionOnPreview();
    }

    onKeyDown(event: KeyboardEvent): void {
        let isArrowKey = false;

        switch (event.key) {
            case ARROW_KEYS.LEFT:
                if (!this.pressedKeys.get(ARROW_KEYS.LEFT)) {
                    this.selection.startingPoint.x -= SELECTION_MOVE_STEP_SIZE;
                }
                break;
            case ARROW_KEYS.UP:
                if (!this.pressedKeys.get(ARROW_KEYS.UP)) {
                    this.selection.startingPoint.y -= SELECTION_MOVE_STEP_SIZE;
                }
                break;
            case ARROW_KEYS.RIGHT:
                if (!this.pressedKeys.get(ARROW_KEYS.RIGHT)) {
                    this.selection.startingPoint.x += SELECTION_MOVE_STEP_SIZE;
                }
                break;
            case ARROW_KEYS.DOWN:
                if (!this.pressedKeys.get(ARROW_KEYS.DOWN)) {
                    this.selection.startingPoint.y += SELECTION_MOVE_STEP_SIZE;
                }
                break;
        }

        if (this.pressedKeys.has(event.key)) {
            this.pressedKeys.set(event.key, true);
            isArrowKey = true;
        }

        setTimeout(() => {
            if (this.isArrowKeyPressed()) {
                this.drawingService.setIsToolInUse(true);
                if (this.intervalId === undefined) {
                    this.intervalId = setInterval(this.move, KEY_PRESS_INTERVAL_DURATION, this);
                }
            }
        }, CONFIRM_KEY_PRESS_DURATION);

        if (isArrowKey) {
            this.printSelectionOnPreview();
            this.isTransformationOver = false;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.pressedKeys.has(event.key)) {
            this.pressedKeys.set(event.key, false);
            this.drawingService.setIsToolInUse(false);
        }

        if (this.intervalId !== undefined) {
            if (!this.isArrowKeyPressed()) {
                clearInterval(this.intervalId);
                this.intervalId = undefined;
            }
        }
    }

    clearSelectionBackground(): void {
        const currentFillStyle = this.drawingService.previewCtx.fillStyle;
        this.drawingService.previewCtx.fillStyle = 'white';

        this.drawingService.previewCtx.fillRect(
            this.initialSelection.startingPoint.x,
            this.initialSelection.startingPoint.y,
            this.initialSelection.width,
            this.initialSelection.height,
        );

        this.drawingService.previewCtx.globalCompositeOperation = 'destination-in';
        this.drawingService.previewCtx.drawImage(this.selectionImage, this.initialSelection.startingPoint.x, this.initialSelection.startingPoint.y);
        this.drawingService.previewCtx.globalCompositeOperation = 'source-over';

        this.drawingService.previewCtx.fillStyle = currentFillStyle;
    }

    printSelectionOnPreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearSelectionBackground();
        this.drawingService.previewCtx.save();
        this.rotateService.rotatePreviewCanvas();
        this.drawingService.previewCtx.drawImage(this.selectionImage, this.selection.startingPoint.x, this.selection.startingPoint.y);
        this.drawingService.previewCtx.restore();
    }

    private move(self: MoveService): void {
        if (self.pressedKeys.get(ARROW_KEYS.LEFT)) {
            self.selection.startingPoint.x -= SELECTION_MOVE_STEP_SIZE;
        }
        if (self.pressedKeys.get(ARROW_KEYS.UP)) {
            self.selection.startingPoint.y -= SELECTION_MOVE_STEP_SIZE;
        }
        if (self.pressedKeys.get(ARROW_KEYS.RIGHT)) {
            self.selection.startingPoint.x += SELECTION_MOVE_STEP_SIZE;
        }
        if (self.pressedKeys.get(ARROW_KEYS.DOWN)) {
            self.selection.startingPoint.y += SELECTION_MOVE_STEP_SIZE;
        }

        self.printSelectionOnPreview();
    }

    private isArrowKeyPressed(): boolean {
        for (const [key] of this.pressedKeys) {
            if (this.pressedKeys.get(key)) {
                return true;
            }
        }
        return false;
    }

    setSelection(selection: SelectionBox, incomingSelection: SelectionBox): void {
        selection.startingPoint.x = incomingSelection.startingPoint.x;
        selection.startingPoint.y = incomingSelection.startingPoint.y;
        selection.width = incomingSelection.width;
        selection.height = incomingSelection.height;
    }
}

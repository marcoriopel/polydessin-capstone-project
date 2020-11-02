import { Injectable } from '@angular/core';
import { Rectangle } from '@app/classes/rectangle';
import { Tool } from '@app/classes/tool';
import { ARROW_KEYS } from '@app/ressources/global-variables/arrow-keys';
import { CONFIRM_KEY_PRESS_DURATION, KEY_PRESS_INTERVAL_DURATION, SELECTION_MOVE_STEP_SIZE } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class MoveService extends Tool {
    initialSelection: Rectangle = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selection: Rectangle;
    selectionData: ImageData;
    isTransformationOver: boolean = true;
    pressedKeys: Map<string, boolean> = new Map([
        [ARROW_KEYS.LEFT, false],
        [ARROW_KEYS.UP, false],
        [ARROW_KEYS.RIGHT, false],
        [ARROW_KEYS.DOWN, false],
    ]);
    intervalId: ReturnType<typeof setTimeout> | undefined = undefined;

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
        if (this.isTransformationOver) {
            this.isTransformationOver = false;
            this.printSelectionOnPreview();
        }
    }

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
                if (this.pressedKeys.get(ARROW_KEYS.LEFT) === false) {
                    this.selection.startingPoint.x -= SELECTION_MOVE_STEP_SIZE;
                }
                break;
            case ARROW_KEYS.UP:
                if (this.pressedKeys.get(ARROW_KEYS.UP) === false) {
                    this.selection.startingPoint.y -= SELECTION_MOVE_STEP_SIZE;
                }
                break;
            case ARROW_KEYS.RIGHT:
                if (this.pressedKeys.get(ARROW_KEYS.RIGHT) === false) {
                    this.selection.startingPoint.x += SELECTION_MOVE_STEP_SIZE;
                }
                break;
            case ARROW_KEYS.DOWN:
                if (this.pressedKeys.get(ARROW_KEYS.DOWN) === false) {
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
                if (this.intervalId === undefined) {
                    this.intervalId = setInterval(this.move, KEY_PRESS_INTERVAL_DURATION, this);
                }
            }
        }, CONFIRM_KEY_PRESS_DURATION);

        if (isArrowKey) {
            this.printSelectionOnPreview();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.pressedKeys.has(event.key)) {
            this.pressedKeys.set(event.key, false);
        }

        if (this.intervalId !== undefined) {
            if (!this.isArrowKeyPressed()) {
                clearInterval(this.intervalId);
                this.intervalId = undefined;
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
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearSelectionBackground(this.drawingService.previewCtx);
        this.drawingService.previewCtx.putImageData(this.selectionData, this.selection.startingPoint.x, this.selection.startingPoint.y);
        if (this.isTransformationOver) {
            this.isTransformationOver = false;
        }
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
}

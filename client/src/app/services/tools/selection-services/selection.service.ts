import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { Tool } from '@app/classes/tool';
import { Selection } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { DASH_LENGTH, DASH_SPACE_LENGTH, MouseButton, SELECTION_POINT_WIDTH } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CircleService } from '@app/services/tools/circle.service';
import { SquareService } from '@app/services/tools/square.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
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
    isMagnetism: boolean = true;
    gridSpacing: number = 20;
    mouseDownCoord: Vec2 = { x: 0, y: 0 };

    constructor(public drawingService: DrawingService, public moveService: MoveService) {
        super(drawingService);
    }

    initialize(): void {
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.setLineDash([DASH_LENGTH, DASH_SPACE_LENGTH]);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDownCoord.x = event.x;
        if (event.button !== MouseButton.LEFT) return;
        if (!this.isInSelection(event)) {
            this.isNewSelection = true;
            if (!this.moveService.isTransformationOver) {
                this.moveService.isTransformationOver = true;
                this.moveService.printSelectionOnPreview();
                this.applyPreview();
            }
            this.selection = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.underlyingService.onMouseDown(event);
        } else {
            this.mouseDownCoord.y = event.y;
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
                this.setInitialSelection(this.selection);
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
            const translationX = event.movementX;
            const translationY = event.movementY;
            if (this.isMagnetism) {
                console.log('MouseEvent: ' + event.x);
                console.log('mouseDownCoord: ' + this.mouseDownCoord.x);
                const mousePosX = event.x - this.mouseDownCoord.x;
                console.log(mousePosX);
                // const mousePosY = event.y - this.mouseDownCoord.y;
                this.onMouseMoveMagnetism(mousePosX, translationY);
            } else {
                this.moveService.onMouseMove(translationX, translationY);
            }
        }
    }

    onMouseMoveMagnetism(movementX: number, movementY: number): void {
        const topLeftX = this.selection.startingPoint.x + movementX;
        const lowestXDistance = topLeftX % this.gridSpacing;
        let gridCoordX = 0;
        if (lowestXDistance > this.gridSpacing / 2) {
            gridCoordX = topLeftX + this.gridSpacing - lowestXDistance;
            console.log('Inside coord:' + this.mouseDownCoord.x);
        } else {
            gridCoordX = topLeftX - lowestXDistance;
            console.log('Inside coord:' + this.mouseDownCoord.x);
        }
        const changeX = gridCoordX - this.selection.startingPoint.x;
        this.mouseDownCoord.x = this.mouseDownCoord.x + changeX;

        // const topLeftY = this.selection.startingPoint.y + movementY;
        // const lowestYDistance = topLeftY % this.gridSpacing;
        // let gridCoordY = 0;
        // if (lowestYDistance > this.gridSpacing / 2) {
        //     gridCoordY = topLeftY + this.gridSpacing - lowestYDistance;
        //     this.mouseDownCoord.y = topLeftY + this.gridSpacing - lowestYDistance;
        // } else {
        //     gridCoordY = topLeftY - lowestYDistance;
        // }
        // const changeY = gridCoordY - this.selection.startingPoint.y;
        this.moveService.onMouseMove(changeX, movementY);
    }

    onKeyDown(event: KeyboardEvent): void {
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
        this.setInitialSelection(this.selection);
        this.setSelectionData(this.selection);
        this.setSelectionPoint();
    }

    onKeyUp(event: KeyboardEvent): void {
        this.moveService.onKeyUp(event);
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

            this.drawingService.previewCtx.fillStyle = '#09acd9';
            this.drawingService.previewCtx.fillRect(leftX, topY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(middleX, topY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(rightX, topY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(leftX, middleY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(rightX, middleY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(leftX, bottomY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(middleX, bottomY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
            this.drawingService.previewCtx.fillRect(rightX, bottomY, SELECTION_POINT_WIDTH, SELECTION_POINT_WIDTH);
        }
    }
}

import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { Selection } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import {
    DASH_LENGTH,
    DASH_SPACE_LENGTH,
    MAGIC_WAND_BORDER_BOTH_SIDES,
    MAGIC_WAND_BORDER_ONE_SIDE,
    MAX_PERCENTAGE,
    MouseButton,
    OFFSET,
} from '@app/ressources/global-variables/global-variables';
import { MAXIMUM_RGBA_VALUE, RGBA_INDEXER, RGBA_LENGTH } from '@app/ressources/global-variables/rgba';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { RotateService } from '@app/services/tools/transformation-services/rotate.service';
import { MagnetismService } from './magnetism.service';
import { SelectionService } from './selection.service';

@Injectable({
    providedIn: 'root',
})
export class MagicWandService extends SelectionService {
    name: string = TOOL_NAMES.MAGIC_WAND_TOOL_NAME;
    mouseDownCoord: Vec2;
    stack: Vec2[];
    selectionData: Selection;
    initialSelection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selectionImageCtx: CanvasRenderingContext2D = this.selectionImage.getContext('2d') as CanvasRenderingContext2D;
    transormation: string = '';
    isNewSelection: boolean = false;
    pixelData: Uint8ClampedArray;
    tolerance: number = 15;
    secondaryTolerance: number = 50;
    selectionImageData: ImageData;
    contourCanvas: HTMLCanvasElement = document.createElement('canvas');
    contourCtx: CanvasRenderingContext2D = this.contourCanvas.getContext('2d') as CanvasRenderingContext2D;
    cornerSelectionValues: Map<string, number> = new Map([
        ['minX', 0],
        ['maxX', 0],
        ['minY', 0],
        ['maxY', 0],
    ]);

    constructor(
        drawingService: DrawingService,
        public moveService: MoveService,
        public rotateService: RotateService,
        public magnetismService: MagnetismService,
        public colorSelectionService: ColorSelectionService,
    ) {
        super(drawingService, moveService, rotateService, magnetismService);
    }

    initialize(): void {
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.setLineDash([DASH_LENGTH, DASH_SPACE_LENGTH]);
    }
    setCursor(): void {
        this.drawingService.gridCanvas.style.cursor = 'crosshair';
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        if (!this.isInSelection(event)) {
            this.isNewSelection = true;
            if (!this.moveService.isTransformationOver) {
                this.moveService.isTransformationOver = true;
                this.moveService.printSelectionOnPreview();
                this.applyPreview();
            }
            if (!this.rotateService.isRotationOver) {
                this.rotateService.restoreSelection();
                this.applyPreview();
            }
            this.selection = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (event.button === MouseButton.LEFT && this.isSelectionOver) {
                this.contiguousWand();
            } else if (event.button === MouseButton.RIGHT && this.isSelectionOver) {
                this.wand();
            }
            this.isSelectionOver = true;
        } else {
            this.isSelectionOver = false;
            this.mouseDownCoord.x = event.x;
            this.mouseDownCoord.y = event.y;
            this.transormation = 'move';
            this.moveService.onMouseDown(event);
        }
        this.drawingService.setIsToolInUse(true);
    }
    onMouseUp(event: MouseEvent): void {
        if (this.isNewSelection) {
            if (this.selection.height !== 0 && this.selection.width !== 0) {
                this.isSelectionOver = false;
                this.setInitialSelection(this.selection);
            }
            this.isNewSelection = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        } else if (this.transormation === 'move') {
            this.transormation = '';
        }
        this.strokeSelection();
        this.setSelectionPoint();
        this.drawingService.setIsToolInUse(false);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.moveService.onKeyUp(event);
        this.rotateService.onKeyUp(event);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.transormation === 'move') {
            if (this.isMagnetism) {
                const mousePosDifferenceX = event.x - this.mouseDownCoord.x;
                const mousePosDifferenceY = event.y - this.mouseDownCoord.y;
                this.onMouseMoveMagnetism(mousePosDifferenceX, mousePosDifferenceY);
            } else {
                this.moveService.onMouseMove(event.movementX, event.movementY);
            }
        }
    }

    adjustCornerSelectionValues(values: Map<string, number>, value: Vec2): Map<string, number> {
        if (value.x < (values.get('minX') as number)) {
            values.set('minX', value.x);
        } else if (value.x > (values.get('maxX') as number)) {
            values.set('maxX', value.x);
        }
        if (value.y < (values.get('minY') as number)) {
            values.set('minY', value.y);
        } else if (value.y > (values.get('maxY') as number)) {
            values.set('maxY', value.y);
        }
        return values;
    }

    contiguousWand(): void {
        this.pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        this.stack = [this.mouseDownCoord];
        const selectedPixels: Map<string, boolean> = new Map();
        this.cornerSelectionValues = new Map([
            ['minX', this.mouseDownCoord.x],
            ['maxX', this.mouseDownCoord.x],
            ['minY', this.mouseDownCoord.y],
            ['maxY', this.mouseDownCoord.y],
        ]);
        const canvasData: ImageData = this.drawingService.getCanvasData();
        this.selectionImageData = new ImageData(this.drawingService.canvas.width, this.drawingService.canvas.height);

        while (this.stack.length) {
            const currentPixel = this.stack.pop() as Vec2;
            const index = (currentPixel.x + currentPixel.y * this.drawingService.canvas.width) * RGBA_LENGTH;
            if (selectedPixels.has(this.Vec2ToString(currentPixel))) {
                continue;
            }
            if (this.isSameColor(this.pixelData, canvasData, index, this.tolerance)) {
                this.addPixelToSelection(index, canvasData);
                this.cornerSelectionValues = this.adjustCornerSelectionValues(this.cornerSelectionValues, currentPixel);
                selectedPixels.set(this.Vec2ToString(currentPixel), true);
                this.nextContiguousPixels(currentPixel, canvasData, index);
            }
        }
        this.selection = {
            startingPoint: {
                x: (this.cornerSelectionValues.get('minX') as number) - MAGIC_WAND_BORDER_ONE_SIDE,
                y: (this.cornerSelectionValues.get('minY') as number) - MAGIC_WAND_BORDER_ONE_SIDE,
            },
            height:
                (this.cornerSelectionValues.get('maxY') as number) -
                (this.cornerSelectionValues.get('minY') as number) +
                MAGIC_WAND_BORDER_BOTH_SIDES,
            width:
                (this.cornerSelectionValues.get('maxX') as number) -
                (this.cornerSelectionValues.get('minX') as number) +
                MAGIC_WAND_BORDER_BOTH_SIDES,
        };

        this.setSelectionData(this.selection);
    }

    nextContiguousPixels(currentPixel: Vec2, canvasData: ImageData, index: number): void {
        if (currentPixel.y - 1 >= 0) {
            index = (currentPixel.x + (currentPixel.y - 1) * this.drawingService.canvas.width) * RGBA_LENGTH;
            if (this.isSameColor(this.pixelData, canvasData, index, this.tolerance)) {
                this.stack.push({ x: currentPixel.x, y: currentPixel.y - 1 });
            } else {
                this.addSecondaryTolerance(this.pixelData, index, canvasData, { x: currentPixel.x, y: currentPixel.y - 1 });
            }
        }
        if (currentPixel.y + 1 < this.drawingService.canvas.height) {
            index = (currentPixel.x + (currentPixel.y + 1) * this.drawingService.canvas.width) * RGBA_LENGTH;
            if (this.isSameColor(this.pixelData, canvasData, index, this.tolerance)) {
                this.stack.push({ x: currentPixel.x, y: currentPixel.y + 1 });
            } else {
                this.addSecondaryTolerance(this.pixelData, index, canvasData, { x: currentPixel.x, y: currentPixel.y + 1 });
            }
        }
        if (currentPixel.x + 1 < this.drawingService.canvas.width) {
            index = (currentPixel.x + 1 + currentPixel.y * this.drawingService.canvas.width) * RGBA_LENGTH;
            if (this.isSameColor(this.pixelData, canvasData, index, this.tolerance)) {
                this.stack.push({ x: currentPixel.x + 1, y: currentPixel.y });
            } else {
                this.addSecondaryTolerance(this.pixelData, index, canvasData, { x: currentPixel.x + 1, y: currentPixel.y });
            }
        }
        if (currentPixel.x - 1 >= 0) {
            index = (currentPixel.x - 1 + currentPixel.y * this.drawingService.canvas.width) * RGBA_LENGTH;
            if (this.isSameColor(this.pixelData, canvasData, index, this.tolerance)) {
                this.stack.push({ x: currentPixel.x - 1, y: currentPixel.y });
            } else {
                this.addSecondaryTolerance(this.pixelData, index, canvasData, { x: currentPixel.x - 1, y: currentPixel.y });
            }
        }
    }

    addPixelToSelection(index: number, canvasData: ImageData): void {
        this.selectionImageData.data[index + RGBA_INDEXER.RED] = canvasData.data[index + RGBA_INDEXER.RED];
        this.selectionImageData.data[index + RGBA_INDEXER.GREEN] = canvasData.data[index + RGBA_INDEXER.GREEN];
        this.selectionImageData.data[index + RGBA_INDEXER.BLUE] = canvasData.data[index + RGBA_INDEXER.BLUE];
        this.selectionImageData.data[index + RGBA_INDEXER.ALPHA] = canvasData.data[index + RGBA_INDEXER.ALPHA];
    }

    addSecondaryTolerance(pixelData: Uint8ClampedArray, index: number, canvasData: ImageData, currentPixel: Vec2): void {
        if (!this.isSameColor(pixelData, canvasData, index, this.secondaryTolerance)) return;
        this.adjustCornerSelectionValues(this.cornerSelectionValues, currentPixel);
        this.selectionImageData.data[index + RGBA_INDEXER.RED] = canvasData.data[index + RGBA_INDEXER.RED];
        this.selectionImageData.data[index + RGBA_INDEXER.GREEN] = canvasData.data[index + RGBA_INDEXER.GREEN];
        this.selectionImageData.data[index + RGBA_INDEXER.BLUE] = canvasData.data[index + RGBA_INDEXER.BLUE];
        this.selectionImageData.data[index + RGBA_INDEXER.ALPHA] = canvasData.data[index + RGBA_INDEXER.ALPHA];
    }

    setSelectionData(selection: SelectionBox): void {
        this.selectionImage.width = selection.width;
        this.selectionImage.height = selection.height;
        this.selectionImageCtx.putImageData(this.selectionImageData, -this.selection.startingPoint.x, -this.selection.startingPoint.y);
        this.moveService.initialize(this.selection, this.selectionImage);
        this.rotateService.initialize(this.selection, this.selectionImage);
        this.drawingService.updateStack(this.selectionData);
    }

    strokeSelection(): void {
        if (this.selection.height !== 0 && this.selection.width !== 0) {
            this.drawingService.previewCtx.save();
            this.rotateService.rotatePreviewCanvas();
            this.setContourCanvas();
            this.drawingService.previewCtx.strokeRect(
                this.selection.startingPoint.x,
                this.selection.startingPoint.y,
                this.selection.width,
                this.selection.height,
            );
            this.drawingService.previewCtx.restore();
        }
    }

    setContourPattern(): CanvasPattern {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = MAGIC_WAND_BORDER_BOTH_SIDES;
        patternCanvas.height = MAGIC_WAND_BORDER_BOTH_SIDES;
        const pctx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;
        pctx.fillStyle = 'rgb(0, 0, 0)';
        pctx.fillRect(0, 0, 2, 2);
        pctx.fillRect(2, 2, 2, 2);
        return pctx.createPattern(patternCanvas, 'repeat') as CanvasPattern;
    }

    setContourCanvas(): void {
        const contourThickness = 2;
        this.contourCanvas.width = this.selectionImage.width + MAGIC_WAND_BORDER_BOTH_SIDES;
        this.contourCanvas.height = this.selectionImage.height + MAGIC_WAND_BORDER_BOTH_SIDES;
        const dArr = [OFFSET, OFFSET, 0, OFFSET, 1, OFFSET, OFFSET, 0, 1, 0, OFFSET, 1, 0, 1, 1, 1];

        for (let i = 0; i < dArr.length; i += 2)
            this.contourCtx.drawImage(
                this.selectionImage,
                contourThickness + dArr[i] * contourThickness,
                contourThickness + dArr[i + 1] * contourThickness,
            );
        this.contourCtx.globalCompositeOperation = 'source-in';
        this.contourCtx.fillStyle = this.setContourPattern();
        this.contourCtx.fillRect(0, 0, this.contourCanvas.width, this.contourCanvas.height);
        this.contourCtx.globalCompositeOperation = 'source-over';
        this.contourCtx.drawImage(this.selectionImage, contourThickness, contourThickness);
        this.drawingService.previewCtx.drawImage(
            this.contourCanvas,
            this.selection.startingPoint.x - MAGIC_WAND_BORDER_ONE_SIDE,
            this.selection.startingPoint.y - MAGIC_WAND_BORDER_ONE_SIDE,
        );
    }

    wand(): void {
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        this.cornerSelectionValues = new Map([
            ['minX', this.mouseDownCoord.x],
            ['maxX', this.mouseDownCoord.x],
            ['minY', this.mouseDownCoord.y],
            ['maxY', this.mouseDownCoord.y],
        ]);
        const canvasData: ImageData = this.drawingService.getCanvasData();
        this.selectionImageData = new ImageData(this.drawingService.canvas.width, this.drawingService.canvas.height);
        for (let index = 0; index < canvasData.data.length; index += RGBA_LENGTH) {
            if (this.isSameColor(pixelData, canvasData, index, this.tolerance)) {
                this.addPixelToSelection(index, canvasData);
                const currentPixel: Vec2 = {
                    x: (index / RGBA_LENGTH) % this.drawingService.canvas.width,
                    y: Math.floor(index / RGBA_LENGTH / this.drawingService.canvas.width),
                };
                this.cornerSelectionValues = this.adjustCornerSelectionValues(this.cornerSelectionValues, currentPixel);
            }
        }
        this.selection = {
            startingPoint: {
                x: (this.cornerSelectionValues.get('minX') as number) - MAGIC_WAND_BORDER_ONE_SIDE,
                y: (this.cornerSelectionValues.get('minY') as number) - MAGIC_WAND_BORDER_ONE_SIDE,
            },
            height:
                (this.cornerSelectionValues.get('maxY') as number) -
                (this.cornerSelectionValues.get('minY') as number) +
                MAGIC_WAND_BORDER_BOTH_SIDES,
            width:
                (this.cornerSelectionValues.get('maxX') as number) -
                (this.cornerSelectionValues.get('minX') as number) +
                MAGIC_WAND_BORDER_BOTH_SIDES,
        };

        this.setSelectionData(this.selection);
    }
    isSameColor(pixelData: Uint8ClampedArray, canvasData: ImageData, index: number, tolerance: number): boolean {
        const diffRed: number = Math.abs(pixelData[RGBA_INDEXER.RED] - canvasData.data[index + RGBA_INDEXER.RED]);
        const diffGreen: number = Math.abs(pixelData[RGBA_INDEXER.GREEN] - canvasData.data[index + RGBA_INDEXER.GREEN]);
        const diffBlue: number = Math.abs(pixelData[RGBA_INDEXER.BLUE] - canvasData.data[index + RGBA_INDEXER.BLUE]);
        const diffAlpha: number = Math.abs(pixelData[RGBA_INDEXER.ALPHA] - canvasData.data[index + RGBA_INDEXER.ALPHA]);
        const diffPercentage: number = ((diffRed + diffGreen + diffBlue + diffAlpha) / (RGBA_LENGTH * MAXIMUM_RGBA_VALUE)) * MAX_PERCENTAGE;
        if (diffPercentage > tolerance) {
            return false;
        } else {
            return true;
        }
    }
    Vec2ToString(pixel: Vec2): string {
        return pixel.x.toString() + ',' + pixel.y.toString();
    }
}

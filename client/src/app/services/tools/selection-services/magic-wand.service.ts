import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { Selection } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASH_LENGTH, DASH_SPACE_LENGTH, MAX_PERCENTAGE, MouseButton } from '@app/ressources/global-variables/global-variables';
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
    selectionData: Selection;
    initialSelection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selectionImageCtx: CanvasRenderingContext2D = this.selectionImage.getContext('2d') as CanvasRenderingContext2D;
    transormation: string = '';
    isNewSelection: boolean = false;
    tolerance: number = 15;
    selectionImageData: ImageData;
    contourCanvas: HTMLCanvasElement = document.createElement('canvas');
    contourCtx: CanvasRenderingContext2D = this.contourCanvas.getContext('2d') as CanvasRenderingContext2D;

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
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        const stack: Vec2[] = [this.mouseDownCoord];
        const selectedPixels: Map<string, boolean> = new Map();
        let cornerSelectionValues: Map<string, number> = new Map([
            ['minX', this.mouseDownCoord.x],
            ['maxX', this.mouseDownCoord.x],
            ['minY', this.mouseDownCoord.y],
            ['maxY', this.mouseDownCoord.y],
        ]);
        const canvasData: ImageData = this.drawingService.getCanvasData();
        this.selectionImageData = new ImageData(this.drawingService.canvas.width, this.drawingService.canvas.height);

        while (stack.length) {
            const currentPixel = stack.pop() as Vec2;
            const index = (currentPixel.x + currentPixel.y * this.drawingService.canvas.width) * RGBA_LENGTH;
            if (selectedPixels.has(this.Vec2ToString(currentPixel))) {
                continue;
            } else if (this.isSameColor(pixelData, canvasData, index)) {
                this.selectionImageData.data[index + RGBA_INDEXER.RED] = canvasData.data[index + RGBA_INDEXER.RED];
                this.selectionImageData.data[index + RGBA_INDEXER.GREEN] = canvasData.data[index + RGBA_INDEXER.GREEN];
                this.selectionImageData.data[index + RGBA_INDEXER.BLUE] = canvasData.data[index + RGBA_INDEXER.BLUE];
                this.selectionImageData.data[index + RGBA_INDEXER.ALPHA] = canvasData.data[index + RGBA_INDEXER.ALPHA];
                cornerSelectionValues = this.adjustCornerSelectionValues(cornerSelectionValues, currentPixel);
                selectedPixels.set(this.Vec2ToString(currentPixel), true);
                if (currentPixel.y - 1 >= 0) {
                    stack.push({ x: currentPixel.x, y: currentPixel.y - 1 });
                }
                if (currentPixel.y + 1 < this.drawingService.canvas.height) {
                    stack.push({ x: currentPixel.x, y: currentPixel.y + 1 });
                }
                if (currentPixel.x + 1 < this.drawingService.canvas.width) {
                    stack.push({ x: currentPixel.x + 1, y: currentPixel.y });
                }
                if (currentPixel.x - 1 >= 0) {
                    stack.push({ x: currentPixel.x - 1, y: currentPixel.y });
                }
            }
        }
        this.selection = {
            startingPoint: { x: cornerSelectionValues.get('minX') as number, y: cornerSelectionValues.get('minY') as number },
            height: (cornerSelectionValues.get('maxY') as number) - (cornerSelectionValues.get('minY') as number) + 1,
            width: (cornerSelectionValues.get('maxX') as number) - (cornerSelectionValues.get('minX') as number) + 1,
        };

        this.setSelectionData(this.selection);
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
        patternCanvas.width = 4;
        patternCanvas.height = 4;
        const pctx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

        // Two green rects make a checkered square: two green, two transparent (white)
        pctx.fillStyle = 'rgb(0, 0, 0)';
        pctx.fillRect(0, 0, 2, 2);
        pctx.fillRect(2, 2, 2, 2);
        return pctx.createPattern(patternCanvas, 'repeat') as CanvasPattern;
    }

    setContourCanvas(): void {
        const contourThickness = 2; // thickness scale

        this.contourCanvas.width = this.selectionImage.width + contourThickness;
        this.contourCanvas.height = this.selectionImage.height + contourThickness;

        // tslint:disable-next-line: no-magic-numbers
        const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1]; // offset array

        // draw images at offsets from the array scaled by s
        for (let i = 0; i < dArr.length; i += 2)
            this.contourCtx.drawImage(
                this.selectionImage,
                contourThickness + dArr[i] * contourThickness,
                contourThickness + dArr[i + 1] * contourThickness,
            );

        // fill with color
        this.contourCtx.globalCompositeOperation = 'source-in';
        this.contourCtx.fillStyle = this.setContourPattern();
        this.contourCtx.fillRect(0, 0, this.contourCanvas.width, this.contourCanvas.height);

        // draw original image in normal mode
        this.contourCtx.globalCompositeOperation = 'source-over';
        this.contourCtx.drawImage(this.selectionImage, contourThickness, contourThickness);
        this.drawingService.previewCtx.drawImage(this.contourCanvas, this.selection.startingPoint.x, this.selection.startingPoint.y);
    }

    wand(): void {
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        let cornerSelectionValues: Map<string, number> = new Map([
            ['minX', this.mouseDownCoord.x],
            ['maxX', this.mouseDownCoord.x],
            ['minY', this.mouseDownCoord.y],
            ['maxY', this.mouseDownCoord.y],
        ]);
        const canvasData: ImageData = this.drawingService.getCanvasData();
        this.selectionImageData = new ImageData(this.drawingService.canvas.width, this.drawingService.canvas.height);
        for (let i = 0; i < canvasData.data.length; i += RGBA_LENGTH) {
            if (this.isSameColor(pixelData, canvasData, i)) {
                this.selectionImageData.data[i + RGBA_INDEXER.RED] = canvasData.data[i + RGBA_INDEXER.RED];
                this.selectionImageData.data[i + RGBA_INDEXER.GREEN] = canvasData.data[i + RGBA_INDEXER.GREEN];
                this.selectionImageData.data[i + RGBA_INDEXER.BLUE] = canvasData.data[i + RGBA_INDEXER.BLUE];
                this.selectionImageData.data[i + RGBA_INDEXER.ALPHA] = canvasData.data[i + RGBA_INDEXER.ALPHA];
                const currentPixel: Vec2 = {
                    x: (i / RGBA_LENGTH) % this.drawingService.canvas.width,
                    y: Math.floor(i / RGBA_LENGTH / this.drawingService.canvas.width),
                };
                cornerSelectionValues = this.adjustCornerSelectionValues(cornerSelectionValues, currentPixel);
            }
        }
        this.selection = {
            startingPoint: { x: cornerSelectionValues.get('minX') as number, y: cornerSelectionValues.get('minY') as number },
            height: (cornerSelectionValues.get('maxY') as number) - (cornerSelectionValues.get('minY') as number) + 1,
            width: (cornerSelectionValues.get('maxX') as number) - (cornerSelectionValues.get('minX') as number) + 1,
        };

        this.setSelectionData(this.selection);
    }

    isSameColor(pixelData: Uint8ClampedArray, canvasData: ImageData, index: number): boolean {
        const diffRed: number = Math.abs(pixelData[RGBA_INDEXER.RED] - canvasData.data[index + RGBA_INDEXER.RED]);
        const diffGreen: number = Math.abs(pixelData[RGBA_INDEXER.GREEN] - canvasData.data[index + RGBA_INDEXER.GREEN]);
        const diffBlue: number = Math.abs(pixelData[RGBA_INDEXER.BLUE] - canvasData.data[index + RGBA_INDEXER.BLUE]);
        const diffAlpha: number = Math.abs(pixelData[RGBA_INDEXER.ALPHA] - canvasData.data[index + RGBA_INDEXER.ALPHA]);

        // After which you can just find the average color difference in percentage.
        const diffPercentage: number = ((diffRed + diffGreen + diffBlue + diffAlpha) / (RGBA_LENGTH * MAXIMUM_RGBA_VALUE)) * MAX_PERCENTAGE;

        if (diffPercentage > this.tolerance) {
            return false;
        } else {
            return true;
        }
    }

    Vec2ToString(pixel: Vec2): string {
        return pixel.x.toString() + ',' + pixel.y.toString();
    }
}

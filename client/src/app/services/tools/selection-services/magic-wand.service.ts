import { Injectable } from '@angular/core';
import { SelectionBox } from '@app/classes/selection-box';
import { Tool } from '@app/classes/tool';
import { Selection } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASH_LENGTH, DASH_SPACE_LENGTH, MAX_PERCENTAGE, MouseButton } from '@app/ressources/global-variables/global-variables';
import { MAXIMUM_RGBA_VALUE, Rgba, RGBA_INDEXER, RGBA_LENGTH } from '@app/ressources/global-variables/rgba';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';

@Injectable({
    providedIn: 'root',
})
export class MagicWandService extends Tool {
    name: string = TOOL_NAMES.MAGIC_WAND_TOOL_NAME;
    mouseDownCoord: Vec2;
    initialPixelData: Uint8ClampedArray;
    selectionData: Selection;
    canvasData: ImageData;
    selectionCanvasData: ImageData;
    initialSelection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 0, height: 0 };
    selectionImage: HTMLCanvasElement = document.createElement('canvas');
    selectionImageCtx: CanvasRenderingContext2D = this.selectionImage.getContext('2d') as CanvasRenderingContext2D;
    transormation: string = '';
    isNewSelection: boolean = false;
    tolerance: number = 0;

    constructor(public drawingService: DrawingService, public moveService: MoveService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
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
        this.drawingService.baseCtx.filter = 'none';
        this.drawingService.previewCtx.filter = 'none';
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.initialPixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        if (event.button === MouseButton.LEFT) {
            this.contiguousFill();
        } else if (event.button === MouseButton.RIGHT) {
            this.fill();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.transormation === 'move') {
            this.moveService.onMouseMove(event);
        }
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
    contiguousFill(): void {
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        const stack: Vec2[] = [this.mouseDownCoord];
        const coloredPixels: Map<string, boolean> = new Map();
        const canvasData: ImageData = this.drawingService.getCanvasData();

        const rgbaPrimaryColor: Rgba = this.colorSelectionService.getRgbaPrimaryColor();

        while (stack.length) {
            const currentPixel = stack.pop() as Vec2;
            const index = (currentPixel.x + currentPixel.y * this.drawingService.canvas.width) * RGBA_LENGTH;
            if (coloredPixels.has(this.Vec2ToString(currentPixel))) {
                continue;
            } else if (this.isInToleranceRange(pixelData, canvasData, index)) {
                canvasData.data[index + RGBA_INDEXER.RED] = rgbaPrimaryColor.RED;
                canvasData.data[index + RGBA_INDEXER.GREEN] = rgbaPrimaryColor.GREEN;
                canvasData.data[index + RGBA_INDEXER.BLUE] = rgbaPrimaryColor.BLUE;
                canvasData.data[index + RGBA_INDEXER.ALPHA] = rgbaPrimaryColor.ALPHA;
                coloredPixels.set(this.Vec2ToString(currentPixel), true);
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
        this.canvasData = canvasData;
        this.drawingService.baseCtx.putImageData(canvasData, 0, 0);
        this.drawingService.updateStack(this.selectionData);
    }

    fill(): void {
        this.selectionImage = this.drawingService.canvas;
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        const canvasData = this.drawingService.getCanvasData();
        const newCanvasData: ImageData = new ImageData(100, 100);

        let i;
        for (i = 0; i < canvasData.data.length; i += RGBA_LENGTH) {
            if (this.isInToleranceRange(pixelData, canvasData, i)) {
                newCanvasData.data[i + RGBA_INDEXER.RED] = canvasData.data[i + RGBA_INDEXER.RED];
                newCanvasData.data[i + RGBA_INDEXER.GREEN] = canvasData.data[i + RGBA_INDEXER.GREEN];
                newCanvasData.data[i + RGBA_INDEXER.BLUE] = canvasData.data[i + RGBA_INDEXER.BLUE];
                newCanvasData.data[i + RGBA_INDEXER.ALPHA] = canvasData.data[i + RGBA_INDEXER.ALPHA];
            }
        }
        this.selectionCanvasData = newCanvasData;
        this.updateSelectionData();
        this.selectionImageCtx.putImageData(newCanvasData, 0, 0);
        this.drawingService.updateStack(this.selectionData);
    }

    isInToleranceRange(pixelData: Uint8ClampedArray, canvasData: ImageData, index: number): boolean {
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

    updateSelectionData(): void {
        this.selectionData = {
            type: 'fill',
            imageData: this.selectionCanvasData,
        };
    }
}

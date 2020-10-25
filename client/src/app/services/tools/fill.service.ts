import { Injectable } from '@angular/core';
import { RGBA_INDEXER } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class FillService extends Tool {
    name: string = TOOL_NAMES.FILL_TOOL_NAME;
    maxTolerance: number = 100;
    minTolerance: number = 0;
    tolerance: number = this.minTolerance;
    mouseDownCoord: Vec2;
    initialPixelData: Uint8ClampedArray;

    constructor(public drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }

    handleCursor(): void {
        const previewCanvas = this.drawingService.previewCanvas;
        previewCanvas.style.cursor = 'crosshair';
    }

    changeTolerance(newTolerance: number): void {
        this.tolerance = newTolerance;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.initialPixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        if (event.button === MouseButton.Left) {
            this.drawingService.baseCtx.fillStyle = this.colorSelectionService.primaryColor;
            this.contiguousFill();
        } else if (event.button === MouseButton.Right) {
            this.fill();
        }
    }

    contiguousFill(): void {
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        const stack: Vec2[] = [this.mouseDownCoord];
        const coloredPixels: Map<string, boolean> = new Map();
        const canvasData: ImageData = this.drawingService.getCanvasData();

        const rgbaPrimaryColor = this.colorSelectionService.getRgbaPrimaryColor();

        while (stack.length) {
            const currentPixel = (stack.pop() as unknown) as Vec2;
            const index = (currentPixel.x + currentPixel.y * this.drawingService.canvas.width) * 4;
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
        this.drawingService.baseCtx.putImageData(canvasData, 0, 0);
    }

    fill(): void {
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        const canvasData = this.drawingService.getCanvasData();

        const rgbaPrimaryColor = this.colorSelectionService.getRgbaPrimaryColor();

        let i;
        for (i = 0; i < canvasData.data.length; i += 4) {
            if (this.isInToleranceRange(pixelData, canvasData, i)) {
                canvasData.data[i + RGBA_INDEXER.RED] = rgbaPrimaryColor.RED;
                canvasData.data[i + RGBA_INDEXER.GREEN] = rgbaPrimaryColor.GREEN;
                canvasData.data[i + RGBA_INDEXER.BLUE] = rgbaPrimaryColor.BLUE;
                canvasData.data[i + RGBA_INDEXER.ALPHA] = rgbaPrimaryColor.ALPHA;
            }
        }

        this.drawingService.baseCtx.putImageData(canvasData, 0, 0);
    }

    Vec2ToString(pixel: Vec2): string {
        return pixel.x.toString() + ',' + pixel.y.toString();
    }

    isInToleranceRange(pixelData: Uint8ClampedArray, canvasData: ImageData, index: number): boolean {
        const diffRed: number = Math.abs(pixelData[RGBA_INDEXER.RED] - canvasData.data[index + RGBA_INDEXER.RED]);
        const diffGreen: number = Math.abs(pixelData[RGBA_INDEXER.GREEN] - canvasData.data[index + RGBA_INDEXER.GREEN]);
        const diffBlue: number = Math.abs(pixelData[RGBA_INDEXER.BLUE] - canvasData.data[index + RGBA_INDEXER.BLUE]);
        const diffAlpha: number = Math.abs(pixelData[RGBA_INDEXER.ALPHA] - canvasData.data[index + RGBA_INDEXER.ALPHA]);

        // After which you can just find the average color difference in percentage.
        const diffPercentage: number = ((diffRed + diffGreen + diffBlue + diffAlpha) / (4 * 255)) * 100;

        if (diffPercentage > this.tolerance) {
            return false;
        } else {
            return true;
        }
    }
}

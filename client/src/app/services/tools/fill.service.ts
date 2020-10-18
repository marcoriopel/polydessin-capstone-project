import { Injectable } from '@angular/core';
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
    tolerance: number = 0;
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

        while (stack.length) {
            const currentPixel = (stack.pop() as unknown) as Vec2;
            const index = (currentPixel.x + currentPixel.y * this.drawingService.canvas.width) * 4;
            if (coloredPixels.has(this.Vec2ToString(currentPixel))) {
                continue;
            } else if (this.isInToleranceRange(pixelData, canvasData, index)) {
                this.drawingService.baseCtx.fillRect(currentPixel.x, currentPixel.y, 1, 1);
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
    }

    fill(): void {
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        const canvasData = this.drawingService.getCanvasData();

        const primaryColor = this.colorSelectionService.primaryColor.slice(5);

        const subStrings = primaryColor.split(',');
        const r: number = parseInt(subStrings[0], 10);
        const g: number = parseInt(subStrings[1], 10);
        const b: number = parseInt(subStrings[2], 10);
        const a: number = parseFloat(subStrings[3]) * 255;

        let i;
        for (i = 0; i < canvasData.data.length; i += 4) {
            if (this.isInToleranceRange(pixelData, canvasData, i)) {
                canvasData.data[i] = r;
                canvasData.data[i + 1] = g;
                canvasData.data[i + 2] = b;
                canvasData.data[i + 3] = a;
            }
        }

        this.drawingService.baseCtx.putImageData(canvasData, 0, 0);
    }

    Vec2ToString(pixel: Vec2): string {
        return pixel.x.toString() + ',' + pixel.y.toString();
    }

    isInToleranceRange(pixelData: Uint8ClampedArray, canvasData: ImageData, index: number): boolean {
        if (
            pixelData[0] - (this.tolerance * 255) / 100 <= canvasData.data[index + 0] &&
            canvasData.data[index + 0] <= pixelData[0] + (this.tolerance * 255) / 100 &&
            pixelData[1] - (this.tolerance * 255) / 100 <= canvasData.data[index + 1] &&
            canvasData.data[index + 1] <= pixelData[1] + (this.tolerance * 255) / 100 &&
            pixelData[2] - (this.tolerance * 255) / 100 <= canvasData.data[index + 2] &&
            canvasData.data[index + 2] <= pixelData[2] + (this.tolerance * 255) / 100 &&
            pixelData[3] - (this.tolerance * 255) / 100 <= canvasData.data[index + 3] &&
            canvasData.data[index + 3] <= pixelData[3] + (this.tolerance * 255) / 100
        ) {
            return true;
        } else {
            return false;
        }
    }
}

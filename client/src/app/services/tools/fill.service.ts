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
        if (event.button === MouseButton.Left) {
            this.contiguousFill();
        } else if (event.button === MouseButton.Right) {
            this.fill();
        }
    }

    contiguousFill(): void {
        // TODO
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

        console.log(a);

        let i;
        for (i = 0; i < canvasData.data.length; i += 4) {
            if (
                pixelData[0] - (this.tolerance * 255) / 100 <= canvasData.data[i] &&
                canvasData.data[i] <= pixelData[0] + (this.tolerance * 255) / 100 &&
                pixelData[1] - (this.tolerance * 255) / 100 <= canvasData.data[i + 1] &&
                canvasData.data[i + 1] <= pixelData[1] + (this.tolerance * 255) / 100 &&
                pixelData[2] - (this.tolerance * 255) / 100 <= canvasData.data[i + 2] &&
                canvasData.data[i + 2] <= pixelData[2] + (this.tolerance * 255) / 100 &&
                pixelData[3] - (this.tolerance * 255) / 100 <= canvasData.data[i + 3] &&
                canvasData.data[i + 3] <= pixelData[3] + (this.tolerance * 255) / 100
            ) {
                canvasData.data[i] = r;
                canvasData.data[i + 1] = g;
                canvasData.data[i + 2] = b;
                canvasData.data[i + 3] = a;
            }
        }

        this.drawingService.baseCtx.putImageData(canvasData, 0, 0);
    }
}

import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { MouseButton, ZOOM_PIPETTE, ZOOM_RADIUS } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';

const MAX_OPACITY = 255;

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    onCanvas: Subject<boolean> = new Subject<boolean>();
    name: string = TOOL_NAMES.PIPETTE_TOOL_NAME;
    zoom: HTMLCanvasElement;
    zoomCtx: CanvasRenderingContext2D;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }

    handleCursor(): void {
        const previewCanvas = this.drawingService.previewCanvas;
        previewCanvas.style.cursor = 'crosshair';
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
        const mousePosition = this.getPositionFromMouse(event);
        const pixel = this.drawingService.baseCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1);
        const pixelData = pixel.data;
        const color = 'rgba(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ', ' + pixelData[3] / MAX_OPACITY + ')';

        if (event.button === MouseButton.Left) {
            this.colorSelectionService.setPrimaryColor(color);
        } else if (event.button === MouseButton.Right) {
            this.colorSelectionService.setSecondaryColor(color);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    showZoomPixel(event: MouseEvent): void {
        this.zoomCtx.clearRect(1, 1, this.zoom.width, this.zoom.height);
        const mousePosition = this.getPositionFromMouse(event);
        // if (!this.handleNearBorder(event)) {
        this.drawImage(this.zoom.height, this.zoom.width, mousePosition.x, mousePosition.y, event);
        // }
    }

    drawImage(height: number, width: number, x: number, y: number, event: MouseEvent): void {
        const hSource = height / ZOOM_PIPETTE;
        const wSource = width / ZOOM_PIPETTE;
        this.zoomCtx.beginPath();
        this.zoomCtx.arc(this.zoom.width / 2, this.zoom.height / 2, ZOOM_RADIUS, 0, 2 * Math.PI);
        this.zoomCtx.clip();
        this.zoomCtx.drawImage(this.drawingService.canvas, x - wSource / 2, y - hSource / 2, wSource, hSource, 0, 0, width, height);
        this.zoomCtx.closePath();
        this.handleCursorOnPixel(event, width, height);
    }

    handleCursorOnPixel(e: MouseEvent, width: number, height: number): void {
        const mousePosition = this.getPositionFromMouse(e);
        const pixelData = this.drawingService.baseCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1).data;
        const color = 'rgba(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ', ' + pixelData[3] / MAX_OPACITY + ')';
        this.zoomCtx.beginPath();
        this.zoomCtx.fillStyle = color;
        this.zoomCtx.strokeStyle = 'white';
        this.zoomCtx.setLineDash([2, 1]);
        this.zoomCtx.strokeRect(width / 2, height / 2, ZOOM_PIPETTE, ZOOM_PIPETTE);
        this.zoomCtx.strokeStyle = 'black';
        this.zoomCtx.setLineDash([1, 2]);
        this.zoomCtx.strokeRect(width / 2, height / 2, ZOOM_PIPETTE, ZOOM_PIPETTE);
        this.zoomCtx.fillRect(width / 2, height / 2, ZOOM_PIPETTE, ZOOM_PIPETTE);
        this.zoomCtx.closePath();
    }

    handleNearBorder(e: MouseEvent): boolean {
        let isNearBorder = false;
        const mousePosition = this.getPositionFromMouse(e);
        if (mousePosition.x <= this.drawingService.canvas.width || mousePosition.x <= 0) {
            isNearBorder = true;
        }
        if (mousePosition.y < this.drawingService.canvas.height || mousePosition.y <= 0) {
            isNearBorder = true;
        }
        if (isNearBorder) {
            this.zoomCtx.clearRect(1, 1, this.zoom.width, this.zoom.height);
            this.onCanvas.next(true);
        }
        return isNearBorder;
    }

    onMouseMove(event: MouseEvent): void {
        this.showZoomPixel(event);
    }
    onMouseEnter(): void {
        this.onCanvas.next(true);
    }

    onMouseLeave(): void {
        this.onCanvas.next(false);
    }
}

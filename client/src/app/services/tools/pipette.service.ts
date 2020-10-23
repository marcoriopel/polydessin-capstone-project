import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { MouseButton, ZOOM_PIPETTE } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';

const MAX_OPACITY = 255;

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    onCanvas = new Subject();
    name: string = TOOL_NAMES.PIPETTE_TOOL_NAME;
    zoom: HTMLCanvasElement;
    zoomCtx: CanvasRenderingContext2D;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
        // this.clearPath();
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

    showZoomPixel(event: MouseEvent, canvas: HTMLCanvasElement): void {
        this.zoomCtx.clearRect(1, 1, this.zoom.width, this.zoom.height);
        const hSource = this.zoom.height / ZOOM_PIPETTE;
        const wSource = this.zoom.width / ZOOM_PIPETTE;
        const mousePosition = this.getPositionFromMouse(event);
        this.zoomCtx.drawImage(
            canvas,
            mousePosition.x - wSource / 2,
            mousePosition.y - hSource / 2,
            wSource,
            hSource,
            0,
            0,
            this.zoom.width,
            this.zoom.height,
        );
        this.handleCursorOnPixel(event);
    }

    handleCursorOnPixel(e: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(e);
        const pixelData = this.drawingService.baseCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1).data;
        const color = 'rgba(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ', ' + pixelData[3] / MAX_OPACITY + ')';
        this.zoomCtx.fillStyle = color;
        this.zoomCtx.strokeStyle = 'white';
        this.zoomCtx.setLineDash([2, 1]);
        this.zoomCtx.strokeRect(this.zoom.width / 2, this.zoom.height / 2, ZOOM_PIPETTE, ZOOM_PIPETTE);
        this.zoomCtx.strokeStyle = 'black';
        this.zoomCtx.setLineDash([1, 2]);
        this.zoomCtx.strokeRect(this.zoom.width / 2, this.zoom.height / 2, ZOOM_PIPETTE, ZOOM_PIPETTE);
        this.zoomCtx.fillRect(this.zoom.width / 2, this.zoom.height / 2, ZOOM_PIPETTE, ZOOM_PIPETTE);
    }

    onMouseMove(event: MouseEvent): void {
        this.showZoomPixel(event, this.drawingService.canvas);
    }
    onMouseEnter(): void {
        this.onCanvas.next(true);
    }

    onMouseLeave(): void {
        this.onCanvas.next(false);
    }
}

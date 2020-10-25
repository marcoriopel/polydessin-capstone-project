import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Pencil } from '@app/classes/tool-properties';


@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    private pathData: Vec2[];
    private pencilData: Pencil;
    name: string = TOOL_NAMES.PENCIL_TOOL_NAME;
    width: number = 1;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
        this.clearPath();
    }

    setCursor(): void {
        const previewCanvas = this.drawingService.previewCanvas;
        previewCanvas.style.cursor = 'crosshair';
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button !== MouseButton.LEFT) {
            return;
        } else {
            this.mouseDown = true;
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.updatePencilData();
            this.drawingService.drawLineStroke(this.drawingService.previewCtx, this.pencilData);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.updatePencilData();
            this.drawingService.drawLineStroke(this.drawingService.baseCtx, this.pencilData);
            this.drawingService.updateStack(this.pencilData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.updatePencilData();
            this.drawingService.drawLineStroke(this.drawingService.previewCtx, this.pencilData);
        }
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }

    private updatePencilData(): void {
        this.pencilData = {
            type: 'pencil',
            path: this.pathData,
            lineWidth: this.width,
            primaryColor: this.colorSelectionService.primaryColor,
        };
    }

    private clearPath(): void {
        this.pathData = [];
    }
}

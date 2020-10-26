import { Injectable } from '@angular/core';
import { LineStroke } from '@app/classes/tool-properties';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool {
    name: string = TOOL_NAMES.BRUSH_TOOL_NAME;
    private brushData: LineStroke;
    private pathData: Vec2[];
    width: number = 1;
    pattern: string;

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
            this.updateBrushData();
            this.drawingService.drawLineStroke(this.drawingService.previewCtx, this.brushData);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.updateBrushData();
            this.drawingService.drawLineStroke(this.drawingService.baseCtx, this.brushData);
            this.drawingService.updateStack(this.brushData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.updateBrushData();
            this.drawingService.drawLineStroke(this.drawingService.previewCtx, this.brushData);
        }
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }

    setPattern(pattern: string): void {
        this.pattern = pattern;
    }

    private updateBrushData(): void {
        this.brushData = {
            type: 'lineStroke',
            path: this.pathData,
            lineWidth: this.width,
            lineCap: 'round',
            pattern: this.pattern,
            primaryColor: this.colorSelectionService.primaryColor,
        };
    }

    private clearPath(): void {
        this.pathData = [];
    }
}

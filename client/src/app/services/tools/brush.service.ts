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
export class BrushService extends Tool {
    name: string = TOOL_NAMES.BRUSH_TOOL_NAME;
    private pathData: Vec2[];
    width: number = 1;
    pattern: string;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
        this.name = TOOL_NAMES.BRUSH_TOOL_NAME;
        this.width = 1;
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
            this.applyPattern(this.pattern);
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.applyPattern('none');
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
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }

    setPattern(pattern: string): void {
        this.pattern = pattern;
    }

    applyPattern(pattern: string): void {
        if (pattern === 'none') {
            this.drawingService.baseCtx.filter = 'none';
            this.drawingService.previewCtx.filter = 'none';
        } else {
            this.drawingService.baseCtx.filter = 'url(/assets/patterns.svg#' + pattern + ')';
            this.drawingService.previewCtx.filter = 'url(/assets/patterns.svg#' + pattern + ')';
        }
        // Les deux lignes ci-dessous servent a faire rafraichir les canvas pour appliquer le filtre
        this.drawingService.baseCtx.strokeRect(-this.drawingService.baseCtx.lineWidth, 0, 1, 0);
        this.drawingService.previewCtx.strokeRect(-this.drawingService.previewCtx.lineWidth, 0, 1, 0);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        ctx.lineCap = ctx.lineJoin = 'round';
        ctx.strokeStyle = this.colorSelectionService.primaryColor;
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}

import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    constructor(public colorSelectionService: ColorSelectionService) {}

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawDot(width: number, isPreview: boolean, mouseClicks: Vec2[], indexPosition: number): void {
        if (isPreview) {
            this.previewCtx.strokeStyle = this.colorSelectionService.secondaryColor;
            this.previewCtx.fillStyle = this.colorSelectionService.secondaryColor;
            this.previewCtx.globalAlpha = this.colorSelectionService.secondaryOpacity;
            this.previewCtx.beginPath();
            this.previewCtx.arc(mouseClicks[indexPosition].x, mouseClicks[indexPosition].y, width, 0, 2 * Math.PI);
            this.previewCtx.fill();
            this.previewCtx.stroke();
        } else {
            this.baseCtx.strokeStyle = this.colorSelectionService.secondaryColor;
            this.baseCtx.fillStyle = this.colorSelectionService.secondaryColor;
            this.baseCtx.globalAlpha = this.colorSelectionService.secondaryOpacity;
            this.baseCtx.beginPath();
            this.baseCtx.arc(mouseClicks[indexPosition].x, mouseClicks[indexPosition].y, width, 0, 2 * Math.PI);
            this.baseCtx.fill();
            this.baseCtx.stroke();
        }
    }

    drawLine(startingPoint: Vec2, endingPoint: Vec2, isPreview: boolean, lineWidth: number): void {
        if (isPreview) {
            // Using the preview canvas
            this.previewCtx.strokeStyle = this.colorSelectionService.primaryColor;
            this.previewCtx.globalAlpha = this.colorSelectionService.primaryOpacity;
            this.previewCtx.lineWidth = lineWidth;
            this.previewCtx.beginPath();
            this.previewCtx.moveTo(startingPoint.x, startingPoint.y);
            this.previewCtx.lineTo(endingPoint.x, endingPoint.y);
            this.previewCtx.stroke();
        } else {
            // Using the base canvas
            this.baseCtx.strokeStyle = this.colorSelectionService.primaryColor;
            this.baseCtx.globalAlpha = this.colorSelectionService.primaryOpacity;
            this.baseCtx.lineWidth = lineWidth;
            this.baseCtx.beginPath();
            this.baseCtx.moveTo(startingPoint.x, startingPoint.y);
            this.baseCtx.lineTo(endingPoint.x, endingPoint.y);
            this.baseCtx.stroke();
        }
    }
}

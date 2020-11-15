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
export class PenService extends Tool {
    private pathData: Vec2[];
    name: string = TOOL_NAMES.PEN_TOOL_NAME;
    width: number = 1;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
        this.clearPath();
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.baseCtx.filter = 'none';
        this.drawingService.previewCtx.filter = 'none';
        if (event.button !== MouseButton.LEFT) {
            return;
        } else {
            this.mouseDown = true;
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.drawPenStroke(this.drawingService.previewCtx);
            this.drawingService.setIsToolInUse(true);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawPenStroke(this.drawingService.baseCtx);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.setIsToolInUse(false);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPenStroke(this.drawingService.previewCtx);
        }
    }

    drawPenStroke(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.colorSelectionService.primaryColor;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (let i = 1; i < this.pathData.length; i++) {
            const lastPoint = this.pathData[i - 1];
            const point = this.pathData[i];
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(point.x, point.y);
            for (let j = 1; j <= this.width / 2; j++) {
                ctx.moveTo(lastPoint.x - j, lastPoint.y - j);
                ctx.lineTo(point.x - j, point.y - j);
                ctx.moveTo(lastPoint.x + j, lastPoint.y + j);
                ctx.lineTo(point.x + j, point.y + j);
            }
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}

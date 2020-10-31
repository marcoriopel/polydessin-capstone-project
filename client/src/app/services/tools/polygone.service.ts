import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends Tool {
    lineWidth: number = 1;
    name: string = TOOL_NAMES.POLYGONE_TOOL_NAME;
    lastPoint: Vec2;
    firstPoint: Vec2;
    numberOfClicks: number = 0;
    fillStyle: number = FILL_STYLES.FILL_AND_BORDER;
    width: number = 1;
    private center: Vec2;
    sides: number = 3;
    centerX: number;
    centerY: number;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
        // this.clearPath();
    }

    handleCursor(): void {
        const previewCanvas = this.drawingService.previewCanvas;
        previewCanvas.style.cursor = 'crosshair';
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }

    changeFillStyle(newFillStyle: number): void {
        this.fillStyle = newFillStyle;
    }
    changeLineWidth(newWidth: number): void {
        this.lineWidth = newWidth;
    }
    changeSides(sides: number): void {
        this.sides = sides;
    }
    setCenterX(): void {
        this.centerX = Math.abs(this.firstPoint.y - this.lastPoint.y);
    }
    setCenterY(): void {
        this.centerY = Math.abs(this.firstPoint.y - this.lastPoint.y);
    }
    set setSides(sides: number) {
        this.sides = sides;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.LEFT;
        if (this.mouseDown) {
            this.firstPoint = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPolygone(this.drawingService.baseCtx);
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastPoint = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.center = this.getCenter();
            this.drawCircularPerimeter(this.drawingService.previewCtx);
            this.drawPolygone(this.drawingService.previewCtx);
        }
    }

    drawCircularPerimeter(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.width;
        ctx.fillStyle = this.colorSelectionService.primaryColor;
        ctx.strokeStyle = this.colorSelectionService.secondaryColor;
        if (this.fillStyle === FILL_STYLES.FILL) {
            ctx.strokeStyle = this.colorSelectionService.primaryColor;
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.setLineDash([1, 2]); // ligne pointillée
        const rad = this.radius;
        ctx.ellipse(this.center.x, this.center.y, rad, rad, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();
    }

    drawPolygone(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colorSelectionService.primaryColor;
        ctx.strokeStyle = this.colorSelectionService.secondaryColor;
        ctx.lineWidth = this.width;

        if (this.fillStyle === FILL_STYLES.FILL) {
            ctx.strokeStyle = this.colorSelectionService.primaryColor;
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.moveTo(this.center.x + this.radius * Math.cos(-Math.PI / 2), this.center.y + this.radius * Math.sin(-Math.PI / 2));

        for (let i = 1; i <= this.sides; i++) {
            ctx.lineTo(
                this.center.x + this.radius * Math.cos((i * 2 * Math.PI) / this.sides - Math.PI / 2),
                this.center.y + this.radius * Math.sin((i * 2 * Math.PI) / this.sides - Math.PI / 2),
            );
            if (this.fillStyle !== FILL_STYLES.BORDER) {
                ctx.fill();
            }
        }
        ctx.stroke();
        ctx.closePath();
    }

    get radius(): number {
        return Math.abs(this.lastPoint.x - this.firstPoint.x) / 2;
    }

    getCenter(): Vec2 {
        let centerX = Math.abs(this.lastPoint.x - this.firstPoint.x) / 2;
        let centerY = Math.abs(this.lastPoint.y - this.firstPoint.y) / 2;

        centerX = this.firstPoint.x > this.lastPoint.x ? this.lastPoint.x + centerX : this.lastPoint.x - centerX;
        centerY = this.firstPoint.y > this.lastPoint.y ? this.lastPoint.y + centerY : this.lastPoint.y - centerY;
        const center: Vec2 = { x: centerX, y: centerY };
        return center;
    }
}

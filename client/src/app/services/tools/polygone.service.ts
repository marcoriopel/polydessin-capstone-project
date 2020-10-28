import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { DASH_LENGTH, DASH_SPACE_LENGTH, MouseButton } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CircleService } from '@app/services/tools/circle.service';

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends Tool {
    name: string = TOOL_NAMES.POLYGONE_TOOL_NAME;
    lastPoint: Vec2;
    firstPoint: Vec2;
    numberOfClicks: number = 0;
    fillStyle: number = FILL_STYLES.FILL_AND_BORDER;
    width: number = 1;
    center: Vec2;
    sides: number = 3;
    centerX: number;
    centerY: number;
    circleHeight: number;
    circleWidth: number;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService, public circleService: CircleService) {
        super(drawingService);
        // this.clearPath();
    }

    handleCursor(): void {
        const previewCanvas = this.drawingService.previewCanvas;
        previewCanvas.style.cursor = 'crosshair';
    }

    changeFillStyle(newFillStyle: number): void {
        this.fillStyle = newFillStyle;
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
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
            this.lastPoint = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastPoint = this.getPositionFromMouse(event);
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
            this.drawCircle(this.drawingService.previewCtx);
            this.drawPolygone(this.drawingService.previewCtx);
        }
    }

    drawCircle(ctx: CanvasRenderingContext2D): void {
        this.circleService.changeFillStyle(FILL_STYLES.BORDER);
        this.circleService.firstPoint = this.firstPoint;
        this.circleService.lastPoint = this.lastPoint;
        this.circleService.drawCircle(ctx, this.findTopLeftPointC());
    }

    drawPolygone(ctx: CanvasRenderingContext2D): void {
        const tpL = this.findTopLeftPointC();
        ctx.fillStyle = this.colorSelectionService.primaryColor;
        ctx.strokeStyle = this.colorSelectionService.secondaryColor;
        ctx.lineWidth = this.width;

        if (this.fillStyle === FILL_STYLES.FILL) {
            ctx.strokeStyle = this.colorSelectionService.primaryColor;
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        this.circleService.firstPoint = this.firstPoint;
        this.circleService.lastPoint = this.lastPoint;
        this.setCircleHeight();
        this.setCircleWidth();
        const ellipseRadiusX = this.circleWidth / 2;
        const ellipseRadiusY = this.circleHeight / 2;
        const circleRadius = Math.min(ellipseRadiusX, ellipseRadiusY);
        const quadrant = this.circleService.findQuadrant();
        const center:Vec2 = {x:0, y:0};

        const point1 = this.firstPoint;
        const point2 = this.lastPoint;

        switch(quadrant) {
            case 1:
                center.x = this.firstPoint.x - circleRadius;
                center.y = this.firstPoint.y - circleRadius;
              break;
            case 2:
                center.x = this.firstPoint.x + circleRadius;
                center.y = this.firstPoint.y - circleRadius;
              break;
            case 3:
                center.x = this.firstPoint.x + circleRadius;
                center.y = this.firstPoint.y + circleRadius;
              break;
            case 4:
                center.x = this.firstPoint.x - circleRadius;
                center.y = this.firstPoint.y + circleRadius;
              break;
            default:
        }

        ctx.moveTo(center.x, center.y - circleRadius);
        ctx.lineWidth = this.width;

        for (let i = 0; i <= this.sides + 1; i++) {
            ctx.lineTo(
                center.x + circleRadius * Math.cos((i * 2 * Math.PI) / this.sides - Math.PI / 2),
                center.y + circleRadius * Math.sin((i * 2 * Math.PI) / this.sides - Math.PI / 2),
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
        let centerX = Math.floor(this.lastPoint.x - this.firstPoint.x) / 2;
        let centerY = Math.floor(this.lastPoint.y - this.firstPoint.y) / 2;

        centerX = this.firstPoint.x > this.lastPoint.x ? this.lastPoint.x + centerX : this.lastPoint.x - centerX;
        centerY = this.firstPoint.y > this.lastPoint.y ? this.lastPoint.y + centerY : this.lastPoint.y - centerY;
        const center: Vec2 = { x: centerX, y: centerY };
        return center;
    }

    findTopLeftPointC(): Vec2 {
        const point1 = this.firstPoint;
        const point2 = this.lastPoint;
        // firstPoint is top left corner lastPoint is bottom right corner
        let x = point1.x;
        let y = point1.y;
        if (point1.x > point2.x && point1.y > point2.y) {
            // firstPoint is bottom right corner lastPoint is top left corner
            x = point2.x;
            y = point2.y;
        } else if (point1.x > point2.x && point1.y < point2.y) {
            // firstPoint is top right corner lastPoint is bottom left corner
            x = point2.x;
            y = point1.y;
        } else if (point1.x < point2.x && point1.y > point2.y) {
            // firstPoint is bottom left corner lastPoint is top right corner
            x = point1.x;
            y = point2.y;
        }

        return { x, y };
    }

    setCircleWidth(): void {
        this.circleWidth = Math.abs(this.firstPoint.x - this.lastPoint.x);
    }

    setCircleHeight(): void {
        this.circleHeight = Math.abs(this.firstPoint.y - this.lastPoint.y);
    }
}

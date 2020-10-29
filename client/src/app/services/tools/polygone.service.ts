import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { DASH_LENGTH, DASH_SPACE_LENGTH, FOUR, MouseButton, ONE, THREE, TWOO } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CircleService } from '@app/services/tools/circle.service';
import { ShapeService } from './shapes/shape.service';

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends Tool {
    name: string = TOOL_NAMES.POLYGONE_TOOL_NAME;
    lastPoint: Vec2;
    firstPoint: Vec2;
    fillStyle: number = FILL_STYLES.FILL_AND_BORDER;
    width: number = 1;
    // center: Vec2;
    sides: number = 3;

    constructor(
        drawingService: DrawingService,
        public colorSelectionService: ColorSelectionService,
        public circleService: CircleService,
        public shapeService: ShapeService,
    ) {
        super(drawingService);
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
        this.shapeService.centerX = Math.abs(this.firstPoint.y - this.lastPoint.y);
    }
    setCenterY(): void {
        this.shapeService.centerY = Math.abs(this.firstPoint.y - this.lastPoint.y);
    }
    set setSides(sides: number) {
        this.sides = sides;
    }
    setCircleWidth(): void {
        this.shapeService.circleWidth = Math.abs(this.firstPoint.x - this.lastPoint.x);
    }
    setCircleHeight(): void {
        this.shapeService.circleHeight = Math.abs(this.firstPoint.y - this.lastPoint.y);
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
            this.shapeService.center = this.shapeService.getCenter();
            this.drawCircle(this.drawingService.previewCtx);
            this.drawPolygone(this.drawingService.previewCtx);
        }
    }

    drawCircle(ctx: CanvasRenderingContext2D): void {
        this.circleService.changeFillStyle(FILL_STYLES.BORDER);
        this.circleService.firstPoint = this.shapeService.firstPoint;
        this.circleService.lastPoint = this.shapeService.lastPoint;
        this.circleService.drawCircle(ctx, this.shapeService.findTopLeftPointC());
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
        this.shapeService.firstPoint = this.firstPoint;
        this.shapeService.lastPoint = this.lastPoint;
        this.shapeService.setCircleHeight();
        this.shapeService.setCircleWidth();
        const ellipseRadiusX = this.shapeService.circleWidth / 2;
        const ellipseRadiusY = this.shapeService.circleHeight / 2;
        const circleRadius = Math.min(ellipseRadiusX, ellipseRadiusY);
        const quadrant = this.shapeService.findQuadrant();
        const center: Vec2 = { x: 0, y: 0 };

        if (ctx === this.drawingService.previewCtx) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.setLineDash([DASH_LENGTH, DASH_SPACE_LENGTH]);
            ctx.stroke();
            ctx.lineWidth = this.width;
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.setLineDash([0]);
        }

        switch (quadrant) {
            case ONE:
                center.x = this.firstPoint.x - circleRadius;
                center.y = this.firstPoint.y - circleRadius;
                break;
            case TWOO:
                center.x = this.firstPoint.x + circleRadius;
                center.y = this.firstPoint.y - circleRadius;
                break;
            case THREE:
                center.x = this.firstPoint.x + circleRadius;
                center.y = this.firstPoint.y + circleRadius;
                break;
            case FOUR:
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
}

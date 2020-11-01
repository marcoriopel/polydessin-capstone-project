import { Injectable } from '@angular/core';
import { Trigonometry } from '@app/classes/math/trigonometry';
import { Tool } from '@app/classes/tool';
import { Ellipse } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { DASH_LENGTH, DASH_SPACE_LENGTH, MouseButton, Quadrant } from '@app/ressources/global-variables/global-variables';
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
    fillStyle: number = FILL_STYLES.FILL_AND_BORDER;
    width: number = 1;
    sides: number = 3;
    circleHeight: number;
    circleWidth: number;
    centerX: number;
    centerY: number;
    center: Vec2;
    trigonometry: Trigonometry = new Trigonometry();

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService, public circleService: CircleService) {
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
        this.centerX = Math.abs(this.firstPoint.y - this.lastPoint.y);
    }
    setCenterY(): void {
        this.centerY = Math.abs(this.firstPoint.y - this.lastPoint.y);
    }
    set setSides(sides: number) {
        this.sides = sides;
    }
    setCircleWidth(): void {
        this.circleWidth = Math.abs(this.firstPoint.x - this.lastPoint.x);
    }
    setCircleHeight(): void {
        this.circleHeight = Math.abs(this.firstPoint.y - this.lastPoint.y);
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
            this.center = this.trigonometry.getCenter(this.firstPoint, this.lastPoint);
            this.drawCircle(this.drawingService.previewCtx);
            this.drawPolygone(this.drawingService.previewCtx);
        }
    }

    drawCircle(ctx: CanvasRenderingContext2D): void {
        const ellipseData: Ellipse = {
            type: 'ellipse',
            primaryColor: this.colorSelectionService.primaryColor,
            secondaryColor: this.colorSelectionService.secondaryColor,
            fillStyle: FILL_STYLES.BORDER,
            isShiftDown: true,
            center: this.trigonometry.getCenter(this.firstPoint, this.lastPoint),
            radius: { x: this.circleWidth / 2, y: this.circleHeight / 2 },
            lineWidth: 1,
        };
        this.circleService.drawEllipse(ctx, ellipseData);
        this.LineDashh(this.drawingService.previewCtx);
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
        this.firstPoint = this.firstPoint;
        this.lastPoint = this.lastPoint;
        this.setCircleHeight();
        this.setCircleWidth();
        const ellipseRadiusX = this.circleWidth / 2;
        const ellipseRadiusY = this.circleHeight / 2;
        const circleRadius = Math.min(ellipseRadiusX, ellipseRadiusY);
        const quadrant = this.trigonometry.findQuadrant(this.firstPoint, this.lastPoint);
        const center: Vec2 = { x: 0, y: 0 };

        switch (quadrant) {
            case Quadrant.TOP_RIGHT:
                center.x = this.firstPoint.x - circleRadius;
                center.y = this.firstPoint.y + circleRadius;
                break;
            case Quadrant.TOP_LEFT:
                center.x = this.firstPoint.x + circleRadius;
                center.y = this.firstPoint.y + circleRadius;
                break;
            case Quadrant.BOTTOM_LEFT:
                center.x = this.firstPoint.x + circleRadius;
                center.y = this.firstPoint.y - circleRadius;
                break;
            case Quadrant.BOTTOM_RIGHT:
                center.x = this.firstPoint.x - circleRadius;
                center.y = this.firstPoint.y - circleRadius;
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

    LineDashh(ctx: CanvasRenderingContext2D): void {
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
    }
}

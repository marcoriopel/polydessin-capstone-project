import { Injectable } from '@angular/core';
import { Trigonometry } from '@app/classes/math/trigonometry';
import { Tool } from '@app/classes/tool';
import { Polygone } from '@app/classes/tool-properties';
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
    fillStyle: number = FILL_STYLES.FILL_AND_BORDER;
    width: number = 1;
    sides: number = 3;
    circleHeight: number;
    circleWidth: number;
    centerX: number;
    centerY: number;
    center: Vec2;
    trigonometry: Trigonometry = new Trigonometry();
    polygoneData: Polygone;

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
            this.updatePolygoneData();
            this.drawPolygone(this.drawingService.baseCtx, this.polygoneData);
            this.drawingService.updateStack(this.polygoneData);
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastPoint = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.center = this.trigonometry.getCenter(this.firstPoint, this.lastPoint);
            this.drawCircle(this.drawingService.previewCtx);
            this.updatePolygoneData();
            this.drawPolygone(this.drawingService.previewCtx, this.polygoneData);
        }
    }

    drawCircle(ctx: CanvasRenderingContext2D): void {
        this.circleService.changeFillStyle(FILL_STYLES.BORDER);
        this.circleService.firstPoint = this.firstPoint;
        this.circleService.lastPoint = this.lastPoint;
        this.circleService.drawCircle(ctx, this.trigonometry.findTopLeftPointC(this.firstPoint, this.lastPoint));
        this.LineDash(this.drawingService.previewCtx);
    }

    drawPolygone(ctx: CanvasRenderingContext2D, polygoneData: Polygone): void {
        ctx.fillStyle = polygoneData.primaryColor;
        ctx.strokeStyle = polygoneData.secondaryColor;
        ctx.lineWidth = polygoneData.lineWidth;

        if (this.fillStyle === FILL_STYLES.FILL) {
            ctx.strokeStyle = this.colorSelectionService.primaryColor;
            ctx.lineWidth = 1;
        }

        ctx.beginPath();
        this.firstPoint = polygoneData.firstPoint;
        this.lastPoint = polygoneData.lastPoint;
        this.setCircleHeight();
        this.setCircleWidth();
        const ellipseRadiusX = polygoneData.circleWidth / 2;
        const ellipseRadiusY = polygoneData.circleHeight / 2;
        const circleRadius = Math.min(ellipseRadiusX, ellipseRadiusY);
        const quadrant = this.trigonometry.findQuadrant(polygoneData.firstPoint, polygoneData.lastPoint);
        const center: Vec2 = { x: 0, y: 0 };

        switch (quadrant) {
            case 1:
                center.x = polygoneData.firstPoint.x - circleRadius;
                center.y = polygoneData.firstPoint.y - circleRadius;
                break;
            case 2:
                center.x = polygoneData.firstPoint.x + circleRadius;
                center.y = polygoneData.firstPoint.y - circleRadius;
                break;
            case 3:
                center.x = polygoneData.firstPoint.x + circleRadius;
                center.y = polygoneData.firstPoint.y + circleRadius;
                break;
            case 4:
                center.x = polygoneData.firstPoint.x - circleRadius;
                center.y = polygoneData.firstPoint.y + circleRadius;
                break;
            default:
        }

        ctx.moveTo(center.x, center.y - circleRadius);
        ctx.lineWidth = polygoneData.lineWidth;

        for (let i = 0; i <= this.sides + 1; i++) {
            ctx.lineTo(
                center.x + circleRadius * Math.cos((i * 2 * Math.PI) / polygoneData.sides - Math.PI / 2),
                center.y + circleRadius * Math.sin((i * 2 * Math.PI) / polygoneData.sides - Math.PI / 2),
            );
            if (this.fillStyle !== FILL_STYLES.BORDER) {
                ctx.fill();
            }
        }
        ctx.stroke();
        ctx.closePath();
    }

    LineDash(ctx: CanvasRenderingContext2D): void {
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

    private updatePolygoneData(): void {
        this.polygoneData = {
            type: 'polygone',
            primaryColor: this.colorSelectionService.primaryColor,
            secondaryColor: this.colorSelectionService.secondaryColor,
            fillStyle: this.fillStyle,
            lineWidth: this.width,
            circleHeight: this.circleHeight,
            circleWidth: this.circleWidth,
            firstPoint: this.firstPoint,
            lastPoint: this.lastPoint,
            sides: this.sides,
        };
    }
}

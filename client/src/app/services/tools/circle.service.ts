import { Injectable } from '@angular/core';
import { Trigonometry } from '@app/classes/math/trigonometry';
import { Tool } from '@app/classes/tool';
import { Ellipse } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { DASH_LENGTH, DASH_SPACE_LENGTH, MouseButton } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class CircleService extends Tool {
    name: string = TOOL_NAMES.CIRCLE_TOOL_NAME;
    fillStyle: number = FILL_STYLES.FILL;
    isShiftKeyDown: boolean = false;
    mouseDown: boolean = false;
    ellipseRadius: Vec2;
    ellipseCenter: Vec2;
    ellipseHeight: number;
    ellipseWidth: number;
    ellipseData: Ellipse;
    width: number = 1;
    firstPoint: Vec2;
    lastPoint: Vec2;
    quadrant: number;
    trigonometry: Trigonometry = new Trigonometry();

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }

    setCursor(): void {
        const previewCanvas = this.drawingService.previewCanvas;
        previewCanvas.style.cursor = 'crosshair';
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }

    changeFillStyle(newFillStyle: number): void {
        this.fillStyle = newFillStyle;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftKeyDown = true;
            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawShape(this.drawingService.previewCtx);
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift' && this.isShiftKeyDown) {
            this.isShiftKeyDown = false;
            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawShape(this.drawingService.previewCtx);
            }
        }
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
            this.drawShape(this.drawingService.baseCtx);
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastPoint = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawShape(this.drawingService.previewCtx);
        }
    }

    drawShape(ctx: CanvasRenderingContext2D): void {
        const topLeftPoint = this.trigonometry.findTopLeftPoint(this.firstPoint, this.lastPoint);
        ctx.fillStyle = this.colorSelectionService.primaryColor;
        ctx.strokeStyle = this.colorSelectionService.secondaryColor;
        ctx.lineWidth = this.width;
        ctx.setLineDash([0]);

        if (this.fillStyle === FILL_STYLES.FILL) {
            ctx.strokeStyle = this.colorSelectionService.primaryColor;
            ctx.lineWidth = 1;
        }

        this.setellipseHeight();
        this.setellipseWidth();
        this.ellipseRadius = { x: this.ellipseWidth / 2, y: this.ellipseHeight / 2 };
        this.ellipseCenter = { x: topLeftPoint.x + this.ellipseRadius.x, y: topLeftPoint.y + this.ellipseRadius.y };

        this.updateEllipseData();
        this.drawEllipse(ctx, this.ellipseData);

        if (ctx === this.drawingService.previewCtx) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.setLineDash([DASH_LENGTH, DASH_SPACE_LENGTH]);
            ctx.rect(topLeftPoint.x, topLeftPoint.y, this.ellipseWidth, this.ellipseHeight);
            ctx.stroke();
            ctx.lineWidth = this.width;
        } else {
            this.drawingService.updateStack(this.ellipseData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.setLineDash([0]);
        }
    }

    drawEllipse(ctx: CanvasRenderingContext2D, ellipse: Ellipse): void {
        ctx.fillStyle = ellipse.primaryColor;
        ctx.strokeStyle = ellipse.secondaryColor;
        ctx.lineWidth = ellipse.lineWidth;

        if (ellipse.fillStyle === FILL_STYLES.FILL) {
            ctx.strokeStyle = ellipse.primaryColor;
            ctx.lineWidth = 1;
        }

        ctx.beginPath();
        if (ellipse.isShiftDown) {
            ctx.arc(ellipse.center.x, ellipse.center.y, Math.min(ellipse.radius.x, ellipse.radius.y), 0, Math.PI * 2, false);
        } else {
            ctx.ellipse(ellipse.center.x, ellipse.center.y, ellipse.radius.x, ellipse.radius.y, 0, 0, Math.PI * 2, false);
        }
        if (ellipse.fillStyle !== FILL_STYLES.BORDER) {
            ctx.fill();
        }
        ctx.stroke();
    }

    setellipseWidth(): void {
        this.ellipseWidth = Math.abs(this.firstPoint.x - this.lastPoint.x);
    }

    setellipseHeight(): void {
        this.ellipseHeight = Math.abs(this.firstPoint.y - this.lastPoint.y);
    }

    private updateEllipseData(): void {
        this.ellipseData = {
            type: 'ellipse',
            primaryColor: this.colorSelectionService.primaryColor,
            secondaryColor: this.colorSelectionService.secondaryColor,
            center: this.ellipseCenter,
            radius: this.ellipseRadius,
            fillStyle: this.fillStyle,
            isShiftDown: this.isShiftKeyDown,
            lineWidth: this.width,
        };
    }
}

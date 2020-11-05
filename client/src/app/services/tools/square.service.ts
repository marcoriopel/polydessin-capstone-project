import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Rectangle } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SquareService extends Tool {
    name: string = TOOL_NAMES.SQUARE_TOOL_NAME;
    mouseDown: boolean = false;
    rectangleData: Rectangle;
    isShiftKeyDown: boolean = false;
    width: number = 1;
    topLeftPoint: Vec2;
    lastPoint: Vec2;
    firstPoint: Vec2;
    previewLayer: HTMLElement | null;
    fillStyle: number = FILL_STYLES.FILL_AND_BORDER;
    rectangleHeight: number;
    rectangleWidth: number;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }

    setRectangleWidth(): void {
        this.rectangleWidth = Math.abs(this.firstPoint.x - this.lastPoint.x);
    }

    setRectangleHeight(): void {
        this.rectangleHeight = Math.abs(this.firstPoint.y - this.lastPoint.y);
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }

    changeFillStyle(newFillStyle: number): void {
        this.fillStyle = newFillStyle;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.LEFT;
        if (this.mouseDown) {
            this.firstPoint = this.getPositionFromMouse(event);
            this.lastPoint = this.getPositionFromMouse(event);
            this.drawingService.setIsToolInUse(true);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastPoint = this.getPositionFromMouse(event);
            this.drawShape(this.drawingService.baseCtx);
            this.mouseDown = false;
            this.drawingService.setIsToolInUse(false);
        }
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

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastPoint = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawShape(this.drawingService.previewCtx);
        }
    }

    private drawShape(ctx: CanvasRenderingContext2D): void {
        this.setRectangleHeight();
        this.setRectangleWidth();
        if (this.isShiftKeyDown) {
            this.rectangleWidth = Math.min(this.rectangleHeight, this.rectangleWidth);
            this.rectangleHeight = this.rectangleWidth;
        }
        this.topLeftPoint = this.findTopLeftPoint(this.rectangleWidth, this.rectangleHeight);

        this.updateRectangleData();
        this.drawRectangle(ctx, this.rectangleData);

        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.updateStack(this.rectangleData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    drawRectangle(ctx: CanvasRenderingContext2D, rectangle: Rectangle): void {
        ctx.fillStyle = rectangle.primaryColor;
        ctx.strokeStyle = rectangle.secondaryColor;
        ctx.lineWidth = rectangle.lineWidth;
        if (rectangle.fillStyle === FILL_STYLES.FILL) {
            ctx.strokeStyle = rectangle.primaryColor;
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.rect(rectangle.topLeftPoint.x, rectangle.topLeftPoint.y, rectangle.width, rectangle.height);
        if (rectangle.fillStyle !== FILL_STYLES.BORDER) {
            ctx.fillRect(rectangle.topLeftPoint.x, rectangle.topLeftPoint.y, rectangle.width, rectangle.height);
        }
        ctx.stroke();
    }

    /*
     to find the top left point of the rectangle or the square
     */
    findTopLeftPoint(width: number, height: number): Vec2 {
        const point1 = this.firstPoint;
        const point2 = this.lastPoint;
        // firstPoint is top left corner lastPoint is bottom right corner
        let x = point1.x;
        let y = point1.y;

        if (point1.x > point2.x && point1.y > point2.y) {
            // firstPoint is bottom right corner lastPoint is top left corner
            x = point1.x - width;
            y = point1.y - height;
        } else if (point1.x > point2.x && point1.y < point2.y) {
            // firstPoint is top right corner lastPoint is bottom left corner
            x = point1.x - width;
            y = point1.y;
        } else if (point1.x < point2.x && point1.y > point2.y) {
            // firstPoint is bottom left corner lastPoint is top right corner
            x = point1.x;
            y = point1.y - height;
        }

        return { x, y };
    }

    private updateRectangleData(): void {
        this.rectangleData = {
            type: 'rectangle',
            primaryColor: this.colorSelectionService.primaryColor,
            secondaryColor: this.colorSelectionService.secondaryColor,
            height: this.rectangleHeight,
            width: this.rectangleWidth,
            topLeftPoint: this.topLeftPoint,
            fillStyle: this.fillStyle,
            isShiftDown: this.isShiftKeyDown,
            lineWidth: this.width,
        };
    }
}

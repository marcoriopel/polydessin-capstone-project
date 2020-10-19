import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_RESIZING_POINTS } from '@app/ressources/global-variables/canvas-resizing-points';
import {
    HALF_RATIO,
    MINIMUM_CANVAS_HEIGHT,
    MINIMUM_CANVAS_WIDTH,
    MINIMUM_WORKSPACE_HEIGHT,
    MINIMUM_WORKSPACE_WIDTH,
    MouseButton,
} from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ResizeDrawingService {
    canvasSize: Vec2;
    previewSize: Vec2;
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    serviceCaller: string;
    workSpaceSize: Vec2;

    constructor(private drawingService: DrawingService) {}

    setDefaultCanvasSize(): void {
        if (this.workSpaceSize.x > MINIMUM_WORKSPACE_WIDTH) {
            this.canvasSize.x = this.workSpaceSize.x * HALF_RATIO;
        }

        if (this.workSpaceSize.y > MINIMUM_WORKSPACE_HEIGHT) {
            this.canvasSize.y = this.workSpaceSize.y * HALF_RATIO;
        }

        this.previewSize.x = this.canvasSize.x;
        this.previewSize.y = this.canvasSize.y;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            const target = event.target as HTMLElement;
            this.serviceCaller = target.id;
        }
    }

    onMouseUp(): void {
        if (this.mouseDown) {
            const tempCanvas: HTMLCanvasElement = document.createElement('canvas');
            tempCanvas.width = this.canvasSize.x;
            tempCanvas.height = this.canvasSize.y;
            const tempCanvasCtx: CanvasRenderingContext2D = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
            tempCanvasCtx.drawImage(this.drawingService.canvas, 0, 0);

            this.canvasSize.x = this.previewSize.x;
            this.canvasSize.y = this.previewSize.y;

            setTimeout(() => {
                let baseCtx: CanvasRenderingContext2D;
                baseCtx = this.drawingService.canvas.getContext('2d') as CanvasRenderingContext2D;
                baseCtx.drawImage(tempCanvas, 0, 0);
            });
        }
        this.mouseDown = false;
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.clientX, y: event.clientY };
    }

    resizeCanvas(event: MouseEvent): void {
        switch (this.serviceCaller) {
            case CANVAS_RESIZING_POINTS.VERTICAL:
                this.verticalResize(event);
                break;
            case CANVAS_RESIZING_POINTS.HORIZONTAL:
                this.horizontalResize(event);
                break;
            case CANVAS_RESIZING_POINTS.VERTICAL_AND_HORIZONTAL:
                this.verticalAndHorizontalResize(event);
                break;
            default:
        }
    }

    private verticalResize(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const mousePositionChangeY = mousePosition.y - this.mouseDownCoord.y;
            const newCanvasHeight = this.previewSize.y + mousePositionChangeY;
            if (newCanvasHeight >= MINIMUM_CANVAS_HEIGHT) {
                this.previewSize.y = newCanvasHeight;
            }
            this.mouseDownCoord = mousePosition;
        }
    }

    private verticalAndHorizontalResize(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const mousePositionChangeY = mousePosition.y - this.mouseDownCoord.y;
            const newCanvasHeight = this.previewSize.y + mousePositionChangeY;
            if (newCanvasHeight >= MINIMUM_CANVAS_HEIGHT) {
                this.previewSize.y = newCanvasHeight;
            }
            const mousePositionChangeX = mousePosition.x - this.mouseDownCoord.x;
            const newCanvasWidth = this.previewSize.x + mousePositionChangeX;
            if (newCanvasWidth >= MINIMUM_CANVAS_WIDTH) {
                this.previewSize.x = newCanvasWidth;
            }
            this.mouseDownCoord = mousePosition;
        }
    }

    private horizontalResize(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const mousePositionChangeX = mousePosition.x - this.mouseDownCoord.x;
            const newCanvasWidth = this.previewSize.x + mousePositionChangeX;
            if (newCanvasWidth >= MINIMUM_CANVAS_WIDTH) {
                this.previewSize.x = newCanvasWidth;
            }
            this.mouseDownCoord = mousePosition;
        }
    }
}

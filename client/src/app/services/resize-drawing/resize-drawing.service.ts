import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import {
    HALF_RATIO,
    MINIMUM_CANVAS_HEIGHT,
    MINIMUM_CANVAS_WIDTH,
    MINIMUM_WORKSPACE_HEIGHT,
    MINIMUM_WORKSPACE_WIDTH,
    MouseButton,
} from '@app/ressources/global-variables/global-variables';

@Injectable({
    providedIn: 'root',
})
export class ResizeDrawingService {
    canvasSize: Vec2;
    mouseDownCoord: Vec2;
    mouseMoveCoord: Vec2;
    mouseDown: boolean = false;
    serviceCaller: string;

    constructor() {
        this.canvasSize = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
    }

    setDefaultCanvasSize(workSpaceSize: Vec2): Vec2 {
        if (workSpaceSize.x > MINIMUM_WORKSPACE_WIDTH) {
            this.canvasSize.x = workSpaceSize.x * HALF_RATIO;
        }

        if (workSpaceSize.y > MINIMUM_WORKSPACE_HEIGHT) {
            this.canvasSize.y = workSpaceSize.y * HALF_RATIO;
        }

        return this.canvasSize;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.mouseMoveCoord = this.mouseDownCoord;
            const target = event.target as HTMLInputElement;
            this.serviceCaller = target.id;
        }
    }

    // returns true if mouseDown was previously true.
    onMouseUp(): boolean {
        if (this.mouseDown) {
            this.mouseDown = false;
            return true;
        } else {
            return false;
        }
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.clientX, y: event.clientY };
    }

    resizeCanvas(event: MouseEvent): void {
        switch (this.serviceCaller) {
            case 'verticalCanvasResizePoint':
                this.verticalResize(event);
                break;
            case 'horizontalCanvasResizePoint':
                this.horizontalResize(event);
                break;
            case 'verticalAndHorizontalCanvasResizePoint':
                this.verticalAndHorizontalResize(event);
                break;
            default:
        }
    }

    private verticalResize(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const mousePositionChangeY = mousePosition.y - this.mouseMoveCoord.y;
            const newCanvasHeight = this.canvasSize.y + mousePositionChangeY;
            if (newCanvasHeight >= MINIMUM_CANVAS_HEIGHT) {
                this.canvasSize.y = newCanvasHeight;
            }
            this.mouseMoveCoord = this.getPositionFromMouse(event);
        }
    }

    private horizontalResize(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const mousePositionChangeY = mousePosition.y - this.mouseMoveCoord.y;
            const newCanvasHeight = this.canvasSize.y + mousePositionChangeY;
            if (newCanvasHeight >= MINIMUM_CANVAS_HEIGHT) {
                this.canvasSize.y = newCanvasHeight;
            }
            const mousePositionChangeX = mousePosition.x - this.mouseMoveCoord.x;
            const newCanvasWidth = this.canvasSize.x + mousePositionChangeX;
            if (newCanvasWidth >= MINIMUM_CANVAS_WIDTH) {
                this.canvasSize.x = newCanvasWidth;
            }
            this.mouseMoveCoord = this.getPositionFromMouse(event);
        }
    }

    private verticalAndHorizontalResize(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const mousePositionChangeX = mousePosition.x - this.mouseMoveCoord.x;
            const newCanvasWidth = this.canvasSize.x + mousePositionChangeX;
            if (newCanvasWidth >= MINIMUM_CANVAS_WIDTH) {
                this.canvasSize.x = newCanvasWidth;
            }
            this.mouseMoveCoord = this.getPositionFromMouse(event);
        }
    }
}

import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import {
    HALF_RATIO,
    MINIMUM_CANVAS_HEIGHT,
    MINIMUM_CANVAS_WIDTH,
    MINIMUM_WORKSPACE_HEIGHT,
    MINIMUM_WORKSPACE_WIDTH,
} from '@app/ressources/global-variables/global-variables';

@Injectable({
    providedIn: 'root',
})
export class ResizeDrawingService {
    canvasSize: Vec2;
    mouseDownCoord: Vec2;
    mouseMoveCoord: Vec2;
    mouseDown: boolean = false;

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
}

import { MAX_BORDER, MAX_SIDES, MAX_TOOL_WIDTH, MIN_BORDER, MIN_SIDES, MIN_TOOL_WIDTH } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    name: string;
    maxToolWidth: number = MAX_TOOL_WIDTH;
    minToolWidth: number = MIN_TOOL_WIDTH;
    maxBorderWidth: number = MAX_BORDER;
    minBorderWidth: number = MIN_BORDER;
    minSides: number = MIN_SIDES;
    maxSides: number = MAX_SIDES;

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseLeave(): void {}

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    setCursor(): void {}
}

import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { FOUR, ONE, THREE, TWOO } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ShapeService {
    firstPoint: Vec2;
    lastPoint: Vec2;
    circleWidth: number;
    circleHeight: number;
    centerX: number;
    centerY: number;
    quadrant: number;
    center: Vec2;
    width: number = 1;

    constructor(protected drawingService: DrawingService) {}
    findQuadrant(): number {
        const point1 = this.firstPoint;
        const point2 = this.lastPoint;
        if (point1.x > point2.x && point1.y > point2.y) {
            // firstPoint is bottom right corner lastPoint is top left corner
            return ONE;
        } else if (point1.x > point2.x && point1.y < point2.y) {
            // firstPoint is top right corner lastPoint is bottom left corner
            return FOUR;
        } else if (point1.x < point2.x && point1.y > point2.y) {
            // firstPoint is bottom left corner lastPoint is top right corner
            return TWOO;
        }
        // firstPoint is top left corner lastPoint is bottom right corner
        return THREE;
    }

    setCircleWidth(): void {
        this.circleWidth = Math.abs(this.firstPoint.x - this.lastPoint.x);
    }

    setCircleHeight(): void {
        this.circleHeight = Math.abs(this.firstPoint.y - this.lastPoint.y);
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

    getCenter(): Vec2 {
        let centerX = Math.floor(this.lastPoint.x - this.firstPoint.x) / 2;
        let centerY = Math.floor(this.lastPoint.y - this.firstPoint.y) / 2;

        centerX = this.firstPoint.x > this.lastPoint.x ? this.lastPoint.x + centerX : this.lastPoint.x - centerX;
        centerY = this.firstPoint.y > this.lastPoint.y ? this.lastPoint.y + centerY : this.lastPoint.y - centerY;
        const center: Vec2 = { x: centerX, y: centerY };
        return center;
    }

    findTopLeftPoint(): Vec2 {
        this.quadrant = this.findQuadrant();

        const point1 = this.firstPoint;
        const point2 = this.lastPoint;
        let x = 0;
        let y = 0;
        switch (this.quadrant) {
            case ONE:
                // firstPoint is top left corner lastPoint is bottom right corner
                x = point2.x;
                y = point2.y;
                break;
            case TWOO:
                // firstPoint is bottom right corner lastPoint is top left corner
                x = point1.x;
                y = point2.y;
                break;
            case THREE:
                // firstPoint is top right corner lastPoint is bottom left corner
                x = point1.x;
                y = point1.y;
                break;
            case FOUR:
                // firstPoint is bottom left corner lastPoint is top right corner
                x = point2.x;
                y = point1.y;
                break;
            default:
        }

        return { x, y };
    }
}

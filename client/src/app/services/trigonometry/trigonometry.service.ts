import { Injectable } from '@angular/core';
import { DEGREES_180, LineAngle, Quadrant } from '@app/ressources/global-variables/global-variables';
import { LIMIT_ANGLES } from '@app/ressources/global-variables/limit-angles';

@Injectable({
    providedIn: 'root',
})
export class TrigonometryService {
    // tslint:disable-next-line: cyclomatic-complexity
    findClosestAngle(quadrant: Quadrant, angleDegree: number): LineAngle {
        switch (quadrant) {
            case Quadrant.TOP_RIGHT: {
                if (LIMIT_ANGLES.DEGREES_0 <= angleDegree && angleDegree <= LIMIT_ANGLES.DEGREES_22POINT5) {
                    return LineAngle.DEGREES_0;
                } else if (LIMIT_ANGLES.DEGREES_22POINT5 < angleDegree && angleDegree <= LIMIT_ANGLES.DEGREES_67POINT5) {
                    return LineAngle.DEGREES_45;
                } else {
                    return LineAngle.DEGREES_90;
                }
            }
            case Quadrant.TOP_LEFT: {
                if (LIMIT_ANGLES.DEGREES_90 > angleDegree && angleDegree >= LIMIT_ANGLES.DEGREES_67POINT5) {
                    return LineAngle.DEGREES_90;
                } else if (LIMIT_ANGLES.DEGREES_67POINT5 > angleDegree && angleDegree >= LIMIT_ANGLES.DEGREES_22POINT5) {
                    return LineAngle.DEGREES_135;
                } else {
                    return LineAngle.DEGREES_180;
                }
            }
            case Quadrant.BOTTOM_LEFT: {
                if (LIMIT_ANGLES.DEGREES_0 <= angleDegree && angleDegree <= LIMIT_ANGLES.DEGREES_22POINT5) {
                    return LineAngle.DEGREES_180;
                } else if (LIMIT_ANGLES.DEGREES_22POINT5 < angleDegree && angleDegree <= LIMIT_ANGLES.DEGREES_67POINT5) {
                    return LineAngle.DEGREES_225;
                } else {
                    return LineAngle.DEGREES_270;
                }
            }
            case Quadrant.BOTTOM_RIGHT: {
                if (LIMIT_ANGLES.DEGREES_90 > angleDegree && angleDegree >= LIMIT_ANGLES.DEGREES_67POINT5) {
                    return LineAngle.DEGREES_270;
                } else if (LIMIT_ANGLES.DEGREES_67POINT5 > angleDegree && angleDegree >= LIMIT_ANGLES.DEGREES_22POINT5) {
                    return LineAngle.DEGREES_315;
                } else {
                    return LineAngle.DEGREES_0;
                }
            }
        }
    }

    radiansToDegrees(radians: number): number {
        return radians * (DEGREES_180 / Math.PI);
    }

    findCursorQuadrant(adjacent: number, opposite: number): Quadrant {
        if (adjacent >= 0 && opposite >= 0) {
            return Quadrant.TOP_RIGHT;
        } else if (adjacent <= 0 && opposite >= 0) {
            return Quadrant.TOP_LEFT;
        } else if (adjacent <= 0 && opposite <= 0) {
            return Quadrant.BOTTOM_LEFT;
        } else {
            return Quadrant.BOTTOM_RIGHT;
        }
    }
}

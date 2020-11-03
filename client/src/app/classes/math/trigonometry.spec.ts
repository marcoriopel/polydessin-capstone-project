import { TestBed } from '@angular/core/testing';
import { LineAngle, Quadrant } from '@app/ressources/global-variables/global-variables';
import { LIMIT_ANGLES } from '@app/ressources/global-variables/limit-angles';
import { Vec2 } from '../vec2';
import { Trigonometry } from './trigonometry';

fdescribe('Trigonometry', () => {
    let trigonometry: Trigonometry;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        trigonometry = TestBed.inject(Trigonometry);
    });

    it('should be created', () => {
        expect(trigonometry).toBeTruthy();
    });

    // BEGINNING OF TOP RIGHT QUADRANT //
    it('findClosestAngle should return 0 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_0;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_0);
    });

    it('findClosestAngle should return 0 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_0);
    });

    it('findClosestAngle should return 45 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5 + 0.1;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_45);
    });

    it('findClosestAngle should return 45 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_45);
    });

    it('findClosestAngle should return 90 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5 + 0.1;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_90);
    });

    it('findClosestAngle should return 90 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_90;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_90);
    });
    // END OF TOP RIGHT QUADRANT //

    // BEGINNING OF TOP LEFT QUADRANT //
    it('findClosestAngle should return 90 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_90 - 0.1;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_90);
    });

    it('findClosestAngle should return 90 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_90);
    });

    it('findClosestAngle should return 135 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5 - 0.1;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_135);
    });

    it('findClosestAngle should return 135 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_135);
    });

    it('findClosestAngle should return 180 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5 - 0.1;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_180);
    });

    it('findClosestAngle should return 180 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_0;

        const returnValue = trigonometry.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_180);
    });
    // END OF TOP LEFT QUADRANT //

    // BEGINNING OF BOTTOM LEFT QUADRANT //
    it('findClosestAngle should return 180 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_0;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_180);
    });

    it('findClosestAngle should return 180 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_180);
    });

    it('findClosestAngle should return 225 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5 + 0.1;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_225);
    });

    it('findClosestAngle should return 225 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_225);
    });

    it('findClosestAngle should return 270 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5 + 0.1;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_270);
    });

    it('findClosestAngle should return 270 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_90;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_270);
    });
    // END OF BOTTOM LEFT QUADRANT //

    // BEGINNING OF BOTTOM RIGHT QUADRANT //
    it('findClosestAngle should return 270 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_90 - 0.1;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_270);
    });

    it('findClosestAngle should return 270 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_270);
    });

    it('findClosestAngle should return 315 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5 - 0.1;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_315);
    });

    it('findClosestAngle should return 315 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_315);
    });

    it('findClosestAngle should return 0 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5 - 0.1;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_0);
    });

    it('findClosestAngle should return 0 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_0;

        const returnValue = trigonometry.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_0);
    });
    // END OF BOTTOM RIGHT QUADRANT //

    it('radiansToDegrees should return 0 when given a 0 degree angle', () => {
        const returnValue: number = trigonometry.radiansToDegrees(0);
        expect(returnValue).toBe(0);
    });

    it('radiansToDegrees should return 1 when given a 0.0174533 radian angle', () => {
        const returnValue: number = trigonometry.radiansToDegrees(0.0174533);
        expect(Math.floor(returnValue)).toBe(1);
    });

    it('findCursorQuadrant should return top right when x and y are positive', () => {
        const positionX = 1;
        const positionY = 1;
        const returnValue: Quadrant = trigonometry.findCursorQuadrant(positionX, positionY);
        expect(returnValue).toBe(Quadrant.TOP_RIGHT);
    });

    it('findCursorQuadrant should return top left when positionX is negative and positionY is positive', () => {
        const positionX = -1;
        const positionY = 1;
        const returnValue: Quadrant = trigonometry.findCursorQuadrant(positionX, positionY);
        expect(returnValue).toBe(Quadrant.TOP_LEFT);
    });

    it('findCursorQuadrant should return bottom left when positionX and positionY are negative', () => {
        const positionX = -1;
        const positionY = -1;
        const returnValue: Quadrant = trigonometry.findCursorQuadrant(positionX, positionY);
        expect(returnValue).toBe(Quadrant.BOTTOM_LEFT);
    });

    it('findCursorQuadrant should return bottom right when positionX is positive and positionY is negative', () => {
        const positionX = 1;
        const positionY = -1;
        const returnValue: Quadrant = trigonometry.findCursorQuadrant(positionX, positionY);
        expect(returnValue).toBe(Quadrant.BOTTOM_RIGHT);
    });

    it('should return false if more than 20px away', () => {
        const firstPoint: Vec2 = { x: 0, y: 0 };
        const secondPoint: Vec2 = { x: 50, y: 50 };
        const returnValue = trigonometry.checkIf20pxAway(firstPoint, secondPoint);
        expect(returnValue).toBe(false);
    });

    it('should adjust line to 0 degrees', () => {
        const mouseClicks: Vec2[] = [];
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 15, y: 11 };
        const adjacent = 5;
        const lineAngle: LineAngle = 0;
        const expectedPoint: Vec2 = { x: 15, y: 10 };

        mouseClicks.push(click1);
        const returnValue = trigonometry.adjustEndingPoint(lineAngle, click2, adjacent, mouseClicks);
        expect(returnValue).toEqual(expectedPoint);
    });

    it('should adjust line to 45 degrees', () => {
        const mouseClicks: Vec2[] = [];
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 15, y: 14 };
        const adjacent = 5;
        const lineAngle: LineAngle = 1;
        const expectedPoint: Vec2 = { x: 15, y: 10 - adjacent };

        mouseClicks.push(click1);
        const returnValue = trigonometry.adjustEndingPoint(lineAngle, click2, adjacent, mouseClicks);
        expect(returnValue).toEqual(expectedPoint);
    });

    it('should adjust line to 90 degrees', () => {
        const mouseClicks: Vec2[] = [];
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 11, y: 18 };
        const adjacent = 5;
        const lineAngle: LineAngle = 2;
        const expectedPoint: Vec2 = { x: 10, y: 18 };

        mouseClicks.push(click1);
        const returnValue = trigonometry.adjustEndingPoint(lineAngle, click2, adjacent, mouseClicks);
        expect(returnValue).toEqual(expectedPoint);
    });

    it('should adjust line to 135 degrees', () => {
        const mouseClicks: Vec2[] = [];
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 9, y: 18 };
        const adjacent = 5;
        const lineAngle: LineAngle = 3;
        const expectedPoint: Vec2 = { x: 9, y: 10 - adjacent };

        mouseClicks.push(click1);
        const returnValue = trigonometry.adjustEndingPoint(lineAngle, click2, adjacent, mouseClicks);
        expect(returnValue).toEqual(expectedPoint);
    });

    it('should adjust line to 180 degrees', () => {
        const mouseClicks: Vec2[] = [];
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 5, y: 11 };
        const adjacent = 5;
        const lineAngle: LineAngle = 4;
        const expectedPoint: Vec2 = { x: 5, y: 10 };

        mouseClicks.push(click1);
        const returnValue = trigonometry.adjustEndingPoint(lineAngle, click2, adjacent, mouseClicks);
        expect(returnValue).toEqual(expectedPoint);
    });

    it('should adjust line to 225 degrees', () => {
        const mouseClicks: Vec2[] = [];
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 5, y: 6 };
        const adjacent = 5;
        const lineAngle: LineAngle = 5;
        const expectedPoint: Vec2 = { x: 5, y: 10 + adjacent };

        mouseClicks.push(click1);
        const returnValue = trigonometry.adjustEndingPoint(lineAngle, click2, adjacent, mouseClicks);
        expect(returnValue).toEqual(expectedPoint);
    });

    it('should adjust line to 270 degrees', () => {
        const mouseClicks: Vec2[] = [];
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 10, y: 9 };
        const adjacent = 5;
        const lineAngle: LineAngle = 6;
        const expectedPoint: Vec2 = { x: 10, y: 9 };

        mouseClicks.push(click1);
        const returnValue = trigonometry.adjustEndingPoint(lineAngle, click2, adjacent, mouseClicks);
        expect(returnValue).toEqual(expectedPoint);
    });

    it('should adjust line to 315 degrees', () => {
        const mouseClicks: Vec2[] = [];
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 14, y: 6 };
        const adjacent = 5;
        const lineAngle: LineAngle = 7;
        const expectedPoint: Vec2 = { x: 14, y: 10 + adjacent };

        mouseClicks.push(click1);
        const returnValue = trigonometry.adjustEndingPoint(lineAngle, click2, adjacent, mouseClicks);
        expect(returnValue).toEqual(expectedPoint);
    });

    it('should return distance between two dots(x1=0, x2=10, y1=0, y2=0), distance should be 10', () => {
        const click1: Vec2 = { x: 0, y: 10 };
        const click2: Vec2 = { x: 10, y: 10 };
        const expectedValue = 10;
        const returnValue = trigonometry.distanceBetweenTwoDots(click1, click2);
        expect(returnValue).toEqual(expectedValue);
    });
});

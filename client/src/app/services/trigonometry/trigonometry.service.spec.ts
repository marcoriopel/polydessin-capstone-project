import { TestBed } from '@angular/core/testing';
import { LineAngle, Quadrant } from '@app/ressources/global-variables/global-variables';
import { LIMIT_ANGLES } from '@app/ressources/global-variables/limit-angles';
import { TrigonometryService } from './trigonometry.service';

// tslint:disable: no-magic-numbers
describe('TrigonometryService', () => {
    let service: TrigonometryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TrigonometryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // BEGINNING OF TOP RIGHT QUADRANT //
    it('findClosestAngle should return 0 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_0;

        const returnValue = service.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_0);
    });

    it('findClosestAngle should return 0 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5;

        const returnValue = service.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_0);
    });

    it('findClosestAngle should return 45 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5 + 0.1;

        const returnValue = service.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_45);
    });

    it('findClosestAngle should return 45 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5;

        const returnValue = service.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_45);
    });

    it('findClosestAngle should return 90 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5 + 0.1;

        const returnValue = service.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_90);
    });

    it('findClosestAngle should return 90 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_90;

        const returnValue = service.findClosestAngle(Quadrant.TOP_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_90);
    });
    // END OF TOP RIGHT QUADRANT //

    // BEGINNING OF TOP LEFT QUADRANT //
    it('findClosestAngle should return 90 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_90 - 0.1;

        const returnValue = service.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_90);
    });

    it('findClosestAngle should return 90 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5;

        const returnValue = service.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_90);
    });

    it('findClosestAngle should return 135 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5 - 0.1;

        const returnValue = service.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_135);
    });

    it('findClosestAngle should return 135 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5;

        const returnValue = service.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_135);
    });

    it('findClosestAngle should return 180 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5 - 0.1;

        const returnValue = service.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_180);
    });

    it('findClosestAngle should return 180 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_0;

        const returnValue = service.findClosestAngle(Quadrant.TOP_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_180);
    });
    // END OF TOP LEFT QUADRANT //

    // BEGINNING OF BOTTOM LEFT QUADRANT //
    it('findClosestAngle should return 180 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_0;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_180);
    });

    it('findClosestAngle should return 180 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_180);
    });

    it('findClosestAngle should return 225 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5 + 0.1;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_225);
    });

    it('findClosestAngle should return 225 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_225);
    });

    it('findClosestAngle should return 270 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5 + 0.1;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_270);
    });

    it('findClosestAngle should return 270 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_90;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_LEFT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_270);
    });
    // END OF BOTTOM LEFT QUADRANT //

    // BEGINNING OF BOTTOM RIGHT QUADRANT //
    it('findClosestAngle should return 270 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_90 - 0.1;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_270);
    });

    it('findClosestAngle should return 270 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_270);
    });

    it('findClosestAngle should return 315 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_67POINT5 - 0.1;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_315);
    });

    it('findClosestAngle should return 315 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_315);
    });

    it('findClosestAngle should return 0 degrees on inferior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_22POINT5 - 0.1;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_0);
    });

    it('findClosestAngle should return 0 degrees on superior limit case', () => {
        const angleDegree = LIMIT_ANGLES.DEGREES_0;

        const returnValue = service.findClosestAngle(Quadrant.BOTTOM_RIGHT, angleDegree);
        expect(returnValue).toBe(LineAngle.DEGREES_0);
    });
    // END OF BOTTOM RIGHT QUADRANT //

    it('radiansToDegrees should return 0 when given a 0 degree angle', () => {
        const returnValue: number = service.radiansToDegrees(0);
        expect(returnValue).toBe(0);
    });

    it('radiansToDegrees should return 1 when given a 0.0174533 radian angle', () => {
        const returnValue: number = service.radiansToDegrees(0.0174533);
        expect(Math.floor(returnValue)).toBe(1);
    });

    it('findCursorQuadrant should return top right when x and y are positive', () => {
        const positionX = 1;
        const positionY = 1;
        const returnValue: Quadrant = service.findCursorQuadrant(positionX, positionY);
        expect(returnValue).toBe(Quadrant.TOP_RIGHT);
    });

    it('findCursorQuadrant should return top left when positionX is negative and positionY is positive', () => {
        const positionX = -1;
        const positionY = 1;
        const returnValue: Quadrant = service.findCursorQuadrant(positionX, positionY);
        expect(returnValue).toBe(Quadrant.TOP_LEFT);
    });

    it('findCursorQuadrant should return bottom left when positionX and positionY are negative', () => {
        const positionX = -1;
        const positionY = -1;
        const returnValue: Quadrant = service.findCursorQuadrant(positionX, positionY);
        expect(returnValue).toBe(Quadrant.BOTTOM_LEFT);
    });

    it('findCursorQuadrant should return bottom right when positionX is positive and positionY is negative', () => {
        const positionX = 1;
        const positionY = -1;
        const returnValue: Quadrant = service.findCursorQuadrant(positionX, positionY);
        expect(returnValue).toBe(Quadrant.BOTTOM_RIGHT);
    });
});

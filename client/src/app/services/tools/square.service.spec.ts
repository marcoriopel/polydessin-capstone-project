import { TestBed } from '@angular/core/testing';
import { SquareService } from './square.service';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
 
const blbnla = 'drawingService';

fdescribe('SquareService', () => {
    let service: SquareService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawSquareSpy: jasmine.Spy<any>;
    
    beforeEach(() => {

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        
        
        TestBed.configureTestingModule({
            providers: [{ SquareService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(SquareService);
        drawSquareSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();
    
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change width', () => {
        service.width = 0;
        service.changeWidth(1);
        expect(service.width).toBe(1);
    });
    
    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });
    
    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, 
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });
    
    it(' onMouseUp should call drawRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        console.log(service.lastPoint);
        service[blbnla].baseCtx = baseCtxStub;
        service[blbnla].previewCtx = previewCtxStub;
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(drawSquareSpy).toHaveBeenCalled();
    });

    // it(' previewLayer.style.cursor shold be crosshair ', () => {
    //     const spy = spyOn(service, 'handleCursor').and.callThrough();
       
        
    //     service.handleCursor();
    //     expect(spy).toHaveBeenCalled();
    // });

    // it(' should return abs rectanglewidth ', () => {
    //     service.firstPoint.x = 25;
    //     service.lastPoint.x = 22;
    //     const spy = spyOnProperty('rectangleWidth', 3, 'get').and.callThrough();
    //     //service.rectangleWidth;
    //     expect(service.rectangleWidth).toBe(3);
    //     //service.handleCursor();
    //     expect(spy).toHaveBeenCalled();
    // });

    it(' should return abs rectangleheigh ', () => {
        const spy = spyOn(service, 'handleCursor').and.callThrough();
       
        
        service.handleCursor();
        expect(spy).toHaveBeenCalled();
    });

    it(' should return abs squarewidth ', () => {
        const spy = spyOn(service, 'handleCursor').and.callThrough();
       
        service.handleCursor();
        expect(spy).toHaveBeenCalled();
    });



    // it(' onMouseMove should call drawLine if mouse was already down', () => {
    //     service.mouseDownCoord = { x: 0, y: 0 };
    //     service.mouseDown = true;

    //     service.onMouseMove(mouseEvent);
    //     expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    //     expect(drawSquareSpy).toHaveBeenCalled();
    // });

    // it(' onMouseMove should not call drawLine if mouse was not already down', () => {
    //     service.mouseDownCoord = { x: 0, y: 0 };
    //     service.mouseDown = false;

    //     service.onMouseMove(mouseEvent);
    //     expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    //     expect(drawSquareSpy).not.toHaveBeenCalled();
    // });
});

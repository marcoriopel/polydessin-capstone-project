// import { fakeAsync, TestBed, tick } from '@angular/core/testing';
// import { SelectionBox } from '@app/classes/selection-box';
// import { ARROW_KEYS } from '@app/ressources/global-variables/arrow-keys';
// import { DrawingService } from '@app/services/drawing/drawing.service';
// import { MoveService } from './move.service';
// import SpyObj = jasmine.SpyObj;

// // tslint:disable: no-magic-numbers
// // tslint:disable: max-file-line-count

// describe('MoveService', () => {
//     let service: MoveService;
//     let drawingServiceSpy: SpyObj<DrawingService>;
//     let previewCtxSpy: SpyObj<CanvasRenderingContext2D>;

//     beforeEach(() => {
//         drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
//         previewCtxSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['putImageData']);
//         drawingServiceSpy.previewCtx = previewCtxSpy;

//         TestBed.configureTestingModule({
//             providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
//         });
//         service = TestBed.inject(MoveService);

//         const selection: SelectionBox = { startingPoint: { x: 0, y: 0 }, width: 1, height: 1 };
//         const selectionData: ImageData = { data: new Uint8ClampedArray([255, 255, 255, 255]), height: 1, width: 1 };
//         service.initialize(selection, selectionData);

//         service.pressedKeys.set(ARROW_KEYS.LEFT, false);
//         service.pressedKeys.set(ARROW_KEYS.UP, false);
//         service.pressedKeys.set(ARROW_KEYS.RIGHT, false);
//         service.pressedKeys.set(ARROW_KEYS.DOWN, false);

//         service.intervalId = undefined;
//     });

//     afterEach(() => {
//         if (service.intervalId) {
//             clearInterval(service.intervalId);
//         }
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('should initialize service', () => {
//         const selection: SelectionBox = { startingPoint: { x: 3, y: 3 }, width: 2, height: 1 };
//         const selectionData: ImageData = { data: new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]), height: 1, width: 2 };
//         service.initialize(selection, selectionData);

//         expect(service.initialSelection).toEqual(selection);
//         expect(service.selection).toEqual(selection);
//         expect(service.selectionData).toEqual(selectionData);
//     });

//     it('onMouseDown should set isTransformationOver to false if isTransformationOver is true', () => {
//         service.isTransformationOver = true;
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

//         service.onMouseDown({} as MouseEvent);

//         expect(service.isTransformationOver).toBe(false);
//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//     });

//     it('onMouseDown should call printSelectionOnPreview if isTransformationOver is true', () => {
//         service.isTransformationOver = true;
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

//         service.onMouseDown({} as MouseEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//     });

//     it('onMouseDown should not call printSelectionOnPreview if isTransformationOver is false', () => {
//         service.isTransformationOver = false;
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

//         service.onMouseDown({} as MouseEvent);

//         expect(printSelectionOnPreviewSpy).not.toHaveBeenCalled();
//     });

//     it('onMouseMove should call printSelectionOnPreview', () => {
//         service.isTransformationOver = true;
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

//         service.onMouseMove({ movementX: 1, movementY: 1 } as MouseEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//     });

//     it('onMouseMove should call drawingService.clearCanvas', () => {
//         service.isTransformationOver = true;
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

//         service.onMouseMove({ movementX: 1, movementY: 1 } as MouseEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
//     });

//     it('onMouseMove should set selection.startingPoint', () => {
//         service.isTransformationOver = true;
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

//         service.onMouseMove({ movementX: 1, movementY: 1 } as MouseEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint).toEqual({ x: 1, y: 1 });
//     });

//     it('onKeyDown should not call printSelectionOnPreview if key is not arrowKey', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

//         service.onKeyDown({ key: 't' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).not.toHaveBeenCalled();
//     });

//     it('onKeyDown should call setTimeout', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         const setTimeoutSpy = spyOn(global, 'setTimeout');

//         service.onKeyDown({ key: 't' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).not.toHaveBeenCalled();
//         expect(setTimeoutSpy).toHaveBeenCalled();
//     });

//     it('onKeyDown should not call setInterval if isArrowKeyPressed is false', fakeAsync(() => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         const setIntervalSpy = spyOn(global, 'setInterval');

//         service.onKeyDown({ key: 't' } as KeyboardEvent);

//         tick(501);

//         expect(printSelectionOnPreviewSpy).not.toHaveBeenCalled();
//         expect(setIntervalSpy).not.toHaveBeenCalled();
//     }));

//     it('onKeyDown should not call setInterval if intervalID is not undefined', fakeAsync(() => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         const setIntervalSpy = spyOn(global, 'setInterval');
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         service.pressedKeys.set(ARROW_KEYS.LEFT, true);

//         service.onKeyDown({ key: 't' } as KeyboardEvent);

//         tick(501);

//         expect(printSelectionOnPreviewSpy).not.toHaveBeenCalled();
//         expect(setIntervalSpy).not.toHaveBeenCalled();
//     }));

//     it('onKeyDown should call setInterval if intervalID is undefined and isArrowKeyPressed', fakeAsync(() => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

//         service.pressedKeys.set(ARROW_KEYS.LEFT, true);

//         service.onKeyDown({ key: 't' } as KeyboardEvent);

//         tick(501);

//         expect(printSelectionOnPreviewSpy).not.toHaveBeenCalled();
//         expect(service.intervalId).toBeDefined();
//         // tslint:disable-next-line: no-non-null-assertion
//         clearInterval(service.intervalId!);
//     }));

//     it('onKeyDown should printSelectionOnPreview if key is ArrowKey', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         service.pressedKeys.set(ARROW_KEYS.LEFT, true);

//         service.onKeyDown({ key: 'ArrowUp' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//     });

//     it('onKeyDown should change selection.startingPoint.x if key is ArrowLeft', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         const initialXValue = service.selection.startingPoint.x;

//         service.onKeyDown({ key: 'ArrowLeft' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.x).toBe(initialXValue - 3);
//     });

//     it('onKeyDown should not change selection.startingPoint.x if key is ArrowLeft and ArrowLeft is pressed', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         const initialXValue = service.selection.startingPoint.x;
//         service.pressedKeys.set(ARROW_KEYS.LEFT, true);

//         service.onKeyDown({ key: 'ArrowLeft' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.x).toBe(initialXValue);
//     });

//     it('onKeyDown should change selection.startingPoint.x if key is ArrowRight', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         const initialXValue = service.selection.startingPoint.x;

//         service.onKeyDown({ key: 'ArrowRight' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.x).toBe(initialXValue + 3);
//     });

//     it('onKeyDown should not change selection.startingPoint.x if key is ArrowRight and ArrowRight is pressed', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         const initialXValue = service.selection.startingPoint.x;
//         service.pressedKeys.set(ARROW_KEYS.RIGHT, true);

//         service.onKeyDown({ key: 'ArrowRight' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.x).toBe(initialXValue);
//     });

//     it('onKeyDown should change selection.startingPoint.y if key is ArrowUp', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         const initialYValue = service.selection.startingPoint.y;

//         service.onKeyDown({ key: 'ArrowUp' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.y).toBe(initialYValue - 3);
//     });

//     it('onKeyDown should not change selection.startingPoint.x if key is ArrowUp and ArrowUp is pressed', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         const initialXValue = service.selection.startingPoint.x;
//         service.pressedKeys.set(ARROW_KEYS.UP, true);

//         service.onKeyDown({ key: 'ArrowUp' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.x).toBe(initialXValue);
//     });

//     it('onKeyDown should change selection.startingPoint.y if key is ArrowDown', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         const initialYValue = service.selection.startingPoint.y;

//         service.onKeyDown({ key: 'ArrowDown' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.y).toBe(initialYValue + 3);
//     });

//     it('onKeyDown should not change selection.startingPoint.x if key is ArrowDown and ArrowDown is pressed', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         const initialXValue = service.selection.startingPoint.x;
//         service.pressedKeys.set(ARROW_KEYS.DOWN, true);

//         service.onKeyDown({ key: 'ArrowDown' } as KeyboardEvent);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.x).toBe(initialXValue);
//     });

//     it('onKeyUp should not clear interval if interval if isArrowKeyPressed', () => {
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         const clearIntervalSpy = spyOn(global, 'clearInterval');
//         service.pressedKeys.set(ARROW_KEYS.LEFT, true);

//         service.onKeyUp({ key: 'ArrowRight' } as KeyboardEvent);

//         expect(clearIntervalSpy).not.toHaveBeenCalled();
//     });

//     it('onKeyUp should not clear interval if interval is undefined', () => {
//         const clearIntervalSpy = spyOn(global, 'clearInterval');

//         service.onKeyUp({ key: 't' } as KeyboardEvent);

//         expect(clearIntervalSpy).not.toHaveBeenCalled();
//     });

//     it('onKeyUp should clear interval if interval is not undefined and if none of the keys are pressed', () => {
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         const clearIntervalSpy = spyOn(global, 'clearInterval');

//         service.onKeyUp({ key: 't' } as KeyboardEvent);

//         expect(clearIntervalSpy).toHaveBeenCalled();
//         expect(service.intervalId).toBe((undefined as unknown) as NodeJS.Timeout);
//     });

//     it('onKeyUp should set pressedKeys ARROW_KEYS.LEFT to false if previously true', () => {
//         // tslint:disable-next-line: no-empty
//         service.intervalId = setTimeout(() => {}, 100);
//         service.pressedKeys.set(ARROW_KEYS.LEFT, true);

//         service.onKeyUp({ key: 'ArrowLeft' } as KeyboardEvent);

//         expect(service.pressedKeys.get(ARROW_KEYS.LEFT)).toBe(false);
//     });

//     it('clearSelectionBackground should set selection background to white', () => {
//         // create a black dummy canvas
//         const canvas: HTMLCanvasElement = document.createElement('canvas');
//         canvas.height = 10;
//         canvas.width = 10;
//         const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
//         ctx.fillStyle = 'black';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         service.clearSelectionBackground(ctx);

//         expect(ctx.getImageData(0, 0, 1, 1).data).toEqual(new Uint8ClampedArray([255, 255, 255, 255]));
//     });

//     it('clearSelectionBackground should not change fillStyle', () => {
//         // create a black dummy canvas
//         const canvas: HTMLCanvasElement = document.createElement('canvas');
//         canvas.height = 10;
//         canvas.width = 10;
//         const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
//         ctx.fillStyle = 'black';

//         service.clearSelectionBackground(ctx);

//         expect(ctx.fillStyle).toEqual('#000000');
//     });

//     it('printSelectionOnPreview should call drawingService.clearCanvas and clearSelectionBackground', () => {
//         const clearSelectionBackgroundSpy = spyOn(service, 'clearSelectionBackground');

//         service.printSelectionOnPreview();

//         expect(clearSelectionBackgroundSpy).toHaveBeenCalled();
//         expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
//     });

//     it('printSelectionOnPreview should call drawingService.previewCtx.putImageData', () => {
//         const clearSelectionBackgroundSpy = spyOn(service, 'clearSelectionBackground');

//         service.printSelectionOnPreview();

//         expect(clearSelectionBackgroundSpy).toHaveBeenCalled();
//         expect(previewCtxSpy.putImageData).toHaveBeenCalled();
//     });

//     it('printSelectionOnPreview should set isTransformationOver to false if isTransformationOver is true', () => {
//         const clearSelectionBackgroundSpy = spyOn(service, 'clearSelectionBackground');
//         service.isTransformationOver = true;

//         service.printSelectionOnPreview();

//         expect(clearSelectionBackgroundSpy).toHaveBeenCalled();
//         expect(service.isTransformationOver).toBe(false);
//     });

//     it('printSelectionOnPreview should leave isTransformationOver to false if isTransformationOver is false', () => {
//         const clearSelectionBackgroundSpy = spyOn(service, 'clearSelectionBackground');
//         service.isTransformationOver = false;

//         service.printSelectionOnPreview();

//         expect(clearSelectionBackgroundSpy).toHaveBeenCalled();
//         expect(service.isTransformationOver).toBe(false);
//     });

//     it('move should call printSelectionOnPreview', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

//         // tslint:disable-next-line: no-string-literal
//         service['move'](service);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//     });

//     it('move should not change startingPoint if no keys are pressed', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         const initialStartingPoint = service.selection.startingPoint;

//         // tslint:disable-next-line: no-string-literal
//         service['move'](service);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint).toEqual(initialStartingPoint);
//     });

//     it('move should change startingPoint.x if isArrowKeyLeftPressed', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         service.pressedKeys.set(ARROW_KEYS.LEFT, true);
//         const initialXValue = service.selection.startingPoint.x;

//         // tslint:disable-next-line: no-string-literal
//         service['move'](service);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.x).toEqual(initialXValue - 3);
//     });

//     it('move should change startingPoint.x if isArrowKeyRightPressed', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         service.pressedKeys.set(ARROW_KEYS.RIGHT, true);
//         const initialXValue = service.selection.startingPoint.x;

//         // tslint:disable-next-line: no-string-literal
//         service['move'](service);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.x).toEqual(initialXValue + 3);
//     });

//     it('move should change startingPoint.y if isArrowKeyUpPressed', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         service.pressedKeys.set(ARROW_KEYS.UP, true);
//         const initialYValue = service.selection.startingPoint.y;

//         // tslint:disable-next-line: no-string-literal
//         service['move'](service);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.y).toEqual(initialYValue - 3);
//     });

//     it('move should change startingPoint.y if isArrowKeyDownPressed', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         service.pressedKeys.set(ARROW_KEYS.DOWN, true);
//         const initialYValue = service.selection.startingPoint.y;

//         // tslint:disable-next-line: no-string-literal
//         service['move'](service);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint.y).toEqual(initialYValue + 3);
//     });

//     it('move should not change startingPoint if all keys are pressed', () => {
//         const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
//         service.pressedKeys.set(ARROW_KEYS.LEFT, true);
//         service.pressedKeys.set(ARROW_KEYS.UP, true);
//         service.pressedKeys.set(ARROW_KEYS.RIGHT, true);
//         service.pressedKeys.set(ARROW_KEYS.DOWN, true);
//         const initialStartingPoint = service.selection.startingPoint;

//         // tslint:disable-next-line: no-string-literal
//         service['move'](service);

//         expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
//         expect(service.selection.startingPoint).toEqual(initialStartingPoint);
//     });

//     it('isArrowKeyPressed should return true if at least one arrowKey is pressed', () => {
//         service.pressedKeys.set(ARROW_KEYS.UP, true);

//         // tslint:disable-next-line: no-string-literal
//         expect(service['isArrowKeyPressed']()).toBe(true);
//     });

//     it('isArrowKeyPressed should return true if all arrowKeys are pressed', () => {
//         service.pressedKeys.set(ARROW_KEYS.LEFT, true);
//         service.pressedKeys.set(ARROW_KEYS.UP, true);
//         service.pressedKeys.set(ARROW_KEYS.RIGHT, true);
//         service.pressedKeys.set(ARROW_KEYS.DOWN, true);

//         // tslint:disable-next-line: no-string-literal
//         expect(service['isArrowKeyPressed']()).toBe(true);
//     });

//     it('isArrowKeyPressed should return false if no arrowKeys are pressed', () => {
//         // tslint:disable-next-line: no-string-literal
//         expect(service['isArrowKeyPressed']()).toBe(false);
//     });
// tslint:disable-next-line: max-file-line-count
// });

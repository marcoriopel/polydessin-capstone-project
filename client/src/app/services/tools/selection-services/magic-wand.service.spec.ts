import { TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { RotateService } from '@app/services/tools/transformation-services/rotate.service';
import { MagicWandService } from './magic-wand.service';
import { MagnetismService } from './magnetism.service';
import SpyObj = jasmine.SpyObj;

describe('MagicWandService', () => {
    let service: MagicWandService;
    let drawingService: DrawingService;
    // let selectionBox: SelectionBox;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let gridCanvasStub: HTMLCanvasElement;
    let moveServiceSpy: jasmine.SpyObj<MoveService>;
    let rotateServiceSpy: jasmine.SpyObj<RotateService>;
    let drawingServiceSpy: SpyObj<DrawingService>;
    let magnetismServiceSpy: SpyObj<MagnetismService>;
    let colorSelectionServiceSpy: SpyObj<ColorSelectionService>;
    let mouseEvent: MouseEvent;
    const WIDTH = 100;
    const HEIGHT = 100;

    beforeEach(() => {
        magnetismServiceSpy = jasmine.createSpyObj('MagnetismService', [
            'magnetismXAxisChange',
            'magnetismYAxisChange',
            'onMouseMoveMagnetism',
            'magnetismCoordinateReference',
        ]);
        colorSelectionServiceSpy = jasmine.createSpyObj('ColorSelectionService', [
            'clearCanvas',
            'getCanvasData',
            'updateStack',
            'setIsToolInUse',
            'applyPreview',
        ]);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'getCanvasData', 'updateStack', 'setIsToolInUse', 'applyPreview']);

        // selectionBox = {
        //     startingPoint: { x: 0, y: 0 },
        //     width: 10,
        //     height: 10,
        // };
        moveServiceSpy = jasmine.createSpyObj('MoveService', ['onMouseDown']);
        rotateServiceSpy = jasmine.createSpyObj('RotateService', ['initialize', 'rotatePreviewCanvas']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: MoveService, useValue: moveServiceSpy },
                { provide: RotateService, useValue: rotateServiceSpy },
                { provide: MagnetismService, useValue: magnetismServiceSpy },
                { provide: ColorSelectionService, useValue: colorSelectionServiceSpy },
            ],
        });
        service = TestBed.inject(MagicWandService);
        drawingService = TestBed.inject(DrawingService);

        const drawCanvas = document.createElement('canvas');
        drawCanvas.width = WIDTH;
        drawCanvas.height = HEIGHT;
        previewCtxStub = drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        const canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvasStub = canvas as HTMLCanvasElement;
        gridCanvasStub = canvas as HTMLCanvasElement;

        drawingService.previewCtx = previewCtxStub;
        drawingService.canvas = canvasStub;
        drawingService.gridCanvas = gridCanvasStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.LEFT,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set line dash of previewctx on initialize', () => {
        const setLineDashSpy = spyOn(drawingService.previewCtx, 'setLineDash');
        service.initialize();
        expect(setLineDashSpy).toHaveBeenCalled();
    });

    it(' should set cursor to crosshair on handleCursorCall with previewLayer correctly loaded', () => {
        drawingService.gridCanvas.style.cursor = 'none';
        service.setCursor();
        expect(gridCanvasStub.style.cursor).toEqual('crosshair');
    });

    it(' should call onMouseDown of moveService if in selection', () => {
        const isInSelectionSpy = spyOn(service, 'isInSelection').and.returnValue(true);
        service.onMouseDown(mouseEvent);
        expect(isInSelectionSpy).toHaveBeenCalled();
        expect(moveServiceSpy.onMouseDown).toHaveBeenCalled();
    });
});

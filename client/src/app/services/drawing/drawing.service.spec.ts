import { TestBed } from '@angular/core/testing';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let service: DrawingService;
    const WIDTH = 100;
    const HEIGHT = 100;

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const drawCanvas = document.createElement('canvas');
        drawCanvas.width = WIDTH;
        drawCanvas.height = HEIGHT;

        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        service.canvas = canvas;
        service.baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('should return true if the canvas is blank', () => {
        service.initializeBaseCanvas();
        expect(service.isCanvasBlank(service.baseCtx)).toEqual(true);
    });

    it('should return false if the canvas is not blank', () => {
        service.initializeBaseCanvas();
        service.baseCtx.fillStyle = 'red';
        service.baseCtx.fillRect(0, 0, 1, 1);
        expect(service.isCanvasBlank(service.baseCtx)).toEqual(false);
    });
});

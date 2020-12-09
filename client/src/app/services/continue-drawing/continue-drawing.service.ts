import { Injectable } from '@angular/core';
import { MINIMUM_CANVAS_HEIGHT, MINIMUM_CANVAS_WIDTH } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ContinueDrawingService {
    private isLastDrawing: boolean = false;

    constructor(public drawingService: DrawingService) {}

    continueDrawing(): void {
        const sourceDrawingURI = localStorage.getItem('drawingKey') as string;
        this.convertURIToImageData(sourceDrawingURI);
    }

    async convertURIToImageData(URI: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (URI == null) return reject();
            const canvas = this.drawingService.canvas;
            const context = this.drawingService.baseCtx;
            const image = new Image();
            image.src = URI;
            image.addEventListener(
                'load',
                () => {
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    resolve();
                },
                false,
            );
        });
    }

    loadOldDrawing(): boolean {
        this.drawingService.isLastDrawing = localStorage.length > 0;
        return this.isLastDrawing;
    }

    setLastDrawing(): void {
        this.drawingService.isLastDrawing = localStorage.length > 0;
    }

    unlockContinueDrawing(): void {
        this.drawingService.isLastDrawing = false;
    }

    clearCanvas(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
    }

    resizingCanvas(width: number = MINIMUM_CANVAS_WIDTH, height: number = MINIMUM_CANVAS_HEIGHT): void {
        this.drawingService.canvas.width = width;
        this.drawingService.canvas.height = height;
    }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MINIMUM_CANVAS_HEIGHT, MINIMUM_CANVAS_WIDTH } from '@app/ressources/global-variables/global-variables';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerResponseService } from '@app/services/server-response/server-response.service';
import { DBData } from '@common/communication/drawing-data';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ContinueDrawingService {
    isLastDrawing: boolean = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    filteredMetadata: DBData[] = [];
    currentRoute: string;
    checkOldDrawing: boolean;
    width: number;
    constructor(
        public drawingService: DrawingService,
        public router: Router,
        public serverResponseService: ServerResponseService,
        public databaseService: DatabaseService,
    ) {}
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
        if (!this.checkOldDrawing) {
            this.drawingService.canvas.width = width;
            this.drawingService.canvas.height = height;
        }
    }
}

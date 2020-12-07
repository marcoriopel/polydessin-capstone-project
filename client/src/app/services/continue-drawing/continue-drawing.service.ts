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
        const sourceDrawingURL = localStorage.getItem('drawingKey') as string;
        this.convertURIToImageData(sourceDrawingURL);
    }

    // tslint:disable-next-line: no-any
    async convertURIToImageData(uri: string): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            if (uri == null) return reject();
            const canvas = this.drawingService.canvas;
            const context = this.drawingService.baseCtx;
            const image = new Image();
            image.src = uri;
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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MINIMUM_CANVAS_HEIGHT, MINIMUM_CANVAS_WIDTH } from '@app/ressources/global-variables/global-variables';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';
import { ServerResponseService } from '@app/services/server-response/server-response.service';
import { DBData } from '@common/communication/drawing-data';
import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ContinueDesignService {
    private lastDesign: boolean = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    filteredMetadata: DBData[] = [];
    currentRoute: string;
    loadDesign: boolean;
    designPrevious: HTMLImageElement;
    WIDTH: number;
    constructor(
        public drawingService: DrawingService,
        public router: Router,
        public serverResponseService: ServerResponseService,
        public resizeDrawingService: ResizeDrawingService,
        public databaseService: DatabaseService,
    ) {}
    continueDesign(): void {
        const findSRC = localStorage.getItem('theDesign') as string;
        this.convertURIToImageData(findSRC);
    }

    loadOldDesign(): boolean {
        return this.lastDesign;
    }

    continueDesignAction(): void {
        this.lastDesign = localStorage.length > 0;
    }

    continueDesignDesactivated(): void {
        this.lastDesign = false;
    }

    clearCanvas(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
    }

    newBaseCtx(): boolean {
        return this.drawingService.baseCtx ? true : false;
    }
    resizeCanvas(width: number = MINIMUM_CANVAS_WIDTH, height: number = MINIMUM_CANVAS_HEIGHT): void {
        this.drawingService.canvas.width = width;
        this.drawingService.canvas.height = height;
        this.drawingService.canvas.width = width;
        this.drawingService.canvas.height = height;
        if (!this.loadDesign) {
            this.drawingService.canvas.width = width;
            this.drawingService.canvas.height = height;
        }
    }
    // tslint:disable-next-line: no-any
    async convertURIToImageData(URI: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (URI == null) return reject();
            const canvas = this.drawingService.canvas;
            const context = this.drawingService.baseCtx;
            const image = new Image();
            image.addEventListener(
                'load',
                () => {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    resolve(context.getImageData(0, 0, canvas.width, canvas.height));
                },
                false,
            );
            image.src = URI;
        });
    }
    // async drawImageOnCanvas(image: string): Promise<void> {
    //     return new Promise<void>((resolve) => {
    //         const drawing = new Image();
    //         drawing.src = image;
    //         drawing.onload = () => {
    //             this.resizeDrawingService.resizeCanvasSize(drawing.width, drawing.height);
    //             this.drawingService.baseCtx.drawImage(drawing, 0, 0, drawing.width, drawing.height);
    //             this.drawingService.resetStack();
    //             resolve();
    //         };
    //     });
    // }

    // convertURIToImageData(URI).then(function(imageData) {
    //   // Here you can use imageData
    //   console.log(imageData);
    // });
}

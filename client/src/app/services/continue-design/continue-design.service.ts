import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ContinueDesignService {
    constructor(private drawingService: DrawingService) {}
    continueDesign(): void {
        const findSRC = localStorage.getItem('theDesign') as string;
        this.convertURIToImageData(findSRC);
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
    // convertURIToImageData(URI).then(function(imageData) {
    //   // Here you can use imageData
    //   console.log(imageData);
    // });
}

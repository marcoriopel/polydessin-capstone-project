import { Component, OnInit } from '@angular/core';
import { FilterStyles, FILTER_STYLES } from '@app/ressources/global-variables/filter';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit {
    filterStyles: FilterStyles = {
        NONE: FILTER_STYLES.NONE,
        BLACK_AND_WHITE: FILTER_STYLES.BLACK_AND_WHITE,
        SEPHIA: FILTER_STYLES.SEPHIA,
        SATURATE: FILTER_STYLES.SATURATE,
        INVERT: FILTER_STYLES.INVERT,
        BLUR: FILTER_STYLES.BLUR,
    };
    differentFilter: string[] = ['none', 'grayscale(100%)', 'sepia(100%)', 'saturate(8)', 'invert(100%)', 'blur(5px)'];
    typeOfFile: string[] = ['image/png', 'image/jpeg'];

    name: string = '';
    emailAdress: string = '';
    imagesrc: string;
    urlImage: string;
    filterCanvas: HTMLCanvasElement;

    constructor(public drawingService: DrawingService) {}

    changeName(name: string): void {
        this.name = name;
    }

    changeFilter(event: Event): void {
        const target = event.target as HTMLInputElement;
        const filterNumber: number = Number(target.value);
        const canvasFilter = document.createElement('canvas') as HTMLCanvasElement;
        const canvasFilterCtx = canvasFilter.getContext('2d');
        canvasFilter.height = this.drawingService.canvas.height;
        canvasFilter.width = this.drawingService.canvas.width;
        if (canvasFilterCtx != null) {
            canvasFilterCtx.filter = this.differentFilter[filterNumber];
            canvasFilterCtx.drawImage(this.drawingService.canvas, 0, 0);
            this.filterCanvas = canvasFilter;
            this.imagesrc = canvasFilterCtx.canvas.toDataURL();
            this.urlImage = this.imagesrc;
        }
    }

    getImageUrl(event: Event): void {
        const target = event.target as HTMLInputElement;
        const typeNumber: number = Number(target.value);
        if (this.filterCanvas != null) {
            this.urlImage = this.filterCanvas.toDataURL(this.typeOfFile[typeNumber]);
        }
    }

    ngOnInit(): void {
        const image: HTMLImageElement = new Image();
        image.src = this.drawingService.baseCtx.canvas.toDataURL();
        this.imagesrc = image.src;
        this.urlImage = this.imagesrc;
    }

    exportLocally(): void {
        const link = document.createElement('a');
        link.href = this.urlImage;
        link.setAttribute('download', this.name);
        link.click();
    }
}

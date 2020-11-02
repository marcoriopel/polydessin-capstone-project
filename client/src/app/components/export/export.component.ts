import { AfterViewInit, Component } from '@angular/core';
import { FilterStyles, FILTER_STYLES } from '@app/ressources/global-variables/filter';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements AfterViewInit {
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
    imagesrc: string = '';
    urlImage: string = '';
    filterCanvas: HTMLCanvasElement = document.createElement('canvas');
    link: HTMLAnchorElement = document.createElement('a');

    constructor(public drawingService: DrawingService) {}

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.imagesrc = this.drawingService.canvas.toDataURL();
            this.urlImage = this.imagesrc;
            this.filterCanvas = this.drawingService.canvas;
        });
    }

    changeName(name: string): void {
        this.name = name;
    }

    changeFilter(event: Event): void {
        const target = event.target as HTMLInputElement;
        const filterNumber: number = Number(target.value);
        const canvasFilter = document.createElement('canvas') as HTMLCanvasElement;
        const canvasFilterCtx = canvasFilter.getContext('2d') as CanvasRenderingContext2D;
        canvasFilter.height = this.drawingService.canvas.height;
        canvasFilter.width = this.drawingService.canvas.width;

        canvasFilterCtx.filter = this.differentFilter[filterNumber];
        canvasFilterCtx.drawImage(this.drawingService.canvas, 0, 0);
        this.filterCanvas = canvasFilter;
        this.imagesrc = canvasFilterCtx.canvas.toDataURL();
        this.urlImage = this.imagesrc;
    }

    getImageUrl(event: Event): void {
        const target = event.target as HTMLInputElement;
        const typeNumber: number = Number(target.value);
        this.urlImage = this.filterCanvas.toDataURL(this.typeOfFile[typeNumber]);
    }

    exportLocally(): void {
        this.link.href = this.urlImage;
        this.link.setAttribute('download', this.name);
        this.link.click();
    }
}

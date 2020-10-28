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

    name: string = '';
    emailAdress: string = '';
    imageUrl: string;

    constructor(public drawingService: DrawingService) {}

    changeName(name: string): void {
        this.name = name;
    }
    changeEmailAddress(mail: string): void {
        this.emailAdress = mail;
    }

    changeFilter(event: Event): void {
        const target = event.target as HTMLInputElement;
        console.log(target.value);
        const filterNumber: number = Number(target.value);
        const image = document.getElementById('image');
        const canvasFilter = document.getElementById('canvas') as HTMLCanvasElement;
        const canvasFilterCtx = canvasFilter.getContext('2d');
        canvasFilterCtx?.drawImage(this.drawingService.canvas, this.drawingService.canvas.width, this.drawingService.canvas.height);

        if (image != null && canvasFilterCtx != null) {
            image.style.filter = this.differentFilter[filterNumber];
            canvasFilterCtx.filter = this.differentFilter[filterNumber];
            this.imageUrl = canvasFilter.toDataURL();
            canvasFilterCtx.filter = 'none';
        }
    }
    ngOnInit(): void {
        const image: HTMLImageElement = new Image();
        image.src = this.drawingService.baseCtx.canvas.toDataURL();
        this.imageUrl = image.src;
    }
}

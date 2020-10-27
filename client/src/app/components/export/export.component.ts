import { Component, OnInit } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit {
    name: string = '';
    imageUrl: string;
    constructor(public drawingService: DrawingService) {}

    changeName(name: string): void {
        this.name = name;
    }
    ngOnInit(): void {
        const image: HTMLImageElement = new Image();
        image.src = this.drawingService.baseCtx.canvas.toDataURL('image/png');
        console.log(image);
        document.head.appendChild(image);
    }
}

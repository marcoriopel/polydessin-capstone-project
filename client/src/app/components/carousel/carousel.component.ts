import { Component } from '@angular/core';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
    isOpenButtonDisabled: boolean = false;
    constructor(public databaseService: DatabaseService) {}

    openSelectedDrawing(): void {
        this.databaseService.getDrawingData().subscribe((drawingData: DrawingData[]) => {
            drawingData.forEach((element: DrawingData) => {
                console.log(element.id);
            });
        });
    }
}

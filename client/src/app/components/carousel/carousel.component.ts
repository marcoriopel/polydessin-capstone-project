import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from '@app/services/database/database.service';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, OnDestroy {
    isOpenButtonDisabled: boolean = false;
    constructor(public databaseService: DatabaseService, public hotkeyService: HotkeyService) {}

    ngOnInit(): void {
        this.hotkeyService.isHotkeyEnabled = false;
    }
    openSelectedDrawing(): void {
        this.databaseService.getDrawingData().subscribe((drawingData: DrawingData[]) => {
            drawingData.forEach((element: DrawingData) => {
                console.log(element.id);
            });
        });
    }
    ngOnDestroy(): void {
        this.hotkeyService.isHotkeyEnabled = true;
    }
}

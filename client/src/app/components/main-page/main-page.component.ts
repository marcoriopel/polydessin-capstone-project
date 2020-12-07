import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { UserGuideComponent } from '@app/components/userguide/user-guide.component';
import { ContinueDrawingService } from '@app/services/continue-drawing/continue-drawing.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'PolyDessin';
    isContinueDrawingEnable: boolean = this.printButton();

    constructor(public dialog: MatDialog, public continueDrawingService: ContinueDrawingService) {}
    openUserguide(): void {
        this.dialog.open(UserGuideComponent);
    }

    openCarousel(): void {
        this.dialog.open(CarouselComponent);
    }

    oldDrawingCheck(): void {
        this.continueDrawingService.loadOldDrawing();
    }

    continueDrawing(): void {
        this.continueDrawingService.unlockContinueDrawing();
    }
    printButton(): boolean {
        return localStorage.getItem('drawingKey') ? true : false;
    }
}

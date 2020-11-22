import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { UserGuideComponent } from '@app/components/userguide/user-guide.component';
import { ContinueDesignService } from '@app/services/continue-design/continue-design.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'PolyDessin';
    constructor(public dialog: MatDialog, public continueDesignService: ContinueDesignService) {}

    openUserguide(): void {
        this.dialog.open(UserGuideComponent);
    }

    openCarousel(): void {
        this.dialog.open(CarouselComponent);
    }

    canContinuerUnDessinButtonBeDisplayed(): boolean {
        return localStorage.length > 0;
    }

    lastDraftActivation(): void {
        this.continueDesignService.continueDesignAction();
    }

    continueDesign(): void {
        this.continueDesignService.continueDesignDesactivated();
    }
}

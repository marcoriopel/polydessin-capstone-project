import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserguideComponent } from '@app/components/userguide/userguide.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'PolyDessin';

    constructor(public dialog: MatDialog) {}

    openUserguide(): void {
        this.dialog.open(UserguideComponent);
    }
}

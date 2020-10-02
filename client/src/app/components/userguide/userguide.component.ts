import { AfterViewInit, Component } from '@angular/core';

@Component({
    selector: 'app-userguide',
    templateUrl: './userguide.component.html',
    styleUrls: ['./userguide.component.scss'],
})
export class UserguideComponent implements AfterViewInit {
    disableAnimation: boolean = true;

    ngAfterViewInit(): void {
        setTimeout(() => (this.disableAnimation = false));
    }
}

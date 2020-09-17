import { Component } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

    onToolChange(event: Event): void {
        if (event.target.value != null) {
            console.log(event.target.value);
        }
    }
}

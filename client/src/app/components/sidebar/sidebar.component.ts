import { Component } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

    onToolChange(event: Event): void {
        let target = event.target as HTMLInputElement;
        if (target.value != null) {
            console.log(target.value);
        }
    }
}

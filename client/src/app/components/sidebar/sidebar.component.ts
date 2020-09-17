import { Component } from '@angular/core';
import { ToolSelectionService } from '../../services/tool-selection.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

    constructor(private toolSelectionService: ToolSelectionService) { }

    onToolChange(event: Event): void {
        let target = event.target as HTMLInputElement;
        if (target.value != null) {
            this.toolSelectionService.onToolChange(target.value);
        }
    }
}

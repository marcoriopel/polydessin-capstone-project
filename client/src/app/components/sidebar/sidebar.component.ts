import { Component } from '@angular/core';
import { SIDEBAR_ELEMENT_DESCRIPTIONS, TOOLTIP_DELAY } from '@app/../ressources/global-variables';
import { SidebarElementDescriptions } from '@app/classes/sidebarElementDescriptions';
import { ToolSelectionService } from '../../services/tool-selection.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    elementDescriptions: SidebarElementDescriptions = SIDEBAR_ELEMENT_DESCRIPTIONS;
    tooltipShowDelay: number = TOOLTIP_DELAY;

    constructor(public toolSelectionService: ToolSelectionService) {}

    onToolChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.value != null) {
            this.toolSelectionService.changeTool(target.value);
        }
    }
}

import { Component } from '@angular/core';
import { SidebarElementDescriptions } from '@app/classes/sidebar-element-descriptions';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { SIDEBAR_ELEMENT_DESCRIPTIONS, TOOLTIP_DELAY } from 'src/ressources/global-variables';

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
            this.toolSelectionService.currentTool.handleCursor();
        }
    }
}

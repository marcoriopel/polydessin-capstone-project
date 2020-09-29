import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserguideComponent } from '@app/components/userguide/userguide.component';
import { TOOLTIP_DELAY } from '@app/ressources/global-variables/global-variables';
import { SidebarElementTooltips, SIDEBAR_ELEMENT_TOOLTIPS } from '@app/ressources/global-variables/sidebar-element-tooltips';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    elementDescriptions: SidebarElementTooltips = SIDEBAR_ELEMENT_TOOLTIPS;
    tooltipShowDelay: number = TOOLTIP_DELAY;

    constructor(public toolSelectionService: ToolSelectionService, public dialog: MatDialog, public newDrawingService: NewDrawingService) {}

    onToolChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.value != null) {
            this.toolSelectionService.changeTool(target.value);
            this.toolSelectionService.currentTool.handleCursor();
        }
    }

    openUserguide(): void {
        this.dialog.open(UserguideComponent);
    }
    openDialog(): void {
        this.newDrawingService.openWarning();
    }
}

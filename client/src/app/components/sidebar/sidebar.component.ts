import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewDrawingComponent } from '@app/components/new-drawing/new-drawing.component';
import { TOOLTIP_DELAY } from '@app/ressources/global-variables/global-variables';
import { SidebarElementTooltips, SIDEBAR_ELEMENT_TOOLTIPS } from '@app/ressources/global-variables/sidebar-element-tooltips';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    elementDescriptions: SidebarElementTooltips = SIDEBAR_ELEMENT_TOOLTIPS;
    tooltipShowDelay: number = TOOLTIP_DELAY;

    constructor(public toolSelectionService: ToolSelectionService, public drawingService: DrawingService, public dialog: MatDialog) {}

    onToolChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.value != null) {
            this.toolSelectionService.changeTool(target.value);
            this.toolSelectionService.currentTool.handleCursor();
        }
    }

    openWarning(): void {
        if (!this.drawingService.isCanvasBlank(this.drawingService.baseCtx)) {
            this.dialog.open(NewDrawingComponent);
        }
    }
    @HostListener('window:keyup', ['$event'])
    KeyEvent(event: KeyboardEvent): void {
        if (event.key === '0' && event.ctrlKey) {
            this.openWarning();
        }
    }
}

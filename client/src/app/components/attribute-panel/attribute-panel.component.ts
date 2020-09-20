import { Component } from '@angular/core';
import { ToolSelectionService } from '@app/services/tool-selection.service';

@Component({
    selector: 'app-attribute-panel',
    templateUrl: './attribute-panel.component.html',
    styleUrls: ['./attribute-panel.component.scss'],
})
export class AttributePanelComponent {
    constructor(public toolSelectionService: ToolSelectionService) {}
}

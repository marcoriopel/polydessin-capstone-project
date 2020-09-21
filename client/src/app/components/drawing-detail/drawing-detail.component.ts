import { Component } from '@angular/core';
import { BasicTool, BASIC_TOOLS, OTHER_FEATURES, ToolGroup, TOOL_GROUPS, TRANSFORMATIONS } from '@app/ressources/texts/outils-description';

@Component({
    selector: 'app-drawing-detail',
    templateUrl: './drawing-detail.component.html',
    styleUrls: ['./drawing-detail.component.scss'],
})
export class DrawingDetailComponent {
    basicTools: BasicTool[] = BASIC_TOOLS;

    toolGroups: ToolGroup[] = TOOL_GROUPS;

    otherFeatures: BasicTool[] = OTHER_FEATURES;

    transformations: BasicTool[] = TRANSFORMATIONS;
}

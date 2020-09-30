import { Component } from '@angular/core';
import { Feature } from '@app/ressources/texts/feature';
import { BASIC_TOOLS, DRAWING_TOOLS, GroupFeature, OTHER_FEATURES, SHAPES, TOOL_GROUPS } from '@app/ressources/texts/outils-description';

@Component({
    selector: 'app-drawing-detail',
    templateUrl: './drawing-detail.component.html',
    styleUrls: ['./drawing-detail.component.scss'],
})
export class DrawingDetailComponent {
    basicTools: Feature[] = BASIC_TOOLS;

    toolGroups: GroupFeature[] = TOOL_GROUPS;

    otherFeatures: Feature[] = OTHER_FEATURES;

    drawingTools: Feature[] = DRAWING_TOOLS;

    shapes: Feature[] = SHAPES;
}

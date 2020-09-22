import { Component } from '@angular/core';
import { feature } from '@app/ressources/texts/feature';
import { BASIC_TOOLS, GroupFeature, OTHER_FEATURES, TOOL_GROUPS, TRANSFORMATIONS } from '@app/ressources/texts/outils-description';

@Component({
    selector: 'app-drawing-detail',
    templateUrl: './drawing-detail.component.html',
    styleUrls: ['./drawing-detail.component.scss'],
})
export class DrawingDetailComponent {
    basicTools: feature[] = BASIC_TOOLS;

    toolGroups: GroupFeature[] = TOOL_GROUPS;

    otherFeatures: feature[] = OTHER_FEATURES;

    transformations: feature[] = TRANSFORMATIONS;
}

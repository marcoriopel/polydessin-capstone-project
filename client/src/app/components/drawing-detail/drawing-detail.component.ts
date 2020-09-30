import { Component } from '@angular/core';
import { Feature } from '@app/ressources/texts/feature';
import { BASIC_TOOLS, GroupFeature, OTHER_FEATURES, TOOL_GROUPS } from '@app/ressources/texts/outils-description';

@Component({
    selector: 'app-drawing-detail',
    templateUrl: './drawing-detail.component.html',
    styleUrls: ['./drawing-detail.component.scss'],
})
export class DrawingDetailComponent {
    basicTools: Feature[] = BASIC_TOOLS;

    toolGroups: GroupFeature[] = TOOL_GROUPS;

    otherFeatures: Feature[] = OTHER_FEATURES;
}

import { CircleSelectionService } from '@app/services/tools/selection-services/circle-selection.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-circleselection-attributes',
    templateUrl: './circleselection-attributes.component.html',
    styleUrls: ['./circleselection-attributes.component.scss'],
})
export class CircleselectionAttributesComponent {
    toolWidth: number;
    fillStyle: number;

    constructor(public circleSelectionService: CircleSelectionService) {
        this.toolWidth = circleSelectionService.circleService.width;
        this.fillStyle = circleSelectionService.circleService.fillStyle;
    }
}

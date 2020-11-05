import { Component } from '@angular/core';
import { CircleSelectionService } from '@app/services/tools/selection-services/circle-selection.service';

@Component({
    selector: 'app-circleselection-attributes',
    templateUrl: './circle-selection-attributes.component.html',
    styleUrls: ['./circle-selection-attributes.component.scss'],
})
export class CircleselectionAttributesComponent {
    // toolWidth: number;
    // fillStyle: number;

    constructor(public circleSelectionService: CircleSelectionService) {
        // this.toolWidth = circleSelectionService.circleService.width;
        // this.fillStyle = circleSelectionService.circleService.fillStyle;
    }
}

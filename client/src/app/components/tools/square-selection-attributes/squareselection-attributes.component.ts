import { Component } from '@angular/core';
import { SquareSelectionService } from '@app/services/tools/selection-services/square-selection.service';

@Component({
    selector: 'app-squareselection-attributes',
    templateUrl: './squareselection-attributes.component.html',
    styleUrls: ['./squareselection-attributes.component.scss'],
})
export class SquareselectionAttributesComponent {
    // toolWidth: number;
    // fillStyle: number;

    constructor(public squareSelectionService: SquareSelectionService) {
        // this.toolWidth = squareSelectionService.squareService.width;
        // this.fillStyle = squareSelectionService.squareService.fillStyle;
    }
}

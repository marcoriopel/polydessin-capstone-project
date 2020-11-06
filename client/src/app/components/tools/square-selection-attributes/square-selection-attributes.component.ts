import { Component } from '@angular/core';
import { SquareSelectionService } from '@app/services/tools/selection-services/square-selection.service';

@Component({
    selector: 'app-squareselection-attributes',
    templateUrl: './square-selection-attributes.component.html',
    styleUrls: ['./square-selection-attributes.component.scss'],
})
export class SquareselectionAttributesComponent {
    constructor(public squareSelectionService: SquareSelectionService) {}
}

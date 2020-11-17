import { Component } from '@angular/core';
import { AlignmentNames, ALIGNMENT_NAMES } from '@app/ressources/global-variables/alignment-names';
import { CircleSelectionService } from '@app/services/tools/selection-services/circle-selection.service';

@Component({
    selector: 'app-circleselection-attributes',
    templateUrl: './circle-selection-attributes.component.html',
    styleUrls: ['./circle-selection-attributes.component.scss'],
})
export class CircleselectionAttributesComponent {
    isMagnetismEnabled: boolean = false;
    alignmentNames: AlignmentNames = ALIGNMENT_NAMES;
    currentAlignment: string = this.alignmentNames.ALIGN_TOP_LEFT_NAME;
    constructor(public circleSelectionService: CircleSelectionService) {}

    enableGridMagnetism(isChecked: boolean): void {
        this.isMagnetismEnabled = isChecked;
        this.circleSelectionService.enableMagnetism(isChecked);
    }

    onAlignmentChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.value != undefined) {
            this.currentAlignment = target.value;
            this.circleSelectionService.setMagnetismAlignment(this.currentAlignment);
        }
    }
}

import { Component } from '@angular/core';
import { AlignmentNames, ALIGNMENT_NAMES } from '@app/ressources/global-variables/alignment-names';
import { MAGNETISM_NAME } from '@app/ressources/global-variables/global-variables';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { CircleSelectionService } from '@app/services/tools/selection-services/circle-selection.service';

@Component({
    selector: 'app-circle-selection-attributes',
    templateUrl: './circle-selection-attributes.component.html',
    styleUrls: ['./circle-selection-attributes.component.scss'],
})
export class CircleSelectionAttributesComponent {
    isMagnetismEnabled: boolean = false;
    alignmentNames: AlignmentNames = ALIGNMENT_NAMES;
    currentAlignment: string = this.alignmentNames.ALIGN_TOP_LEFT_NAME;
    constructor(public circleSelectionService: CircleSelectionService, public hotkeyService: HotkeyService) {
        this.hotkeyService.getKey().subscribe((toolName) => {
            if (toolName === MAGNETISM_NAME) {
                if (this.isMagnetismEnabled) this.enableGridMagnetism(false);
                else this.enableGridMagnetism(true);
            }
        });
    }

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

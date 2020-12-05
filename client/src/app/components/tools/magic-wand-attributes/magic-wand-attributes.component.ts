import { Component } from '@angular/core';
import { AlignmentNames, ALIGNMENT_NAMES } from '@app/ressources/global-variables/alignment-names';
import { MAGNETISM_NAME } from '@app/ressources/global-variables/global-variables';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { MagicWandService } from '@app/services/tools/selection-services/magic-wand.service';

@Component({
    selector: 'app-magic-wand-attributes',
    templateUrl: './magic-wand-attributes.component.html',
    styleUrls: ['./magic-wand-attributes.component.scss'],
})
export class MagicWandAttributesComponent {
    isMagnetismEnabled: boolean = false;
    alignmentNames: AlignmentNames = ALIGNMENT_NAMES;
    currentAlignment: string = this.alignmentNames.ALIGN_TOP_LEFT_NAME;

    constructor(public magicWandService: MagicWandService, public hotkeyService: HotkeyService) {
        this.hotkeyService.getKey().subscribe((toolName) => {
            if (toolName === MAGNETISM_NAME) {
                if (this.isMagnetismEnabled) this.enableGridMagnetism(false);
                else this.enableGridMagnetism(true);
            }
        });
    }

    enableGridMagnetism(isChecked: boolean): void {
        this.isMagnetismEnabled = isChecked;
        this.magicWandService.enableMagnetism(isChecked);
    }

    onAlignmentChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.value != undefined) {
            this.currentAlignment = target.value;
            this.magicWandService.setMagnetismAlignment(this.currentAlignment);
        }
    }
}

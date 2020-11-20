import { Component } from '@angular/core';
import { Stamps, STAMPS } from '@app/../assets/stamps/stamps';
import { StampService } from '@app/services/tools/stamp.service';

@Component({
    selector: 'app-stamp-attributes',
    templateUrl: './stamp-attributes.component.html',
    styleUrls: ['./stamp-attributes.component.scss'],
})
export class StampAttributesComponent {
    toolSize: number = 5;
    stamps: Stamps = STAMPS;

    constructor(public stampService: StampService) {
        this.stampService.currentStamp = STAMPS.ANGULAR;
    }

    changeSize(newSize: number): void {
        this.toolSize = newSize;
        this.stampService.stampSize = newSize;
    }

    changeStamp(newStamp: string): void {
        this.stampService.currentStamp = newStamp;
    }
}

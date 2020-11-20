import { Component } from '@angular/core';
import { StampService } from '@app/services/tools/stamp.service';

@Component({
    selector: 'app-stamp-attributes',
    templateUrl: './stamp-attributes.component.html',
    styleUrls: ['./stamp-attributes.component.scss'],
})
export class StampAttributesComponent {
    toolSize: number = 5;

    constructor(public stampService: StampService) {}

    changeSize(newSize: number): void {
        this.toolSize = newSize;
        this.stampService.stampSize = newSize;
    }
}

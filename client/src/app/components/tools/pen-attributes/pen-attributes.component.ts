import { Component } from '@angular/core';
import { PenService } from '@app/services/tools/pen.service';

@Component({
    selector: 'app-pen-attributes',
    templateUrl: './pen-attributes.component.html',
    styleUrls: ['./pen-attributes.component.scss'],
})
export class PenAttributesComponent {
    toolWidth: number;

    constructor(public penService: PenService) {
        this.toolWidth = penService.width;
    }

    changeWidth(newWidth: number): void {
        this.toolWidth = newWidth;
        this.penService.changeWidth(this.toolWidth);
    }
}

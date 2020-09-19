import { Component } from '@angular/core';
import { EraserService } from '@app/services/tools/eraser.service';

@Component({
    selector: 'app-eraser-attributes',
    templateUrl: './eraser-attributes.component.html',
    styleUrls: ['./eraser-attributes.component.scss'],
})
export class EraserAttributesComponent {
    toolWidth: number = 1;

    constructor(public eraserService: EraserService) { }
}

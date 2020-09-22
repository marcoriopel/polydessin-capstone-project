import { Component } from '@angular/core';
import { BrushService } from '@app/services/tools/brush.service';

@Component({
    selector: 'app-brush-attributes',
    templateUrl: './brush-attributes.component.html',
    styleUrls: ['./brush-attributes.component.scss'],
})
export class BrushAttributesComponent {
    toolWidth: number = 1;

    constructor(public brushService: BrushService) {}
}

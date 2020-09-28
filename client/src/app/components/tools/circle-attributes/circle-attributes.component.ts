import { Component } from '@angular/core';
import { CircleService } from '@app/services/tools/circle.service';

@Component({
    selector: 'app-circle-attributes',
    templateUrl: './circle-attributes.component.html',
    styleUrls: ['./circle-attributes.component.scss'],
})
export class CircleAttributesComponent {
    toolWidth: number = 1;

    constructor(public circleService: CircleService) {}
}

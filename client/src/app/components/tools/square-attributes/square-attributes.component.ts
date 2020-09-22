import { Component } from '@angular/core';
import { SquareService } from '@app/services/tools/square.service';

@Component({
    selector: 'app-square-attributes',
    templateUrl: './square-attributes.component.html',
    styleUrls: ['./square-attributes.component.scss'],
})
export class SquareAttributesComponent {
    toolWidth: number = 1;

    constructor(public squareService: SquareService) {}
}

import { Component } from '@angular/core';
import { SquareService } from '@app/services/tools/square.service';

@Component({
    selector: 'app-square-attributes',
    templateUrl: './square-attributes.component.html',
    styleUrls: ['./square-attributes.component.scss'],
})
export class SquareAttributesComponent {
    toolWidth: number;

    constructor(public squareService: SquareService) {
        this.toolWidth = squareService.width;
    }

    handleBorderWidthChange(newWidth: number): void {
        this.toolWidth = newWidth;
        this.squareService.changeWidth(newWidth);
    }

    handleFillStyleChange(newFillStyle: number): void {
        this.squareService.changeFillStyle(newFillStyle);
    }
}

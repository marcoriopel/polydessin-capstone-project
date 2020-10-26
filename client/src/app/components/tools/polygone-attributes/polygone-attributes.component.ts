import { Component } from '@angular/core';
import { PolygoneService } from '@app/services/tools/polygone.service';

@Component({
    selector: 'app-polygone-attributes',
    templateUrl: './polygone-attributes.component.html',
    styleUrls: ['./polygone-attributes.component.scss'],
})
export class PolygoneAttributesComponent {
    toolWidth: number;
    fillStyle: number;
    sides: number;

    constructor(public polygoneService: PolygoneService) {
        this.toolWidth = polygoneService.width;
        this.fillStyle = polygoneService.fillStyle;
    }

    handleBorderWidthChange(newWidth: number): void {
        this.toolWidth = newWidth;
        this.polygoneService.changeWidth(newWidth);
    }

    handleFillStyleChange(newFillStyle: number): void {
        this.polygoneService.changeFillStyle(newFillStyle);
    }

    handlePolygoneSides(sides: number): void {
        this.sides = sides;
        this.polygoneService.changeSides(sides);
    }
}

import { Component } from '@angular/core';
import { BrushService } from '@app/services/tools/brush.service';

@Component({
    selector: 'app-brush-attributes',
    templateUrl: './brush-attributes.component.html',
    styleUrls: ['./brush-attributes.component.scss'],
})
export class BrushAttributesComponent {
    toolWidth: number;

    constructor(public brushService: BrushService) {
        this.toolWidth = brushService.width;
    }

    handleWidthChange(newWidth: number): void {
        this.toolWidth = newWidth;
        this.brushService.changeWidth(this.toolWidth);
    }
}

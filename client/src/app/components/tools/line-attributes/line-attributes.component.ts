import { Component } from '@angular/core';
import { LineService } from '@app/services/tools/line.service';

@Component({
    selector: 'app-line-attributes',
    templateUrl: './line-attributes.component.html',
    styleUrls: ['./line-attributes.component.scss'],
})
export class LineAttributesComponent {
    toolWidth: number = 1;

    constructor(public lineService: LineService) {}

    handleWidthChange(newWidth: number): void {
        this.toolWidth = newWidth;
        this.lineService.changeWidth(this.toolWidth);
    }
}

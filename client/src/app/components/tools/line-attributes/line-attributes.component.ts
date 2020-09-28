import { Component } from '@angular/core';
import { LineService } from '@app/services/tools/line.service';

@Component({
    selector: 'app-line-attributes',
    templateUrl: './line-attributes.component.html',
    styleUrls: ['./line-attributes.component.scss'],
})
export class LineAttributesComponent {
    constructor(public lineService: LineService) {}
    toolWidth: number = 1;

    handleDotWidthChange(newWidth: number): void {
        this.lineService.changeDotWidth(newWidth);
    }

    handleLineWidthChange(newWidth: number): void {
        this.lineService.changeLineWidth(newWidth);
    }

    handleJunctionPointChange(isChecked: boolean): void {
        this.lineService.changeJunction(isChecked);
    }
}

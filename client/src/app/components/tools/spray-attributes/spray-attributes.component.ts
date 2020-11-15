import { Component } from '@angular/core';
import { SprayService } from '@app/services/tools/spray.service';

@Component({
    selector: 'app-spray-attributes',
    templateUrl: './spray-attributes.component.html',
    styleUrls: ['./spray-attributes.component.scss'],
})
export class SprayAttributesComponent {
    toolWidth: number;

    constructor(public sprayService: SprayService) {
        this.toolWidth = sprayService.width;
    }

    changeWidth(newWidth: number): void {
        this.toolWidth = newWidth;
        this.sprayService.changeWidth(this.toolWidth);
    }
}

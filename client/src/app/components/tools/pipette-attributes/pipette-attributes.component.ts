import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PipetteService } from '@app/services/tools/pipette.service';

@Component({
    selector: 'app-pipette-attributes',
    templateUrl: './pipette-attributes.component.html',
    styleUrls: ['./pipette-attributes.component.scss'],
})
export class PipetteAttributesComponent implements AfterViewInit {
    @ViewChild('zoom', { static: false }) zoom: ElementRef<HTMLCanvasElement>;
    private zoomCtx: CanvasRenderingContext2D;
    constructor(public pipetteService: PipetteService) {}

    ngAfterViewInit(): void {
        this.zoomCtx = this.zoom.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.pipetteService.zoomCtx = this.zoomCtx;
        this.pipetteService.zoom = this.zoom.nativeElement;
    }
}

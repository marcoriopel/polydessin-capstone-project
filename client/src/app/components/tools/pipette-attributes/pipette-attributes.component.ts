import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MAXIMUM_ZOOM_HEIGHT, MAXIMUM_ZOOM_WIDTH } from '@app/ressources/global-variables/global-variables';
import { PipetteService } from '@app/services/tools/pipette.service';

@Component({
    selector: 'app-pipette-attributes',
    templateUrl: './pipette-attributes.component.html',
    styleUrls: ['./pipette-attributes.component.scss'],
})
export class PipetteAttributesComponent implements AfterViewInit, OnInit {
    @ViewChild('zoom', { static: false }) zoom: ElementRef<HTMLCanvasElement>;

    @Input() zoomSize: Vec2;

    private zoomCtx: CanvasRenderingContext2D;
    constructor(public pipetteService: PipetteService) {
        this.zoomSize = { x: MAXIMUM_ZOOM_WIDTH, y: MAXIMUM_ZOOM_HEIGHT };
    }

    ngOnInit(): void {
        this.pipetteService.onCanvas.subscribe((data: boolean) => {
            if (data) {
                this.zoom.nativeElement.style.visibility = 'visible';
            } else {
                this.zoom.nativeElement.style.visibility = 'hidden';
            }
        });
    }
    ngAfterViewInit(): void {
        this.zoom.nativeElement.style.visibility = 'hidden';
        this.zoomCtx = this.zoom.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.pipetteService.zoomCtx = this.zoomCtx;
        this.pipetteService.zoom = this.zoom.nativeElement;
    }
    get width(): number {
        return this.zoomSize.x;
    }

    get height(): number {
        return this.zoomSize.y;
    }
}

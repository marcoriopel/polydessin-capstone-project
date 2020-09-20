import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import {
    HALF_RATIO,
    MINIMUM_CANVAS_HEIGHT,
    MINIMUM_CANVAS_WIDTH,
    MINIMUM_WORKSPACE_HEIGHT,
    MINIMUM_WORKSPACE_WIDTH
} from '@app/ressources/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2;
    private workSpaceSize: Vec2;

    constructor(private drawingService: DrawingService, public toolSelectionService: ToolSelectionService) {
        this.canvasSize = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
        this.workSpaceSize = { x: MINIMUM_WORKSPACE_WIDTH, y: MINIMUM_WORKSPACE_HEIGHT };
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;

        setTimeout(() => {
            let workspaceElement: HTMLElement = document.querySelector('#workSpace') as HTMLElement;
            this.workSpaceSize.x = workspaceElement.offsetWidth;
            this.workSpaceSize.y = workspaceElement.offsetHeight;
            this.setDefaultCanvasSize();
        });
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.toolSelectionService.currentTool.onMouseMove(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.toolSelectionService.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolSelectionService.currentTool.onMouseUp(event);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    private setDefaultCanvasSize(): void {

        if (this.workSpaceSize.x > MINIMUM_WORKSPACE_WIDTH) {
            this.canvasSize.x = this.workSpaceSize.x * HALF_RATIO;
        }

        if (this.workSpaceSize.y > MINIMUM_WORKSPACE_HEIGHT) {
            this.canvasSize.y = this.workSpaceSize.y * HALF_RATIO;
        }
    }
}

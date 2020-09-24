import { AfterViewInit, Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MINIMUM_CANVAS_HEIGHT, MINIMUM_CANVAS_WIDTH, MINIMUM_WORKSPACE_HEIGHT, MINIMUM_WORKSPACE_WIDTH } from '@app/ressources/global-variables';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    canvasSize: Vec2;
    private workSpaceSize: Vec2;

    constructor(public resizeDrawingService: ResizeDrawingService) {
        this.canvasSize = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
        this.workSpaceSize = { x: MINIMUM_WORKSPACE_WIDTH, y: MINIMUM_WORKSPACE_HEIGHT };
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const workspaceElement: HTMLElement = document.querySelector('#workSpace') as HTMLElement;
            this.workSpaceSize.x = workspaceElement.offsetWidth;
            this.workSpaceSize.y = workspaceElement.offsetHeight;
            this.setDefaultCanvasSize();
        });
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.resizeDrawingService.resizeCanvas(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.resizeDrawingService.onMouseUp();
    }

    private setDefaultCanvasSize(): void {
        this.canvasSize = this.resizeDrawingService.setDefaultCanvasSize(this.workSpaceSize);
        console.log(this.canvasSize);
    }
}

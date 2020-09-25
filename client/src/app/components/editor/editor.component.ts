import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import {
    MINIMUM_CANVAS_HEIGHT,
    MINIMUM_CANVAS_WIDTH,
    MINIMUM_WORKSPACE_HEIGHT,
    MINIMUM_WORKSPACE_WIDTH,
} from '@app/ressources/global-variables/global-variables';
import { ToolNames, TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    @ViewChild('drawingComponent', { static: false }) drawingComponent: DrawingComponent;

    toolNames: ToolNames = TOOL_NAMES;
    canvasSize: Vec2;
    private workSpaceSize: Vec2;
    previewSize: Vec2;
    previewDiv: HTMLDivElement;

    // TODO -> Add missing keys for new tools as we create them
    keyToolMapping: Map<string, string> = new Map([
        ['c', this.toolNames.PENCIL_TOOL_NAME],
        ['w', this.toolNames.BRUSH_TOOL_NAME],
        ['1', this.toolNames.SQUARE_TOOL_NAME],
        ['2', this.toolNames.CIRCLE_TOOL_NAME],
        ['e', this.toolNames.LINE_TOOL_NAME],
        ['p', this.toolNames.ERASER_TOOL_NAME],
    ]);

    constructor(public toolSelectionService: ToolSelectionService, public resizeDrawingService: ResizeDrawingService) {
        this.canvasSize = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
        this.previewSize = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
        this.workSpaceSize = { x: MINIMUM_WORKSPACE_WIDTH, y: MINIMUM_WORKSPACE_HEIGHT };
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const workspaceElement: HTMLElement = document.querySelector('#workSpace') as HTMLElement;
            this.workSpaceSize.x = workspaceElement.offsetWidth;
            this.workSpaceSize.y = workspaceElement.offsetHeight;
            this.previewDiv = document.querySelector('#previewDiv') as HTMLDivElement;
            this.previewDiv.style.display = 'none';
            this.previewDiv.style.borderWidth = '1px';
            this.previewDiv.style.borderColor = '#09acd9';
            this.previewDiv.style.borderStyle = 'dashed';
            this.previewDiv.style.position = 'absolute';
            this.setDefaultCanvasSize();
        });
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent): void {
        const keyName: string | undefined = this.keyToolMapping.get(event.key.toString());
        if (keyName) {
            (document.querySelector('#' + keyName) as HTMLElement).click();
        } else {
            this.toolSelectionService.currentTool.onKeyUp(event);
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        this.toolSelectionService.currentTool.onKeyDown(event);
    }

    onMouseDown(event: MouseEvent): void {
        this.previewDiv.style.display = 'block';
        this.resizeDrawingService.onMouseDown(event);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.resizeDrawingService.resizeCanvas(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.resizeDrawingService.onMouseUp()) {
            const tempCanvas: HTMLCanvasElement = document.createElement('canvas');
            tempCanvas.width = this.canvasSize.x;
            tempCanvas.height = this.canvasSize.y;
            const tempCanvasCtx: CanvasRenderingContext2D = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
            tempCanvasCtx.drawImage(this.drawingComponent.baseCanvas.nativeElement, 0, 0);

            this.canvasSize.x = this.previewSize.x;
            this.canvasSize.y = this.previewSize.y;
            this.previewDiv.style.display = 'none';

            setTimeout(() => {
                this.drawingComponent.baseCtx.drawImage(tempCanvas, 0, 0);
            });
        }
    }

    private setDefaultCanvasSize(): void {
        this.previewSize = this.resizeDrawingService.setDefaultCanvasSize(this.workSpaceSize);
        this.canvasSize.x = this.previewSize.x;
        this.canvasSize.y = this.previewSize.y;
    }
}

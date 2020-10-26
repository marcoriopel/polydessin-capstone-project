import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { CanvasResizingPoints, CANVAS_RESIZING_POINTS } from '@app/ressources/global-variables/canvas-resizing-points';
import {
    MINIMUM_CANVAS_HEIGHT,
    MINIMUM_CANVAS_WIDTH,
    MINIMUM_WORKSPACE_HEIGHT,
    MINIMUM_WORKSPACE_WIDTH,
} from '@app/ressources/global-variables/global-variables';
import { ToolNames, TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    @ViewChild('drawingComponent', { static: false }) drawingComponent: DrawingComponent;

    workSpaceSize: Vec2 = { x: MINIMUM_WORKSPACE_WIDTH, y: MINIMUM_WORKSPACE_HEIGHT };
    previewSize: Vec2 = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
    canvasSize: Vec2 = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
    canvasResizingPoints: CanvasResizingPoints = CANVAS_RESIZING_POINTS;
    toolNames: ToolNames = TOOL_NAMES;
    previewDiv: HTMLDivElement;

    // TODO -> Add missing keys for new tools as we create them
    keyToolMapping: Map<string, string> = new Map([
        ['c', this.toolNames.PENCIL_TOOL_NAME],
        ['w', this.toolNames.BRUSH_TOOL_NAME],
        ['1', this.toolNames.SQUARE_TOOL_NAME],
        ['2', this.toolNames.CIRCLE_TOOL_NAME],
        ['l', this.toolNames.LINE_TOOL_NAME],
        ['b', this.toolNames.FILL_TOOL_NAME],
        ['e', this.toolNames.ERASER_TOOL_NAME],
        ['i', this.toolNames.PIPETTE_TOOL_NAME],
        ['3', this.toolNames.POLYGONE_TOOL_NAME],
    ]);

    constructor(
        public toolSelectionService: ToolSelectionService,
        public resizeDrawingService: ResizeDrawingService,
        public newDrawingService: NewDrawingService,
    ) {
        this.resizeDrawingService.workSpaceSize = this.workSpaceSize;
        this.resizeDrawingService.previewSize = this.previewSize;
        this.resizeDrawingService.canvasSize = this.canvasSize;
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
            this.resizeDrawingService.setDefaultCanvasSize();
        });
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        const keyName: string | undefined = this.keyToolMapping.get(event.key.toString());
        if (keyName) {
            (document.querySelector('#' + keyName) as HTMLElement).click();
        } else {
            this.toolSelectionService.currentTool.onKeyUp(event);
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'o' && event.ctrlKey) {
            event.preventDefault();
            this.newDrawingService.openWarning();
        } else {
            this.toolSelectionService.currentTool.onKeyDown(event);
        }
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
        this.resizeDrawingService.onMouseUp();
        this.previewDiv.style.display = 'none';
    }
}

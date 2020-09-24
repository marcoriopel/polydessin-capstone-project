import { AfterViewInit, Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
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
    toolNames: ToolNames = TOOL_NAMES;
    canvasSize: Vec2;
    private workSpaceSize: Vec2;

    constructor(public toolSelectionService: ToolSelectionService, public resizeDrawingService: ResizeDrawingService) {
        this.canvasSize = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
        this.workSpaceSize = { x: MINIMUM_WORKSPACE_WIDTH, y: MINIMUM_WORKSPACE_HEIGHT };
    }

    // TODO -> Add missing keys for new tools as we create them
    keyToolMapping: Map<string, string> = new Map([
        ['c', this.toolNames.PENCIL_TOOL_NAME],
        ['w', this.toolNames.BRUSH_TOOL_NAME],
        ['1', this.toolNames.SQUARE_TOOL_NAME],
        ['2', this.toolNames.CIRCLE_TOOL_NAME],
        ['e', this.toolNames.LINE_TOOL_NAME],
        ['p', this.toolNames.ERASER_TOOL_NAME],
    ]);

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

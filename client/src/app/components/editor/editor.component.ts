import { Component, HostListener } from '@angular/core';
import { ToolNames, TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(public toolSelectionService: ToolSelectionService) {}
    toolNames: ToolNames = TOOL_NAMES;

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
}

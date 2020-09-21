import { Component, HostListener } from '@angular/core';
import { TOOL_NAMES } from '@app/../ressources/global-variables';
import { ToolNames } from '@app/classes/tool-names';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(public toolSelectionService: ToolSelectionService) {}
    toolNames: ToolNames = TOOL_NAMES;

    // tslint:disable-next-line: cyclomatic-complexity
    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case 'c': {
                const tool = document.querySelector('#' + this.toolNames.PENCIL_TOOL_NAME) as HTMLElement;
                tool.click();
                return;
            }
            case 'w': {
                const tool = document.querySelector('#' + this.toolNames.BRUSH_TOOL_NAME) as HTMLElement;
                tool.click();
                return;
            }
            case '1': {
                const tool = document.querySelector('#' + this.toolNames.SQUARE_TOOL_NAME) as HTMLElement;
                tool.click();
                return;
            }
            case '2': {
                const tool = document.querySelector('#' + this.toolNames.CIRCLE_TOOL_NAME) as HTMLElement;
                tool.click();
                return;
            }
            case 'e': {
                const tool = document.querySelector('#' + this.toolNames.ERASER_TOOL_NAME) as HTMLElement;
                tool.click();
                return;
            }
            case 'l': {
                const tool = document.querySelector('#' + this.toolNames.LINE_TOOL_NAME) as HTMLElement;
                tool.click();
                return;
            }
            case 'p': {
                // TODO PLUME
                return;
            }
            case 'a': {
                // TODO AEROSOL
                return;
            }
            case '3': {
                // TODO POLYGONE
                return;
            }
            case 't': {
                // TODO TEXTE
                return;
            }
            case 'b': {
                // TODO SCEAU PEINTURE
                return;
            }
            case 'd': {
                // TODO ETAMPE
                return;
            }
            case 'i': {
                // TODO PIPETTE
                return;
            }
            case 'r': {
                // TODO RECTANGLE SELECTION
                return;
            }
            case 's': {
                // TODO ELLIPSE SELECTION
                return;
            }
            case 'v': {
                // TODO BAGUETTE MAGIQUE
                return;
            }
        }
        this.toolSelectionService.currentTool.onKeyUp(event);
    }
    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        this.toolSelectionService.currentTool.onKeyDown(event);
    }
}

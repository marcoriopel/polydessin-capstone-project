import { Component, HostListener } from '@angular/core';
import { TOOL_NAMES } from '@app/../ressources/global-variables';
import { ToolNames } from '@app/classes/toolNames';
import { ToolSelectionService } from '@app/services/tool-selection.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(public toolSelectionService: ToolSelectionService) {}
    toolNames: ToolNames = TOOL_NAMES;

    @HostListener('document:keypress', ['$event'])
    handleKeyPress(event: KeyboardEvent): void {
        switch (event.key) {
            case 'c': {
                const tool = document.querySelector('#' + this.toolNames.PENCIL_TOOL_NAME) as HTMLElement;
                tool.click();
                break;
            }
            case 'w': {
                const tool = document.querySelector('#' + this.toolNames.BRUSH_TOOL_NAME) as HTMLElement;
                tool.click();
                break;
            }
            case '1': {
                const tool = document.querySelector('#' + this.toolNames.SQUARE_TOOL_NAME) as HTMLElement;
                tool.click();
                break;
            }
            case '2': {
                const tool = document.querySelector('#' + this.toolNames.CIRCLE_TOOL_NAME) as HTMLElement;
                tool.click();
                break;
            }
            case 'e': {
                const tool = document.querySelector('#' + this.toolNames.ERASER_TOOL_NAME) as HTMLElement;
                tool.click();
                break;
            }
            case 'l': {
                const tool = document.querySelector('#' + this.toolNames.LINE_TOOL_NAME) as HTMLElement;
                tool.click();
                break;
            }
            case 'p': {
                // TODO PLUME
                break;
            }
            case 'a': {
                // TODO AEROSOL
                break;
            }
            case '3': {
                // TODO POLYGONE
                break;
            }
            case 't': {
                // TODO TEXTE
                break;
            }
            case 'b': {
                // TODO SCEAU PEINTURE
                break;
            }
            case 'd': {
                // TODO ETAMPE
                break;
            }
            case 'i': {
                // TODO PIPETTE
                break;
            }
            case 'r': {
                // TODO RECTANGLE SELECTION
                break;
            }
            case 's': {
                // TODO ELLIPSE SELECTION
                break;
            }
            case 'v': {
                // TODO BAGUETTE MAGIQUE
                break;
            }
        }
    }
}

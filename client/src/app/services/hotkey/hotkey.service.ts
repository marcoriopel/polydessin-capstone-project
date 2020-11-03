import { Injectable } from '@angular/core';
import { SidebarElements, SIDEBAR_ELEMENTS } from '@app/ressources/global-variables/sidebar-elements';
import { ToolNames, TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HotkeyService {
    toolName: Subject<string> = new Subject<string>();
    toolNames: ToolNames = TOOL_NAMES;
    sidebarElements: SidebarElements = SIDEBAR_ELEMENTS;
    isHotkeyEnabled: boolean = true;
    keyMapping: Map<string, string> = new Map([
        ['c', this.toolNames.PENCIL_TOOL_NAME],
        ['w', this.toolNames.BRUSH_TOOL_NAME],
        ['1', this.toolNames.SQUARE_TOOL_NAME],
        ['2', this.toolNames.CIRCLE_TOOL_NAME],
        ['l', this.toolNames.LINE_TOOL_NAME],
        ['b', this.toolNames.FILL_TOOL_NAME],
        ['e', this.toolNames.ERASER_TOOL_NAME],
        ['r', this.toolNames.SQUARE_SELECTION_TOOL_NAME],
        ['s', this.toolNames.CIRCLE_SELECTION_TOOL_NAME],
    ]);
    keysNeedCtrl: Map<string, string> = new Map([
        ['o', this.sidebarElements.NEW_DRAWING_NAME],
        ['g', this.sidebarElements.CAROUSEL_NAME],
        ['s', this.sidebarElements.SAVE_SERVER_NAME],
    ]);

    constructor() {
        this.isHotkeyEnabled = true;
    }

    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.isHotkeyEnabled) {
            if (event.ctrlKey) {
                const keyName: string | undefined = this.keysNeedCtrl.get(event.key.toString());
                if (keyName) {
                    this.toolName.next(keyName);
                }
            } else {
                const keyName: string | undefined = this.keyMapping.get(event.key.toString());
                if (keyName){
                    this.toolName.next(keyName);
                }
            }
        }
    }
    getKey(): Observable<string> {
        return this.toolName.asObservable();
    }
}

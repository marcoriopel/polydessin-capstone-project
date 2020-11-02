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
        ['o', this.sidebarElements.NEW_DRAWING_NAME],
        ['g', this.sidebarElements.CAROUSEL_NAME],
        ['s', this.sidebarElements.SAVE_SERVER_NAME],
    ]);
    keysNeedCtrl: string[] = [this.sidebarElements.NEW_DRAWING_NAME, this.sidebarElements.CAROUSEL_NAME, this.sidebarElements.SAVE_SERVER_NAME];

    constructor() {
        this.isHotkeyEnabled = true;
    }

    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isHotkeyEnabled) return;
        const keyName: string | undefined = this.keyMapping.get(event.key.toString());
        if (!keyName) return;
        if (!this.keysNeedCtrl.includes(keyName) || (this.keysNeedCtrl.includes(keyName) && event.ctrlKey)) {
            this.toolName.next(keyName);
        }
    }
    getKey(): Observable<string> {
        return this.toolName.asObservable();
    }
}

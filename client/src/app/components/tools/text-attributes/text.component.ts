import { Component, OnDestroy, OnInit } from '@angular/core';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-text-attributes',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit, OnDestroy {
    constructor(public textService: TextService, public hotkeyService: HotkeyService) {}

    ngOnInit(): void {
        this.hotkeyService.isHotkeyEnabled = false;
    }

    ngOnDestroy(): void {
        this.hotkeyService.isHotkeyEnabled = true;
    }
}

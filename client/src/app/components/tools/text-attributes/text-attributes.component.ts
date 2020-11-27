import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { FONT, Font } from '@app/ressources/global-variables/text';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-text-attributes',
    templateUrl: './text-attributes.component.html',
    styleUrls: ['./text-attributes.component.scss'],
})
export class TextComponent implements OnDestroy, AfterViewInit {
    textSize: number;
    fontStyle: Font = {
        GEORGIA: FONT.GEORGIA,
        ARIAL: FONT.ARIAL,
        TIME_NEW_ROMAN: FONT.TIME_NEW_ROMAN,
        VERDANA: FONT.VERDANA,
        COURIER_NEW: FONT.COURIER_NEW,
    };
    constructor(public textService: TextService, public hotkeyService: HotkeyService) {
        this.textSize = this.textService.size;
    }

    changeFont(font: MatSelectChange): void {
        this.textService.setFont(font.value);
    }

    changeSize(size: number): void {
        this.textSize = size;
        this.textService.setSize(size);
    }

    changeItalic(style: boolean): void {
        if (style) {
            this.textService.setStyle('italic');
        } else {
            this.textService.setStyle('normal');
        }
    }

    changeBoldText(bold: boolean): void {
        if (bold) {
            this.textService.setBoldText('bold');
        } else {
            this.textService.setBoldText('normal');
        }
    }

    changeAlignment(align: string): void {
        this.textService.setAlignment(align as CanvasTextAlign);
    }

    ngOnDestroy(): void {
        this.textService.createText();
        this.textService.destroy();
    }

    ngAfterViewInit(): void {
        this.hotkeyService.getEventKey().subscribe((event) => {
            if (this.hotkeyService.isTextTool) {
                this.textService.onKeyDown(event);
            }
        });
    }
}

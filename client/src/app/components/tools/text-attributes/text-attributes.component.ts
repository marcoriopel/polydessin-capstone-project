import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { SIZE_STEP } from '@app/ressources/global-variables/global-variables';
import { FONTS, Fonts } from '@app/ressources/global-variables/text';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-text-attributes',
    templateUrl: './text-attributes.component.html',
    styleUrls: ['./text-attributes.component.scss'],
})
export class TextComponent implements OnDestroy {
    @ViewChild('textSizeInput', { read: ElementRef }) textSizeInput: ElementRef;
    textSize: number;
    fontStyle: Fonts = {
        GEORGIA: FONTS.GEORGIA,
        ARIAL: FONTS.ARIAL,
        TIME_NEW_ROMAN: FONTS.TIME_NEW_ROMAN,
        VERDANA: FONTS.VERDANA,
        COURIER_NEW: FONTS.COURIER_NEW,
    };
    constructor(public textService: TextService, public hotkeyService: HotkeyService) {
        this.textSize = this.textService.size;
    }

    changeFont(font: string): void {
        this.textService.font = font;
        this.textService.applyTextStyle();
    }

    decrementSize(): void {
        if (this.textSize > this.textService.minSize) {
            this.changeSize(this.textSize - SIZE_STEP);
        }
    }

    incrementSize(): void {
        if (this.textSize < this.textService.maxSize) {
            this.changeSize(this.textSize + SIZE_STEP);
        }
    }

    changeSize(size: number): void {
        size = Number(size);
        this.textSize = size;
        this.textService.size = size;
        this.textService.applyTextStyle();
    }

    changeItalic(style: boolean): void {
        if (style) {
            this.textService.italicText = 'italic';
        } else {
            this.textService.italicText = 'normal';
        }
        this.textService.applyTextStyle();
    }

    changeBoldText(bold: boolean): void {
        if (bold) {
            this.textService.boldText = 'bold';
        } else {
            this.textService.boldText = 'normal';
        }
        this.textService.applyTextStyle();
    }

    changeAlignment(align: string): void {
        this.textService.align = align as CanvasTextAlign;
        this.textService.applyTextStyle();
    }

    ngOnDestroy(): void {
        this.textService.createText();
    }

    onFocus(): void {
        this.hotkeyService.isHotkeyEnabled = false;
        this.textService.isWritingEnable = false;
    }

    onFocusOut(): void {
        this.textService.isWritingEnable = true;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.textSizeInput.nativeElement.blur();
            event.stopPropagation();
        }
    }
}

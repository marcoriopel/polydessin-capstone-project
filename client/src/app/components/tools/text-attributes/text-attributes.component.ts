import { Component, OnDestroy } from '@angular/core';
import { SIZE_STEP } from '@app/ressources/global-variables/global-variables';
import { FONTS, Fonts } from '@app/ressources/global-variables/text';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-text-attributes',
    templateUrl: './text-attributes.component.html',
    styleUrls: ['./text-attributes.component.scss'],
})
export class TextComponent implements OnDestroy {
    textSize: number;
    fontStyle: Fonts = {
        GEORGIA: FONTS.GEORGIA,
        ARIAL: FONTS.ARIAL,
        TIME_NEW_ROMAN: FONTS.TIME_NEW_ROMAN,
        VERDANA: FONTS.VERDANA,
        COURIER_NEW: FONTS.COURIER_NEW,
    };
    constructor(public textService: TextService) {
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
}

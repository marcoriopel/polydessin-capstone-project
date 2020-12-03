import { Component, OnDestroy } from '@angular/core';
import { FONT, Font } from '@app/ressources/global-variables/text';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-text-attributes',
    templateUrl: './text-attributes.component.html',
    styleUrls: ['./text-attributes.component.scss'],
})
export class TextComponent implements OnDestroy {
    textSize: number;
    fontStyle: Font = {
        GEORGIA: FONT.GEORGIA,
        ARIAL: FONT.ARIAL,
        TIME_NEW_ROMAN: FONT.TIME_NEW_ROMAN,
        VERDANA: FONT.VERDANA,
        COURIER_NEW: FONT.COURIER_NEW,
    };
    constructor(public textService: TextService) {
        this.textSize = this.textService.size;
    }

    changeFont(font: string): void {
        console.log(font);
        this.textService.font = font;
        this.textService.applyTextStyle();
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

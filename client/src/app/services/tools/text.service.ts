import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ARROW_KEYS } from '@app/ressources/global-variables/arrow-keys';
import { MARGIN, MAX_TEXT_TOOL_SIZE, MIN_TEXT_TOOL_SIZE } from '@app/ressources/global-variables/global-variables';
import { AUTHORIZED_KEY } from '@app/ressources/global-variables/text';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    minSize: number = MIN_TEXT_TOOL_SIZE;
    maxSize: number = MAX_TEXT_TOOL_SIZE;
    name: string = TOOL_NAMES.TEXT_TOOL_NAME;
    text: string[];
    indexText: number = 0;
    color: string;
    textStartingPoint: Vec2 = { x: 0, y: 0 };
    isNewText: boolean = false;
    font: string = 'Georgia';
    size: number = 30;
    style: string = 'normal';
    boldText: string = 'normal';
    align: CanvasTextAlign = 'start';
    height: number;
    width: number = 0;
    isDelete: boolean = false;
    isShiftKeyPress: boolean = false;

    constructor(drawingService: DrawingService, public hotkeyService: HotkeyService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }

    initializeNewText(): void {
        this.hotkeyService.isTextTool = true;
        this.color = this.colorSelectionService.primaryColor;
        this.text = [];
        this.text.push('|');
        this.isNewText = true;
        this.applyFont();
    }

    destroy(): void {
        this.text = [];
        this.isNewText = false;
        this.indexText = 0;
        this.hotkeyService.isTextTool = false;
    }
    onMouseDown(event: MouseEvent): void {
        if (this.isInText(this.getPositionFromMouse(event))) return;
        if (!this.isNewText) {
            this.initializeNewText();
            const mousePosition = this.getPositionFromMouse(event);
            this.textStartingPoint = { x: mousePosition.x, y: mousePosition.y };
        } else {
            this.createText();
            this.destroy();
        }
    }

    onMouseLeave(): void {
        this.createText();
        this.destroy();
    }

    isInText(mousePosition: Vec2): boolean {
        if (this.text === undefined) return false;
        let maxLine = [];
        let line = [];
        let numberOfLine = 1;
        for (const char of this.text) {
            if (char === 'enter') {
                numberOfLine++;
                if (maxLine.length < line.length) {
                    maxLine = line;
                }
                line = [];
                length = 0;
            } else {
                line.push(char);
            }
        }
        if (numberOfLine === 1) maxLine = line;
        const selectionWidth = this.width * maxLine.length + this.textStartingPoint.x;
        const selectionHeight = this.height * numberOfLine + this.textStartingPoint.y;
        if (
            mousePosition.x >= this.textStartingPoint.x &&
            mousePosition.x <= selectionWidth &&
            mousePosition.y >= this.textStartingPoint.y &&
            mousePosition.y <= selectionHeight
        ) {
            return true;
        } else {
            return false;
        }
    }

    createText(): void {
        this.removeIndicator();
        this.printText();
        this.drawingService.applyPreview();
    }

    onMouseEnter(): void {
        this.color = this.colorSelectionService.primaryColor;
    }

    onKeyDown(event: KeyboardEvent): void {
        this.insertLetter(event);

        switch (event.key) {
            case 'Backspace':
                this.deleteLetter(this.indexText - 1);
                break;
            case 'Delete':
                this.isDelete = true;
                this.deleteLetter(this.indexText - 1);
                break;
            case ARROW_KEYS.LEFT:
                if (this.indexText > 0) {
                    this.moveIndicator(-1);
                }
                break;
            case ARROW_KEYS.RIGHT:
                if (this.indexText + 1 < this.text.length) {
                    this.moveIndicator(1);
                }
                break;
            case ARROW_KEYS.UP:
                if (!this.isInFirstLine()) {
                    this.moveIndicatorUpAndDown('UP');
                }
                break;
            case ARROW_KEYS.DOWN:
                if (!this.isInLastLine()) {
                    this.moveIndicatorUpAndDown('DOWN');
                }
                break;
            case 'Escape':
                this.createText();
                this.destroy();
                break;
            case 'Alt':
                event.preventDefault();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.printText();
        if (event.key === 'Shift') {
            this.isShiftKeyPress = false;
        }
    }

    moveIndicatorUpAndDown(mouvement: string): void {
        const lines = [];
        let line = '';
        let numberLine = 0;
        let indexInLine = 0;
        let i = 0;
        let j = 0;
        for (const letter of this.text) {
            if (letter === 'Enter') {
                lines.push(line);
                line = '';
                j = 0;
                i++;
            } else {
                line += letter;
                j++;
            }
            if (letter === '|') {
                numberLine = i;
                indexInLine = j;
            }
        }
        lines.push(line);

        if (mouvement === 'UP') {
            if (lines[numberLine - 1].length < indexInLine - 1) {
                this.indexText -= indexInLine;
            } else {
                this.indexText -= indexInLine + 1;
                this.indexText -= lines[numberLine - 1].length - indexInLine;
            }
        } else {
            if (lines[numberLine + 1].length < indexInLine - 1) {
                this.indexText += lines[numberLine].length - indexInLine;
                this.indexText += lines[numberLine + 1].length + 1;
            } else {
                this.indexText += lines[numberLine].length - indexInLine;
                this.indexText += indexInLine;
            }
        }
        this.removeIndicator();
        this.insertText(this.indexText, '|');
    }

    isInFirstLine(): boolean {
        const indexEnter = this.text.indexOf('Enter');
        if (indexEnter > this.indexText || indexEnter < 0) {
            return true;
        } else {
            return false;
        }
    }

    isInLastLine(): boolean {
        const indexEnter = this.text.lastIndexOf('Enter');
        console.log(indexEnter);
        if (indexEnter < this.indexText || indexEnter < 0) {
            return true;
        } else {
            return false;
        }
    }

    insertLetter(event: KeyboardEvent): void {
        if (!this.isNumberAndLetter(event)) return;
        if (event.key === 'Shift') return;
        if (this.indexText === this.text.length - 1) {
            this.text.pop();
            this.text.push(event.key);
            this.text.push('|');
            ++this.indexText;
        } else {
            const newText = [];
            let i = 0;
            for (const char of this.text) {
                if (i === this.indexText) {
                    newText.push(event.key);
                }
                newText.push(char);
                i++;
            }
            this.text = newText;
            this.indexText++;
        }
    }

    deleteLetter(index: number): void {
        if (index < 0 && !this.isDelete) return;
        if (index >= this.text.length && this.isDelete) {
            this.isDelete = false;
            return;
        }
        const newText = [];
        let i = 0;
        for (const char of this.text) {
            if (i !== index) {
                newText.push(char);
            }
            i++;
        }
        this.text = newText;
        this.indexText--;
    }

    removeIndicator(): void {
        const newText = [];
        for (const char of this.text) {
            if (char !== '|') {
                newText.push(char);
            }
        }
        this.text = newText;
    }

    printText(): void {
        if (this.text === undefined) return;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        let line = '';
        let lineHeight = this.textStartingPoint.y + this.height;
        for (const char of this.text) {
            if (char === 'Enter') {
                this.drawingService.previewCtx.fillText(line, this.textStartingPoint.x, lineHeight);
                lineHeight += this.height + MARGIN;
                line = '';
            } else {
                line += char;
            }
        }
        this.drawingService.previewCtx.fillText(line, this.textStartingPoint.x, lineHeight);
    }

    moveIndicator(interval: number): void {
        this.removeIndicator();
        this.indexText = this.indexText + interval;

        this.insertText(this.indexText, '|');
    }

    insertText(index: number, item: string): void {
        if (this.indexText >= this.text.length) {
            this.text.push('|');
            return;
        }
        const newText = [];
        let j = 0;
        for (const char of this.text) {
            if (j === index) {
                newText.push(item);
            }
            newText.push(char);
            j++;
        }
        this.text = newText;
    }

    applyFont(): void {
        const textTest = 'wWmML';
        this.drawingService.previewCtx.fillStyle = this.color;
        this.drawingService.previewCtx.font = this.style + ' ' + this.boldText + ' ' + this.size.toString() + 'px ' + this.font;
        this.drawingService.previewCtx.textAlign = this.align;
        const metrics = this.drawingService.previewCtx.measureText(textTest);
        this.height = metrics.actualBoundingBoxAscent;
        this.width = metrics.width / textTest.length;
    }

    isNumberAndLetter(event: KeyboardEvent): boolean {
        const isLetter = event.key >= 'a' && event.key <= 'z';
        const isNumber = event.key >= '0' && event.key <= '9';
        if (isLetter || isNumber) return true;
        else if (AUTHORIZED_KEY.includes(event.key)) return true;
        else if (event.key === 'Enter' || event.key === ' ') return true;
        else return false;
    }

    setFont(font: string): void {
        this.font = font;
        this.applyFont();
        this.printText();
    }
    setSize(size: number): void {
        this.size = size;
        this.applyFont();
        this.printText();
    }

    setStyle(style: string): void {
        this.style = style;
        this.applyFont();
        this.printText();
    }

    setBoldText(bold: string): void {
        this.boldText = bold;
        this.applyFont();
        this.printText();
    }

    setAlignment(align: CanvasTextAlign): void {
        this.align = align;
        this.applyFont();
        this.printText();
    }
}

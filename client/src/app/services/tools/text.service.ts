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
    isDelete: boolean = false;
    maxLine: string;
    numberLine: number = 0;

    constructor(drawingService: DrawingService, public hotkeyService: HotkeyService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }

    initializeNewText(): void {
        this.hotkeyService.isTextTool = true;
        this.color = this.colorSelectionService.primaryColor;
        this.text = [];
        this.isNewText = true;
        this.text.push('|');
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
            const mousePosition = this.getPositionFromMouse(event);
            this.textStartingPoint = { x: mousePosition.x, y: mousePosition.y };
            this.initializeNewText();
        } else {
            this.createText();
        }
    }

    onMouseLeave(): void {
        this.createText();
    }

    isInText(mousePosition: Vec2): boolean {
        if (this.text === undefined) return false;
        const selectionWidth = this.calculateWidth(this.maxLine, this.textStartingPoint.x);
        const selectionHeight = this.height * this.numberLine + this.textStartingPoint.y;
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
        this.destroy();
    }

    onMouseEnter(): void {
        this.color = this.colorSelectionService.primaryColor;
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Backspace':
                this.deleteLetter(this.indexText - 1);
                this.indexText--;
                break;
            case 'Delete':
                this.isDelete = true;
                this.deleteLetter(this.indexText + 1);
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
                break;
            case 'Alt':
                event.preventDefault();
                break;
            default:
                this.insertLetter(event.key);
                this.indexText++;
                break;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.printText();
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
        this.insertLetter('|');
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
        if (indexEnter < this.indexText || indexEnter < 0) {
            return true;
        } else {
            return false;
        }
    }

    insertLetter(item: string): void {
        console.log('hi');
        if (!this.isNumberAndLetter(item)) return;
        if (item === 'Shift') return;
        if (item === '|' && this.indexText >= this.text.length) {
            this.text.push('|');
        } else if (this.indexText >= this.text.length) {
            this.text.pop();
            this.text.push(item);
            this.text.push('|');
        } else {
            const newText = [];
            let i = 0;
            for (const char of this.text) {
                if (i === this.indexText) {
                    newText.push(item);
                }
                newText.push(char);
                i++;
            }
            this.text = newText;
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
        let numberLine = 1;
        let maxLine = '';
        if (this.text === undefined) return;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        let line = '';
        let lineHeight = this.textStartingPoint.y + this.height;
        let lineWidth = this.textStartingPoint.x;
        for (const char of this.text) {
            if (char === 'Enter') {
                numberLine++;
                this.drawingService.previewCtx.fillText(line, lineWidth, lineHeight);
                lineHeight += this.height + MARGIN;
                if (line.length > maxLine.length) maxLine = line;
                line = '';
                lineWidth = this.textStartingPoint.x;
            } else if (char === '|' && this.align === 'start') {
                this.drawingService.previewCtx.fillText(line, this.textStartingPoint.x, lineHeight);
                lineWidth = this.calculateWidth(line, lineWidth);
                line = '';
                this.printCursor(lineWidth, lineHeight);
                lineWidth = this.calculateWidth('|', lineWidth);
            } else {
                line += char;
            }
        }
        if (maxLine.length === 0) maxLine = line;
        this.drawingService.previewCtx.fillText(line, lineWidth, lineHeight);
        this.maxLine = maxLine;
        this.numberLine = numberLine;
    }

    printCursorLine(line: string, lineAfterCursor: string, lineBefore: string, lineHeight: number): void {
        let lineWidth = 0;
        if (this.align === 'center') {
            lineWidth =
                this.textStartingPoint.x -
                this.drawingService.previewCtx.measureText(line).actualBoundingBoxLeft +
                this.drawingService.previewCtx.measureText(lineBefore).width / 2;
            this.drawingService.previewCtx.fillText(lineBefore, lineWidth, lineHeight);
            this.printCursor(lineWidth + this.drawingService.previewCtx.measureText(lineBefore).width / 2, lineHeight);
            lineWidth += this.drawingService.previewCtx.measureText(lineAfterCursor).width / 2;
        } else if (this.align === 'end') {
            lineWidth =
                this.textStartingPoint.x -
                this.drawingService.previewCtx.measureText(line).actualBoundingBoxLeft +
                this.drawingService.previewCtx.measureText(lineBefore).width;
            this.drawingService.previewCtx.fillText(lineBefore, lineWidth, lineHeight);
            this.printCursor(lineWidth + this.drawingService.previewCtx.measureText('|').width, lineHeight);
            lineWidth = this.textStartingPoint.x;
        } else {
            lineWidth = this.textStartingPoint.x;
            this.drawingService.previewCtx.fillText(lineBefore, lineWidth, lineHeight);
            lineWidth += this.drawingService.previewCtx.measureText(lineBefore).width;
            this.printCursor(lineWidth, lineHeight);
            lineWidth += this.drawingService.previewCtx.measureText('|').width;
        }
        this.drawingService.previewCtx.fillText(lineAfterCursor, lineWidth, lineHeight);
    }

    printCursor(lineWidth: number, lineHeight: number): void {
        const fillStyle = this.drawingService.previewCtx.fillStyle;
        this.drawingService.previewCtx.fillStyle = '#000000';
        this.drawingService.previewCtx.fillText('|', lineWidth, lineHeight);
        this.drawingService.previewCtx.fillStyle = fillStyle;
    }

    calculateWidth(text: string, lineWidth: number): number {
        return lineWidth + this.drawingService.previewCtx.measureText(text).width;
    }

    moveIndicator(interval: number): void {
        this.removeIndicator();
        this.indexText = this.indexText + interval;
        this.insertLetter('|');
    }

    applyFont(): void {
        const textTest = 'wWmML';
        this.drawingService.previewCtx.fillStyle = this.color;
        this.drawingService.previewCtx.font = this.style + ' ' + this.boldText + ' ' + this.size.toString() + 'px ' + this.font;
        this.drawingService.previewCtx.textAlign = this.align;
        const metrics = this.drawingService.previewCtx.measureText(textTest);
        this.height = metrics.actualBoundingBoxAscent;
        this.printText();
    }

    isNumberAndLetter(key: string): boolean {
        const isLetter = key >= 'a' && key <= 'z';
        const isNumber = key >= '0' && key <= '9';
        if (isLetter || isNumber) return true;
        else if (AUTHORIZED_KEY.includes(key)) return true;
        else if (key === 'Enter' || key === ' ') return true;
        else return false;
    }
}

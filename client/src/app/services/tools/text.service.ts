import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ARROW_KEYS } from '@app/ressources/global-variables/arrow-keys';
import { MARGIN, MAX_TEXT_TOOL_SIZE, MIN_TEXT_TOOL_SIZE, MouseButton } from '@app/ressources/global-variables/global-variables';
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
        if (this.isInText(this.getPositionFromMouse(event)) || event.button === MouseButton.RIGHT) {
            return;
        }
        if (!this.isNewText) {
            const mousePosition = this.getPositionFromMouse(event);
            this.textStartingPoint = { x: mousePosition.x, y: mousePosition.y };
            this.initializeNewText();
        } else {
            this.createText();
        }
    }

    isInText(mousePosition: Vec2): boolean {
        if (this.text === undefined) return false;
        const selectionWidth = this.textStartingPoint.x + this.drawingService.previewCtx.measureText(this.maxLine).width;
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
        this.applyFont();
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Backspace':
                this.isDelete = false;
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
                if (this.isNumberAndLetter(event.key)) {
                    this.insertLetter(event.key);
                    this.indexText++;
                }
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
        if (item === '|' && this.indexText >= this.text.length) {
            this.text.push('|');
        } else if (this.indexText >= this.text.length) {
            // est ce que je peux l'enlever?
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
        if (index < 0 && this.isDelete) return;
        if (index >= this.text.length && !this.isDelete) {
            return;
        }
        const beforeItem = this.text.slice(0, index);
        const afterItem = this.text.slice(index + 1);
        this.text = beforeItem.concat(afterItem);
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
        let line: string[] = [];
        let lineHeight = this.textStartingPoint.y + this.height;
        let lineWidth = this.textStartingPoint.x;
        for (const char of this.text) {
            if (char === 'Enter') {
                if (line.indexOf('|') >= 0) {
                    this.printCursorLine(line, lineHeight);
                } else {
                    this.drawingService.previewCtx.fillText(line.join(''), lineWidth, lineHeight);
                }
                numberLine++;
                lineHeight += this.height + MARGIN;
                if (line.length > maxLine.length) maxLine = line.join('');
                line = [];
                lineWidth = this.textStartingPoint.x;
            } else {
                line.push(char);
            }
        }
        if (line.indexOf('|') >= 0) {
            this.printCursorLine(line, lineHeight);
        } else {
            this.drawingService.previewCtx.fillText(line.join(''), lineWidth, lineHeight);
        }
        if (line.length > maxLine.length) maxLine = line.join('');
        this.maxLine = maxLine;
        this.numberLine = numberLine;
    }

    setStratingPoint(line: string[]): number {
        let lineWidth = this.textStartingPoint.x;
        if (this.align === 'center') {
            lineWidth -= this.drawingService.previewCtx.measureText(line.join('')).width / 2;
        } else if (this.align === 'end') {
            lineWidth -= this.drawingService.previewCtx.measureText(line.join('')).width;
        }
        return lineWidth;
    }

    printCursorLine(line: string[], lineHeight: number): void {
        const afterCursor: string[] = line.slice(line.indexOf('|') + 1);
        const beforeCursor = line.slice(0, line.indexOf('|'));
        let lineWidth = this.setStratingPoint(line);
        this.drawingService.previewCtx.textAlign = 'start';
        this.drawingService.previewCtx.fillText(beforeCursor.join(''), lineWidth, lineHeight);
        lineWidth += this.drawingService.previewCtx.measureText(beforeCursor.join('')).width;
        this.printCursor(lineWidth, lineHeight);
        lineWidth += this.drawingService.previewCtx.measureText('|').width;
        this.drawingService.previewCtx.fillText(afterCursor.join(''), lineWidth, lineHeight);
        this.drawingService.previewCtx.textAlign = this.align;
    }

    printCursor(lineWidth: number, lineHeight: number): void {
        const fillStyle = this.drawingService.previewCtx.fillStyle;
        this.drawingService.previewCtx.fillStyle = '#000000';
        this.drawingService.previewCtx.fillText('|', lineWidth, lineHeight);
        this.drawingService.previewCtx.fillStyle = fillStyle;
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
        if (isLetter || isNumber || AUTHORIZED_KEY.includes(key)) return true;
        else return false;
    }
}

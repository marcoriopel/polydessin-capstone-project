import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { ARROW_KEYS } from '@app/ressources/global-variables/arrow-keys';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { ColorSelectionService } from '../color-selection/color-selection.service';
import { DrawingService } from '../drawing/drawing.service';
import { HotkeyService } from '../hotkey/hotkey.service';
import { TextService } from './text.service';

fdescribe('TextService', () => {
    let keyboardEvent: KeyboardEvent;
    let service: TextService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let previewCtxStub: CanvasRenderingContext2D;
    let colorPickerStub: ColorSelectionService;
    let hotkeyServiceStub: HotkeyService;
    let mouseEventLeft: MouseEvent;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'applyPreview']);
        colorPickerStub = new ColorSelectionService();
        hotkeyServiceStub = new HotkeyService();

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ColorSelectionService, useValue: colorPickerStub },
                { provide: HotkeyService, useValue: hotkeyServiceStub },
            ],
        });
        service = TestBed.inject(TextService);

        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        previewCtxStub = canvas.getContext('2d') as CanvasRenderingContext2D;
        // tslint:disable-next-line: no-string-literal
        service['drawingService'].previewCtx = previewCtxStub;
        service.textStartingPoint = { x: 0, y: 0 };
        mouseEventLeft = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.LEFT,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeNewText should initialize as new text', () => {
        const applyFontSpy = spyOn(service, 'applyFont');
        colorPickerStub.primaryColor = '#ffffff';
        const text = ['|'];
        service.initializeNewText();
        expect(hotkeyServiceStub.isTextTool).toEqual(true);
        expect(service.color).toEqual(colorPickerStub.primaryColor);
        expect(service.text).toEqual(text);
        expect(service.isNewText).toEqual(true);
        expect(applyFontSpy).toHaveBeenCalled();
    });

    it('destroy should reinitialize text', () => {
        service.destroy();
        expect(hotkeyServiceStub.isTextTool).toEqual(false);
        expect(service.text).toEqual([]);
        expect(service.isNewText).toEqual(false);
        expect(service.indexText).toEqual(0);
    });

    it('mouseDown should initializeNewtext when is newSelection', () => {
        const initializeSpy = spyOn(service, 'initializeNewText');
        service.isNewText = false;
        const point: Vec2 = { x: mouseEventLeft.offsetX, y: mouseEventLeft.offsetY };
        service.onMouseDown(mouseEventLeft);
        expect(initializeSpy).toHaveBeenCalled();
        expect(service.textStartingPoint).toEqual(point);
    });

    it('mouseDown should call createText when is not a new text', () => {
        const createTextSpy = spyOn(service, 'createText');
        service.isNewText = true;
        service.onMouseDown(mouseEventLeft);
        expect(createTextSpy).toHaveBeenCalled();
    });

    it('mouseDown should call createText when is not a new text', () => {
        const initializeSpy = spyOn(service, 'initializeNewText');
        service.isNewText = false;
        service.text = [];
        service.maxLine = 'allo World';
        service.height = 2;
        service.numberLine = 1;
        service.text = [];
        const mouseEvent = {
            offsetX: 1,
            offsetY: 2,
            button: MouseButton.LEFT,
        } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(initializeSpy).not.toHaveBeenCalled();
    });

    it('Should return true when the mousePosition on the text', () => {
        service.maxLine = 'allo World';
        service.height = 2;
        service.numberLine = 1;
        service.text = ['a', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd'];
        const mousePosition: Vec2 = { x: 2, y: 1 };
        expect(service.isInText(mousePosition)).toEqual(true);
    });

    it('Should return false when the mousePosition not on the text', () => {
        service.maxLine = 'allo World';
        service.height = 2;
        service.numberLine = 1;
        service.text = ['a', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd'];
        const mousePosition: Vec2 = { x: 2, y: 25 };
        expect(service.isInText(mousePosition)).toEqual(false);
    });

    it('createText should removeIndicator, printText and destroy', () => {
        const removeIndicatorSpy = spyOn(service, 'removeIndicator');
        const printTextSpy = spyOn(service, 'printText');
        const destroySpy = spyOn(service, 'destroy');

        service.createText();
        expect(removeIndicatorSpy).toHaveBeenCalled();
        expect(printTextSpy).toHaveBeenCalled();
        expect(drawingServiceSpy.applyPreview).toHaveBeenCalled();
        expect(destroySpy).toHaveBeenCalled();
    });

    it('onMouseEnter should change color', () => {
        service.color = '#000000';
        colorPickerStub.primaryColor = '#ffffff';
        service.onMouseEnter();
        expect(service.color).toEqual(colorPickerStub.primaryColor);
    });

    it('Should call deleteLetter when key is delete', () => {
        service.indexText = 5;
        const deleteLetterSpy = spyOn(service, 'deleteLetter');
        keyboardEvent = new KeyboardEvent('keydown', { key: 'Delete' });
        service.onKeyDown(keyboardEvent);
        expect(service.isDelete).toBeTrue();
        expect(deleteLetterSpy).toHaveBeenCalledWith(6);
    });

    it('Should call deleteLetter when key is Backspace', () => {
        service.indexText = 5;
        const deleteLetterSpy = spyOn(service, 'deleteLetter');
        keyboardEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
        service.onKeyDown(keyboardEvent);
        expect(deleteLetterSpy).toHaveBeenCalledWith(4);
        expect(service.indexText).toEqual(4);
    });

    it('Should call moveIndicator when key is arrow left', () => {
        service.indexText = 5;
        const moveIndicatorSpy = spyOn(service, 'moveIndicator');
        keyboardEvent = new KeyboardEvent('keydown', { key: ARROW_KEYS.LEFT });
        service.onKeyDown(keyboardEvent);
        expect(moveIndicatorSpy).toHaveBeenCalledWith(-1);
    });

    it('Should call not moveIndicator when key is arrow left', () => {
        service.indexText = 0;
        const moveIndicatorSpy = spyOn(service, 'moveIndicator');
        keyboardEvent = new KeyboardEvent('keydown', { key: ARROW_KEYS.LEFT });
        service.onKeyDown(keyboardEvent);
        expect(moveIndicatorSpy).not.toHaveBeenCalledWith(-1);
    });

    it('Should call moveIndicator when key is arrow rigth', () => {
        service.indexText = 4;
        service.text = ['a', 'b', 'c', 'd', 'e', 'f'];
        const moveIndicatorSpy = spyOn(service, 'moveIndicator');
        keyboardEvent = new KeyboardEvent('keydown', { key: ARROW_KEYS.RIGHT });
        service.onKeyDown(keyboardEvent);
        expect(moveIndicatorSpy).toHaveBeenCalledWith(1);
    });

    it('Should call not moveIndicator when key is arrow rigth', () => {
        service.indexText = 6;
        service.text = ['a', 'b', 'c', 'd', 'e', 'f'];
        const moveIndicatorSpy = spyOn(service, 'moveIndicator');
        keyboardEvent = new KeyboardEvent('keydown', { key: ARROW_KEYS.RIGHT });
        service.onKeyDown(keyboardEvent);
        expect(moveIndicatorSpy).not.toHaveBeenCalledWith(1);
    });

    it('Should call moveIndicatorUpAndDown when key is arrow up', () => {
        service.indexText = 4;
        service.text = ['a', 'Enter', 'b', 'c', 'd', 'e', 'f'];
        const moveIndicatorUpAndDownSpy = spyOn(service, 'moveIndicatorUpAndDown');
        keyboardEvent = new KeyboardEvent('keydown', { key: ARROW_KEYS.UP });
        service.onKeyDown(keyboardEvent);
        expect(moveIndicatorUpAndDownSpy).toHaveBeenCalledWith('UP');
    });

    it('Should not call moveIndicatorUpAndDown when is in first line', () => {
        service.indexText = 1;
        service.text = ['a', 'b', 'c', 'd', 'Enter', 'e', 'f'];
        const moveIndicatorUpAndDownSpy = spyOn(service, 'moveIndicatorUpAndDown');
        keyboardEvent = new KeyboardEvent('keydown', { key: ARROW_KEYS.UP });
        service.onKeyDown(keyboardEvent);
        expect(moveIndicatorUpAndDownSpy).not.toHaveBeenCalledWith('UP');
    });

    it('Should call moveIndicatorUpAndDown when key is arrow down', () => {
        service.indexText = 1;
        service.text = ['a', 'Enter', 'b', 'c', 'd', 'e', 'f'];
        const moveIndicatorUpAndDownSpy = spyOn(service, 'moveIndicatorUpAndDown');
        keyboardEvent = new KeyboardEvent('keydown', { key: ARROW_KEYS.DOWN });
        service.onKeyDown(keyboardEvent);
        expect(moveIndicatorUpAndDownSpy).toHaveBeenCalledWith('DOWN');
    });

    it('Should not call moveIndicatorUpAndDown when is in last line', () => {
        service.indexText = 4;
        service.text = ['a', 'Enter', 'b', 'c', 'd', 'e', 'f'];
        const moveIndicatorUpAndDownSpy = spyOn(service, 'moveIndicatorUpAndDown');
        keyboardEvent = new KeyboardEvent('keydown', { key: ARROW_KEYS.DOWN });
        service.onKeyDown(keyboardEvent);
        expect(moveIndicatorUpAndDownSpy).not.toHaveBeenCalledWith('DOWN');
    });

    it('Should call preventDefault when key is Alt', () => {
        keyboardEvent = new KeyboardEvent('keydown', { key: 'Alt' });
        const preventDefaultSpy = spyOn(keyboardEvent, 'preventDefault');
        service.onKeyDown(keyboardEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('Should call createText when key is Escape', () => {
        const createTextSpy = spyOn(service, 'createText');
        keyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        service.onKeyDown(keyboardEvent);
        expect(createTextSpy).toHaveBeenCalled();
    });

    it('Should call insertLetter when it is a letter', () => {
        const insertLetterSpy = spyOn(service, 'insertLetter');
        keyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
        service.onKeyDown(keyboardEvent);
        expect(insertLetterSpy).toHaveBeenCalledWith(keyboardEvent.key);
    });

    it('Should not call insertLetter when it is not a good key', () => {
        const insertLetterSpy = spyOn(service, 'insertLetter');
        keyboardEvent = new KeyboardEvent('keydown', { key: 'Shift' });
        service.onKeyDown(keyboardEvent);
        expect(insertLetterSpy).not.toHaveBeenCalledWith(keyboardEvent.key);
    });

    it('onKeyUp should call printText', () => {
        const printTextSpy = spyOn(service, 'printText');
        service.onKeyUp(keyboardEvent);
        expect(printTextSpy).toHaveBeenCalled();
    });

    it('moveIndicatorUpAndDown should move up when movement is UP', () => {
        service.text = ['a', 'b', 'Enter', 'c', 'd', 'e', '|'];
        service.indexText = service.text.indexOf('|');
        service.moveIndicatorUpAndDown('UP');
        expect(service.indexText).toEqual(2);
    });

    it('moveIndicatorUpAndDown should move up when movement is UP', () => {
        service.text = ['a', 'b', 'c', 'd', 'Enter', '|', 'e'];
        service.indexText = service.text.indexOf('|');
        service.moveIndicatorUpAndDown('UP');
        expect(service.indexText).toEqual(0);
    });

    it('moveIndicatorUpAndDown should move down when movement is DOWN', () => {
        service.text = ['|', 'a', 'b', 'c', 'Enter', 'd', 'e'];
        service.indexText = service.text.indexOf('|');
        service.moveIndicatorUpAndDown('DOWN');
        expect(service.indexText).toEqual(4);
    });

    it('moveIndicatorUpAndDown should move down when movement is DOWN', () => {
        service.text = ['a', 'b', 'c', '|', 'Enter', 'd'];
        service.indexText = service.text.indexOf('|');
        service.moveIndicatorUpAndDown('DOWN');
        expect(service.indexText).toEqual(5);
    });

    it('isInFirstLine should return true if the cursor is in the first line', () => {
        service.text = ['|', 'a', 'b', 'c', 'Enter', 'd', 'e'];
        service.indexText = service.text.indexOf('|');
        expect(service.isInFirstLine()).toBeTrue();
    });

    it('isInFirstLine should return true if there is no enter', () => {
        service.text = ['|', 'a', 'b', 'c'];
        service.indexText = service.text.indexOf('|');
        expect(service.isInFirstLine()).toBeTrue();
    });

    it('isInFirstLine should return false if after enter', () => {
        service.text = ['a', 'b', 'c', 'Enter', '|'];
        service.indexText = service.text.indexOf('|');
        expect(service.isInFirstLine()).toBeFalse();
    });

    it('isInLastLine should return true when after enter', () => {
        service.text = ['a', 'b', 'c', 'Enter', '|'];
        service.indexText = service.text.indexOf('|');
        expect(service.isInLastLine()).toBeTrue();
    });

    it('insertLetter should push when item is | ', () => {
        service.text = ['a', 'b'];
        const text = ['a', 'b', '|'];
        service.indexText = 3;
        service.insertLetter('|');
        expect(service.text).toEqual(text);
    });

    it('insertLetter should put item at the end', () => {
        service.text = ['a', 'b', '|'];
        const text = ['a', 'b', 'c', '|'];
        service.indexText = 4;
        service.insertLetter('c');
        expect(service.text).toEqual(text);
    });

    it('insertLetter should put item inside text', () => {
        service.text = ['a', 'b', '|'];
        const text = ['a', 'b', 'c', '|'];
        service.indexText = 2;
        service.insertLetter('c');
        expect(service.text).toEqual(text);
    });

    it('deleteLetter should delete the item at the index', () => {
        service.text = ['a', 'b', 'c', 'd'];
        const text = ['a', 'c', 'd'];
        service.deleteLetter(1);
        expect(service.text).toEqual(text);
    });

    it('deleteLetter should not delete the item if index is 0', () => {
        service.isDelete = true;
        service.text = ['a', 'b', 'c', 'd'];
        const text = ['a', 'b', 'c', 'd'];
        service.deleteLetter(-1);
        expect(service.text).toEqual(text);
    });

    it('deleteLetter should not delete the item if index is 0', () => {
        service.isDelete = false;
        service.text = ['a', 'b', 'c', 'd'];
        const text = ['a', 'b', 'c', 'd'];
        service.deleteLetter(5);
        expect(service.text).toEqual(text);
    });

    it('removeIndicator should remove indicator', () => {
        service.text = ['a', '|'];
        const text = ['a'];
        service.removeIndicator();
        expect(service.text).toEqual(text);
    });

    it('printText should not call clearCanvas when no text', () => {
        service.printText();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('printText should call fillText', () => {
        const fillTextSpy = spyOn(previewCtxStub, 'fillText');
        service.text = ['a', 'b', 'c', '|'];
        service.printText();
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('printText should call fillText when find enter', () => {
        const fillTextSpy = spyOn(previewCtxStub, 'fillText');
        service.text = ['a', 'b', 'c', 'Enter', '|'];
        const maxLine = 'abc';
        service.printText();
        expect(fillTextSpy).toHaveBeenCalled();
        expect(service.maxLine).toEqual(maxLine);
        expect(service.numberLine).toEqual(2);
    });

    it('printText should call printCursor when the cursor is in the line', () => {
        const printCursorLineSpy = spyOn(service, 'printCursorLine');
        service.text = ['a', 'b', '|', 'Enter', 'c', 'd'];
        service.printText();
        expect(printCursorLineSpy).toHaveBeenCalled();
    });

    it('printText should have the right maxLine when there is a lot of line', () => {
        service.text = ['a', 'b', 'Enter', 'c', 'd', 'Enter', 'e', 'f', 'g'];
        const maxLine = 'efg';
        service.printText();
        expect(service.maxLine).toEqual(maxLine);
        expect(service.numberLine).toEqual(3);
    });

    it('printText should call fillText and calculateWidth when align is start', () => {
        service.align = 'start';
        const fillTextSpy = spyOn(previewCtxStub, 'fillText');
        const printCursorSpy = spyOn(service, 'printCursor');
        service.text = ['a', 'b', 'c', 'Enter', '|'];
        service.printText();
        expect(fillTextSpy).toHaveBeenCalled();
        expect(printCursorSpy).toHaveBeenCalled();
    });

    it('printCursor should call fillText', () => {
        const fillTextSpy = spyOn(previewCtxStub, 'fillText');
        service.printCursor(2, 2);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('setCursor should change lineWidth when align is center', () => {
        service.textStartingPoint.x = 10;
        const lineWidth = service.textStartingPoint.x - previewCtxStub.measureText('abcd').width / 2;
        service.align = 'center';
        const line = ['a', 'b', 'c', 'd'];
        expect(service.setStratingPoint(line)).toEqual(lineWidth);
    });

    it('setCursor should change lineWidth when align is end', () => {
        service.textStartingPoint.x = 10;
        const lineWidth = service.textStartingPoint.x - previewCtxStub.measureText('abcd').width;
        service.align = 'end';
        const line = ['a', 'b', 'c', 'd'];
        expect(service.setStratingPoint(line)).toEqual(lineWidth);
    });

    it('printCursorLine should call setStartingPoint and printCursor', () => {
        const setStartingPointSpy = spyOn(service, 'setStratingPoint');
        const printCursorSpy = spyOn(service, 'printCursor');
        const line = ['a', 'b', 'c', 'd'];
        const lineHeigth = 1;
        service.printCursorLine(line, lineHeigth);
        expect(setStartingPointSpy).toHaveBeenCalled();
        expect(printCursorSpy).toHaveBeenCalled();
    });

    it('moveIndicator should call removeIndicator and insertLetter', () => {
        service.indexText = 1;
        const removeIndicatorSpy = spyOn(service, 'removeIndicator');
        const insertLetterSpy = spyOn(service, 'insertLetter');
        service.moveIndicator(1);
        expect(removeIndicatorSpy).toHaveBeenCalled();
        expect(insertLetterSpy).toHaveBeenCalled();
        expect(service.indexText).toEqual(2);
    });

    it('applyFont should change attribute of previewCtx and call printText', () => {
        service.color = '#ffffff';
        service.align = 'center';
        service.font = 'Arial';
        service.size = 40;
        service.style = 'italic';
        service.boldText = 'normal';
        const font = 'italic 40px Arial';
        const printTextSpy = spyOn(service, 'printText');
        service.applyFont();
        expect(previewCtxStub.font).toEqual(font);
        expect(previewCtxStub.fillStyle).toEqual('#ffffff');
        expect(previewCtxStub.textAlign).toEqual('center');
        expect(printTextSpy).toHaveBeenCalled();
    });

    it('isNumberAndLetter should return true if key is Enter', () => {
        expect(service.isNumberAndLetter('Enter')).toEqual(true);
    });

    it('isNumberAndLetter should return false if key is not correct', () => {
        expect(service.isNumberAndLetter('Alt')).toEqual(false);
    });
});

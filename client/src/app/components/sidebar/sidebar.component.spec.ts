import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { ExportComponent } from '@app/components/export/export.component';
import { SavingComponent } from '@app/components/saving/saving.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { CircleSelectionService } from '@app/services/tools/selection-services/circle-selection.service';
import { SquareSelectionService } from '@app/services/tools/selection-services/square-selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';

import SpyObj = jasmine.SpyObj;
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let matdialogSpy: SpyObj<MatDialog>;
    let newDrawingServiceSpy: SpyObj<NewDrawingService>;
    let toolSelectionServiceSpy: SpyObj<ToolSelectionService>;
    let squareSelectionServiceSpy: SpyObj<SquareSelectionService>;
    let circleSelectionServiceSpy: SpyObj<CircleSelectionService>;
    let clipboardService: SpyObj<ClipboardService>;
    let hotkeyServiceSpy: SpyObj<HotkeyService>;
    let obs: Subject<string>;
    let obsSquareSelection: Subject<boolean>;
    let obsCircleSelection: Subject<boolean>;
    let obsClipboard: Subject<boolean>;
    let undoRedoServiceSpy: SpyObj<UndoRedoService>;
    let obsUndoButton: Subject<boolean>;
    let obsRedoButton: Subject<boolean>;

    beforeEach(() => {
        obs = new Subject<string>();
        obsUndoButton = new Subject<boolean>();
        obsRedoButton = new Subject<boolean>();
        obsSquareSelection = new Subject<boolean>();
        obsCircleSelection = new Subject<boolean>();
        obsClipboard = new Subject<boolean>();
        toolSelectionServiceSpy = jasmine.createSpyObj('ToolSelectionService', ['changeTool', 'selectAll', 'getCurrentTool']);
        toolSelectionServiceSpy.getCurrentTool.and.returnValue(obs.asObservable());
        matdialogSpy = jasmine.createSpyObj('dialog', ['open']);
        hotkeyServiceSpy = jasmine.createSpyObj('HotkeyService', ['getKey']);
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['getUndoAvailability', 'getRedoAvailability']);
        undoRedoServiceSpy.getUndoAvailability.and.returnValue(obsUndoButton.asObservable());
        undoRedoServiceSpy.getRedoAvailability.and.returnValue(obsRedoButton.asObservable());
        newDrawingServiceSpy = jasmine.createSpyObj('newDrawingService', ['openWarningModal']);
        squareSelectionServiceSpy = jasmine.createSpyObj('SquareSelectionService', ['getIsSelectionEmptySubject', 'cut', 'copy', 'paste']);
        squareSelectionServiceSpy.getIsSelectionEmptySubject.and.returnValue(obsSquareSelection.asObservable());
        circleSelectionServiceSpy = jasmine.createSpyObj('CircleSelectionService', ['getIsSelectionEmptySubject', 'cut', 'copy', 'paste']);
        circleSelectionServiceSpy.getIsSelectionEmptySubject.and.returnValue(obsCircleSelection.asObservable());
        clipboardService = jasmine.createSpyObj('ClipboardService', ['getIsPasteAvailableSubject']);
        clipboardService.getIsPasteAvailableSubject.and.returnValue(obsClipboard.asObservable());

        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [SidebarComponent],
            providers: [
                { provide: ToolSelectionService, useValue: toolSelectionServiceSpy },
                { provide: NewDrawingService, useValue: newDrawingServiceSpy },
                { provide: MatDialog, useValue: matdialogSpy },
                { provide: HotkeyService, useValue: hotkeyServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: SquareSelectionService, useValue: squareSelectionServiceSpy },
                { provide: CircleSelectionService, useValue: circleSelectionServiceSpy },
                { provide: ClipboardService, useValue: clipboardService },
            ],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('cursor should be not-allowed if undo and redo are not available', () => {
        obsRedoButton.next(false);
        obsUndoButton.next(false);
        expect(document.getElementById('undo')?.style.cursor).toEqual('not-allowed');
        expect(document.getElementById('redo')?.style.cursor).toEqual('not-allowed');
    });

    it('cursor should be pointer if undo and redo are available', () => {
        obsRedoButton.next(true);
        obsUndoButton.next(true);
        expect(document.getElementById('undo')?.style.cursor).toEqual('pointer');
        expect(document.getElementById('redo')?.style.cursor).toEqual('pointer');
    });

    it('cursor should be pointer if is not square Selection', () => {
        obsSquareSelection.next(false);
        expect(component.cutButton.nativeElement.style.cursor).toEqual('pointer');
    });

    it('cursor should be not-allowed if is square Selection', () => {
        obsSquareSelection.next(true);
        expect(component.cutButton.nativeElement.style.cursor).toEqual('not-allowed');
    });

    it('cursor should be not-allowed if is circle Selection', () => {
        obsCircleSelection.next(true);
        expect(component.cutButton.nativeElement.style.cursor).toEqual('not-allowed');
    });

    it('cursor should be pointer if is not circle selection', () => {
        obsCircleSelection.next(false);
        expect(component.cutButton.nativeElement.style.cursor).toEqual('pointer');
    });

    it('cursor should be pointer if paste available', () => {
        obsClipboard.next(true);
        expect(component.pasteButton.nativeElement.style.cursor).toEqual('pointer');
    });

    it('cursor should be not allowed if paste is not available', () => {
        obsClipboard.next(false);
        expect(component.pasteButton.nativeElement.style.cursor).toEqual('not-allowed');
    });

    it('should call toolSelectionService.changeTool', () => {
        const button = fixture.debugElement.nativeElement.querySelector('#Pinceau');
        button.click();
        expect(toolSelectionServiceSpy.changeTool).toHaveBeenCalled();
    });

    it('should call open of MatDialog', () => {
        component.openUserguide();
        expect(matdialogSpy.open).toHaveBeenCalled();
    });

    it('should call openWarningModal', () => {
        const button = fixture.debugElement.nativeElement.querySelector('#new-drawing');
        button.click();
        expect(newDrawingServiceSpy.openWarningModal).toHaveBeenCalled();
    });

    it('should call open whit the export component', () => {
        component.openExportWindow();
        expect(matdialogSpy.open).toHaveBeenCalledWith(ExportComponent);
    });

    it('should not change tool nor handle cursor on an invalid event', () => {
        const value = undefined;
        const target = ({
            value,
        } as unknown) as HTMLInputElement;
        const event = ({
            target,
        } as unknown) as InputEvent;
        component.onToolChange(event);
        expect(toolSelectionServiceSpy.changeTool).not.toHaveBeenCalled();
    });

    it('should change tool on hotkey call', () => {
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next('invalidtool');
        expect(component.selectedTool).toEqual(TOOL_NAMES.PENCIL_TOOL_NAME);
    });

    it('should not change tool on invalid hotkey call', () => {
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(TOOL_NAMES.BRUSH_TOOL_NAME);
        expect(component.selectedTool).toEqual(TOOL_NAMES.BRUSH_TOOL_NAME);
    });

    it('should open save window', () => {
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(TOOL_NAMES.BRUSH_TOOL_NAME);
        expect(component.selectedTool).toEqual(TOOL_NAMES.BRUSH_TOOL_NAME);
    });

    it('should open carousel component on call', () => {
        component.openCarouselWindow();
        expect(matdialogSpy.open).toHaveBeenCalledWith(CarouselComponent);
    });

    it('should open save component on call', () => {
        component.openSaveWindow();
        expect(matdialogSpy.open).toHaveBeenCalledWith(SavingComponent);
    });

    it('should call selectall of tool selection service', () => {
        component.selectAll();
        expect(toolSelectionServiceSpy.selectAll).toHaveBeenCalled();
    });

    it('should open export component on call', () => {
        component.openExportWindow();
        expect(matdialogSpy.open).toHaveBeenCalledWith(ExportComponent);
    });

    it('should call cut of square selection if it is suqare selection', () => {
        component.selectedTool = TOOL_NAMES.SQUARE_SELECTION_TOOL_NAME;
        component.cut();
        expect(squareSelectionServiceSpy.cut).toHaveBeenCalled();
    });

    it('should call cut of circle selection if it is circle selection', () => {
        component.selectedTool = TOOL_NAMES.CIRCLE_SELECTION_TOOL_NAME;
        component.cut();
        expect(circleSelectionServiceSpy.cut).toHaveBeenCalled();
    });

    it('should call copy of circle selection if it is circle selection', () => {
        component.selectedTool = TOOL_NAMES.CIRCLE_SELECTION_TOOL_NAME;
        component.copy();
        expect(circleSelectionServiceSpy.copy).toHaveBeenCalled();
    });

    it('should call copy of square selection if it is suqare selection', () => {
        component.selectedTool = TOOL_NAMES.SQUARE_SELECTION_TOOL_NAME;
        component.copy();
        expect(squareSelectionServiceSpy.copy).toHaveBeenCalled();
    });

    it('should call paste of square selection if it is suqare selection', () => {
        component.selectedTool = TOOL_NAMES.SQUARE_SELECTION_TOOL_NAME;
        component.paste();
        expect(squareSelectionServiceSpy.paste).toHaveBeenCalled();
    });

    it('should call paste of circle selection if it is circle selection', () => {
        component.selectedTool = TOOL_NAMES.CIRCLE_SELECTION_TOOL_NAME;
        component.paste();
        expect(circleSelectionServiceSpy.paste).toHaveBeenCalled();
    });
});

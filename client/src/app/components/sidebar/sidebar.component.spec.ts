import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { Subject } from 'rxjs';
import { CarouselComponent } from '../carousel/carousel.component';
import { SavingComponent } from '../saving/saving.component';

import SpyObj = jasmine.SpyObj;
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let matdialogSpy: SpyObj<MatDialog>;
    let newDrawingServiceSpy: SpyObj<NewDrawingService>;
    let toolSelectionServiceSpy: SpyObj<ToolSelectionService>;
    let hotkeyServiceSpy: SpyObj<HotkeyService>;
    let obs: Subject<string>;

    beforeEach(() => {
        obs = new Subject<string>();
        toolSelectionServiceSpy = jasmine.createSpyObj('ToolSelectionService', ['changeTool', 'setCurrentToolCursor']);
        newDrawingServiceSpy = jasmine.createSpyObj('newDrawingService', ['openWarning']);
        matdialogSpy = jasmine.createSpyObj('dialog', ['open']);
        hotkeyServiceSpy = jasmine.createSpyObj('HotkeyService', ['getKey']);
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());

        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [SidebarComponent],
            providers: [
                { provide: ToolSelectionService, useValue: toolSelectionServiceSpy },
                { provide: NewDrawingService, useValue: newDrawingServiceSpy },
                { provide: MatDialog, useValue: matdialogSpy },
                { provide: HotkeyService, useValue: hotkeyServiceSpy },
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

    it('should call toolSelectionService.changeTool', () => {
        const button = fixture.debugElement.nativeElement.querySelector('#Pinceau');
        button.click();
        expect(toolSelectionServiceSpy.changeTool).toHaveBeenCalled();
    });

    it('should call toolSelectionService.setCurrentToolCursor', () => {
        const button = fixture.debugElement.nativeElement.querySelector('#Pinceau');
        button.click();
        expect(toolSelectionServiceSpy.setCurrentToolCursor).toHaveBeenCalled();
    });

    it('should call open of MatDialog', () => {
        component.openUserguide();
        expect(matdialogSpy.open).toHaveBeenCalled();
    });

    it('should call openWarning', () => {
        const button: DebugElement = fixture.debugElement.query(By.css('mat-icon[type=newDrawing]'));
        fixture.detectChanges();
        button.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(newDrawingServiceSpy.openWarning).toHaveBeenCalled();
    });

    it('should not change tool nor set cursor on an invalid event', () => {
        const value = undefined;
        const target = ({
            value,
        } as unknown) as HTMLInputElement;
        const event = ({
            target,
        } as unknown) as InputEvent;
        component.onToolChange(event);
        expect(toolSelectionServiceSpy.setCurrentToolCursor).not.toHaveBeenCalled();
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
});

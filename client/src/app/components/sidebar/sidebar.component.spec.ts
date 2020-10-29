import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Tool } from '@app/classes/tool';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';

import SpyObj = jasmine.SpyObj;
class ToolStub extends Tool {}

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolStub: ToolStub;
    let matdialogSpy: SpyObj<MatDialog>;
    let newDrawingServiceSpy: SpyObj<NewDrawingService>;
    let toolSelectionServiceSpy: SpyObj<ToolSelectionService>;
    let currentToolSpy: SpyObj<Tool>;

    beforeEach(() => {
        toolStub = new ToolStub({} as DrawingService);
        matdialogSpy = jasmine.createSpyObj('dialog', ['open']);
        toolSelectionServiceSpy = jasmine.createSpyObj('ToolSelectionService', ['changeTool']);
        toolSelectionServiceSpy.changeTool.and.returnValue();
        currentToolSpy = jasmine.createSpyObj('Tool', ['setCursor']);
        toolSelectionServiceSpy.currentTool = currentToolSpy;
        newDrawingServiceSpy = jasmine.createSpyObj('newDrawingService', ['openWarning']);
        TestBed.configureTestingModule({
            imports: [MatDialogModule, BrowserAnimationsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [SidebarComponent],
            providers: [
                { provide: ToolSelectionService, useValue: toolSelectionServiceSpy },
                { provide: NewDrawingService, useValue: newDrawingServiceSpy },
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
        const spy = spyOn(component.toolSelectionService, 'changeTool');
        const button = fixture.debugElement.nativeElement.querySelector('#Pinceau');
        button.click();
        expect(spy).toHaveBeenCalled();
    });

    it('should call toolSelectionService.currentTool.setCursor', () => {
        const spy = spyOn(toolStub, 'setCursor');
        const button = fixture.debugElement.nativeElement.querySelector('#Pinceau');
        button.click();
        expect(spy).toHaveBeenCalled();
    });

    it('should call open of MatDialog', async(() => {
        component.openUserguide();
        expect(matdialogSpy.open).toHaveBeenCalled();
    }));

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

        const cursorSpy = spyOn(toolStub, 'setCursor');
        const toolSpy = spyOn(component.toolSelectionService, 'changeTool');
        component.onToolChange(event);
        expect(cursorSpy).not.toHaveBeenCalled();
        expect(toolSpy).not.toHaveBeenCalled();
    });
});

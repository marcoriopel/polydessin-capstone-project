import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Tool } from '@app/classes/tool';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { BrushService } from '@app/services/tools/brush.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { FillService } from '@app/services/tools/fill.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { SquareService } from '@app/services/tools/square.service';

import SpyObj = jasmine.SpyObj;
class ToolStub extends Tool {}

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolStub: ToolStub;
    let toolSelectionStub: ToolSelectionService;
    let matdialogSpy: SpyObj<MatDialog>;
    let newDrawingServiceSpy: SpyObj<NewDrawingService>;

    beforeEach(() => {
        toolStub = new ToolStub({} as DrawingService);
        toolSelectionStub = new ToolSelectionService(
            toolStub as PencilService,
            {} as BrushService,
            {} as SquareService,
            {} as CircleService,
            {} as LineService,
            {} as FillService,
            {} as EraserService,
        );
        matdialogSpy = jasmine.createSpyObj('dialog', ['open']);
        newDrawingServiceSpy = jasmine.createSpyObj('newDrawingService', ['openWarning']);
        TestBed.configureTestingModule({
            imports: [MatDialogModule, BrowserAnimationsModule],
            declarations: [SidebarComponent],
            providers: [
                { provide: ToolSelectionService, useValue: toolSelectionStub },
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
        // spyOn(hotkeyServiceStub, 'getKey').and.returnValue(of('Crayon'));
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

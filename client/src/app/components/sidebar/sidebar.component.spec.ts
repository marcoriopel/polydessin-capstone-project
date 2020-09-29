import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Tool } from '@app/classes/tool';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { BrushService } from '@app/services/tools/brush.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
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
    let newDrawingServiceSpy: SpyObj<NewDrawingService>;
    let matDialogSpy: SpyObj<MatDialog>;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        toolSelectionStub = new ToolSelectionService(
            toolStub as PencilService,
            toolStub as BrushService,
            toolStub as SquareService,
            toolStub as CircleService,
            toolStub as LineService,
            toolStub as EraserService,
        );
        newDrawingServiceSpy = jasmine.createSpyObj('newDrawingService', ['openWarning']);
        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: ToolSelectionService, useValue: toolSelectionStub },
                { provide: NewDrawingService, useValue: newDrawingServiceSpy },
                { provide: MatDialog, useValue: matDialogSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
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

    it('should call toolSelectionService.currentTool.handleCursor', () => {
        const spy = spyOn(toolStub, 'handleCursor');
        const button = fixture.debugElement.nativeElement.querySelector('#Pinceau');
        button.click();
        expect(spy).toHaveBeenCalled();
    });

    it('should call openWarning', () => {
        const button: DebugElement = fixture.debugElement.query(By.css('mat-icon[type=newDrawing]'));
        fixture.detectChanges();
        button.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(newDrawingServiceSpy.openWarning).toHaveBeenCalled();
    });

    it('should call openUserGuide', () => {
        const button: DebugElement = fixture.debugElement.query(By.css('mat-icon[type=help]'));
        fixture.detectChanges();
        button.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });
});

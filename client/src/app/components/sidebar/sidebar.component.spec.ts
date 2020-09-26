import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { BrushService } from '@app/services/tools/brush.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { SquareService } from '@app/services/tools/square.service';

import SpyObj = jasmine.SpyObj;

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolSelectionStub: ToolSelectionService;
    let matdialogSpy: SpyObj<MatDialog>;

    beforeEach(async(() => {
        toolSelectionStub = new ToolSelectionService(
            {} as PencilService,
            {} as BrushService,
            {} as SquareService,
            {} as CircleService,
            {} as LineService,
            {} as EraserService,
        );
        matdialogSpy = jasmine.createSpyObj('MatDialog', ['openUserguide']);
        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: ToolSelectionService, useValue: toolSelectionStub },
                { provide: MatDialog, useValue: matdialogSpy },
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
        const button = fixture.debugElement.nativeElement.querySelector('#brush');
        button.click();
        expect(spy).toHaveBeenCalled();
    });

    it('should call open of MatDialog', () => {
        const spy = spyOn(component, 'openUserguide');
        component.openUserguide();
        expect(spy).toHaveBeenCalled();
    });
});

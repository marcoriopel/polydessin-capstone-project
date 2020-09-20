import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ToolSelectionService } from '@app/services/tool-selection.service';
import { BrushService } from '@app/services/tools/brush.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { SquareService } from '@app/services/tools/square.service';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolSelectionStub: ToolSelectionService;

    beforeEach(async(() => {

        toolSelectionStub = new ToolSelectionService(
            {} as PencilService,
            {} as BrushService,
            {} as SquareService,
            {} as CircleService,
            {} as LineService,
            {} as EraserService,
        );

        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: ToolSelectionService, useValue: toolSelectionStub },
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

    it('should call toolSelectionService.onToolChange', () => {
        let spy = spyOn(component.toolSelectionService, 'onToolChange')
        const button = fixture.debugElement.nativeElement.querySelector('#brush');
        button.click()
        expect(spy).toHaveBeenCalled();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { MINIMUM_CANVAS_HEIGHT, MINIMUM_CANVAS_WIDTH } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { BrushService } from '@app/services/tools/brush.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { FillService } from '@app/services/tools/fill.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { PolygoneService } from '@app/services/tools/polygone.service';
import { SquareService } from '@app/services/tools/square.service';
import { DrawingComponent } from './drawing.component';

class ToolStub extends Tool {}

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let toolSelectionStub: ToolSelectionService;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService();
        toolSelectionStub = new ToolSelectionService(
            toolStub as PencilService,
            {} as BrushService,
            {} as SquareService,
            {} as CircleService,
            {} as LineService,
            {} as FillService,
            {} as EraserService,
            {} as PolygoneService,
        );

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: ToolSelectionService, useValue: toolSelectionStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        component.canvasSize = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
        component.previewSize = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a default WIDTH and HEIGHT', () => {
        const height = component.height;
        const width = component.width;
        expect(height).toEqual(MINIMUM_CANVAS_HEIGHT);
        expect(width).toEqual(MINIMUM_CANVAS_WIDTH);
    });

    it('should get stubTool', () => {
        const currentTool = component.toolSelectionService.currentTool;
        expect(currentTool).toEqual(toolStub);
    });

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' onMouseLeave should call toolSelectionService.onMouseLeave', () => {
        const mouseEventSpy = spyOn(toolStub, 'onMouseLeave').and.callThrough();
        component.onMouseLeave();
        expect(mouseEventSpy).toHaveBeenCalled();
    });
});

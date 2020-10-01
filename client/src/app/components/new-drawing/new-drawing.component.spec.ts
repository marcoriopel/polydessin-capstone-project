import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingComponent } from './new-drawing.component';

describe('NewDrawingComponent', () => {
    let component: NewDrawingComponent;
    let fixture: ComponentFixture<NewDrawingComponent>;
    let drawingServiceStub: DrawingService;

    beforeEach(async(() => {
        drawingServiceStub = {} as DrawingService;
        TestBed.configureTestingModule({
            declarations: [NewDrawingComponent],
            providers: [{ provides: DrawingService, useValue: drawingServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call clearCanvas', () => {
        const testSpy = spyOn(component.drawingService, 'clearCanvas');
        component.createNewDrawing();
        expect(testSpy).toHaveBeenCalled();
    });
});

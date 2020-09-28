import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrushService } from '@app/services/tools/brush.service';
import { BrushAttributesComponent } from './brush-attributes.component';

describe('BrushAttributesComponent', () => {
    let component: BrushAttributesComponent;
    let fixture: ComponentFixture<BrushAttributesComponent>;
    let brushServiceSpy: jasmine.SpyObj<BrushService>;
    // let drawingStub: DrawingService;
    // let brushService: BrushService;
    const initialToolWidth = 1;
    const finalToolWidth = 5;
    const pattern = 'pattern2';

    beforeEach(async(() => {
        brushServiceSpy = jasmine.createSpyObj('BrushService', ['changeWidth', 'setPattern']);
        // drawingStub = new DrawingService();
        // brushService = new BrushService(drawingStub, {} as ColorSelectionService);

        TestBed.configureTestingModule({
            declarations: [BrushAttributesComponent],
            providers: [{ provide: BrushService, useValue: brushServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrushAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call changeWidth of brushService', () => {
        component.handleWidthChange(finalToolWidth);
        expect(component.brushService.changeWidth).toHaveBeenCalled();
    });

    it('should change toolWidth', () => {
        component.toolWidth = initialToolWidth;
        component.handleWidthChange(finalToolWidth);
        expect(component.toolWidth).toBe(finalToolWidth);
    });

    it('should call setPattern of brushService', () => {
        component.setPattern(pattern);
        expect(component.brushService.setPattern).toHaveBeenCalled();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SquareService } from '@app/services/tools/square.service';
import { SquareAttributesComponent } from './square-attributes.component';

describe('SquareAttributesComponent', () => {
    let component: SquareAttributesComponent;
    let fixture: ComponentFixture<SquareAttributesComponent>;
    let squareServiceSpy: jasmine.SpyObj<SquareService>;
    const initialToolWidth = 1;
    const finalToolWidth = 5;

    beforeEach(async(() => {
        squareServiceSpy = jasmine.createSpyObj('SquareService', ['changeWidth', 'changeFillStyle']);

        TestBed.configureTestingModule({
            declarations: [SquareAttributesComponent],
            providers: [{ provide: SquareService, useValue: squareServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SquareAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call changeWidth of circleService', () => {
        component.handleBorderWidthChange(finalToolWidth);
        expect(component.squareService.changeWidth).toHaveBeenCalled();
    });

    it('should change toolWidth', () => {
        component.toolWidth = initialToolWidth;
        component.handleBorderWidthChange(finalToolWidth);
        expect(component.toolWidth).toBe(finalToolWidth);
    });

    it('should call changeFillStyle of circleService', () => {
        component.handleFillStyleChange(finalToolWidth);
        expect(component.squareService.changeFillStyle).toHaveBeenCalled();
    });
});

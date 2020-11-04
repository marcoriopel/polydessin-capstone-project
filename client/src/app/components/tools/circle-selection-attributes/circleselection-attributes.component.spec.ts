import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleSelectionService } from '@app/services/tools/selection-services/circle-selection.service';
import { CircleselectionAttributesComponent } from './circleselection-attributes.component';

describe('CircleselectionAttributesComponent', () => {
    let component: CircleselectionAttributesComponent;
    let fixture: ComponentFixture<CircleselectionAttributesComponent>;
    let circleServiceSpy: jasmine.SpyObj<CircleSelectionService>;

    beforeEach(async(() => {
        circleServiceSpy = jasmine.createSpyObj('CircleSelectionService', ['changeWidth', 'changeFillStyle']);

        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [CircleselectionAttributesComponent],
            providers: [{ provide: CircleSelectionService, useValue: circleServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CircleselectionAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should call changeWidth of CircleSelectionService', () => {
    //     component.changeBorderWidth(finalToolWidth);
    //     expect(component.circleSelectionService.circleService.changeWidth).toHaveBeenCalled();
    // });

    // it('should change toolWidth', () => {
    //     component.toolWidth = initialToolWidth;
    //     component.changeBorderWidth(finalToolWidth);
    //     expect(component.toolWidth).toBe(finalToolWidth);
    // });

    // it('should call changeFillStyle of CircleSelectionService', () => {
    //     component.changeFillStyle(finalToolWidth);
    //     expect(component.circleSelectionService.circleService.changeFillStyle).toHaveBeenCalled();
    // });
});

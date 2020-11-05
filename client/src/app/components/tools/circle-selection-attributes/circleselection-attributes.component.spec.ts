import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleSelectionService } from '@app/services/tools/selection-services/circle-selection.service';
import { CircleselectionAttributesComponent } from './circleselection-attributes.component';

describe('CircleselectionAttributesComponent', () => {
    let component: CircleselectionAttributesComponent;
    let fixture: ComponentFixture<CircleselectionAttributesComponent>;
    let circleSelectionServiceSpy: jasmine.SpyObj<CircleSelectionService>;

    beforeEach(async(() => {
        circleSelectionServiceSpy = jasmine.createSpyObj('CircleSelectionService', ['changeWidth', 'changeFillStyle']);

        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [CircleselectionAttributesComponent],
            providers: [{ provide: CircleSelectionService, useValue: circleSelectionServiceSpy }],
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
});

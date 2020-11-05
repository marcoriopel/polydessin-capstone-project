import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SquareSelectionService } from '@app/services/tools/selection-services/square-selection.service';
import { SquareselectionAttributesComponent } from './squareselection-attributes.component';

describe('SqareselectionAttributesComponent', () => {
    let component: SquareselectionAttributesComponent;
    let fixture: ComponentFixture<SquareselectionAttributesComponent>;
    let squareSelectionServiceSpy: jasmine.SpyObj<SquareSelectionService>;

    beforeEach(async(() => {
        squareSelectionServiceSpy = jasmine.createSpyObj('SquareSelectionService', ['changeWidth', 'changeFillStyle']);

        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [SquareselectionAttributesComponent],
            providers: [{ provide: SquareSelectionService, useValue: squareSelectionServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SquareselectionAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PenService } from '@app/services/tools/pen.service';

import { PenAttributesComponent } from './pen-attributes.component';

describe('PenAttributesComponent', () => {
    let component: PenAttributesComponent;
    let fixture: ComponentFixture<PenAttributesComponent>;
    let penServiceSpy: jasmine.SpyObj<PenService>;

    beforeEach(async(() => {
        penServiceSpy = jasmine.createSpyObj('PenService', ['changeWidth', 'changeAngle', 'getAngle']);
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [PenAttributesComponent],
            providers: [{ provide: PenService, useValue: penServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PenAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

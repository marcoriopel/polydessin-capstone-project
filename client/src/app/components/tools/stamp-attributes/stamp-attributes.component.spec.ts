import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StampAttributesComponent } from './stamp-attributes.component';

describe('StampAttributesComponent', () => {
    let component: StampAttributesComponent;
    let fixture: ComponentFixture<StampAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [StampAttributesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StampAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

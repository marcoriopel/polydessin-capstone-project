/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MagicWandAttributesComponent } from './magic-wand-attributes.component';

describe('MagicWandAttributesComponent', () => {
    let component: MagicWandAttributesComponent;
    let fixture: ComponentFixture<MagicWandAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MagicWandAttributesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MagicWandAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

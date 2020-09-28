import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SquareAttributesComponent } from './square-attributes.component';

describe('SquareAttributesComponent', () => {
    let component: SquareAttributesComponent;
    let fixture: ComponentFixture<SquareAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SquareAttributesComponent],
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
});

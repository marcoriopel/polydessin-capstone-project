import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleAttributesComponent } from './circle-attributes.component';

describe('CircleAttributesComponent', () => {
    let component: CircleAttributesComponent;
    let fixture: ComponentFixture<CircleAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CircleAttributesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CircleAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

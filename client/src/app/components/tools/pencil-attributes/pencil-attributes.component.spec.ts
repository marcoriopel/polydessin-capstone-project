import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PencilService } from '@app/services/tools/pencil-service';
import { PencilAttributesComponent } from './pencil-attributes.component';

describe('PencilAttributesComponent', () => {
    let component: PencilAttributesComponent;
    let fixture: ComponentFixture<PencilAttributesComponent>;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    const initialToolWidth = 1;
    const finalToolWidth = 5;

    beforeEach(async(() => {
        pencilServiceSpy = jasmine.createSpyObj('PencilService', ['changeWidth']);

        TestBed.configureTestingModule({
            declarations: [PencilAttributesComponent],
            providers: [{ provide: PencilService, useValue: pencilServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call changeWidth of pencilService', () => {
        component.handleWidthChange(finalToolWidth);
        expect(component.pencilService.changeWidth).toHaveBeenCalled();
    });

    it('should change toolWidth', () => {
        component.toolWidth = initialToolWidth;
        component.handleWidthChange(finalToolWidth);
        expect(component.toolWidth).toBe(finalToolWidth);
    });
});

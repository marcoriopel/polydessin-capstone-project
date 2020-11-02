/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { LoadSelectedDrawingAlertComponent } from './load-selected-drawing-alert.component';
import SpyObj = jasmine.SpyObj;

describe('LoadSelectedDrawingAlertComponent', () => {
    let component: LoadSelectedDrawingAlertComponent;
    let fixture: ComponentFixture<LoadSelectedDrawingAlertComponent>;
    let matdialogRefSpy: SpyObj<MatDialogRef<LoadSelectedDrawingAlertComponent>>;

    beforeEach(() => {
        matdialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        TestBed.configureTestingModule({
            declarations: [LoadSelectedDrawingAlertComponent],
            providers: [{ provide: MatDialogRef, useValue: matdialogRefSpy }],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(LoadSelectedDrawingAlertComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call dialogref .close on close() function call', () => {
        component.close();
        expect(matdialogRefSpy.close).toHaveBeenCalledWith('Fermer');
    });

    it('should call dialogref .close on load() function call', () => {
        component.load();
        expect(matdialogRefSpy.close).toHaveBeenCalledWith('Oui');
    });
});

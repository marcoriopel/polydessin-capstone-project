import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { IndexService } from '@app/services/index/index.service';
import { of } from 'rxjs';
import { MainPageComponent } from './main-page.component';

import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let indexServiceSpy: SpyObj<IndexService>;
    let matDialogSpy: SpyObj<MatDialog>;

    beforeEach(async(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet', 'basicPost']);
        indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
        indexServiceSpy.basicPost.and.returnValue(of());

        matDialogSpy = jasmine.createSpyObj('dialog', ['openUserguide']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: IndexService, useValue: indexServiceSpy },
<<<<<<< HEAD
                { provide: MatDialog, useValue: matDialogSpy },
=======
                { provide: MatDialog, useValue: {} },
>>>>>>> 716a3f8bc9e43e4794d08fbfde8d34143946d140
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'PolyDessin'", () => {
        expect(component.title).toEqual('PolyDessin');
    });

    it('should call open of MatDialog', () => {
        const spy = spyOn(component, 'openUserguide');
        component.openUserguide();
        expect(spy).toHaveBeenCalled();
    });
});

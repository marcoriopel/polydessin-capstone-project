import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from './main-page.component';

import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let matDialogSpy: SpyObj<MatDialog>;

    beforeEach(async(() => {
        matDialogSpy = jasmine.createSpyObj('dialog', ['open']);

        matDialogSpy = jasmine.createSpyObj('dialog', ['open']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [{ provide: MatDialog, useValue: matDialogSpy }],
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
        component.openUserguide();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });
});

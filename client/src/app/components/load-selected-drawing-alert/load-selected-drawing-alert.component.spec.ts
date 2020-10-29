/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoadSelectedDrawingAlertComponent } from './load-selected-drawing-alert.component';

describe('LoadSelectedDrawingAlertComponent', () => {
  let component: LoadSelectedDrawingAlertComponent;
  let fixture: ComponentFixture<LoadSelectedDrawingAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadSelectedDrawingAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadSelectedDrawingAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipetteAttributesComponent } from './pipette-attributes.component';

describe('PipetteAttributesComponent', () => {
  let component: PipetteAttributesComponent;
  let fixture: ComponentFixture<PipetteAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipetteAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipetteAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

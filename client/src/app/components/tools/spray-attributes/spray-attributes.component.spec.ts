import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprayAttributesComponent } from './spray-attributes.component';

describe('SprayAttributesComponent', () => {
  let component: SprayAttributesComponent;
  let fixture: ComponentFixture<SprayAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprayAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerCargaComponent } from './spinner-carga.component';

describe('SpinnerCargaComponent', () => {
  let component: SpinnerCargaComponent;
  let fixture: ComponentFixture<SpinnerCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerCargaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnerCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

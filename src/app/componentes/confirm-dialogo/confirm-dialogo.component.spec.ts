import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogoComponent } from './confirm-dialogo.component';

describe('ConfirmDialogoComponent', () => {
  let component: ConfirmDialogoComponent;
  let fixture: ComponentFixture<ConfirmDialogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

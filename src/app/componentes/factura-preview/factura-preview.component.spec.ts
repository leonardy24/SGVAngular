import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaPreviewComponent } from './factura-preview.component';

describe('FacturaPreviewComponent', () => {
  let component: FacturaPreviewComponent;
  let fixture: ComponentFixture<FacturaPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturaPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

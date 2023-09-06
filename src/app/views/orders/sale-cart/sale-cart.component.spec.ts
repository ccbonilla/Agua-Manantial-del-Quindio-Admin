import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleCartComponent } from './sale-cart.component';

describe('SaleCartComponent', () => {
  let component: SaleCartComponent;
  let fixture: ComponentFixture<SaleCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfigChartComponent } from './dialog-config-chart.component';

describe('DialogConfigChartComponent', () => {
  let component: DialogConfigChartComponent;
  let fixture: ComponentFixture<DialogConfigChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfigChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfigChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

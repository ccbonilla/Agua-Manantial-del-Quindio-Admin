import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketHolderComponent } from './ticket-holder.component';

describe('TicketHolderComponent', () => {
  let component: TicketHolderComponent;
  let fixture: ComponentFixture<TicketHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketHolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

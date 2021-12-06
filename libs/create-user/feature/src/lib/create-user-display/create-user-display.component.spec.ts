import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserDisplayComponent } from './create-user-display.component';

describe('CreateUserDisplayComponent', () => {
  let component: CreateUserDisplayComponent;
  let fixture: ComponentFixture<CreateUserDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUserDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

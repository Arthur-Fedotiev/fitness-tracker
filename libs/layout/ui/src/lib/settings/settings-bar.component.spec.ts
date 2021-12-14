import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBarComponent } from './settings-bar.component';

describe('SettingsBarComponent', () => {
  let component: SettingsBarComponent;
  let fixture: ComponentFixture<SettingsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

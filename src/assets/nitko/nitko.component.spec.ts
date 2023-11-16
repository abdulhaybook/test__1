import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NitkoComponent } from './nitko.component';

describe('NitkoComponent', () => {
  let component: NitkoComponent;
  let fixture: ComponentFixture<NitkoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NitkoComponent]
    });
    fixture = TestBed.createComponent(NitkoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

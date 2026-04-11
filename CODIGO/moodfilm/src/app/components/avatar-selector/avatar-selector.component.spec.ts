import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvatarSelectorComponent } from './avatar-selector.component';

describe('AvatarSelectorComponent', () => {
  let component: AvatarSelectorComponent;
  let fixture: ComponentFixture<AvatarSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AvatarSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

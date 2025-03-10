import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlocksComponent } from './unlocks.component';

describe('UnlocksComponent', () => {
  let component: UnlocksComponent;
  let fixture: ComponentFixture<UnlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlocksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

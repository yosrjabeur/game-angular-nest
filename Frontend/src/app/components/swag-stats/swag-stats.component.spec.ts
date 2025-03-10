import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwagStatsComponent } from './swag-stats.component';

describe('SwagStatsComponent', () => {
  let component: SwagStatsComponent;
  let fixture: ComponentFixture<SwagStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwagStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwagStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

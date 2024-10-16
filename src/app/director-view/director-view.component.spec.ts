import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorViewComponent } from './director-view.component';

describe('DirectorViewComponent', () => {
  let component: DirectorViewComponent;
  let fixture: ComponentFixture<DirectorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

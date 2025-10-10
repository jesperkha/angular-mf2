import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMf2 } from './angular-mf2';

describe('AngularMf2', () => {
  let component: AngularMf2;
  let fixture: ComponentFixture<AngularMf2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularMf2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularMf2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLib } from './test-lib';

describe('TestLib', () => {
  let component: TestLib;
  let fixture: ComponentFixture<TestLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ValidarLoginGuard } from './validar-login.guard';

describe('ValidarLoginGuard', () => {
  let guard: ValidarLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ValidarLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

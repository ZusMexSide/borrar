import { TestBed, async, inject } from '@angular/core/testing';

import { GuardFacebookGuard } from './guard-facebook.guard';

describe('GuardFacebookGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardFacebookGuard]
    });
  });

  it('should ...', inject([GuardFacebookGuard], (guard: GuardFacebookGuard) => {
    expect(guard).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { IotFirebaseService } from './iot-firebase.service';

describe('IotFirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IotFirebaseService = TestBed.get(IotFirebaseService);
    expect(service).toBeTruthy();
  });
});

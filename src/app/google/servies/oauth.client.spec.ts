import { TestBed } from '@angular/core/testing';

import { OauthClient } from './oauth.client';

describe('OauthClient', () => {
  let service: OauthClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OauthClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

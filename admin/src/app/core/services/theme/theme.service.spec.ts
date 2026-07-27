import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let documentMock: Document;

  beforeEach(() => {
    documentMock = document;

    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: DOCUMENT, useValue: documentMock }],
    });

    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('toggle alterna entre claro e escuro', () => {
    const initial = service.isDark();
    service.toggle();
    expect(service.isDark()).toBe(!initial);
  });
});

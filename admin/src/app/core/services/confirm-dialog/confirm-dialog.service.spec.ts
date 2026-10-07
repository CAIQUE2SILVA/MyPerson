import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  it('retorna true quando o dialog confirma', async () => {
    const afterClosed = vi.fn().mockReturnValue(of(true));
    const open = vi.fn().mockReturnValue({ afterClosed });

    TestBed.configureTestingModule({
      providers: [
        ConfirmDialogService,
        { provide: MatDialog, useValue: { open } },
      ],
    });

    const service = TestBed.inject(ConfirmDialogService);
    const result = await service.open({
      title: 'Excluir',
      message: 'Confirma?',
    });

    expect(open).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('retorna false quando o dialog cancela', async () => {
    const afterClosed = vi.fn().mockReturnValue(of(undefined));
    const open = vi.fn().mockReturnValue({ afterClosed });

    TestBed.configureTestingModule({
      providers: [
        ConfirmDialogService,
        { provide: MatDialog, useValue: { open } },
      ],
    });

    const service = TestBed.inject(ConfirmDialogService);
    const result = await service.open({
      title: 'Excluir',
      message: 'Confirma?',
    });

    expect(result).toBe(false);
  });
});

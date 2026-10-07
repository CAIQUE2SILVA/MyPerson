import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../ui/common/confirm-dialog/confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  open(data: ConfirmDialogData): Promise<boolean> {
    const ref = this.dialog.open(ConfirmDialog, {
      data,
      panelClass: 'app-dialog-panel',
      autoFocus: 'first-titled-element',
      restoreFocus: true,
    });

    return firstValueFrom(ref.afterClosed()).then((result) => result === true);
  }
}

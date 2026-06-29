import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlockUI } from 'primeng/blockui';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Toast } from 'primeng/toast';

// import { LoadingService } from './services/loading/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, BlockUI, ProgressSpinner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('admin');
  // readonly loading = inject(LoadingService);
}

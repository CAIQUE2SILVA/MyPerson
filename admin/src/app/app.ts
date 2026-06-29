import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// import { LoadingService } from './services/loading/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('admin');
  // readonly loading = inject(LoadingService);
}

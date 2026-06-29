import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './login-footer.html',
  styleUrl: './login-footer.scss',
})
export class LoginFooter {
  currentYear = new Date().getFullYear();
}

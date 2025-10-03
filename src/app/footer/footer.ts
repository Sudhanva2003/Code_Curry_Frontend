import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
  role: 'user' | 'restaurant' | null = null;

  constructor(private auth: AuthGuard) {}

  ngOnInit() {
    const user = this.auth.getUser();
    this.role = user ? user.role : null;
  }
}

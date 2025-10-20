import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'customer-view',
  standalone: false,
  templateUrl: './customer-view.html',
  styleUrl: './customer-view.css'
})
export class CustomerView implements OnInit {
  username: string = '';

  constructor(private auth: AuthGuard) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user && user.role === 'customer') {
      this.username = user.name;  // get restaurant name
    }
  }
}

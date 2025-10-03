import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'user-view',
  standalone: false,
  templateUrl: './user-view.html',
  styleUrl: './user-view.css'
})
export class UserView implements OnInit {
  username: string = '';

  constructor(private auth: AuthGuard) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user && user.role === 'user') {
      this.username = user.name;  // get restaurant name
    }
  }
}

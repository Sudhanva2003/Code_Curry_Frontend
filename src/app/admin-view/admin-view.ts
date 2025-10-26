import { Component,OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-admin-view',
  standalone: false,
  templateUrl: './admin-view.html',
  styleUrl: './admin-view.css'
})
export class AdminView {
  username: string = '';
    
      constructor(private auth: AuthGuard) {}
    
      ngOnInit() {
        const user = this.auth.getUser();
        if (user && user.role === 'admin') {
          this.username = user.name;  // get restaurant name
        }
      }
}

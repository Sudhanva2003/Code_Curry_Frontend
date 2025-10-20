import { Component,OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-deliverer-view',
  standalone: false,
  templateUrl: './deliverer-view.html',
  styleUrl: './deliverer-view.css'
})
export class DelivererView {
  username: string = '';
  
    constructor(private auth: AuthGuard) {}
  
    ngOnInit() {
      const user = this.auth.getUser();
      if (user && user.role === 'deliverer') {
        this.username = user.name;  // get restaurant name
      }
    }
}

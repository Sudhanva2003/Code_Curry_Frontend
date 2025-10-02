import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Input } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
// export class Footer {
//   @Input() role: 'user' | 'restaurant' = 'user';
// }
export class Footer implements OnInit {
  role: 'user' | 'restaurant' | null = null;

  constructor(private auth: AuthGuard) {}

  ngOnInit() {
    this.role = this.auth.getRole();
  }
}
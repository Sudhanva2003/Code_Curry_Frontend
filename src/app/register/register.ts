import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  standalone: false,
  templateUrl: 'register.html',
  styleUrl: './register.css'
})
export class Register{
  constructor(private router: Router) {}

  goRestaurant() { this.router.navigate(['/register-restaurant']); }
  goUser() { this.router.navigate(['/register-customer']); }
  goDeliverer() {this.router.navigate(['/register-deliverer']);}
}

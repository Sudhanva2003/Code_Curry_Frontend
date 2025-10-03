import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-restaurant-settings',
  standalone: false,
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
// export class Settings implements OnInit {
//   restaurant: any;
//   role: string | null = null;

//   constructor(private apiService: ApiService, private authService: AuthService) {}

//   ngOnInit(): void {
//     if (this.authService.isLoggedIn()) {
//       this.role = this.authService.getRole();
//       this.apiService.get('Restaurant/ViewRestaurant/1').subscribe({
//         next: (data) => {
//           this.restaurant = data;
//         },
//         error: (err) => {
//           console.error('Error fetching restaurant profile:', err);
//         }
//       });
//     } else {
//       console.warn('User not logged in');
//     }
//   }
// }

export class Settings implements OnInit {
  restaurant: any;
  role: string | null = null;
  showEditForm: boolean = false;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.role = this.authService.getRole();
      this.apiService.get('Restaurant/ViewRestaurant/1').subscribe({
        next: (data) => {
          this.restaurant = data;
        },
        error: (err) => {
          console.error('Error fetching restaurant profile:', err);
        }
      });
    } else {
      console.warn('User not logged in');
    }
  }

  onEdit(): void {
    this.showEditForm = !this.showEditForm;
  }

  onDelete(): void {
    const confirmed = confirm('Are you sure you want to delete this restaurant?');
    if (confirmed) {
      // Add delete logic here
      console.log('Restaurant deleted');
    }
  }
  onSave(form: NgForm): void {
  if (form.valid) {
    const updatePayload = {
      name: this.restaurant.name,
      phone: this.restaurant.phone,
      address: this.restaurant.address,
      isOpen: this.restaurant.isOpen
    };
this.restaurant.restaurantId=1;
    this.apiService.put(`Restaurant/EditRestaurant/${this.restaurant.restaurantId}`, updatePayload).subscribe({
      next: (response) => {
        console.log('Restaurant updated successfully:', response);
        alert('Restaurant updated successfully!');
        this.showEditForm = false; // ✅ Close the form
      },
      error: (err) => {
        console.error('Error updating restaurant:', err);
      }
    });
  } else {
    console.warn('Form is invalid');
  }
}

}

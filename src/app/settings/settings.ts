import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-restaurant-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
  standalone: false
})
export class Settings implements OnInit {
  restaurant: any = null;
  editedRestaurant: any = null;
  showEditPopup = false;
  formSubmitted = false;

  constructor(private auth: AuthGuard, private http: HttpClient) {}

  ngOnInit(): void {
    const restId = this.auth.getRestId();
    if (restId !== null) {
      this.http.get(`https://localhost:7265/api/Restaurant/ViewRestaurant/${restId}`).subscribe({
        next: (data: any) => {
          this.restaurant = { ...data, restId };
        },
        error: (err) => {
          console.error('Failed to load restaurant', err);
          this.restaurant = null;
        }
      });
    }
  }

  onEdit(): void {
    this.editedRestaurant = {
      name: this.restaurant.name,
      phone: this.restaurant.phone,
      address: this.restaurant.address,
      isOpen: this.restaurant.isOpen
    };
    this.showEditPopup = true;
    this.formSubmitted = false;
  }

  onSave(form: any): void {
    this.formSubmitted = true;

    if (form.valid && this.restaurant?.restId) {
      this.http.put(`https://localhost:7265/api/Restaurant/EditRestaurant/${this.restaurant.restId}`, this.editedRestaurant).subscribe({
        next: () => {
          alert('Restaurant updated successfully');
          this.restaurant = { ...this.restaurant, ...this.editedRestaurant };
          this.showEditPopup = false;
          this.formSubmitted = false;
        },
        error: (err) => {
  console.error('Failed to update restaurant', err);
  alert('Update failed: ' + JSON.stringify(err.error?.errors || err.message));
}

      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  onDelete(): void {
    if (this.restaurant?.restId && confirm('Are you sure you want to delete this restaurant?')) {
      this.http.delete(`https://localhost:7265/api/Restaurant/DeleteRestaurant/${this.restaurant.restId}`).subscribe({
        next: () => {
          alert('Restaurant deleted');
          this.restaurant = null;
        },
        error: (err) => {
          console.error('Failed to delete restaurant', err);
          alert('Delete failed');
        }
      });
    }
  }

  closePopup(): void {
    this.showEditPopup = false;
    this.editedRestaurant = null;
    this.formSubmitted = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  

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
  defaultImage = 'https://t3.ftcdn.net/jpg/03/24/73/92/360_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg';

  constructor(private auth: AuthGuard, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    const restId = this.auth.getRestId();
    if (restId !== null) {
      this.http.get(`https://localhost:7265/api/Restaurant/ViewRestaurant/${restId}`).subscribe({
        next: (data: any) => {
          this.restaurant = { ...data, restId };
          if (!this.restaurant.restImageUrl) {
            this.restaurant.restImageUrl = this.defaultImage;
          }
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
      RestStatus: this.restaurant.RestStatus,
      cuisine:this.restaurant.cuisine,
      restImageUrl: this.restaurant.restImageUrl
    };
    this.showEditPopup = true;
    this.formSubmitted = false;
  }

  onSave(form: any): void {
    this.formSubmitted = true;

    if (form.valid && this.restaurant?.restId) {
      // If invalid or empty URL, default to original
      if (!this.editedRestaurant.restImageUrl || !this.isValidUrl(this.editedRestaurant.restImageUrl)) {
        this.editedRestaurant.restImageUrl = this.defaultImage;
      }

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
          this.router.navigate(['/login']);
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

  // Simple URL validation
  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }
}

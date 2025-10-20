import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deliverer-settings',
  templateUrl: './deliverer-settings.html',
  styleUrls: ['./deliverer-settings.css'],
  standalone: false
})
export class DelivererSettings implements OnInit {
  deliverer: any = null;
  editedDeliverer: any = null;
  showEditPopup = false;
  formSubmitted = false;

  constructor(private auth: AuthGuard, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    const DelivererId = user?.userId;

    if (DelivererId !== null) {
      this.http.get(`https://localhost:7265/api/Deliverer/DelivererProfile/${DelivererId}`).subscribe({
        next: (data: any) => {
          this.deliverer = { ...data, userId: DelivererId };
        },
        error: (err) => {
          console.error('Failed to load deliverer profile', err);
          this.deliverer = null;
        }
      });
    }
  }

  onEdit(): void {
    this.editedDeliverer = {
      fullName: this.deliverer.fullName,
      phone: this.deliverer.phone,
      address: this.deliverer.address
    };
    this.showEditPopup = true;
    this.formSubmitted = false;
  }

  onSave(form: any): void {
    this.formSubmitted = true;

    if (form.valid && this.deliverer?.userId) {
      this.http.put(`https://localhost:7265/api/Deliverer/EditDeliverer/${this.deliverer.userId}`, this.editedDeliverer).subscribe({
        next: () => {
          alert('Profile updated successfully');
          this.deliverer = { ...this.deliverer, ...this.editedDeliverer };
          this.showEditPopup = false;
          this.formSubmitted = false;
        },
        error: (err) => {
          console.error('Failed to update deliverer', err);
          alert('Update failed');
        }
      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  onDelete(): void {
    if (this.deliverer?.userId && confirm('Are you sure you want to delete your account?')) {
      this.http.delete(`https://localhost:7265/api/Deliverer/DeleteDeliverer/${this.deliverer.userId}`).subscribe({
        next: () => {
          alert('Deliverer account deleted');
          this.deliverer = null;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Failed to delete deliverer', err);
          alert('Delete failed');
        }
      });
    }
  }

  closePopup(): void {
    this.showEditPopup = false;
    this.editedDeliverer = null;
    this.formSubmitted = false;
  }
}

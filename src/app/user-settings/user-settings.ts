import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.html',
  styleUrls: ['./user-settings.css'],
  standalone: false
})
export class UserSettings implements OnInit {
  user: any = null;
  editedUser: any = null;
  showEditPopup = false;
  formSubmitted = false;

  constructor(private auth: AuthGuard, private http: HttpClient) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
const userId = user?.userId;
// Replace with actual method
    if (userId !== null) {
      this.http.get(`https://localhost:7265/api/Users/ViewUser/${userId}`).subscribe({
        next: (data: any) => {
          this.user = { ...data, userId };
        },
        error: (err) => {
          console.error('Failed to load user', err);
          this.user = null;
        }
      });
    }
  }

  onEdit(): void {
    this.editedUser = {
      fullName: this.user.fullName,
      phone: this.user.phone,
      address: this.user.address
    };
    this.showEditPopup = true;
    this.formSubmitted = false;
  }

  onSave(form: any): void {
    this.formSubmitted = true;

    if (form.valid && this.user?.userId) {
      this.http.put(`https://localhost:7265/api/Users/EditUserDetails/${this.user.userId}`, this.editedUser).subscribe({
        next: () => {
          alert('User updated successfully');
          this.user = { ...this.user, ...this.editedUser };
          this.showEditPopup = false;
          this.formSubmitted = false;
        },
        error: (err) => {
          console.error('Failed to update user', err);
          alert('Update failed');
        }
      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  onDelete(): void {
    if (this.user?.userId && confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`https://localhost:7265/api/Users/DeleteUser/${this.user.userId}`).subscribe({
        next: () => {
          alert('User deleted');
          this.user = null;
        },
        error: (err) => {
          console.error('Failed to delete user', err);
          alert('Delete failed');
        }
      });
    }
  }

  closePopup(): void {
    this.showEditPopup = false;
    this.editedUser = null;
    this.formSubmitted = false;
  }
}
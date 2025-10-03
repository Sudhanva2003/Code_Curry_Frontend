import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-user-settings',
  standalone: false,
  templateUrl: './user-settings.html',
  styleUrls: ['./user-settings.css']
})
// export class UserSettings implements OnInit {
//   user: any;
//   role: string | null = null;

//   constructor(private apiService: ApiService, private authService: AuthService) {}

//   ngOnInit(): void {
//     if (this.authService.isLoggedIn()) {
//       this.role = this.authService.getRole();
//       this.apiService.get('Users/ViewUser/2').subscribe({
//         next: (data) => {
//           this.user = data;
//         },
//         error: (err) => {
//           console.error('Error fetching user profile:', err);
//         }
//       });
//     } else {
//       console.warn('User not logged in');
//     }
//   }
// }


export class UserSettings implements OnInit {
  user: any;
  role: string | null = null;
  showEditForm: boolean = false;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.role = this.authService.getRole();
      this.apiService.get('Users/ViewUser/1').subscribe({
  next: (data) => {
    console.log('User data received:', data); // 👈 Confirm UserId is present
    this.user = data;
  },
  error: (err) => {
    console.error('Error fetching user profile:', err);
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
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      // Add delete logic here
      console.log('User deleted');
    }
  }
  onSave(form: NgForm): void {
  if (form.valid) {
    const updatePayload = {
      fullName: this.user.fullName,
      phone: this.user.phone,
      address: this.user.address
    };
    this.user.userId=1;
    this.apiService.put(`Users/EditUserDetails/${this.user.userId}`, updatePayload).subscribe({
  next: (response) => {
    alert('User updated successfully!');
    this.showEditForm = false;
  },
  error: (err) => {
    console.error('Error updating user:', err);
  }
});

  } else {
    console.warn('Form is invalid');
  }
}

}


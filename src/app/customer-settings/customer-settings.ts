import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-customer-settings',
  templateUrl: './customer-settings.html',
  styleUrls: ['./customer-settings.css'],
  standalone: false
})
export class CustomerSettings implements OnInit {
  user: any = null;
  editedUser: any = null;
  showEditPopup = false;
  formSubmitted = false;
  showSupportPopup = false;
  selectedCategory: string = 'default';
  issueDetails: string = '';
  pastTickets: any[] = [];

  constructor(private auth: AuthGuard, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    const userId = user?.userId ?? 0;

    if (userId) {
      this.http.get(`https://localhost:7265/api/Customer/ViewUser/${userId}`).subscribe({
        next: (data: any) => {
          this.user = { ...data, userId };
          this.loadPastTickets(userId);
        },
        error: (err) => {
          console.error('Failed to load user', err);
          this.user = null;
        }
      });
    }
  }

  loadPastTickets(userId: number): void {
    this.http.get(`https://localhost:7265/api/Support/viewOpenTickets/${userId}`).subscribe({
      next: (openTickets: any) => {
        this.http.get(`https://localhost:7265/api/Support/viewClosedTickets/${userId}`).subscribe({
          next: (closedTickets: any) => {
            const allTickets = [...(openTickets || []), ...(closedTickets || [])];
            this.pastTickets = allTickets.sort((a, b) => {
              const dateA = new Date(a.createdAt || a.date || a.resolvedAt || 0).getTime();
              const dateB = new Date(b.createdAt || b.date || b.resolvedAt || 0).getTime();
              if (dateB !== dateA) {
                return dateB - dateA;
              }
              return (b.ticketId || 0) - (a.ticketId || 0);
            });
          },
          error: (err) => console.error('Error loading closed tickets', err)
        });
      },
      error: (err) => console.error('Error loading open tickets', err)
    });
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
      this.http.put(`https://localhost:7265/api/Customer/EditUserDetails/${this.user.userId}`, this.editedUser).subscribe({
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
      this.http.delete(`https://localhost:7265/api/Customer/DeleteUser/${this.user.userId}`).subscribe({
        next: () => {
          alert('User deleted');
          this.user = null;
          this.router.navigate(['/login']);
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

  openSupportPopup(): void {
    this.selectedCategory = 'default';
    this.issueDetails = '';
    this.showSupportPopup = true;
  }

  closeSupportPopup(): void {
    this.showSupportPopup = false;
    this.selectedCategory = 'default';
    this.issueDetails = '';
  }

  submitSupportTicket(): void {
    if (this.selectedCategory === 'default' || !this.issueDetails.trim()) {
      alert('Please select a category and describe the issue.');
      return;
    }

    const supportTicket = {
      userId: this.user.userId,
      email: this.user.email,
      category: this.selectedCategory,
      description: this.issueDetails
    };

    this.http.post('https://localhost:7265/api/Support/raiseUserTicket', supportTicket).subscribe({
      next: (response: any) => {
        alert(`Support Ticket Submitted Successfully!`);
        this.closeSupportPopup();
        this.loadPastTickets(this.user.userId ?? 0);
      },
      error: (err) => {
        console.error('Failed to submit ticket', err);
        alert('Failed to submit support ticket. Please try again.');
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

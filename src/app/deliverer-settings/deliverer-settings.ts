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
  showSupportPopup = false;
  selectedCategory: string = 'default';
  issueDetails: string = '';
  pastTickets: any[] = [];

  constructor(private auth: AuthGuard, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    const delivererId = user?.userId ?? 0;

    if (delivererId) {
      this.http.get(`https://localhost:7265/api/Deliverer/DelivererProfile/${delivererId}`).subscribe({
        next: (data: any) => {
          this.deliverer = { ...data, userId: delivererId };
          this.loadPastTickets(delivererId);
        },
        error: (err) => {
          console.error('Failed to load deliverer profile', err);
          this.deliverer = null;
        }
      });
    }
  }

  loadPastTickets(userId: number): void {
    this.http.get(`https://localhost:7265/api/Support/viewOpenTickets/${userId}`).subscribe({
      next: (openTickets: any) => {
        this.http.get(`https://localhost:7265/api/Support/viewClosedTickets/${userId}`).subscribe({
          next: (closedTickets: any) => {
            // Combine all tickets
            const allTickets = [...(openTickets || []), ...(closedTickets || [])];
            
            // Sort by ticketId descending (newest first)
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
      userId: this.deliverer.userId,
      email: this.deliverer.email,
      category: this.selectedCategory,
      description: this.issueDetails
    };

    this.http.post('https://localhost:7265/api/Support/raiseUserTicket', supportTicket).subscribe({
      next: (response: any) => {
        alert(`Support Ticket Submitted Successfully!`);
        this.closeSupportPopup();
        this.loadPastTickets(this.deliverer.userId ?? 0);
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
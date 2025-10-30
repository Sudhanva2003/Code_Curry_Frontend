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
  showSupportPopup = false;
  selectedCategory: string = 'default';
  issueDetails: string = '';
  pastTickets: any[] = [];
  defaultImage = 'https://t3.ftcdn.net/jpg/03/24/73/92/360_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg';

  constructor(private auth: AuthGuard, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const restId = this.auth.getRestId();
    if (restId !== null) {
      this.http.get(`https://localhost:7265/api/Restaurant/ViewRestaurant/${restId}`).subscribe({
        next: (data: any) => {
          this.restaurant = { ...data, restId };
          if (!this.restaurant.restImageUrl) {
            this.restaurant.restImageUrl = this.defaultImage;
          }
          this.loadPastTickets(restId);
        },
        error: (err) => {
          console.error('Failed to load restaurant', err);
          this.restaurant = null;
        }
      });
    }
  }

  loadPastTickets(restId: number): void {
    this.http.get(`https://localhost:7265/api/Support/viewMyRestTickets/${restId}`).subscribe({
      next: (response: any) => {
        // Combine all tickets
        const allTickets = [
          ...(response.openTickets || []),
          ...(response.assignedTickets || []),
          ...(response.resolvedTickets || [])
        ];

        // Sort by ticketId descending (newest first) or by date if available
        this.pastTickets = allTickets.sort((a, b) => {
          // Try sorting by date first
          const dateA = new Date(a.createdAt || a.date || a.resolvedAt || 0).getTime();
          const dateB = new Date(b.createdAt || b.date || b.resolvedAt || 0).getTime();
          
          if (dateB !== dateA) {
            return dateB - dateA; // Newest first
          }
          
          // If dates are same or missing, sort by ticketId (higher ID = newer)
          return (b.ticketId || 0) - (a.ticketId || 0);
        });
      },
      error: (err) => {
        console.error('Failed to fetch past tickets', err);
        this.pastTickets = [];
      }
    });
  }

  toggleRestaurantStatus(): void {
    if (!this.restaurant?.restId) return;

    this.http
      .patch(
        `https://localhost:7265/api/Restaurant/ChangeAvailability/${this.restaurant.restId}`,
        {}
      )
      .subscribe({
        next: (res: any) => {
          this.restaurant.restStatus = res.restStatus;
          alert(res.message);
        },
        error: (err) => {
          console.error('Failed to toggle restaurant status', err);
          alert('Failed to change restaurant availability.');
        }
      });
  }

  onEdit(): void {
    this.editedRestaurant = {
      name: this.restaurant.name,
      phone: this.restaurant.phone,
      address: this.restaurant.address,
      cuisine: this.restaurant.cuisine,
      restImageUrl: this.restaurant.restImageUrl
    };
    this.showEditPopup = true;
    this.formSubmitted = false;
  }

  onSave(form: any): void {
    this.formSubmitted = true;

    if (form.valid && this.restaurant?.restId) {
      if (
        !this.editedRestaurant.restImageUrl ||
        !this.isValidUrl(this.editedRestaurant.restImageUrl)
      ) {
        this.editedRestaurant.restImageUrl = this.defaultImage;
      }

      this.http
        .put(
          `https://localhost:7265/api/Restaurant/EditRestaurant/${this.restaurant.restId}`,
          this.editedRestaurant
        )
        .subscribe({
          next: () => {
            alert('Restaurant updated successfully');
            this.restaurant = { ...this.restaurant, ...this.editedRestaurant };
            this.showEditPopup = false;
            this.formSubmitted = false;
          },
          error: (err) => {
            console.error('Failed to update restaurant', err);
            alert(
              'Update failed: ' +
                JSON.stringify(err.error?.errors || err.message)
            );
          }
        });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  onDelete(): void {
    if (
      this.restaurant?.restId &&
      confirm('Are you sure you want to delete this restaurant?')
    ) {
      this.http
        .delete(
          `https://localhost:7265/api/Restaurant/DeleteRestaurant/${this.restaurant.restId}`
        )
        .subscribe({
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
      restId: this.restaurant.restId,
      email: this.restaurant.email,
      category: this.selectedCategory,
      description: this.issueDetails
    };

    this.http.post('https://localhost:7265/api/Support/raiseRestaurantTicket', supportTicket).subscribe({
      next: (response: any) => {
        alert(`Support Ticket Submitted Successfully!`);
        this.closeSupportPopup();
        this.loadPastTickets(this.restaurant.restId);
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

  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
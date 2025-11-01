import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service'; // <-- Import NotificationService

@Component({
  selector: 'app-my-tickets',
  standalone: false,
  templateUrl: './my-tickets.html',
  styleUrls: ['./my-tickets.css']
})
export class MyTickets implements OnInit {
  tickets: any[] = [];
  loading = true;
  error = '';
  adminId = 1; // Replace with actual admin ID from auth service
  
  // Modal properties
  showModal = false;
  selectedTicket: any = null;
  adminMessage = '';

  constructor(private http: HttpClient, private notificationService: NotificationService) {} // <-- Inject NotificationService

  ngOnInit(): void {
    this.loadMyTickets();
  }

  loadMyTickets(): void {
    this.loading = true;
    this.http.get(`https://localhost:7265/api/Support/viewMyAssignedTickets/${this.adminId}`).subscribe({
      next: (data: any) => {
        this.tickets = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading my tickets', err);
        this.error = 'Failed to load your tickets';
        this.loading = false;
      }
    });
  }

  markAsComplete(ticket: any): void {
    // Open modal instead of confirm
    this.selectedTicket = ticket;
    this.adminMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTicket = null;
    this.adminMessage = '';
  }

  submitComplete(): void {
    if (!this.adminMessage.trim()) {
      this.notificationService.show('Please enter a comment before submitting', 3000);
      return;
    }

    const resolveData = {
      ticketId: this.selectedTicket.ticketId,
      userId: this.adminId,
      adminMessage: this.adminMessage
    };

    this.http.post('https://localhost:7265/api/Support/resolveTicket', resolveData).subscribe({
      next: () => {
        // REMOVE THE CARD FROM MY TICKETS IMMEDIATELY FIRST
        const ticketIdToRemove = this.selectedTicket.ticketId;
        this.tickets = this.tickets.filter(t => t.ticketId !== ticketIdToRemove);
        
        // Then close modal and show notification
        this.closeModal();
        this.notificationService.show('Ticket marked as complete!', 3000);
      },
      error: (err) => {
        console.error('Failed to resolve ticket', err);
        this.notificationService.show('Failed to mark ticket as complete', 3000);
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

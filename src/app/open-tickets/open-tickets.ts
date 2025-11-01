import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service';  // <-- Import NotificationService

@Component({
  selector: 'app-open-tickets',
  standalone: false,
  templateUrl: './open-tickets.html',
  styleUrls: ['./open-tickets.css']
})
export class OpenTickets implements OnInit {
  tickets: any[] = [];
  loading = true;
  error = '';
  adminId = 1; // Replace with actual admin ID from auth service

  constructor(private http: HttpClient, private notificationService: NotificationService) {}  // <-- Inject NotificationService

  ngOnInit(): void {
    this.loadOpenTickets();
  }

  loadOpenTickets(): void {
    this.loading = true;
    // Make sure you include the userId in the URL
    const userId = this.adminId; // or get it dynamically from your auth service

    this.http.get(`https://localhost:7265/api/Support/viewAllOpenTickets`).subscribe({
      next: (data: any) => {
        // Filter out tickets that have ticketStatus as 'Assigned' or have an assignedAdminId
        this.tickets = (data || []).filter((ticket: any) => 
          ticket.ticketStatus !== 'Assigned' && !ticket.assignedAdminId
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading open tickets', err);
        this.error = 'Failed to load open tickets';
        this.loading = false;
        this.notificationService.show('Failed to load open tickets', 3000); // <-- Notification on error
      }
    });
  }

  assignToMe(ticket: any): void {
    this.http.post(`https://localhost:7265/api/Support/assignToMe?ticketId=${ticket.ticketId}&adminId=${this.adminId}`, {}).subscribe({
      next: (response: any) => {
        this.notificationService.show('Ticket assigned to you successfully!', 3000); // <-- Success Notification
        // REMOVE THE CARD FROM OPEN TICKETS IMMEDIATELY
        this.tickets = this.tickets.filter(t => t.ticketId !== ticket.ticketId);
      },
      error: (err) => {
        console.error('Failed to assign ticket', err);
        this.notificationService.show('Failed to assign ticket', 3000); // <-- Error Notification
      }
    });
  }

  markAsComplete(ticket: any): void {
    if (!ticket.assignedAdminId) {
      this.notificationService.show('Please assign the ticket to yourself first before marking it complete.', 3000);
      return;
    }

    if (ticket.assignedAdminId !== this.adminId) {
      this.notificationService.show('This ticket is assigned to another admin.', 3000);
      return;
    }

    if (confirm(`Mark Ticket #${ticket.ticketId} as complete?`)) {
      const resolveData = {
        ticketId: ticket.ticketId,
        userId: this.adminId,
        adminMessage: 'Ticket resolved by admin'
      };

      this.http.post('https://localhost:7265/api/Support/resolveTicket', resolveData).subscribe({
        next: () => {
          this.notificationService.show('Ticket marked as complete!', 3000); // <-- Success Notification
          // REMOVE THE CARD FROM OPEN TICKETS IMMEDIATELY
          this.tickets = this.tickets.filter(t => t.ticketId !== ticket.ticketId);
        },
        error: (err) => {
          console.error('Failed to resolve ticket', err);
          this.notificationService.show('Failed to mark ticket as complete', 3000); // <-- Error Notification
        }
      });
    }
  }

  isAssignedToMe(ticket: any): boolean {
    return ticket.assignedAdminId === this.adminId;
  }

  isAssignedToOther(ticket: any): boolean {
    return ticket.assignedAdminId && ticket.assignedAdminId !== this.adminId;
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

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resolved-tickets',
  standalone: false,
  templateUrl: './resolved-tickets.html',
  styleUrls: ['./resolved-tickets.css']
})
export class ResolvedTickets implements OnInit {
  tickets: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClosedTickets();
  }

  loadClosedTickets(): void {
    this.loading = true;
    this.http.get('https://localhost:7265/api/Support/viewAllResolvedTickets').subscribe({
      next: (data: any) => {
        this.tickets = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading closed tickets', err);
        this.error = 'Failed to load resolved tickets';
        this.loading = false;
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
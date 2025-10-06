// src/app/api-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // base URL of backend
  private baseUrl = 'https://localhost:7265/api';

  constructor(private http: HttpClient) {}

  // Generic GET
  get(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${endpoint}`);
  }

  // Generic POST
  post(endpoint: string, body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${endpoint}`, body);
  }

  // Generic PUT
  put(endpoint: string, body: any = {}): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${endpoint}`, body);
  }

  // Generic DELETE
  delete(endpoint: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${endpoint}`);
  }
}

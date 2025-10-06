import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api-service';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  menuItems: any[] = [];
  loading = true;
  error = '';

  showEditModal = false;
  showDeleteModal = false;
  editForm: FormGroup;
  currentItem: any | null = null;
  itemToDelete: any | null = null;

  constructor(private api: ApiService, private fb: FormBuilder) {
  this.editForm = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    isAvailable: [true]
  });
}

  ngOnInit(): void {
    this.loadMenu();
  }

  private loadMenu(): void {
    this.loading = true;
    this.error = '';
    const restId = localStorage.getItem('restId');

    if (!restId) {
      this.error = 'Restaurant not detected. Please login as a restaurant first.';
      this.loading = false;
      return;
    }

    this.api.get(`Restaurants/Menu/${restId}`).subscribe({
      next: (data: any[]) => {
        this.menuItems = data || [];
        this.loading = false;
        console.log('[Menu] Menu items loaded:', this.menuItems);
      },
      error: (err: any) => {
        console.error('[Menu] Failed to load menu', err);
        this.error = 'Failed to load menu';
        this.loading = false;
      }
    });
  }

  // FIXED: Prevent event propagation
  openEdit(item: any): void {
    this.currentItem = { ...item };
    this.editForm.patchValue({
      name: item.name ?? '',
      category: item.category ?? '',
      price: item.price ?? 0,
      description: item.description ?? '',
      isAvailable: !!item.isAvailable
    });
    
    // Delay modal opening to prevent immediate backdrop click
    setTimeout(() => {
      this.showEditModal = true;
      console.log('[Menu] Edit modal opened');
    }, 100);
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.currentItem) {
      this.editForm.markAllAsTouched();
      return;
    }

    const updatedBody = {
      name: this.editForm.value.name,
      description: this.editForm.value.description,
      price: this.editForm.value.price,
      category: this.editForm.value.category,
      isAvailable: this.editForm.value.isAvailable
    };

    const foodId = this.currentItem.foodId;

    this.api.put(`Foods/UpdateFood/${foodId}`, updatedBody).subscribe({
      next: () => {
        const idx = this.menuItems.findIndex(m => m.foodId === foodId);
        if (idx >= 0) {
          this.menuItems[idx] = { ...this.menuItems[idx], ...updatedBody };
        }
        alert('✅ Food item updated successfully!');
        this.showEditModal = false;
        this.currentItem = null;
        this.editForm.reset();
      },
      error: (err: any) => {
        console.error('[Menu] Update failed:', err);
        alert('❌ Failed to update food item.');
      }
    });
  }

  cancelEdit(): void {
    this.showEditModal = false;
    this.currentItem = null;
    this.editForm.reset();
  }

  // FIXED: Prevent event propagation
  openDelete(item: any): void {
    this.itemToDelete = item;
    
    // Delay modal opening to prevent immediate backdrop click
    setTimeout(() => {
      this.showDeleteModal = true;
      console.log('[Menu] Delete modal opened');
    }, 100);
  }

  confirmDelete(): void {
    if (!this.itemToDelete) return;

    const foodId = this.itemToDelete.foodId;

    this.api.delete(`Foods/DeleteFood/${foodId}`).subscribe({
      next: () => {
        this.menuItems = this.menuItems.filter(m => m.foodId !== foodId);
        alert('🗑️ Food item deleted successfully!');
        this.showDeleteModal = false;
        this.itemToDelete = null;
      },
      error: (err: any) => {
        console.error('[Menu] Delete failed:', err);
        alert('❌ Failed to delete item.');
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  formatPrice(p: any): string {
    if (p == null) return '';
    const n = Number(p);
    return isNaN(n) ? String(p) : `₹ ${n.toFixed(2)}`;
  }
}
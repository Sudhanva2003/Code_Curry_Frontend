import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthGuard } from '../auth.guard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
  standalone: false
})
export class Menu implements OnInit {
  menuItems: any[] = [];
  loading = true;
  error = '';
  restId: number | null = null;

  defaultFoodUrl = 'https://static.vecteezy.com/system/resources/previews/004/204/922/non_2x/food-logo-template-design-icon-illustration-vector.jpg';

  // Popup state
  showEditPopup = false;
  showDeletePopup = false;
  showAddPopup = false;
  formSubmitted = false;

  // Forms
  editForm: FormGroup;
  addForm: FormGroup;
  currentItem: any = null;

  searchTerm: string = '';

  // Category options for dropdown
  categories: string[] = ['Veg', 'Non Veg', 'Vegan'];

  constructor(private auth: AuthGuard, private http: HttpClient, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      foodStatus: ['Available'],
      foodImageUrl: ['']
    });

    this.addForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      foodStatus: ['Available'],
      foodImageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.restId = this.auth.getRestId();
    if (this.restId === null) {
      this.error = 'Restaurant not detected. Please login as a restaurant first.';
      this.loading = false;
      return;
    }
    this.loadMenu();
  }

  loadMenu(): void {
    this.loading = true;
    this.error = '';
    this.http.get(`https://localhost:7265/api/Restaurant/Menu/${this.restId}`).subscribe({
      next: (data: any) => {
        this.menuItems = data.map((item: any) => ({
          ...item,
          foodImageUrl: item.foodImageUrl || this.defaultFoodUrl
        })) || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load menu', err);
        this.error = 'Failed to load menu';
        this.loading = false;
      }
    });
  }

  searchFoods(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      this.loadMenu();
      return;
    }

    this.loading = true;
    this.http.get(`https://localhost:7265/api/Foods/Search?name=${term}`).subscribe({
      next: (data: any) => {
        this.menuItems = data
          .filter((f: any) => f.restId === this.restId)
          .map((item: any) => ({
            ...item,
            foodImageUrl: item.foodImageUrl || this.defaultFoodUrl
          }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Search failed', err);
        this.error = 'Search failed';
        this.loading = false;
      }
    });
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // ---------- ADD ----------
  openAddPopup(): void {
    this.addForm.reset({
      name: '',
      category: '',
      price: 0,
      description: '',
      foodStatus: 'Available',
      foodImageUrl: ''
    });
    this.showAddPopup = true;
    this.formSubmitted = false;
  }

  onAddSave(): void {
    this.formSubmitted = true;
    if (this.addForm.invalid || this.restId === null) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const foodUrl = this.addForm.value.foodImageUrl;
    const newFood = {
      restId: this.restId,
      ...this.addForm.value,
      foodImageUrl: foodUrl && this.isValidUrl(foodUrl) ? foodUrl : this.defaultFoodUrl
    };

    this.http.post(`https://localhost:7265/api/Foods/AddFood`, newFood).subscribe({
      next: (res: any) => {
        this.menuItems.push(res);
        this.closePopup();
        alert('Food item added successfully');
      },
      error: (err) => {
        console.error('Failed to add food', err);
        alert('Add failed: ' + JSON.stringify(err.error?.errors || err.message));
      }
    });
  }

  // ---------- EDIT ----------
  onEdit(item: any): void {
    this.currentItem = { ...item };
    this.editForm.setValue({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      foodStatus: item.foodStatus,
      foodImageUrl: item.foodImageUrl || ''
    });
    this.showEditPopup = true;
    this.formSubmitted = false;
  }

  onSave(): void {
    this.formSubmitted = true;
    if (this.editForm.invalid || !this.currentItem) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const foodId = this.currentItem.foodId;
    const formValue = this.editForm.value;
    const updatedItem = {
      ...formValue,
      foodImageUrl: formValue.foodImageUrl && this.isValidUrl(formValue.foodImageUrl)
        ? formValue.foodImageUrl
        : this.defaultFoodUrl
    };

    this.http.put(`https://localhost:7265/api/Foods/UpdateFood/${foodId}`, updatedItem).subscribe({
      next: () => {
        const index = this.menuItems.findIndex(m => m.foodId === foodId);
        if (index !== -1) {
          this.menuItems[index] = { ...this.menuItems[index], ...updatedItem };
        }
        this.closePopup();
        alert('Food item updated successfully');
      },
      error: (err) => {
        console.error('Failed to update food', err);
        alert('Update failed: ' + JSON.stringify(err.error?.errors || err.message));
      }
    });
  }

  // ---------- DELETE ----------
  onDelete(item: any): void {
    if (confirm('Are you sure you want to delete this food item?')) {
      const foodId = item.foodId;
      this.http.delete(`https://localhost:7265/api/Foods/DeleteFood/${foodId}`).subscribe({
        next: () => {
          this.menuItems = this.menuItems.filter(m => m.foodId !== foodId);
          alert('Food item deleted');
        },
        error: (err) => {
          console.error('Failed to delete food', err);
          alert('Delete failed');
        }
      });
    }
  }

  closePopup(): void {
    this.showEditPopup = false;
    this.showAddPopup = false;
    this.currentItem = null;
    this.editForm.reset();
    this.addForm.reset();
    this.formSubmitted = false;
  }

  formatPrice(p: any): string {
    const n = Number(p);
    return isNaN(n) ? String(p) : `₹ ${n.toFixed(2)}`;
  }
}

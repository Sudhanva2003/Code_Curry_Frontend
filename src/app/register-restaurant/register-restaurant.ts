// // import { Component } from '@angular/core';
// // import { FormBuilder, Validators, FormGroup } from '@angular/forms';
// // import { Router } from '@angular/router';
// // import { AuthGuard } from '../auth.guard';
// // import { HttpClient } from '@angular/common/http';

// // @Component({
// //   selector: 'register-restaurant',
// //   standalone: false,
// //   templateUrl: 'register-restaurant.html',
// //   styleUrls: ['./register-restaurant.css']
// // })
// // export class RegisterRestaurant {
// //   form: FormGroup;

// //   constructor(
// //     private fb: FormBuilder,
// //     private router: Router,
// //     private auth: AuthGuard,
// //     private http: HttpClient
// //   ) {
// //     this.form = this.fb.group({
// //       name: ['', Validators.required],
// //       address: ['', Validators.required],
// //       email: ['', [Validators.required, Validators.email]],
// //       phone: ['', Validators.required],
// //       rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
// //       password: ['', [Validators.required, Validators.minLength(6)]]
// //     });
// //   }

// //   submit() {
// //     if (!this.form.valid) {
// //       alert('Please fill all fields correctly.');
// //       return;
// //     }

// //    // const restaurantData = this.form.value;
// //    const restaurantData = {
// //       name: this.form.value.name,
// //       email: this.form.value.email,
// //       phone: this.form.value.phone,
// //       address: this.form.value.address,
// //       rating:this.form.value.rating,
// //       password: this.form.value.password,
// //       isOpen:true
// //       //role: 'restaurant' // backend defaults to user, kept for clarity
// //     };

// //     // Step 1: Register the restaurant
// //     this.http.post('https://localhost:7265/api/Restaurant/RegisterRestaurant', restaurantData)
// //       .subscribe({
// //         next: () => {
// //           // Step 2: Auto-login using same flow as login.ts
// //           this.http.post<any>('https://localhost:7265/api/users/login', {
// //             email: restaurantData.email,
// //             password: restaurantData.password
// //           }).subscribe({
// //             next: (res) => {
// //               // Save user details using AuthGuard like login.ts
// //               this.auth.setUser(res);

// //               // Redirect based on role
// //               if (res.role === 'restaurant') {
// //                 this.router.navigate(['/restaurant']);
// //               } else {
// //                 this.router.navigate(['/user']);
// //               }
// //             },
// //             error: () => {
// //               alert('Login failed after registration.');
// //             }
// //           });
// //         },
// //         error: (err) => {
// //           if(err.status===409){
// //             alert("email already exists");
// //           }
// //           else{
// //           alert('Restaurant registration failed.');
// //           }
// //         }
// //       });
// //   }
// // }

// import { Component } from '@angular/core';
// import { FormBuilder, Validators, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthGuard } from '../auth.guard';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'register-restaurant',
//   standalone: false,
//   templateUrl: 'register-restaurant.html',
//   styleUrls: ['./register-restaurant.css']
// })
// export class RegisterRestaurant {
//   form: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private auth: AuthGuard,
//     private http: HttpClient
//   ) {
//     this.form = this.fb.group({
//       name: ['', Validators.required],
//       address: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', Validators.required],
//       rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   submit() {
//     if (!this.form.valid) {
//       alert('Please fill all fields correctly.');
//       return;
//     }

//     const restaurantData = {
//       name: this.form.value.name,
//       email: this.form.value.email,
//       phone: this.form.value.phone,
//       address: this.form.value.address,
//       rating: this.form.value.rating,
//       password: this.form.value.password,
//       isOpen: true  // ✅ required by backend model
//     };

//     // Step 1: Register restaurant
//     this.http.post('https://localhost:7265/api/Restaurant/RegisterRestaurant', restaurantData)
//       .subscribe({
//         next: () => {
//           // Step 2: Auto-login after successful registration
//           this.http.post<any>('https://localhost:7265/api/users/login', {
//             email: restaurantData.email,
//             password: restaurantData.password
//           }).subscribe({
//             next: (res) => {
//               // Save user data in AuthGuard
//               this.auth.setUser(res);

//               // Redirect based on role
//               if (res.role === 'restaurant') {
//                 this.router.navigate(['/restaurant']);
//               } else {
//                 this.router.navigate(['/user']);
//               }
//             },
//             error: () => {
//               alert('Login failed after registration.');
//             }
//           });
//         },
//         error: (err) => {
//           if (err.status === 409) {
//             alert('Email already exists.');
//           } else {
//             console.error(err);
//             alert('Restaurant registration failed.');
//           }
//         }
//       });
//   }
// }

import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'register-restaurant',
  standalone: false,
  templateUrl: 'register-restaurant.html',
  styleUrls: ['./register-restaurant.css']
})
export class RegisterRestaurant {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthGuard,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (!this.form.valid) {
      alert('Please fill all fields correctly.');
      return;
    }

    const restaurantData = {
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone,
      address: this.form.value.address,
      rating: this.form.value.rating,
      password: this.form.value.password,
      isOpen: true,       // required by backend
      role: 'restaurant'  // optional, backend can default
    };

    // Step 1: Register the restaurant
    this.http.post('https://localhost:7265/api/Restaurant/RegisterRestaurant', restaurantData)
      .subscribe({
        next: () => {
          // Step 2: Auto-login using same flow as login.ts
          this.http.post<any>('https://localhost:7265/api/users/login', {
            email: restaurantData.email,
            password: restaurantData.password
          }).subscribe({
            next: (res) => {
              // Save user details using AuthGuard
              this.auth.setUser(res);

              // Redirect based on role
              if (res.role === 'restaurant') {
                this.router.navigate(['/restaurant']);
              } else {
                this.router.navigate(['/user']);
              }
            },
            error: (loginErr) => {
              console.error('Login failed after registration', loginErr);
              alert('Login failed after registration.');
            }
          });
        },
        error: (err: any) => {
          console.error('Registration failed', err);

          // Handle specific backend validation
          if (err.status === 409) {
            alert("Email already exists.");
          } else if (err.status === 400 && err.error?.errors) {
            const messages = Object.values(err.error.errors).flat().join('\n');
            alert("Validation errors:\n" + messages);
          } else {
            alert('Restaurant registration failed.');
          }
        }
      });
  }
}

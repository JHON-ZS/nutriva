import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  edad: number | null = null;
  altura: string = '';
  peso: number | null = null;
  sexo: string = '';
  telefono: string = '';
  isToggled: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(event: Event) {
    event.preventDefault();
    this.http.post('http://localhost:3000/login', { email: this.email, password: this.password })
      .subscribe(response => {
        console.log('✅ Login exitoso', response);
        this.router.navigate(['/inicio']);
      }, error => {
        console.error('❌ Error en el login', error);
      });
  }

  register(event: Event) {
    event.preventDefault();
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      edad: this.edad,
      altura: this.altura,
      peso: this.peso,
      sexo: this.sexo,
      telefono: this.telefono
    };
    
    this.http.post('http://localhost:3000/register', userData)
      .subscribe(response => {
        console.log('✅ Registro exitoso', response);
        this.router.navigate(['/inicio']);
      }, error => {
        console.error('❌ Error en el registro', error);
      });
  }

  toggleToSignUp() {
    this.isToggled = true;
  }

  toggleToSignIn() {
    this.isToggled = false;
  }
}

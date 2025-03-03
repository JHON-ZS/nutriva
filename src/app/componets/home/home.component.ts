import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Importar Router

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {}  // Inyectar Router

  goToLogin() {
    this.router.navigate(['/login']);  // Navegar al componente login
  }
}

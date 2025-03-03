import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Importa RouterModule para las rutas
import { RouterOutlet } from '@angular/router';  // Importa RouterOutlet para renderizar las rutas

@Component({
  selector: 'app-root',
  imports: [RouterModule,RouterOutlet],  // Importa RouterModule en el componente
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Asegúrate de que el nombre sea styleUrls y no styleUrl
})
export class AppComponent {
  title = 'nutriva';  // Título de la aplicación
}

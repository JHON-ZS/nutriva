import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [RouterModule],  // Incluye RouterModule aquí
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Si necesitas usar Web Components
})
export class PrincipalComponent {
  openChatbot() {
    alert("¡Chatbot abierto!");
  }
}

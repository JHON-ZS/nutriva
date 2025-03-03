import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilComponent implements OnInit {
  userId: number | null = null;
  user: any = {}; // Para almacenar los datos del usuario
  editMode: boolean = false; // Modo de edición

  // Campos del formulario
  userFields = [
    { key: 'username', label: 'Usuario', icon: 'person-outline' },
    { key: 'email', label: 'Correo', icon: 'mail-outline' },
    { key: 'edad', label: 'Edad', icon: 'calendar-outline' },
    { key: 'altura', label: 'Altura', icon: 'body-outline' },
    { key: 'peso', label: 'Peso', icon: 'fitness-outline' },
    { key: 'sexo', label: 'Sexo', icon: 'male-female-outline' },
    { key: 'telefono', label: 'Teléfono', icon: 'call-outline' }
  ];
  

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = Number(localStorage.getItem('userId')); // Obtener ID del usuario

    if (this.userId) {
      console.log("🟢 ID del usuario:", this.userId);
      this.http.get(`http://localhost:3000/user/${this.userId}`)
        .subscribe((response: any) => {
          if (response.user) {
            this.user = response.user;
            console.log("✅ Datos del usuario recibidos:", this.user);
          }
        }, error => {
          console.error('❌ Error al obtener datos del usuario', error);
        });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  updateProfile() {
    if (this.userId) {
      this.http.put(`http://localhost:3000/update-profile/${this.userId}`, this.user)
        .subscribe(response => {
          console.log('✅ Perfil actualizado', response);
          alert('Perfil actualizado con éxito');
          this.editMode = false;
        }, error => {
          console.error('❌ Error al actualizar el perfil', error);
        });
    }
  }
}

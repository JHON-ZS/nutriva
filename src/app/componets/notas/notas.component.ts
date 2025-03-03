import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notas',
  standalone: true,
    imports: [CommonModule, FormsModule],
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit {
  notaPersonal: string = '';
  imagen: string | null = null;
  registros: { texto: string; imagen?: string }[] = [];
  registroSeleccionado: { texto: string; imagen?: string } | null = null;
  mostrandoRegistros: boolean = false;
  viendoRegistro: boolean = false;
  paginaActual: number = 0;
  registrosPorPagina: number = 5;

  ngOnInit() {
    this.registros = JSON.parse(localStorage.getItem('registros') || '[]');
  }

  guardarNota() {
    if (this.notaPersonal.trim()) {
      const nuevoRegistro = { texto: this.notaPersonal, imagen: this.imagen || '' };
      this.registros.push(nuevoRegistro);
      localStorage.setItem('registros', JSON.stringify(this.registros));
      this.notaPersonal = '';
      this.imagen = null;
    }
  }

  subirFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagen = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  verRegistros() {
    this.mostrandoRegistros = !this.mostrandoRegistros;
  }

  verDetalleRegistro(index: number) {
    this.registroSeleccionado = this.registros[index];
    this.viendoRegistro = true;
    this.mostrandoRegistros = false;
  }

  volverANuevaNota() {
    this.viendoRegistro = false;
    this.registroSeleccionado = null;
  }

  cambiarPagina(direccion: number) {
    this.paginaActual += direccion;
  }

  registrosPaginados() {
    const inicio = this.paginaActual * this.registrosPorPagina;
    return this.registros.slice(inicio, inicio + this.registrosPorPagina);
  }

  get maxPaginas() {
    return Math.ceil(this.registros.length / this.registrosPorPagina);
  }
}
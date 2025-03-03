import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EjercicioService } from '../../services/ejercicio.service';

@Component({
  selector: 'app-ejercicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ejercicios.component.html',
  styleUrls: ['./ejercicios.component.css'],
})
export class EjerciciosComponent implements OnInit {
  currentStep = 1;
  selectedCategory: string | null = null;
  ejercicios: any[] = [];
  selectedEjercicio: any = null;
  isLoading = false;
  errorMessage = '';

  // Mapeo de categorías para la API
  categoriasEjercicio = [
    { tipo: 'cardio', title: 'Ejercicios cardiovasculares', description: 'Para quemar grasa.', icon: '❤️' },
    { tipo: 'upper legs', title: 'Piernas', description: 'Fortalece tus piernas.', icon: '🦵' },
    { tipo: 'waist', title: 'Abdomen', description: 'Ejercicios para el core.', icon: '🏋️' },
    { tipo: 'chest', title: 'Pecho', description: 'Ejercicios para pectorales.', icon: '🏆' },
    { tipo: 'back', title: 'Espalda', description: 'Fortalece tu espalda.', icon: '💪' }
  ];

  constructor(private ejercicioService: EjercicioService) {}

  ngOnInit(): void {}

  // Método para seleccionar una categoría y obtener los ejercicios desde la API
  selectCategory(category: any) {
    this.selectedCategory = category.tipo ?? ''; // Asegura que siempre sea un string
    this.currentStep = 2;
    this.isLoading = true;
    this.errorMessage = '';
  
    if (!this.selectedCategory) {
      this.errorMessage = 'Categoría inválida.';
      this.isLoading = false;
      return;
    }
  
    this.ejercicioService.getEjerciciosByCategory(this.selectedCategory).subscribe(
      (data: any) => {
        this.ejercicios = data;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error al obtener ejercicios:', error);
        this.errorMessage = 'Error al cargar los ejercicios. Intenta de nuevo más tarde.';
        this.isLoading = false;
      }
    );
  }
  
  selectEjercicio(ejercicio: any) {
    this.selectedEjercicio = ejercicio;
    this.currentStep = 3;
  }

  goBack() {
    if (this.currentStep === 3) {
      this.currentStep = 2;
      this.selectedEjercicio = null;
    } else if (this.currentStep === 2) {
      this.currentStep = 1;
      this.selectedCategory = null;
      this.ejercicios = [];
    }
  }
}

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';  // Importar Chart.js

Chart.register(...registerables);  // Registrar todos los elementos de Chart.js necesarios

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
})
export class CalendarioComponent implements OnInit, AfterViewInit, OnDestroy {
  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  daysInMonth: number[] = [];
  paddedDays: number[] = [];
  weightHistory: { date: Date; weight: number }[] = []; // Historial de pesos (con fechas)

  emotions = [
    { name: 'Feliz', icon: '😊' },
    { name: 'Ansioso', icon: '😟' },
    { name: 'Cansado', icon: '😴' },
    { name: 'Triste', icon: '😢' },
  ];

  emotionalState: string = '';
  customNotes: string = '';
  symptoms: string = '';
  meals: string[] = ['Desayuno', 'Almuerzo', 'Cena'];
  foodLog: { [key: string]: string } = {};
  currentWeight: number | null = null;  // Inicializa como null
  selectedDay: number | null = null;
  currentQuestion: number = 0; // Control de preguntas

  private weightChart: Chart | null = null;  // Mantener una referencia al gráfico

  // Nueva función para cerrar la ventana flotante de emociones
  closeFloatingWindow(): void {
    this.currentQuestion = 1; // Avanzar a la siguiente pregunta
  }

  // Nueva función para cerrar la ventana flotante de opciones de peso
  closeFloatingOptions(): void {
    this.currentQuestion = 0; // Restablecer las preguntas a la inicial
    this.selectedDay = null; // Cerrar la selección de día
  }

  ngOnInit(): void {
    this.generateCalendar();
    this.loadWeightHistory();
  }

  ngAfterViewInit(): void {
    this.createWeightChart(); // Crear el gráfico solo una vez
  }

  ngOnDestroy(): void {
    if (this.weightChart) {
      this.weightChart.destroy(); // Destruir el gráfico cuando el componente sea destruido
    }
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
    this.paddedDays = Array(firstDay.getDay()).fill(0).concat(this.daysInMonth);
    while (this.paddedDays.length < 42) {
      this.paddedDays.push(0);
    }
  }

  isToday(day: number): boolean {
    return (
      this.currentDate.getDate() === day &&
      this.currentMonth === this.currentDate.getMonth() &&
      this.currentYear === this.currentDate.getFullYear()
    );
  }

  previousMonth(): void {
    this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
    this.currentYear -= this.currentMonth === 11 ? 1 : 0;
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
    this.currentYear += this.currentMonth === 0 ? 1 : 0;
    this.generateCalendar();
  }

  selectDay(day: number): void {
    if (day !== 0) {
      this.selectedDay = day;
      this.currentQuestion = 0; // Reinicia preguntas
      this.resetDailyInputs();
    }
  }

  extQuestion(): void {
    this.currentQuestion += 1;
  }

  submitEmotion(emotion: string): void {
    this.emotionalState = emotion;
    this.extQuestion();
  }

  resetDailyInputs(): void {
    this.emotionalState = '';
    this.customNotes = '';
    this.symptoms = '';
    this.foodLog = {};
    this.currentWeight = null;  // Se restablece a null
  }

  recordMeal(meal: string, description: string): void {
    this.foodLog[meal] = description;
  }

  uploadPhoto(event: Event, meal: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      console.log(`Foto cargada para ${meal}:`, input.files[0]);
    }
  }

  /** Cargar historial de pesos (simulación de base de datos) */
  loadWeightHistory(): void {
    this.weightHistory = [
      { date: new Date('2025-01-28'), weight: 70 },
      { date: new Date('2025-01-29'), weight: 69.5 },
      { date: new Date('2025-01-30'), weight: 69 },
      { date: new Date('2025-01-31'), weight: 68.7 },
    ]; // Ejemplo de datos históricos
  }

  // Crear gráfico de peso (solo una vez)
  createWeightChart(): void {
    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;
    if (ctx) {
      this.weightChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.weightHistory.map(record => record.date.toLocaleDateString()),
          datasets: [{
            label: 'Peso (kg)',
            data: this.weightHistory.map(record => record.weight),
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    }
  }

  // Actualizar gráfico con nuevos datos de peso
  updateWeightChart(): void {
    if (this.weightChart) {
      this.weightChart.data.labels = this.weightHistory.map(record => record.date.toLocaleDateString());
      this.weightChart.data.datasets[0].data = this.weightHistory.map(record => record.weight);
      this.weightChart.update();
    }
  }

  isValidWeight(weight: number | null): boolean {
    return weight !== null && !isNaN(weight) && weight > 0;
  }

  // Validar que las respuestas sean solo palabras (sin números)
  isValidTextResponse(response: string): boolean {
    const regex = /^[A-Za-z\s]+$/;  // Solo letras y espacios
    return regex.test(response);
  }

  // Evento para manejar la entrada de peso
  onWeightInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    if (value && value < 0.1) {
      input.value = '0.1';  // Si el valor es menor a 0.1, se ajusta a 0.1
    }
    this.currentWeight = parseFloat(input.value) || null;  // Manejo adecuado de valores nulos
  }

  // Función para avanzar a la siguiente pregunta
  submitMealResponse(): void {
    if (this.foodLog[this.meals[this.currentQuestion - 1]] && this.isValidTextResponse(this.foodLog[this.meals[this.currentQuestion - 1]])) {
      this.extQuestion();
    } else {
      alert("Por favor ingresa una respuesta válida.");
    }
  }

  submitWeightResponse(): void {
    if (this.isValidWeight(this.currentWeight)) {
      const newRecord = { date: new Date(), weight: this.currentWeight! }; // Usamos el operador "!" para asegurar que no sea null en este punto
      this.weightHistory.push(newRecord);
      this.updateWeightChart(); // Actualiza el gráfico de peso
    } else {
      alert('Por favor ingresa un peso válido.');
    }
    this.resetDailyInputs();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EjercicioService {
  private apiUrl = 'https://exercisedb.p.rapidapi.com/exercises';

  private headers = new HttpHeaders({
    'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
    'x-rapidapi-key': '51a37fbee5msh521f3492893686fp1d641djsn882105a3f0d5', // Reemplázala con tu clave API válida
  });

  private googleTranslateApi = 'https://translation.googleapis.com/language/translate/v2?key=TU_CLAVE_GOOGLE';

  constructor(private http: HttpClient) {}

  getEjerciciosByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bodyPart/${category}`, { headers: this.headers }).pipe(
      map((ejercicios) => ejercicios.map((ejercicio) => ({
        ...ejercicio,
        name: this.traducirNombre(ejercicio.name), // Traducir el nombre
        description: this.generarDescripcion(ejercicio) // Añadir descripción
      })))
    );
  }

  private traducirNombre(ingles: string): string {
    const traducciones: { [key: string]: string } = {
      'push-up': 'Flexión de brazos',
      'squat': 'Sentadilla',
      'pull-up': 'Dominadas',
      'lunges': 'Zancadas',
      'deadlift': 'Peso muerto'
      // Agrega más términos según sea necesario
    };
    return traducciones[ingles.toLowerCase()] || ingles;
  }

  private generarDescripcion(ejercicio: any): string {
    if (ejercicio.bodyPart === 'chest') {
      return 'Ejercicio para fortalecer los músculos pectorales.';
    }
    if (ejercicio.bodyPart === 'back') {
      return 'Ejercicio para fortalecer la espalda y mejorar la postura.';
    }
    if (ejercicio.bodyPart === 'upper legs') {
      return 'Ejercicio para fortalecer las piernas y mejorar la resistencia.';
    }
    return 'Ejercicio para mejorar fuerza y movilidad.';
  }
}

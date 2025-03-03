import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-dietas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dietas.component.html',
  styleUrls: ['./dietas.component.css']
})
export class DietasComponent implements OnInit {
  currentStep = 1;
  recipes: any[] = [];
  selectedObjective: string = '';
  selectedDieta: string = '';

  // 🔹 Opciones de objetivos
  objetivoOptions = [
    { title: 'Bajar de Peso', description: 'Dietas enfocadas en pérdida de grasa.', value: 'bajar' },
    { title: 'Subir de Peso', description: 'Dietas enfocadas en ganar masa muscular.', value: 'subir' }
  ];

  // 🔹 Categorías de TheMealDB clasificadas por objetivo
  categoriasBajarPeso = ['Seafood', 'Vegan', 'Vegetarian', 'Starter', 'Side', 'Miscellaneous'];
  categoriasSubirPeso = ['Beef', 'Chicken', 'Pasta', 'Pork', 'Lamb', 'Goat', 'Dessert'];

  // 🔹 Opciones de dieta
  allDietaOptions = [
    { title: 'Carnes Rojas', description: 'Recetas con carne de res.', query: 'Beef', type: 'subir' },
    { title: 'Desayunos', description: 'Opciones para empezar el día.', query: 'Breakfast', type: 'bajar' },
    { title: 'Pollo', description: 'Platos preparados con pollo.', query: 'Chicken', type: 'subir' },
    { title: 'Postres', description: 'Dulces y postres deliciosos.', query: 'Dessert', type: 'subir' },
    { title: 'Cabra', description: 'Platos con carne de cabra.', query: 'Goat', type: 'subir' },
    { title: 'Cordero', description: 'Recetas a base de cordero.', query: 'Lamb', type: 'subir' },
    { title: 'Variado', description: 'Platos diversos e internacionales.', query: 'Miscellaneous', type: 'bajar' },
    { title: 'Pasta', description: 'Recetas con todo tipo de pastas.', query: 'Pasta', type: 'subir' },
    { title: 'Cerdo', description: 'Recetas con carne de cerdo.', query: 'Pork', type: 'subir' },
    { title: 'Mariscos', description: 'Platos con pescados y mariscos.', query: 'Seafood', type: 'bajar' },
    { title: 'Acompañamientos', description: 'Platos secundarios y guarniciones.', query: 'Side', type: 'bajar' },
    { title: 'Entradas', description: 'Aperitivos y entrantes deliciosos.', query: 'Starter', type: 'bajar' },
    { title: 'Vegano', description: 'Libre de productos animales.', query: 'Vegan', type: 'bajar' },
    { title: 'Vegetariano', description: 'Sin carne, pero lleno de sabor.', query: 'Vegetarian', type: 'bajar' }
  ];

  dietaOptions: any[] = []; // 🔹 Dietas filtradas según objetivo seleccionado

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {}

  // 🔹 Seleccionar Objetivo
  selectObjective(objetivo: string) {
    this.selectedObjective = objetivo;
    this.dietaOptions = this.allDietaOptions.filter(option => option.type === objetivo);
    this.currentStep = 2;
  }

  // 🔹 Seleccionar Dieta
  selectDieta(option: any) {
    this.selectedDieta = option.title;
    this.recipeService.getRecipes(option.query).subscribe(response => {
      this.recipes = response.meals ? response.meals.map((meal: any) => ({
        name: meal.strMeal,
        image: meal.strMealThumb,
        ingredients: this.getIngredients(meal)
      })) : [];
      this.currentStep = 3;
    });
  }

  // 🔹 Extraer ingredientes
  getIngredients(meal: any): string[] {
    let ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      let ingredient = meal[`strIngredient${i}`];
      let measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(`${measure} ${ingredient}`.trim());
      }
    }
    return ingredients;
  }

  selectedRecipe: any = null;

  // 🔹 Seleccionar Receta
  selectRecipe(recipe: any) {
    this.selectedRecipe = recipe;
    this.currentStep = 4;
  }

  // 🔹 Volver a un paso anterior
  goBack() {
    this.currentStep--;
  }
}

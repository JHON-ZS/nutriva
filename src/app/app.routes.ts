import { Routes } from '@angular/router';
import { HomeComponent } from './componets/home/home.component';
import { LoginComponent } from './componets/login/login.component';
import { PrincipalComponent } from './componets/principal/principal.component';
import { CalendarioComponent } from './componets/calendario/calendario.component';
import { DietasComponent } from './componets/dietas/dietas.component';
import { NotasComponent } from './componets/notas/notas.component';
import { EjerciciosComponent } from './componets/ejercicios/ejercicios.component';
import { CalculadoraComponent } from './componets/calculadora/calculadora.component';
import { PerfilComponent } from './componets/perfil/perfil.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home page' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: 'inicio', component: PrincipalComponent, title: 'Principal', children: [
      { path: 'calendario', component: CalendarioComponent, title: 'Calendario' },
      { path: 'dietas', component: DietasComponent, title: 'Dietas' },
      { path: 'notas', component: NotasComponent, title: 'Notas' },
      { path: 'ejercicios', component: EjerciciosComponent, title: 'Ejercicios' },
      { path: 'calculadora', component: CalculadoraComponent, title: 'Calculadora' },
      { path: 'perfil', component: PerfilComponent, title: 'Perfil' },
    ]
  },
];

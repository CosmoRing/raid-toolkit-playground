import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FoodManagerComponent } from './dashboard/food-manager/food-manager.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'food-manager', component: FoodManagerComponent
      },
      { path: '', redirectTo: 'food-manager', pathMatch: 'full' }
    ],
  },
  { path: '**', redirectTo: 'food-manager' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

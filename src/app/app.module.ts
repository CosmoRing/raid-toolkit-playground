import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FoodManagerComponent } from './dashboard/food-manager/food-manager.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FoodCardComponent } from './dashboard/food-manager/food-card/food-card.component';
import { HeroStarLabelPipe } from './shared/pipes/hero-star-label.pipe';
import { FoodResumeComponent } from './dashboard/food-manager/food-resume/food-resume.component';
import { FoodCostsComponent } from './dashboard/food-manager/food-costs/food-costs.component';
import { ResumeInfoDialogComponent } from './dashboard/food-manager/food-resume/resume-info-dialog/resume-info-dialog.component';
import { DialogFoodResumeHelperComponent } from './dashboard/food-manager/food-resume/dialog-food-resume-helper/dialog-food-resume-helper.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FoodManagerComponent,
    FoodCardComponent,
    HeroStarLabelPipe,
    FoodResumeComponent,
    FoodCostsComponent,
    ResumeInfoDialogComponent,
    DialogFoodResumeHelperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

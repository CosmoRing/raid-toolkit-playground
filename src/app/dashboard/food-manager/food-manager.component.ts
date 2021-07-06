import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { FoodManagerService } from './food-manager.service';
import { DialogFoodResumeHelperComponent } from './food-resume/dialog-food-resume-helper/dialog-food-resume-helper.component';

@UntilDestroy()
@Component({
  selector: 'app-food-manager',
  templateUrl: './food-manager.component.html',
  styleUrls: ['./food-manager.component.scss']
})
export class FoodManagerComponent implements OnInit {

  private loadSubscription: Subscription | null = null;

  constructor(public foodManagerService: FoodManagerService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadFood();
  }

  public openInfo(): void {
    this.dialog.open(DialogFoodResumeHelperComponent);
  }

  private loadFood(): void {
    if (!(this.loadSubscription?.closed ?? true)) {
      this.loadSubscription?.unsubscribe();
    }

    this.loadSubscription = this.foodManagerService.loadHeroes().pipe(
      untilDestroyed(this)
    ).subscribe();
  }
}

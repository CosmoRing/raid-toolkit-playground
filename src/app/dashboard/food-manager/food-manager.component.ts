import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { FoodManagerService } from './food-manager.service';

@UntilDestroy()
@Component({
  selector: 'app-food-manager',
  templateUrl: './food-manager.component.html',
  styleUrls: ['./food-manager.component.scss']
})
export class FoodManagerComponent implements OnInit {

  private loadSubscription: Subscription | null = null;

  constructor(public foodManagerService: FoodManagerService) { }

  ngOnInit(): void {
    this.loadFood();
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

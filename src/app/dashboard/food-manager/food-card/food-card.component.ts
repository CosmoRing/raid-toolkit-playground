import { Component, Input, OnInit } from '@angular/core';
import { HeroInstance } from '@raid-toolkit/types';
import { FoodManagerService } from '../food-manager.service';

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.scss']
})
export class FoodCardComponent implements OnInit {

  @Input() hero: HeroInstance | null = null;

  @Input() isFood: boolean = false;

  constructor(private foodManagerService: FoodManagerService) { }

  ngOnInit(): void { }

  public toogleFoodStatus(): void {
    if (this.hero) {
      if (this.isFood) {
        this.foodManagerService.removeFromFood(this.hero)
      } else {
        this.foodManagerService.addAsFood(this.hero);
      }
    }
  }

}

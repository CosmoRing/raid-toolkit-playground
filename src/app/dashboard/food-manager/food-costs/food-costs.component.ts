import { Component, OnInit } from '@angular/core';
import { FoodManagerService } from '../food-manager.service';

@Component({
  selector: 'app-food-costs',
  templateUrl: './food-costs.component.html',
  styleUrls: ['./food-costs.component.scss']
})
export class FoodCostsComponent implements OnInit {

  constructor(private foodManagerService: FoodManagerService) { }

  ngOnInit(): void {
  }

}

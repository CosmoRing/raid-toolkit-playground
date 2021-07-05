import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { startWith } from 'rxjs/operators';
import { FoodManagerService } from '../food-manager.service';
import { IFoodRankResume } from './viewmodels/interfaces/foodRankResume';

@UntilDestroy()
@Component({
  selector: 'app-food-resume',
  templateUrl: './food-resume.component.html',
  styleUrls: ['./food-resume.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FoodResumeComponent implements OnInit {

  public ranks = [1, 2, 3, 4, 5];

  public foodRankResumes: IFoodRankResume[] = [];

  constructor(private foodManagerService: FoodManagerService) {
    this.createResumes();
  }

  ngOnInit(): void {
    this.foodManagerService.heroesUpdated.pipe(
      startWith(null),
      untilDestroyed(this)
    ).subscribe(() => {
      this.updateResume();
    });
  }

  public toogleIgnoreRank(resume: IFoodRankResume): void {
    resume.ignoreLowerRankFoodInTotal = !resume.ignoreLowerRankFoodInTotal;
    this.updateResume();
  }

  public updateResume(): void {
    this.resetFoodRankResumes();
    for (let food of this.foodManagerService.foodHeroes) {
      const resume = this.foodRankResumes.find(r => r.rank === food.rank);
      if (resume === undefined) continue;

      resume.foodHeroes.push(food);
      ++resume.currentFood;
      if (food.level === resume.maxLevel) {
        ++resume.currentFoodAtMaxLevel;
      }
    }

    for (const resume of this.foodRankResumes) {

      const chickensToUse: number = resume.ignoreChickensInTotal ? 0 : resume.chickens;

      // number of upgrades available at this time
      resume.currentUgradeRankAvailable =
        Math.min(
          // food at max level
          resume.currentFoodAtMaxLevel,
          // upgrades available if used all food and chickens
          // max number is the number of food
          resume.currentFood,
          Math.floor((resume.currentFood + chickensToUse) / resume.foodNeededForUpgradeRank)
        );

      let lowerRankResume: IFoodRankResume | undefined = this.foodRankResumes.find(r => r.rank === resume.rank - 1);

      if (resume.ignoreLowerRankFoodInTotal) {
        resume.totalFood = resume.currentFood;
      } else {
        resume.totalFood = resume.currentFood + (lowerRankResume?.totalUpgradeRankAvailable ?? 0);
      }

      resume.totalUpgradeRankAvailable =
        Math.min(
          resume.totalFood,
          Math.floor((resume.totalFood + chickensToUse) / resume.foodNeededForUpgradeRank)
        );

      resume.missingFoodAtMaxLevelForTotalUgrade =
        Math.max(
          resume.totalUpgradeRankAvailable - resume.currentFoodAtMaxLevel,
          0
        );

      resume.missingRankFoodForNextUpgradeRankList = this.getMissingRankFoodForNUpgradeRankList(resume, 1);
    }
  }

  private getMissingRankFoodForNUpgradeRankList(resume: IFoodRankResume, upgrades: number): number[] {
    const missingRankFoodForNUpgradeRankList: number[] = [
      this.getFoodNeededForUpgrades(resume, upgrades)
    ];
    
    if (resume.ignoreLowerRankFoodInTotal) return missingRankFoodForNUpgradeRankList;
    
    let lowerRankResume: IFoodRankResume | undefined = this.foodRankResumes.find(r => r.rank === resume.rank - 1);

    while (lowerRankResume !== undefined) {
      const previousMissing = missingRankFoodForNUpgradeRankList[
        missingRankFoodForNUpgradeRankList.length - 1
      ];

      missingRankFoodForNUpgradeRankList.push(this.getFoodNeededForUpgrades(lowerRankResume, previousMissing));

      if (lowerRankResume.ignoreLowerRankFoodInTotal) {
        break;
      }

      lowerRankResume = this.foodRankResumes.find(r => r.rank === (lowerRankResume as IFoodRankResume).rank - 1);
    }

    return missingRankFoodForNUpgradeRankList;
  }

  private getFoodNeededForUpgrades(resume: IFoodRankResume, numberUpgrades: number): number {
    const chickensToUse: number = resume.ignoreChickensInTotal ? 0 : resume.chickens;

    // if all food ends upgraded then all upgrades are using chickens
    if (resume.totalUpgradeRankAvailable === resume.totalFood && resume.totalFood !== 0) {
      const chickensAlreadyUsed = (resume.foodNeededForUpgradeRank * resume.totalFood) - resume.totalFood;
      const chickensAvailable = chickensToUse - chickensAlreadyUsed;

      const chickensNeeded = (resume.foodNeededForUpgradeRank - 1) * numberUpgrades;

      // enought chickens to upgrade, only needs foods
      if (chickensAvailable >= chickensNeeded) {
        return numberUpgrades;
      } else {
        // not enougth chickens
        return chickensNeeded - chickensAvailable + numberUpgrades;
      }
    } else {
      return resume.foodNeededForUpgradeRank * (numberUpgrades - 1) +
        (
          resume.foodNeededForUpgradeRank -
          ((resume.totalFood + chickensToUse) % resume.foodNeededForUpgradeRank)
        );
    }
  }

  private resetFoodRankResumes(): void {
    for (const resume of this.foodRankResumes) {
      resume.currentFood = 0;
      resume.currentFoodAtMaxLevel = 0;
      resume.currentUgradeRankAvailable = 0;

      resume.totalFood = 0;
      resume.totalUpgradeRankAvailable = 0;
      resume.missingFoodAtMaxLevelForTotalUgrade = 0;

      resume.missingRankFoodForNextUpgradeRankList = [];
      resume.foodHeroes = [];
    }
  }

  private createResumes(): void {
    const cleanResumes: IFoodRankResume[] = [];
    for (const rank of this.ranks) {
      cleanResumes.push({
        rank: rank,
        maxLevel: rank * 10,
        foodNeededForUpgradeRank: rank + 1,

        chickens: 0,
        ignoreChickensInTotal: false,

        currentFood: 0,
        currentFoodAtMaxLevel: 0,
        currentUgradeRankAvailable: 0,

        // only use lower rank food if current is 3º rank or higher
        ignoreLowerRankFoodInTotal: rank <= 2,
        totalFood: 0,
        totalUpgradeRankAvailable: 0,
        missingFoodAtMaxLevelForTotalUgrade: 0,

        missingRankFoodForNextUpgradeRankList: [],
        foodHeroes: []
      })
    }
    this.foodRankResumes = cleanResumes;
  }
}

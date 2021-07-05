import { HeroInstance } from "@raid-toolkit/types";

export interface IFoodRankResume {
    rank: number;
    maxLevel: number;
    foodNeededForUpgradeRank: number;

    // Chikens
    chickens: number;
    ignoreChickensInTotal: boolean;

    // Current food status
    currentFood: number;
    currentFoodAtMaxLevel: number;
    currentUgradeRankAvailable: number;

    // Max food status
    // Taking in count other rank current status
    ignoreLowerRankFoodInTotal: boolean;
    totalFood: number;
    totalUpgradeRankAvailable: number;
    missingFoodAtMaxLevelForTotalUgrade: number;

    // List of all food needed for current and lower ranks to upgrade
    // Sorted from current rank to lower rank
    missingRankFoodForNextUpgradeRankList: number[];

    // Food
    foodHeroes: HeroInstance[];
}

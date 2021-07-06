import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { HeroInstance } from '@raid-toolkit/types';
import { from, Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ClientService } from '../../shared/services/client.service';

@UntilDestroy()
@Injectable({
    providedIn: 'root'
})
export class FoodManagerService {

    public heroes: HeroInstance[];
    public foodHeroes: HeroInstance[];
    public ignoredHeroes: HeroInstance[];

    private ignoreHeroesIds: number[];

    public heroesUpdated = new Subject<null>();

    constructor(public clientService: ClientService) {
        this.heroes = [];
        this.foodHeroes = [];
        this.ignoredHeroes = [];
        this.ignoreHeroesIds = JSON.parse(localStorage.getItem('rsl-dash-fm-ignore-ids') ?? '[]');
    }

    public loadHeroes(): Observable<HeroInstance[]> {
        return this.clientService.getConnectedClient().pipe(
            switchMap(client => from(client.getHeroes())),
            tap((heroes) => {
                this.heroes = heroes ?? [];
                this.heroes.sort((ha, hb) =>
                    hb.rank !== ha.rank ? hb.rank - ha.rank : (
                        hb.level !== ha.level ? hb.level - ha.level :
                            ha.name.localeCompare(hb.name)
                    )
                );
                this.updateLocalHeroes();
            })
        );
    }

    public removeFromFood(hero: HeroInstance): void {
        if (hero && this.ignoreHeroesIds.indexOf(hero.id) === -1) {
            this.ignoreHeroesIds.push(hero.id);
            localStorage.setItem('rsl-dash-fm-ignore-ids', JSON.stringify(this.ignoreHeroesIds));
            this.updateLocalHeroes();
        }
    }

    public addAsFood(hero: HeroInstance): void {
        if (hero) {
            this.ignoreHeroesIds = this.ignoreHeroesIds.filter(id => id !== hero.id);
            localStorage.setItem('rsl-dash-fm-ignore-ids', JSON.stringify(this.ignoreHeroesIds));
            this.updateLocalHeroes();
        }
    }

    private updateLocalHeroes(): void {
        this.foodHeroes = [];
        this.ignoredHeroes = [];
        for (const hero of this.heroes) {
            if (this.ignoreHeroesIds.indexOf(hero.id) === -1) {
                this.foodHeroes.push(hero);
            } else {
                this.ignoredHeroes.push(hero);
            }
        }
        this.heroesUpdated.next(null);
    }
}
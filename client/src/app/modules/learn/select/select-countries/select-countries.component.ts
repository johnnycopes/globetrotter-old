import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, first, distinctUntilChanged, switchMap, shareReplay } from 'rxjs/operators';
import * as _ from 'lodash';

import { IRegion } from '@models/region.interface';
import { ISubregion } from '@models/subregion.interface';
import { PlacesTreeProvider } from '@models/places-tree-provider.class';
import { TCheckboxStates } from '@shared/components/nested-checkboxes/nested-checkboxes.component';
import { CountryService } from '@services/country/country.service';
import { SelectService } from '@services/select/select.service';

interface IRegionData {
  region: IRegion;
  treeProvider: PlacesTreeProvider;
  selectedSubject: BehaviorSubject<number>;
  totalSubject: BehaviorSubject<number>;
  selected$: Observable<number>;
  total$: Observable<number>;
}

interface IViewModel {
  regionData: IRegionData[];
  checkboxStates: TCheckboxStates;
  overallSelected: number;
  overallTotal: number;
}

@Component({
  selector: 'app-select-countries',
  templateUrl: './select-countries.component.html',
  styleUrls: ['./select-countries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCountriesComponent implements OnInit {
  vm$: Observable<IViewModel>;
  private regionData$: Observable<IRegionData[]>;
  private checkboxStates$: Observable<TCheckboxStates>;
  private overallSelected$: Observable<number>;
  private overallTotal$: Observable<number>;

  constructor(
    private countryService: CountryService,
    private selectService: SelectService
  ) { }

  ngOnInit(): void {
    this.initializeStreams();
    this.vm$ = combineLatest([
      this.regionData$,
      this.checkboxStates$,
      this.overallSelected$,
      this.overallTotal$
    ]).pipe(
      map(([regionData, checkboxStates, overallSelected, overallTotal]) =>
        ({ regionData, checkboxStates, overallSelected, overallTotal  })
      )
    );
  }

  onCountriesChange(state: TCheckboxStates): void {
    this.selectService.updateCountries(state);
  }

  onSelectAll(): void {
    // TODO: fix this
  }

  onClearAll(): void {
    this.selectService.updateCountries({});
  }

  getNumberOfCountries(item: ISubregion): number {
    return item.countries.length;
  }

  private initializeStreams(): void {
    this.checkboxStates$ = this.selectService.selection.observe(lens => lens.to('countries'));
    this.regionData$ = this.countryService.countries
      .observe(lens => lens.to('nestedCountries'))
      .pipe(
        first(),
        map(regions => regions.map(region => {
          const treeProvider = new PlacesTreeProvider(region);
          const selectedSubject = new BehaviorSubject<number>(0);
          const totalSubject = new BehaviorSubject<number>(0);
          const selected$ = selectedSubject.asObservable().pipe(
            distinctUntilChanged()
          );
          const total$ = totalSubject.asObservable().pipe(
            distinctUntilChanged()
          );
          return { region, treeProvider, selectedSubject, totalSubject, selected$, total$ };
        })),
        shareReplay({ bufferSize: 1, refCount: true })
      );

    const selected1$ = this.regionData$.pipe(
      switchMap(regionData => regionData[0].selected$),
    );
    const selected2$ = this.regionData$.pipe(
      switchMap(regionData => regionData[1].selected$),
    );
    const selected3$ = this.regionData$.pipe(
      switchMap(regionData => regionData[2].selected$),
    );
    const selected4$ = this.regionData$.pipe(
      switchMap(regionData => regionData[3].selected$),
    );
    const selected5$ = this.regionData$.pipe(
      switchMap(regionData => regionData[4].selected$),
    );
    this.overallSelected$ = combineLatest(selected1$, selected2$, selected3$, selected4$, selected5$).pipe(
      map(([...values]) => values.reduce((accum, current) => accum + current, 0))
    );

    const total1$ = this.regionData$.pipe(
      switchMap(regionData => regionData[0].total$),
    );
    const total2$ = this.regionData$.pipe(
      switchMap(regionData => regionData[1].total$),
    );
    const total3$ = this.regionData$.pipe(
      switchMap(regionData => regionData[2].total$),
    );
    const total4$ = this.regionData$.pipe(
      switchMap(regionData => regionData[3].total$),
    );
    const total5$ = this.regionData$.pipe(
      switchMap(regionData => regionData[4].total$),
    );
    this.overallTotal$ = combineLatest(total1$, total2$, total3$, total4$, total5$).pipe(
      map(([...values]) => values.reduce((accum, current) => accum + current, 0))
    );
  }
}

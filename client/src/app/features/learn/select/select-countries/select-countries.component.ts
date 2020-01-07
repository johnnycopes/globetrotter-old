import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { CountryService } from 'src/app/core/services/country/country.service';
import { SelectService } from 'src/app/core/services/select/select.service';
import { CheckboxStates, TreeProvider } from 'src/app/shared/components/nested-checkboxes/nested-checkboxes.component';
import { Place } from 'src/app/shared/model/place.type';
import { Region } from 'src/app/shared/model/region.interface';
import { PlacesTreeProvider } from 'src/app/shared/model/places-tree-provider.class';

interface ViewModel {
  regions: Region[];
  checkboxStates: CheckboxStates;
}

@Component({
  selector: 'app-select-countries',
  templateUrl: './select-countries.component.html',
  styleUrls: ['./select-countries.component.scss']
})
export class SelectCountriesComponent implements OnInit {
  vm$: Observable<ViewModel>;
  treeProvider: TreeProvider<Place> = new PlacesTreeProvider();
  private regions$: Observable<Region[]>;
  private checkboxStates$: Observable<CheckboxStates>;

  constructor(
    private countryService: CountryService,
    private selectService: SelectService
  ) { }

  ngOnInit(): void {
    this.initializeStreams();
    this.vm$ = combineLatest([
      this.regions$,
      this.checkboxStates$
    ]).pipe(
      map(([regions, checkboxStates]) => ({regions, checkboxStates}))
    );
  }

  onCountriesChange(model: CheckboxStates): void {
    this.selectService.updateCountries(model);
  }

  private initializeStreams(): void {
    this.regions$ = this.countryService.getData();
    this.checkboxStates$ = this.selectService.getSelection().pipe(
      map(selection => selection.countries)
    );
  }
}

import { Component, Input, OnChanges, AfterViewInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ICountry } from '@models/country.interface';

interface ITableContent {
  header: string;
  content?: string;
  template?: TemplateRef<any>;
}

@Component({
  selector: 'app-explore-country',
  templateUrl: './explore-country.component.html',
  styleUrls: ['./explore-country.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExploreCountryComponent implements OnChanges, AfterViewInit {
  @Input() country: ICountry;
  @Input() summary: string;
  tableData: ITableContent[];
  @ViewChild("population") populationTemplate: TemplateRef<any>;
  @ViewChild("size") sizeTemplate: TemplateRef<any>;
  @ViewChild("language") languageTemplate: TemplateRef<any>;
  @ViewChild("currency") currencyTemplate: TemplateRef<any>;
  @ViewChild("list") listTemplate: TemplateRef<any>;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.setTableData();
    }
  }

  ngAfterViewInit(): void {
    this.setTableData();
    this.changeDetectorRef.markForCheck();
  }

  private setTableData(): void {
    const country = this.country;
    this.tableData = [
      {
        header: 'subregion',
        content: country.subregion
      },
      {
        header: 'demonym',
        content: country.demonym
      },
      {
        header: `language${country.languages.length > 1 ? 's' : ''}`,
        template: this.languageTemplate
      },
      {
        header: `currenc${country.currencies.length > 1 ? 'ies' : 'y'}`,
        template: this.currencyTemplate
      },
      {
        header: 'population',
        template: this.populationTemplate
      },
      {
        header: 'size',
        template: this.sizeTemplate
      },
      {
        header: 'numeric code',
        content: `+${country.numericCode}`
      },
      {
        header: 'top-level domain',
        content: country.topLevelDomain[0]
      },
    ];
  }
}

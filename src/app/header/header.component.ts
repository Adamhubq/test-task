import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, Observable, of, startWith, switchMap } from 'rxjs';
import { EN_LOCALE_EMPTY_RESPONSE, LOCALE_ARRAY } from '../shared/constants/locales';
import { CityResponsBody } from '../shared/interfaces/weather-api';
import { ApiWeatherService } from '../shared/services/api-weather.service';
import { StoreWeatherService } from '../shared/services/store-weather.service';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  controlLocale = new FormControl('en');
  locales: string[] = LOCALE_ARRAY;
  respEmptyRes: string = EN_LOCALE_EMPTY_RESPONSE;

  cityName = new FormControl();
  cityNames: CityResponsBody[] = [];

  filteredLocales: Observable<string[]> | undefined;
  filteredCity: CityResponsBody[] = [];

  presset = new FormControl('hourly');

  get filteredCityNames(): string[] {
    return this.filteredCity?.map((city) => `${city.name}(${city.country})`) ?? [];
  }

  get emptyResponse(): string {
    return this.cityName.value?.length && !this.filteredCityNames.length ? this.respEmptyRes :'';
  }

  constructor(
    private _apiWeatherService: ApiWeatherService,
    private _storeWeatherService: StoreWeatherService,
    private _cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cityName.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        switchMap((res) => {
          if (res.length < 3) return of(null);
          return this._apiWeatherService.searchCity(<string>res, 10);
        }),
        untilDestroyed(this),
      )
      .subscribe((cityList: CityResponsBody[]) => {
        this.filteredCity = cityList;
        if(this.cityName.value && !this.filteredCity?.length) {
          this.openSnackBar('city not found', 'ok')
        }
        this._cd.markForCheck();
      });
  }

  selectedCity(index: number) {
    this._storeWeatherService.setCityObjectSelected(this.filteredCity[index]);
  }

  selectedPreset($event: MatButtonToggleChange) {
    this._storeWeatherService.setPresseteSelected($event.value);
  }

  selectedLocale($event: MatAutocompleteSelectedEvent) {
    this._storeWeatherService.setLocaleSelected($event.option.value);
  }

  openSnackBar(message: string, action: string) {
    console.log(1);
    
    this._snackBar.open(message, action);
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounce, debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { LOCALE_ARRAY } from '../shared/constants/locales';
import { WeatherCityResponsBody } from '../shared/interfaces/weather-api';
import { ApiWeatherService } from '../shared/services/api-weather.service';
import { StoreWeatherService } from '../shared/services/store-weather.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  controlLocale = new FormControl('en');
  locales: string[] = LOCALE_ARRAY;

  cityName = new FormControl('');
  cityNames: WeatherCityResponsBody[] = [];

  filteredLocales: Observable<string[]> | undefined;
  filteredCityNames: Observable<string[]> | undefined;

  constructor(private _apiWeatherService: ApiWeatherService, private _storeWeatherService: StoreWeatherService) {}

  ngOnInit() {
    this.filteredLocales = this.controlLocale.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '')),
    );

    this.filteredCityNames = this.cityName.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      switchMap((res) => {
        if (!res || res.length < 3) return of('');
        return this._apiWeatherService.searchCity(<string>res, 10);
      }),
      map((value) => {
        return value ?? [];
      }),
    );
  }

  selectedCity($event: MatAutocompleteSelectedEvent){
    this._storeWeatherService.cityObject = $event.option.value;
    this.cityName.setValue(`${$event.option.value.name}(${$event.option.value.country})`)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.locales.filter((locale) => locale.toLowerCase().includes(filterValue));
  }
}

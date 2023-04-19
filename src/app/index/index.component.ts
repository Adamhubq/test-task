import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  CityTableDateDaily,
  CityTableDateHourly,
  WeatherCityDailyResponsBody,
  WeatherCityHourlyResponsBody,
} from '@shared/interfaces/weather-api';
import { ApiWeatherService } from '@shared/services/api-weather.service';
import { StoreWeatherService } from '@shared/services/store-weather.service';
import { mergeMap, Observable, of } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent implements OnInit {
  displayedColumns: string[] = ['city_name'];

  presset: 'hourly' | 'daily' = 'hourly';

  dataSourceDay: CityTableDateDaily[] = [];

  dataSourceHour: CityTableDateHourly[] = [];

  constructor(
    private _apiWeatherService: ApiWeatherService,
    private _storeWeatherService: StoreWeatherService,
    private _cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // todo forkjoin
    if (this.presset === 'daily') {
      this.loadDayPreset()
        .pipe(switchMap((cityObject) => (cityObject ? this.loadColumnDay(cityObject) : of(null))))
        .subscribe(null);
    } else {
      this.loadHourPreset()
        .pipe(switchMap((cityObject) => (cityObject ? this.loadColumnHour(cityObject) : of(null))))
        .subscribe(null);
    }
  }

  loadHourPreset(): Observable<WeatherCityHourlyResponsBody> {
    return this._storeWeatherService.changeCityObject$.pipe(
      switchMap((cityObject) => {
        if (!cityObject) return of(null);
        this.dataSourceHour = [
          ...this.dataSourceHour,
          {
            name: cityObject.name,
            lat: cityObject.lat,
            lon: cityObject.lon,
          },
        ];
        return this._apiWeatherService.getDataCity(cityObject.lat, cityObject.lon, 'hourly');
      }),
      switchMap((cityObject: WeatherCityHourlyResponsBody) => {
        if (!cityObject) return of(null);
        Object.defineProperty(this.dataSourceHour[this.dataSourceHour.length - 1], 'hourly', {
          value: (cityObject as WeatherCityHourlyResponsBody).hourly,
          writable: false,
        });
        this._cd.markForCheck();
        return of(cityObject);
      }),
      untilDestroyed(this),
    );
  }

  loadDayPreset(): Observable<WeatherCityDailyResponsBody> {
    return this._storeWeatherService.changeCityObject$.pipe(
      switchMap((cityObject) => {
        if (!cityObject) return of(null);
        this.dataSourceDay = [
          ...this.dataSourceDay,
          {
            name: cityObject.name,
            lat: cityObject.lat,
            lon: cityObject.lon,
          },
        ];
        return this._apiWeatherService.getDataCity(cityObject.lat, cityObject.lon, 'daily');
      }),
      switchMap((cityObject: WeatherCityDailyResponsBody) => {
        if (!cityObject) return of(null);
        Object.defineProperty(this.dataSourceDay[this.dataSourceDay.length - 1], 'daily', {
          value: (cityObject as WeatherCityDailyResponsBody).daily,
          writable: false,
        });
        this._cd.markForCheck();
        return of(cityObject);
      }),
      untilDestroyed(this),
    );
  }

  loadColumnHour(cityObject: WeatherCityHourlyResponsBody): Observable<string[]> {
    this.displayedColumns = [
      'city_name',
      ...cityObject?.hourly
        .slice(0, 23)
        .map((displayedColumn) => new Date(displayedColumn.dt * 1000).toString())
        .filter((_, i) => i % 3 === 0),
    ];
    return of(this.displayedColumns);
  }

  loadColumnDay(cityObject: WeatherCityDailyResponsBody): Observable<string[]> {
    this.displayedColumns = ['city_name', ...cityObject?.daily.map((v) => new Date(v.dt * 1000).toString())];
    return of(this.displayedColumns);
  }
}

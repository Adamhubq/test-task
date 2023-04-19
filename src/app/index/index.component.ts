import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  CityResponsBody,
  CityTableDateDaily,
  CityTableDateHourly,
  WeatherCityDailyResponsBody,
  WeatherCityHourlyResponsBody,
} from '@shared/interfaces/weather-api';
import { ApiWeatherService } from '@shared/services/api-weather.service';
import { StoreWeatherService } from '@shared/services/store-weather.service';
import { switchMap, Observable, of, forkJoin, tap } from 'rxjs';

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
    this._observation();
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
        this.dataSourceHour = this._setArrayWithUpdate(this.dataSourceHour, cityObject);
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
        this.dataSourceDay = this._setArrayWithUpdate(this.dataSourceDay, cityObject);
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

  private _setArrayWithUpdate(array: CityTableDateHourly[] | CityTableDateDaily[], cityObject: CityResponsBody) {
    return [
      ...array,
      {
        name: cityObject.name,
        lat: cityObject.lat,
        lon: cityObject.lon,
        country: cityObject.country
      },
    ];
  }

  private _loadWithChangePresset(): Observable<(WeatherCityHourlyResponsBody | WeatherCityDailyResponsBody)[]> {
    if (this.presset === 'daily') {
      return <Observable<WeatherCityDailyResponsBody[]>>(
        forkJoin(
          this.dataSourceHour.map((city) => this._apiWeatherService.getDataCity(city.lat, city.lon, this.presset)),
        )
      );
    }
    if (this.presset === 'hourly') {
      return <Observable<WeatherCityHourlyResponsBody[]>>(
        forkJoin(
          this.dataSourceDay.map((city) => this._apiWeatherService.getDataCity(city.lat, city.lon, this.presset)),
        )
      );
    }
  }

  private _observation(): void {
    this._storeWeatherService.changePresset$
      .pipe(
        switchMap((presset) => {
          this.presset = presset;
          this._cd.detectChanges();
          return this._loadWithChangePresset();
        }),
        switchMap((weatherCityArray: (WeatherCityDailyResponsBody | WeatherCityHourlyResponsBody)[]) => {
          if (this.presset === 'daily') {
            this.dataSourceDay = structuredClone(this.dataSourceHour);
            this.dataSourceDay.forEach((weatherCity, i) => {
              weatherCity.daily = (<WeatherCityDailyResponsBody>weatherCityArray[i]).daily;
            });
            return this.loadColumnDay(weatherCityArray[0] as WeatherCityDailyResponsBody);
          }

          if (this.presset === 'hourly') {
            this.dataSourceHour = structuredClone(this.dataSourceDay);
            this.dataSourceHour.forEach((weatherCity, i) => {
              weatherCity.hourly = (<WeatherCityHourlyResponsBody>weatherCityArray[i]).hourly;
            });
            return this.loadColumnHour(weatherCityArray[0] as WeatherCityHourlyResponsBody);
          }
        }),
      )
      .subscribe(() => this._cd.detectChanges());
  }
}

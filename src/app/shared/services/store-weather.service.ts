import { Injectable } from '@angular/core';
import { CityResponsBody, WeatherDailyResponseBody, WeatherHourlyResponseBody } from '@shared/interfaces/weather-api';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreWeatherService {

  private _changeCityObject: Subject<CityResponsBody> = new BehaviorSubject(null);
  changeCityObject$: Observable<CityResponsBody> = this._changeCityObject.asObservable();

  private _changeLocale: Subject<string> = new BehaviorSubject(null);
  changeLocale$: Observable<string> = this._changeLocale.asObservable();

  private _changePresset: Subject<string> = new BehaviorSubject(null);
  changePresset$: Observable<string> = this._changePresset.asObservable();
  
  constructor() { }

  setCityObjectSelected(cityObject: CityResponsBody): void {
    this._changeCityObject.next(cityObject);
  }

  setLocaleSelected(locale: string): void {
    this._changeLocale.next(locale);
  }

  setPresseteSelected(presset: string): void {
    this._changePresset.next(presset);
  }
}

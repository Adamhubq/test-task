import { Injectable } from '@angular/core';
import { WeatherCityResponsBody } from '@shared/interfaces/weather-api';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreWeatherService {

  cityObject: WeatherCityResponsBody;

  private _changeCityObject: Subject<WeatherCityResponsBody> = new BehaviorSubject(null);
  changeCityObject$: Observable<WeatherCityResponsBody> = this._changeCityObject.asObservable();

  private _changeLocale: Subject<string> = new BehaviorSubject(null);
  changeLocale$: Observable<string> = this._changeLocale.asObservable();

  private _changePresset: Subject<string> = new BehaviorSubject(null);
  changePresset$: Observable<string> = this._changePresset.asObservable();
  
  constructor() { }

  setCityObjectSelected(cityObject: WeatherCityResponsBody): void {
    this._changeCityObject.next(cityObject);
  }

  setLocaleSelected(locale: string): void {
    this._changeLocale.next(locale);
  }

  setPresseteSelected(presset: string): void {
    this._changePresset.next(presset);
  }
}

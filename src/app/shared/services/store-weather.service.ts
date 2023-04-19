import { Injectable } from '@angular/core';
import { WeatherCityResponsBody } from '@shared/interfaces/weather-api';

@Injectable({
  providedIn: 'root'
})
export class StoreWeatherService {

  cityObject: WeatherCityResponsBody;

  constructor() { }
}

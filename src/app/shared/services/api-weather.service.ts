import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_KEY } from '../constants/token';
import { DAILY, HOURLY } from '../constants/pressetLists';
import { Observable } from 'rxjs';
import {
  CityResponsBody,
  WeatherCityDailyResponsBody,
  WeatherCityHourlyResponsBody,
} from '@shared/interfaces/weather-api';

@Injectable({
  providedIn: 'root',
})
export class ApiWeatherService {
  private readonly BASE_URL = 'https://api.openweathermap.org/';
  private readonly VERSION_ONE_CALL = 2.5
  private readonly VERSION_DIRECT = 1.0

  constructor(private _http: HttpClient) {}
  
  /**
   * Получение списка городов по вхождению в строку поиска{q}
   * 
   * @param  {string} q подстрока поиска города
   * @param  {number} limit=1 кол-во загружаемых городов
   * @returns Observable<CityResponsBody[]>
   */
  searchCity(q: string, limit: number = 1): Observable<CityResponsBody[]> {
    return this._http.get<CityResponsBody[]>(`${this.BASE_URL}geo/${this.VERSION_DIRECT}/direct`, {
      params: new HttpParams({
        fromObject: {
          q,
          limit,
          appid: API_KEY,
        },
      }),
    });
  }
  
  /**
   * Получение данных погоды города по координатам
   * 
   * @param  {number} lat - координата широты города
   * @param  {number} lon - координата долготы города
   * @param  {'hourly'|'daily'} exclude - пресет запроса данных (часы/дни)
   * @returns Observable<WeatherCityHourlyResponsBody | WeatherCityDailyResponsBody>
   */
  getDataCity(
    lat: number,
    lon: number,
    exclude: 'hourly' | 'daily',
  ): Observable<WeatherCityHourlyResponsBody | WeatherCityDailyResponsBody> {
    return this._http.get<WeatherCityHourlyResponsBody | WeatherCityDailyResponsBody>(
      `${this.BASE_URL}data/${this.VERSION_ONE_CALL}/onecall`,
      {
        params: new HttpParams({
          fromObject: {
            lat: String(lat),
            lon: String(lon),
            exclude: (exclude === 'daily' ? HOURLY : DAILY).toString(),
            appid: API_KEY,
          },
        }),
      },
    );
  }
}

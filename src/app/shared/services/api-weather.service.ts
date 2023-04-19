import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_KEY } from '../constants/token';
import { DAILY, HOURLY } from '../constants/pressetLists';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiWeatherService {
  private readonly BASE_URL = 'https://api.openweathermap.org/';
  // private readonly BASE_URL_GET_DATA_WEATHER = `${this.BASE_URL}`;

  constructor(private _http: HttpClient) {
  }

  searchCity(q: string, limit = 1): Observable<any> {
    return this._http.get(`${this.BASE_URL}geo/1.0/direct`, {
      params: new HttpParams({
        fromObject: {
          q,
          limit,
          appid: API_KEY,
        },
      }),
    });
  }

  getDataCity(lat: Number, lon: Number, exclude: 'hourly' | 'daily') {
    return this._http.get(`${this.BASE_URL}data/2.5/onecall`, {
      params: new HttpParams({
        fromObject: {
          lat: String(lat),
          lon: String(lon),
          exclude: (exclude === 'daily' ? HOURLY : DAILY).toString(),
          appid: API_KEY,
        },
      }),
    });
  }
}

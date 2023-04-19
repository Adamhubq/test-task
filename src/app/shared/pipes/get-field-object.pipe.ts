import { Pipe, PipeTransform } from '@angular/core';
import { WeatherHourlyResponseBody, WeatherDailyResponseBody } from '@shared/interfaces/weather-api';

@Pipe({
  name: 'getFieldObject',
})
export class GetFieldObjectPipe implements PipeTransform {
  transform(cityObject: WeatherDailyResponseBody | WeatherHourlyResponseBody, field: string): string {
    if (cityObject.hasOwnProperty(field) && typeof cityObject[field] === 'string') {
      return cityObject[field];
    }
    return '';
  }
}

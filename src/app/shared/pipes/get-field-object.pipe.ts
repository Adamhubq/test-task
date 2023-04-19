import { Pipe, PipeTransform } from '@angular/core';
import { WeatherCityResponsBody } from '../interfaces/weather-api';

@Pipe({
  name: 'getFieldObject',
})
export class GetFieldObjectPipe implements PipeTransform {
  transform(cityObject: WeatherCityResponsBody, field: string): string {
    if (cityObject.hasOwnProperty(field) && typeof cityObject[field] === 'string') {
      return cityObject[field];
    }
    return '';
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { WeatherCityResponsBody } from '../interfaces/weather-api';

@Pipe({
  name: 'getFieldObject',
})
export class GetFieldObjectPipe implements PipeTransform {
  transform(cityObjects: WeatherCityResponsBody[], field: string): string[] {
    if (!cityObjects) return [''];
    return cityObjects?.map((cityObject) => {
      if (cityObject.hasOwnProperty(field) && typeof cityObject[field] === 'string') {
        return cityObject[field];
      }
      return '';
    });
  }
}

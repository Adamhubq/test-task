import { Pipe, PipeTransform } from '@angular/core';
import { Temperature } from '../interfaces/weather-api';
@Pipe({
  name: 'displayTemperature',
})
export class DisplayTemperaturePipe implements PipeTransform {
  transform(temp: Temperature): number {
    return (temp.day + temp.night + temp.morn + temp.eve) / 4;
  }
}

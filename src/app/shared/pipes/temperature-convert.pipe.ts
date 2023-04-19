import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperatureConvert',
})
export class TemperatureConvertPipe implements PipeTransform {
  transform(temperature: number, convert: 'FC' | 'KC'): number {
    if (convert === 'KC') return temperature - 273.15;
    if (convert === 'FC') return (temperature - 32) / 1.8;
  }
}

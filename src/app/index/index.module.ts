import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';
import { MatTableModule } from '@angular/material/table';
import { DisplayTemperaturePipe } from 'src/app/shared/pipes/display-temperature.pipe';
import { TemperatureConvertPipe } from 'src/app/shared/pipes/temperature-convert.pipe';


@NgModule({
  declarations: [IndexComponent, DisplayTemperaturePipe, TemperatureConvertPipe],
  imports: [CommonModule, IndexRoutingModule, MatTableModule],
  providers: [DatePipe, DisplayTemperaturePipe, TemperatureConvertPipe],
})
export class IndexModule {}

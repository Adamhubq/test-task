import { Component } from '@angular/core';
import { ApiWeatherService } from './shared/services/api-weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test-task';

  constructor( private api: ApiWeatherService){
    console.log(api);
    
  }
}

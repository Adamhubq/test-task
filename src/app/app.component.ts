import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiWeatherService } from './shared/services/api-weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'test-task';

  constructor(private api: ApiWeatherService) {
  }
}

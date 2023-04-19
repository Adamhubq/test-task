import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, QueryParamsHandling, Router, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, Observable, of, startWith, switchMap } from 'rxjs';
import { EN_LOCALE_EMPTY_RESPONSE, LOCALE_ARRAY } from '../shared/constants/locales';
import { CityResponsBody } from '../shared/interfaces/weather-api';
import { ApiWeatherService } from '../shared/services/api-weather.service';
import { StoreWeatherService } from '../shared/services/store-weather.service';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  controlLocale = new FormControl('en');
  locales: string[] = LOCALE_ARRAY;
  respEmptyRes: string = EN_LOCALE_EMPTY_RESPONSE;

  cityName = new FormControl();
  cityNames: CityResponsBody[] = [];

  filteredLocales: Observable<string[]> | undefined;
  filteredCity: CityResponsBody[] = [];

  presset = new FormControl('hourly');

  params: Params = {};

  get filteredCityNames(): string[] {
    return this.filteredCity?.map((city) => `${city.name}(${city.country})`) ?? [];
  }

  constructor(
    private _apiWeatherService: ApiWeatherService,
    private _storeWeatherService: StoreWeatherService,
    private _cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {}

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe((params) => (this.params = params));
    this._obserableCityName();
    this.selectedPreset(new MatButtonToggleChange(null, 'hourly')); // кастыль чтобы учесть dry так как иначе придется задублировать присваивание параметров

    // но мне кажется так было бы лучше, без 'лишнего' инстанцирования
    // this._router.navigate([], {
    // ...
    // });
  }

  selectedCity(index: number) {
    const city = (
      this.params.city?.length
        ? [...new Set([this.filteredCity[index].name, this.params.city])]
        : [this.filteredCity[index].name]
    ).toString();

    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParamsHandling: 'merge',
      queryParams: { ...this.params, city },
    });
    this._storeWeatherService.setCityObjectSelected(this.filteredCity[index]);
    this._clearData();
  }

  selectedPreset($event: MatButtonToggleChange) {
    this._storeWeatherService.setPresseteSelected($event.value);

    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParamsHandling: 'merge',
      queryParams: { ...this.params, presset: $event.value },
    });
  }

  selectedLocale($event: MatAutocompleteSelectedEvent) {
    this._storeWeatherService.setLocaleSelected($event.option.value);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  private _obserableCityName(): void {
    this.cityName.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        switchMap((res) => {
          if (res.length < 3) return of(null);
          return this._apiWeatherService.searchCity(<string>res, 10);
        }),
        untilDestroyed(this),
      )
      .subscribe((cityList: CityResponsBody[]) => {
        this.filteredCity = cityList;
        if (this.cityName.value && !this.filteredCity?.length) {
          this.openSnackBar('city not found', 'ok');
        }
        this._cd.markForCheck();
      });
  }

  private _clearData() {
    this.filteredCity = [];
    this.cityName.setValue('');
    this._cd.detectChanges();
  }
}

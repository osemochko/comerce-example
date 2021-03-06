import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {filter, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Car} from '../interfaces/car.interface';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private readonly URL: string = environment.apiUrl;
  private readonly ALL_CARS: string = 'All cars';


  constructor(private http: HttpClient) {
  }

  public get cars(): Observable<Car[]> {
    return this.http.get(`${this.URL}/cars`).pipe(
      map((cars: Car[]) => cars),
    );
  }

  public getCarById(id: string): Observable<Car> {
    return this.http.get(`${this.URL}/cars/${id}`).pipe(
      filter(Boolean),
      map((car: Car) => car),
    );
  }


  public get navList(): Observable<string[]> {
    return this.http.get(`${this.URL}/cars`)
      .pipe(
        map((cars: Car[]) => cars.map((car: Car) => car.brand)),
        map((brands: string[]) => [...new Set(brands)]),
        map((brands: string[]) => brands.sort((a: string, b: string) => a > b ? 1 : -1)),
        map((brandsNames: string[]) => [ this.ALL_CARS, ...brandsNames ]),
      );
  }

  public getFilteredCars(brand): Observable<Car[]> {
    return this.http.get(`${this.URL}/cars`)
      .pipe(
        map((cars: Car[]) => cars.filter((car: Car) => brand === this.ALL_CARS || car.brand === brand))
      );
  }

  public modifyCar(car: Car): void {
    this.http.put(`${this.URL}/cars/${car.id}`, car)
      .subscribe((res) => console.log(res));
  }


}

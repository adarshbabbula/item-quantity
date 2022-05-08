import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { DateQuantities } from './dateQuantities.model';

@Injectable({ providedIn: 'root' })
export class DateQuantitiesService {
  private dateQuantities: DateQuantities[] = [];
  private dateQuantitiesUpdated = new Subject<DateQuantities[]>();
  date = new Date();
  constructor(private http: HttpClient, private router: Router) {}

  getDateQuantities(itemId: string) {
    this.http
      .get<{ message: string; dateQuantities: DateQuantities[] }>(
        'http://localhost:8080/api/dateQuantities/'+itemId
      )
      .subscribe((itemData) => {
        // console.log(itemData);
        this.dateQuantities = itemData.dateQuantities;
        this.dateQuantitiesUpdated.next([...this.dateQuantities]);
      });
  }

  getDateQuantity(itemId: string) {
    return this.http.get<{ message: string; dateQuantites: DateQuantities[] }>(
      'http://localhost:8080/api/dateQuantities/' + itemId
    );
  }

  getDateQuantitiesUpdatedListener() {
    return this.dateQuantitiesUpdated.asObservable();
  }

  addDateQuantities(dateQuantity: DateQuantities) {
    this.http
      .post<{ message: string; dateQuantityId: string }>(
        'http://localhost:8080/api/dateQuantities',
        dateQuantity
      )
      .subscribe((result) => {
        dateQuantity._id = result.dateQuantityId;
        this.dateQuantities.push(dateQuantity);
        this.dateQuantitiesUpdated.next([...this.dateQuantities]);
      });
  }

  deletDateQuantities(dateQuantityId: string) {
    this.http
      .delete('http://localhost:8080/api/dateQuantities/' + dateQuantityId)
      .subscribe((result) => {
        const updatedDateQuantities = this.dateQuantities.filter(
          (DateQuantities) => DateQuantities._id.toString() != dateQuantityId.toString()
        );
        this.dateQuantities = updatedDateQuantities;
        this.dateQuantitiesUpdated.next([...this.dateQuantities]);
      });
  }

  updateDateQuantities(itemId: string, updatedDateQuantitity: DateQuantities) {
    this.http
      .put('http://localhost:8080/api/dateQuantities/' + updatedDateQuantitity._id, updatedDateQuantitity)
      .subscribe((result) => {
        const updatedDateQuantityIndex = this.dateQuantities.findIndex(
          (item) => item._id == itemId
        );
        const updatedDateQuantitiess = this.dateQuantities;
        updatedDateQuantitiess[updatedDateQuantityIndex] = updatedDateQuantitity;
        this.dateQuantities = updatedDateQuantitiess;
        this.dateQuantitiesUpdated.next([...this.dateQuantities]);
      });
  }

  getDateQuantitiesDetails(itemId: string) {
    return this.http
    .get<{ message: string; dateQuantities: DateQuantities[] }>(
      'http://localhost:8080/api/dateQuantities/'+itemId
    );
 }
}

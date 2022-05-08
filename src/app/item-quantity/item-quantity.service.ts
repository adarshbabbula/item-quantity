import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Item } from './item.model';
import { DateQuantities } from '../quantity-date/dateQuantities.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private items: Item[] = [];
  private itemsUpdated = new Subject<Item[]>();
  date = new Date();
  constructor(private http: HttpClient, private router: Router) {}

  getItems() {
    this.http
      .get<{ message: string; items: Item[] }>(
        'http://localhost:8080/api/items'
      )
      .subscribe((itemData) => {
        this.items = itemData.items;
        this.itemsUpdated.next([...this.items]);
      });
  }

  getItem(itemId: string) {
    return this.http.get<{ message: string; item: Item }>(
      'http://localhost:8080/api/items/' + itemId
    );
  }

  getItemUpdatedListener() {
    return this.itemsUpdated.asObservable();
  }

  addItem(item: Item) {
    this.http
      .post<{ message: string; itemId: string }>(
        'http://localhost:8080/api/items',
        item
      )
      .subscribe((result) => {
        item._id = result.itemId;
        this.items.push(item);
        this.itemsUpdated.next([...this.items]);
      });
  }

  deletItem(itemId: string) {
    this.http
      .delete('http://localhost:8080/api/items/' + itemId)
      .subscribe((result) => {
        const updatedItems = this.items.filter(
          (Item) => Item._id.toString() != itemId.toString()
        );
        this.items = updatedItems;
        this.itemsUpdated.next([...this.items]);
      });
  }

  updateItem(itemId: string, updatedItem: Item) {
    return this.http
      .put('http://localhost:8080/api/items/' + itemId, updatedItem);
      // .subscribe((result) => {
      //   const updatedItemIndex = this.items.findIndex(
      //     (item) => item._id == itemId
      //   );
      //   const updatedItems = this.items;
      //   updatedItems[updatedItemIndex] = updatedItem;
      //   this.items = updatedItems;
      //   this.itemsUpdated.next([...this.items]);
      // });
  }

  getItemDetails() {
    return this.http
    .get<{ message: string; items: Item[] }>(
      'http://localhost:8080/api/items'
    );
 }
}

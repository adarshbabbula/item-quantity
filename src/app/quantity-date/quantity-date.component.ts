import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { Item } from '../item-quantity/item.model';
import { ItemService } from '../item-quantity/item-quantity.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateQuantitiesService } from './quantity-date.service';
import { DateQuantities } from './dateQuantities.model';

@Component({
  selector: 'app-quantity-date',
  templateUrl: './quantity-date.component.html',
  styleUrls: ['./quantity-date.component.css']
})
export class QuantityDateComponent implements OnInit {
  date=new Date();
  item: Item;
  currentDate =(this.date.getDate()+"/"+this.date.getMonth()+"/"+this.date.getFullYear())
  isLoading = true;
  isItemDetailsFetched = false;
  constructor(private route: ActivatedRoute, private _location: Location, private itemService: ItemService, private dateQuantityService: DateQuantitiesService) { }
  itemId = this.route.params['id'];
  itemForm: FormGroup;
  form: FormGroup;
  dateQuantities: DateQuantities[];
  dateQuantity:DateQuantities;
  ngOnInit(): void {
    this.dateQuantityService.getDateQuantities(this.itemId);
    this.isLoading = true;
    this.dateQuantityService.getDateQuantitiesUpdatedListener().subscribe(result => {
      this.isLoading = true;
      this.dateQuantityService.getDateQuantitiesDetails(this.itemId).subscribe(dateQuantities => {
          this.dateQuantities = dateQuantities.dateQuantities;
          this.itemService.getItem(this.itemId).subscribe(item => {
            this.item = item.item;
            this.isLoading = false;
          });
      });
  });
    this.itemForm = new FormGroup({
      'name': new FormControl(this.item? this.item.name : null, [Validators.required])
    });
    this.form = new FormGroup({
      'quantity': new FormControl(0, [Validators.required, Validators.min(0)]),
      'date': new FormControl( this.date.getDate()+"/"+this.date.getMonth()+"/"+this.date.getFullYear(), [Validators.required]),
      'rate': new FormControl( 0, [Validators.required])
    });
    this.route.params.subscribe(params => {
      this.itemId = params.itemId
    })

    this.itemService.getItem(this.itemId).subscribe(item => {
      this.item = item.item;
      this.isItemDetailsFetched = true;
    });

    this.itemService.getItemUpdatedListener().subscribe(items => {
      this.item = items.find(item => item._id == this.item._id);
    });
  }
  setDateQuantity(dateQuantity) {
    this.dateQuantity = dateQuantity
  }

  back() {
    this._location.back();
  }

  editItemName(name) {
    const updatedItem = this.item;
    updatedItem.name = name.value
    this.isLoading = true;
    this.itemService.updateItem(this.itemId, updatedItem).subscribe(result => {
      this.item = updatedItem;
      this.isLoading = false;
    })
  }

  addDateQuantity() {
    const date = new Date(this.form.value.date)
    const date1 =(date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear());
    const dateQuantity = { _id: null, date: date1, quantity: this.form.value.quantity, itemId: this.item._id, rate: this.form.value.rate, amount: (this.form.value.quantity*this.form.value.rate)};
    this.dateQuantityService.addDateQuantities(dateQuantity);
  }

  editDateQuantity(quantity, rate) {
    const updatedDateQuantitity = this.dateQuantity;
    updatedDateQuantitity.quantity = quantity;
    updatedDateQuantitity.rate = rate
    this.dateQuantityService.updateDateQuantities(this.item._id, updatedDateQuantitity);
  }

  delete() {
    this.dateQuantityService.deletDateQuantities(this.dateQuantity._id);
  }

  deleteItem() {
    this.itemService.deletItem(this.item._id);
    this._location.back();
  }
}

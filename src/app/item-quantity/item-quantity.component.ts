import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemService } from './item-quantity.service';
import { Item } from './item.model';

@Component({
  selector: 'app-item-quantity',
  templateUrl: './item-quantity.component.html',
  styleUrls: ['./item-quantity.component.css']
})
export class ItemQuantityComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  items: Item[];
  filteredItems: Item[];
  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'name': new FormControl(null, [Validators.required])
    })
    this.itemService.getItems();
    this.isLoading = true;
    this.itemService.getItemUpdatedListener().subscribe(result => {
        this.isLoading = true;
        this.itemService.getItemDetails().subscribe(items => {
            this.items = items.items;
            this.filterItems({});
            this.isLoading = false
        });
    });
  }

  deleteItem(itemId: string) {
    this.isLoading = true;
    this.itemService.deletItem(itemId);
  }

  addNewItem() {
    const item = {_id: null, name: this.form.value.name, quantity: 0, datesQuantity:[], avgRate: 0, totalAmount: 0}
    this.itemService.addItem(item);
  }

  filterItems(event) {
    if (event && event.target && event.target.value) {
      this.filteredItems = this.items.filter((item) => {
        return (item.name && item.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1);
      });
    } else {
      this.filteredItems = this.items;
    }
    this.filteredItems.sort((a, b) => a && a.name && b && b.name && a.name.localeCompare(b.name));
  }
}

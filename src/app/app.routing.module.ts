import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ItemQuantityComponent } from "./item-quantity/item-quantity.component";
import { QuantityDateComponent } from "./quantity-date/quantity-date.component";

const appRoutes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'itemQuantity' },
  { path: 'itemQuantity', component: ItemQuantityComponent },
  { path: 'itemQuantity/:itemId', component: QuantityDateComponent}
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {

}

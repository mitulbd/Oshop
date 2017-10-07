import { ShoppingCart } from './../models/shopping-cart';
import { ShoppingCartService } from './../shopping-cart.service';
import { product } from './../models/product';

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  @Input('product') 'product':product
  @Input('show-actions') showActions=true;
  @Input('shopping-cart') shoppingCart:ShoppingCart;
  constructor(private shoppingCartService:ShoppingCartService) { }

  addToCart(){
    this.shoppingCartService.addToCart(this.product);
  }
 

}

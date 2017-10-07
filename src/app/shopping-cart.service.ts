
import { Observable } from 'rxjs/Rx';
import { ShoppingCart } from './models/shopping-cart';
import { FirebaseObjectObservable } from 'angularfire2/database/firebase_object_observable';
import { number } from 'ng2-validation/dist/number';
import { async } from '@angular/core/testing';
import { product } from './models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class ShoppingCartService {
    
  constructor(private db :AngularFireDatabase) {

   }

  async addToCart(product:product){
    this.UpdateItem(product,1)
  }
  async RemoveFromCart(product:product){
    this.UpdateItem(product,-1)
  }
  async getCart():Promise<Observable<ShoppingCart>> {
    let cartId=await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/'+cartId)
        .map(x=>new ShoppingCart(x.items));
  }

 async clearCart(){
   let cartId=await this.getOrCreateCartId();
   this.db.object('/shopping-carts/'+cartId+'/items').remove();

}
 private create(){
    return  this.db.list('/shopping-carts').push({
        dateCreated:new Date().getTime()
      })
  }


private getItem(cartId:string,productId:string){
 return this.db.object('/shopping-carts/'+cartId+'/items/'+productId);
}

 private async getOrCreateCartId():Promise<string> {

    let cartId=localStorage.getItem('cartId');
    if(cartId){
      return cartId;
    }

    let result=await this.create();
    localStorage.setItem('cartId',result.key);
    return result.key;
   
}


private async UpdateItem(product:product,change:number){
  let cartId =await this.getOrCreateCartId();
  let item$=this.getItem(cartId,product.$key);
  item$.take(1).subscribe(item=>{
    let quantity=(item.quantity||0) +change;
    if(quantity===0)item$.remove();
    else {
        item$.update({
        title:product.title,
        imageUrl:product.imageUrl,
        price:product.price,
        quantity: quantity});
    }
   
  });
}


}

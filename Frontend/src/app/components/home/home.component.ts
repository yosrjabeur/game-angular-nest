import { Component, OnInit } from '@angular/core';
import { World } from '../../models/world';
import { WebserviceService } from '../../services/webservice.service';
import { Product } from '../../models/product';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { ProductComponent } from "../product/product.component";
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [SideBarComponent, ProductComponent,DecimalPipe ,CommonModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  multiplier: number = 1;
  multiplierLabel: string = 'BUY x1';
  server: string;
  world: World = new World();
  product: Product = new Product();
  constructor(private service: WebserviceService) {
    this.server= service.server
    service.getWorld(this.service.user).then(
      world => {
        this.world = world.data.getWorld;
      });
  }

  onProductionDone($event: { p: Product; qt: number }) {
    let moneyMade = $event.qt
    this.world.money += moneyMade;
    this.world.score += moneyMade;
  }

 // home.component.ts
 onBuy(cost: number) {
  this.world.money -= cost;
}


  onMultiplierChange() {
    if (this.multiplier === 1) {
      this.multiplier = 10;
      this.multiplierLabel = 'BUY x10';
    } else if (this.multiplier === 10) {
      this.multiplier = 100;
      this.multiplierLabel = 'BUY x100';
    } else if (this.multiplier === 100) {
      this.multiplier = -1;
      this.multiplierLabel = 'BUY max';
    } else {
      this.multiplier = 1;
      this.multiplierLabel = 'BUY x1';
    }
  }

}

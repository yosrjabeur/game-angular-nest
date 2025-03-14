import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product';
import { World } from '../../models/world';
import { WebserviceService } from '../../services/webservice.service';
import { DecimalPipe } from '@angular/common';
import { ProgressbarComponent } from "../progressbar/progressbar.component";
import { Orientation } from '../progressbar/progressbar.component';
@Component({
  selector: 'app-product',
  imports: [DecimalPipe, ProgressbarComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  Orientation = Orientation;
  _product: Product = new Product();
  _world: World = new World();
  server: string;
  qtX = 'X1';

  constructor(private service: WebserviceService,private cdRef: ChangeDetectorRef) {
    this.server = service.server;
  }

  ngOnInit(): void {
    setInterval(() => this.updateScore(), 100);
  }
    updateScore() {
      if (this._product.timeleft > 0) {
        this._product.timeleft = Math.max(0, this._product.timeleft - 0.1); // Diminue le temps de 0.1s à chaque tick
      }
      this.calcScore(); 
    }


  @Input()
set product(value: Product) {
  if (value) {
    this._product = value; 
    this._product.lastupdate = Date.now();
    if (this._world.money) this.calcMaxCanBuy();
  }
}
@Input()
set world(value: World) {
  if (value) {
    this._world = value;
    if (this._world.money) this.calcMaxCanBuy();
  }
}
  @Output() onBuy = new EventEmitter<number>();
  @Output() notifyProduction = new EventEmitter<{ p: Product; qt: number }>();

  calcScore() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this._product.lastupdate) / 1000;

    let moneyMade = 0;

    if (this._product.managerUnlocked) {
      let productionCount = 1 + Math.floor((elapsedTime - this._product.timeleft) / this._product.vitesse);
      const remainingTime = (elapsedTime - this._product.timeleft) % this._product.vitesse;

      moneyMade += productionCount * this._product.revenu * this._product.quantite * 
                  (1 + this._world.activeangels * (this._world.angelbonus / 100));

      this._product.timeleft = this._product.vitesse - remainingTime;
    } else {
      if (this._product.timeleft > 0) {
        if (this._product.timeleft <= elapsedTime) {
          moneyMade += this._product.revenu * this._product.quantite * 
                      (1 + this._world.activeangels * (this._world.angelbonus / 100));
          this._product.timeleft = 0;
        } else {
          this._product.timeleft -= elapsedTime;
        }
      }
    }

    if (moneyMade > 0) {
      this._world.lastupdate = currentTime;
      this.notifyProduction.emit({ p: this._product, qt: moneyMade });
    }

    // Mise à jour de la progression pour la barre de progression
    this._product.progress = 1 - (this._product.timeleft / this._product.vitesse);
    this._product.totalTime = this._product.vitesse;
  }

  calcMaxCanBuy(): number {
    if (!this._product || !this._world.money) return 0;
    const { cout, croissance } = this._product;
    const money = this._world.money;
    return Math.floor(Math.log((money * (croissance - 1) / cout) + 1) / Math.log(croissance));
  }

  buyProduct() {
    let quantity = 1;
    if (this.qtX === 'x10') quantity = 10;
    else if (this.qtX === 'x100') quantity = 100;
    else if (this.qtX === 'Max') quantity = this.calcMaxCanBuy();

    const cost = this.calculateTotalCost(quantity);
    if (cost <= this._world.money) {
      this.onBuy.emit(cost);
      this.updateCost(quantity);
      this._product.quantite += quantity;
    }
  }

  calculateTotalCost(quantite: number): number {
    const { cout, croissance } = this._product;
    return cout * ((1 - Math.pow(croissance, quantite)) / (1 - croissance));
  }

  updateCost(quantite: number) {
    this._product.cout *= Math.pow(this._product.croissance, quantite);
  }

  startFabrication() {
    if (!this._product.managerUnlocked && this._product.timeleft == 0) {
      this._product.timeleft = this._product.vitesse;
    }
  }
  trackByFn(index: number, product: Product) {
    return product.id; 
  }  
}

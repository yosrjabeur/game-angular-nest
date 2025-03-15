import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product';
import { World } from '../../models/world';
import { WebserviceService } from '../../services/webservice.service';
import { CommonModule, DecimalPipe, NgIf } from '@angular/common';
import { ProgressbarComponent } from "../progressbar/progressbar.component";
import { Orientation } from '../progressbar/progressbar.component';
@Component({
  selector: 'app-product',
  imports: [DecimalPipe, ProgressbarComponent,NgIf],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  // Orientation = Orientation;
  _product: Product = new Product();
  _world: World = new World();
  _multiplier = 1;
  server: string;
  qtX = 'X1';

  constructor(private service: WebserviceService, private cdRef: ChangeDetectorRef,) {
    this.server = service.server;
  }

  ngOnInit(): void {
    setInterval(() => this.updateScore(), 100); // Update every 100ms for smoother gameplay
  }

  updateScore() {
    if (this._product.timeleft > 0) {
      this._product.timeleft = Math.max(0, this._product.timeleft - 0.1); // Decrease time by 0.1s every tick
      this._product.progress = 1 - (this._product.timeleft / this._product.vitesse);
    }
    this.calcScore();
  }

  @Input()
  set product(value: Product) {
    this._product = value;
    this._product.lastupdate = Date.now();
    if (this._world.money && this._product) this.calcMaxCanBuy();
  }

@Input()
set world(value: World) {
  this._world = value;
    if (this._world.money && this._product) 
      {
        this.calcMaxCanBuy();
      };
  }

  @Output() onBuy = new EventEmitter<number>();
  @Output() notifyProduction = new EventEmitter<{ p: Product; qt: number }>();

  calcScore() {

    const currentTime = Date.now();

    const elapsedTime = (currentTime - this._product.lastupdate);

    let moneyMade = 0;
    if (this._product.timeleft > 0) {
      if (this._product.managerUnlocked) {
        this.run= true;
        //moneyMade = Math.floor(elapsedTime / this._product.vitesse);
        let productionCount = Math.floor((elapsedTime + this._product.vitesse - this._product.timeleft) / this._product.vitesse);
        const remainingTime = (elapsedTime + this._product.vitesse - this._product.timeleft) % this._product.vitesse;
        moneyMade += this._product.quantite * productionCount * this._product.revenu * (1 + this._world.activeangels * (this._world.angelbonus / 100));

        this._product.timeleft = this._product.vitesse - remainingTime;
        if (this._product.timeleft === 0) {
          this._product.timeleft = this._product.vitesse;

        }
      } else {

        if (this._product.timeleft <= elapsedTime) {
          moneyMade += this._product.revenu * this._product.quantite * (1 + this._world.activeangels * (this._world.angelbonus / 100));
          this._product.timeleft = 0;
        } else {
          this._product.timeleft -= elapsedTime;

        }
      }
    }
    this._product.lastupdate = currentTime;
    if (moneyMade > 0) {
      this.notifyProduction.emit({p: this._product, qt: moneyMade});
    }
  }

 
  calcMaxCanBuy(): number {
    if (!this._product || !this._world.money) {return 0};
    const cout = this._product.cout;
    const croissance = this._product.croissance;
    const money = this._world.money;
    return Math.floor(Math.log((money * (croissance - 1) / cout) + 1) / Math.log(croissance));
  }
  

@Input() 
set multiplier(value: number) {
  this._multiplier = value;
  if (this._multiplier && this._product) this.calcMaxCanBuy();
}

buyProduct() {
  
  let quantity = this._multiplier;

    if (this._multiplier === -1) quantity = this.calcMaxCanBuy();

    console.log(quantity)
    const cost = this.calculateTotalCost(quantity);

    if (cost > this._world.money) {
      console.log("Pas assez d'argent !");
      return;
    }   

    if (cost <= this._world.money) {
      this.service.acheterQtProduit(this._world.name, this._product, quantity).then(r => {
        this.onBuy.emit(cost);
        this.updateCost(quantity);
        this._product.quantite += quantity;
        this.checkUnlocks(this._world, this._product);
      });
    }


  }

checkUnlocks(world: World, product: Product) {
  this.checkProductUnlocks(world, product);
  this.checkAllUnlocks(world);
}

checkProductUnlocks(world: World, product: Product) {
  product.paliers.forEach(palier => {
    if (!palier.unlocked && product.quantite >= palier.seuil) {
      palier.unlocked = true;
      this.service.applyBonus(world, palier);
    }
  });
}

checkAllUnlocks(world: World) {
  let productQuantityTotal = 0;
  world.products.forEach(product => {
    productQuantityTotal += product.quantite;
  })
  world.allunlocks.forEach(palier => {
    if (!palier.unlocked && productQuantityTotal >= palier.seuil) {
      palier.unlocked = true;
      this.service.applyBonus(world, palier);
    }
  });
}

calculateTotalCost(quantite: number): number {
  const cout = this._product.cout;
  const croissance = this._product.croissance;
  return cout * ((1 - Math.pow(croissance, quantite)) / (1 - croissance))
}

  updateCost(quantite: number) {
    this._product.cout *= Math.pow(this._product.croissance, quantite);
  }

  startFabrication() {
    if (this._product.timeleft == 0) {
      this.service.lancerProduction(this._world.name, this._product).then(r => {
        this._product.timeleft = this._product.vitesse;
        this.run = true;
        setTimeout(() => {
          this.run = false;
        }, 10);
      });
    }
  }
  // barre progression
  progressbarvalue=0;
  initialValue = 0
  run = false
  vitesse: number = 0
  orientation = Orientation.horizontal
  setProgress(value: number) {
    if (value >= 0 && value <= 100) {
      this.progressbarvalue = value;
    } else if (value < 0) {
      this.progressbarvalue = 0;
    } else {
      this.progressbarvalue = 100;
    }
  }
  
  
  trackByFn(index: number, product: Product) {
    return product?.id ?? index;
  }
  
}
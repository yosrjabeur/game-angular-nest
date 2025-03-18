import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  _product: Product = new Product();
  _world: World = new World();
  _multiplier = 1;
  server: string;
  qtX = 'X1';
  
  // Progress bar properties
  progressbarvalue = 0;
  initialValue = 0;
  run = false;
  orientation = Orientation.horizontal;

  displayCost: number = 0;
  maxQuantity: number = 0;

  @ViewChild(ProgressbarComponent) progressBar: ProgressbarComponent | undefined;
  
  constructor(private service: WebserviceService, private cdRef: ChangeDetectorRef,) {
    this.server = service.server;
  }

  ngOnInit(): void {
    setInterval(() => this.updateScore(), 100); // Update every 100ms for smoother gameplay
     // Initialiser le coût affiché
     this.updateBuyButtonDisplay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['_product']) {
      console.log("Produit mis à jour : ", this._product);
      
      // Check if manager status changed or was set
      if (this._product.managerUnlocked) {
        this.checkAndStartProduction();
      }
      
      this.cdRef.detectChanges();
    }
  }

  updateScore() {
    if (this._product.timeleft > 0) {
      this._product.timeleft = Math.max(0, this._product.timeleft - 0.1); // Decrease time by 0.1s every tick
      this._product.progress = 1 - (this._product.timeleft / this._product.vitesse);
      
      // Update the progress bar run state
      this.run = true;
    } else {
      // When time is up, stop the progress bar
      this.run = false;
      
      // Auto-restart production if manager is unlocked
      if (this._product.managerUnlocked) {
        this.startFabrication();
      }
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
      } else 
        if (this._product.timeleft <= elapsedTime) {
          moneyMade += this._product.revenu * this._product.quantite * (1 + this._world.activeangels * (this._world.angelbonus / 100));
          this._product.timeleft = 0;
          this.run = false; 
          // Reset the canvas directly instead of using setTimeout
          if (this.progressBar) {
            this.progressBar.resetCanvas();
          }
        } else {
          this._product.timeleft -= elapsedTime;
        }
      }
  this._product.lastupdate = currentTime;
  if (moneyMade > 0) {
    this.notifyProduction.emit({p: this._product, qt: moneyMade});
  }
}
 
calcMaxCanBuy(): number {
    if (!this._product || !this._world?.money) {
      return 0;
    }
    const cout = this._product.cout;
    const croissance = this._product.croissance;
    const money = this._world.money;
    
    // Calculer le nombre maximum d'achats possibles
    const maxBuy = Math.floor(Math.log((money * (croissance - 1) / cout) + 1) / Math.log(croissance));
    return Math.max(0, maxBuy); // Assurer qu'on ne retourne pas de valeur négative
  }

@Input() 
set multiplier(value: number) {
  this._multiplier = value;
  if (this._multiplier && this._product) {
    this.calcMaxCanBuy();
    // Mettre à jour l'affichage du coût quand le multiplicateur change
    this.updateBuyButtonDisplay();
  }
}

updateBuyButtonDisplay() {
  this.maxQuantity = this.calcMaxCanBuy();
  
  if (this._multiplier === -1) {
    // En mode MAX
    this.qtX = 'MAX';
    if (this.maxQuantity > 0) {
      this.displayCost = this.calculateTotalCost(this.maxQuantity);
    } else {
      this.displayCost = this._product.cout; // Prix d'un seul si on ne peut pas acheter
    }
  } else {
    // En mode normal (1, 10, 100)
    this.qtX = `X${this._multiplier}`;
    this.displayCost = this.calculateTotalCost(this._multiplier);
  }
  
  this.cdRef.detectChanges();
}

buyProduct() {
  let quantity = this._multiplier === -1 ? this.calcMaxCanBuy() : this._multiplier;
  const cost = this.calculateTotalCost(quantity);

  if (cost > this._world.money) {
    console.log("Pas assez d'argent !");
    return;
  }

  // Appeler l'API pour acheter les produits
  this.service.acheterQtProduit(this._world.name, this._product, quantity).then(() => {
    this.onBuy.emit(cost);
    // Mise à jour du prix du produit après achat
    this.updateCost(quantity);

    console.log("Après achat, coût du produit : ", this._product.cout); 

    // Augmenter la quantité du produit acheté
    this._product.quantite += quantity;
    // Vérifier les unlocks après l'achat
    this.checkUnlocks(this._world, this._product);

    // Mettre à jour l'affichage du coût après l'achat
    this.updateBuyButtonDisplay();
  });
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
    if (!this._product) return 0;
    
    const cout = this._product.cout;
    const croissance = this._product.croissance;
    
    // Vérifier si la quantité est valide
    if (quantite <= 0) return 0;
    
    // Formule pour calculer le coût total
    return cout * ((1 - Math.pow(croissance, quantite)) / (1 - croissance));
  }

  updateCost(quantite: number) {
    this._product.cout *= Math.pow(this._product.croissance, quantite);
    console.log('Nouveau coût du produit :', this._product.cout);
    this.cdRef.detectChanges(); 
  }

  startFabrication() {
    if (this._product.timeleft == 0) {
      this.service.lancerProduction(this._world.name, this._product).then(r => {
        this._product.timeleft = this._product.vitesse;
        // First reset the canvas to ensure it's clear
        if (this.progressBar) {
          this.progressBar.resetCanvas();
        }
        // Then start a new animation
        this.run = true;
        this.cdRef.detectChanges();
      });
    }
  }


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

  // Add this method to ProductComponent
  checkAndStartProduction() {
    if (this._product.managerUnlocked && this._product.timeleft === 0) {
      this.startFabrication();
    }
  }

  
}
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { World } from '../../models/world';
import { WebserviceService } from '../../services/webservice.service';
import { Product } from '../../models/product';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { ProductComponent } from "../product/product.component";
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { ManagerComponent } from "../manager/manager.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, NgModel } from '@angular/forms';
import { UnlocksComponent } from "../unlocks/unlocks.component";
import { UpgradesComponent } from "../upgrades/upgrades.component";
import { InvestorsComponent } from "../investors/investors.component";
@Component({
  selector: 'app-home',
  imports: [SideBarComponent, ProductComponent, DecimalPipe, CommonModule, MatBadgeModule, ManagerComponent, FormsModule, UnlocksComponent, UpgradesComponent, InvestorsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  multiplier: number = 1;
  multiplierLabel: string = 'BUY x1';
  server: string;
  world: World = new World();
  product: Product = new Product();
  showManagers: boolean = false;
  showUnlocks: boolean = false; // Variable pour afficher le pop-up Unlocks
  showUpgrades: boolean = false; // Variable pour afficher la pop-up Upgrades
  showInvestors: boolean = false; // Variable pour afficher la pop-up Investors
  badgeManagers: number = 0;
  badgeUpgrades: number = 0; // Compteur des upgrades achetables
  username: string = ''; // Ensure the username variable is defined and initialized
  
  // Référence à tous les composants produits rendus
  @ViewChildren(ProductComponent) productComponents!: QueryList<ProductComponent>;

  constructor(private service: WebserviceService,private snackBar: MatSnackBar) {
    this.server= service.server
    service.getWorld(this.service.user).then(
      world => {
        this.world = world.data.getWorld;
        this.username = localStorage.getItem('username') || this.generateRandomUsername(); 
        this.service.setUsername(this.username); // Synchronisation avec le service
        service.getWorld(this.service.user).then(world => {
          this.world = world.data.getWorld;
        });
      });
    
  }
  ngOnInit(): void {
    const savedUsername = localStorage.getItem('username');
  
    if (savedUsername) {
      this.username = savedUsername;
      this.service.setUsername(this.username);
      this.loadUserWorld(); // Charge le monde lié à l'utilisateur
    } else {
      this.username = this.generateRandomUsername();
      localStorage.setItem('username', this.username);
      this.service.setUsername(this.username);
      this.createNewWorld(); // Crée un nouveau monde pour ce nouvel utilisateur
    }
  
    this.calculateBadgeManagers();
  }
  
    
  saveUsername() {
    if (this.username.trim()) {
      localStorage.setItem('username', this.username);
      this.service.setUsername(this.username);
  
      // Charger un monde existant pour le nouvel utilisateur ou en créer un nouveau
      this.service.getWorld(this.username).then(world => {
        if (world.data.getWorld) {
          this.world = world.data.getWorld; // Charger le monde existant
        } else {
          this.createNewWorld(); // Créer un nouveau monde
        }
      });
    }
  }

  // Charger le monde d'un utilisateur existant
loadUserWorld(): void {
  const savedWorld = localStorage.getItem(`world_${this.username}`);
  
  if (savedWorld) {
    this.world = JSON.parse(savedWorld);
  } else {
    // Si le monde n'existe pas, récupérer un nouveau monde depuis le backend
    this.createNewWorld();
  }
}
  onProductUpdated(product: Product) {
    // Attendre que la vue soit initialisée
    setTimeout(() => {
      const productComp = this.productComponents.find(pc => pc._product.id === product.id);
      if (productComp) {
        productComp.startFabrication();
      }
    });
  }


// Créer un nouveau monde et l'enregistrer pour un nouvel utilisateur
createNewWorld(): void {
  this.service.getWorld(this.service.user).then(world => {
    this.world = world.data.getWorld;
    localStorage.setItem(`world_${this.username}`, JSON.stringify(this.world));
  });
}
  calculateBadgeManagers() {
    const oldCount = this.badgeManagers;
    // On compte les managers qui ne sont pas débloqués et sont abordables
    this.badgeManagers = this.world.managers.filter(m => !m.unlocked && this.world.money >= m.seuil).length;
  
    // Si un manager devient disponible, on affiche une notification
    if (this.badgeManagers > oldCount) {
      this.snackBar.open("New manager available!", "Close", {
        duration: 3000,
        panelClass: ['snackbar-info']
      });
    }
  }
  calculateBadgeUpgrades() {
    const oldCount = this.badgeManagers;
    this.badgeUpgrades = this.world.upgrades.filter(up => !up.unlocked && this.world.money >= up.seuil).length;
   // Si un manager devient disponible, afficher une notification
   if (this.badgeManagers > oldCount) {
    this.snackBar.open("New manager available!", "Close", {
      duration: 3000,
      panelClass: ['snackbar-info']
    });
  }
  }

  // Lorsque l'argent change, on met à jour le badge
  onMoneyChange() {
    this.calculateBadgeManagers();
    this.calculateBadgeUpgrades();
    localStorage.setItem(`world_${this.username}`, JSON.stringify(this.world));


  }
  onProductionDone($event: { p: Product; qt: number }) {
    let moneyMade = $event.qt
    this.world.money += moneyMade;
    this.world.score += moneyMade;
    localStorage.setItem(`world_${this.username}`, JSON.stringify(this.world));

  }


  onBuy(cost: number) {
    this.world.money -= cost;
    localStorage.setItem(`world_${this.username}`, JSON.stringify(this.world));

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
    // Mise à jour des coûts dans tous les composants produits
    if (this.productComponents) {
      this.productComponents.forEach(productComponent => {
        productComponent.updateBuyButtonDisplay();
      });
    }
}

  calcMaxCanBuy(): number {
    if (!this.product || !this.world.money || this.world.money <= 0) {
      return 0;
    }
    const cout = this.product.cout;
    const croissance = this.product.croissance;

    // Vérifier si cout et croissance sont des valeurs valides
    if (!cout || cout <= 0 || !croissance || croissance <= 1) {
      return 0;
    }

   // Calculer le nombre maximum d'achats possibles
    const maxBuy = Math.floor(Math.log((this.world.money * (croissance - 1) / cout) + 1) / Math.log(croissance));
    
    // Vérifier si le résultat est un nombre valide
    return isNaN(maxBuy) ? 0 : maxBuy;
  }

  getMultiplierDisplay(): string {
    if (this.multiplier === -1) {
      return 'MAX';
    } else {
      return `x${this.multiplier}`;
    }
  }

  calculateTotalCost(quantite: number): number {
    const cout = this.product.cout;
    const croissance = this.product.croissance;
    return cout * ((1 - Math.pow(croissance, quantite)) / (1 - croissance))
  }
  
    updateCost(quantite: number) {
      this.product.cout *= Math.pow(this.product.croissance, quantite);
      //this.cdRef.detectChanges(); 
    }
    // Méthode pour afficher ou cacher la fenêtre des managers
  toggleManagers() {
    this.showManagers = !this.showManagers;
  }
  generateRandomUsername(): string {
    return 'Captain' + Math.floor(Math.random() * 10000);
  }
  toggleUnlocks() {
    console.log("toggleUnlocks() called, changing showUnlocks");
    this.showUnlocks = !this.showUnlocks;
  }
  

  closeUnlocks(event: Event) {
    event.stopPropagation();
    this.showUnlocks = false;
  }
  toggleUpgrades() {
    console.log("toggleUpgrades() called, changing showUpgrades");
    this.showUpgrades = !this.showUpgrades;
  }
  toggleInvestors() {
    console.log("toggleInvestors() called, changing showUpgrades");
    this.showInvestors = !this.showInvestors;
  }
}

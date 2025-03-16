import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { World } from '../../models/world';
import { WebserviceService } from '../../services/webservice.service';
import { Product } from '../../models/product';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { ProductComponent } from "../product/product.component";
import { CommonModule, DecimalPipe } from '@angular/common';
<<<<<<< HEAD
import { MatBadgeModule } from '@angular/material/badge';
import { ManagerComponent } from "../manager/manager.component";
import { MatSnackBar } from '@angular/material/snack-bar';
=======
import { MatBadgeModule } from '@angular/material/badge';  

>>>>>>> ea3ce6f10aec59dc8f1c0576f20bac6e61df8777
@Component({
  selector: 'app-home',
  imports: [SideBarComponent, ProductComponent, DecimalPipe, CommonModule, MatBadgeModule, ManagerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  multiplier: number = 1;
  multiplierLabel: string = 'BUY x1';
  server: string;
  world: World = new World();
  product: Product = new Product();
<<<<<<< HEAD
  showManagers: boolean = false;
  badgeManagers: number = 0;
  constructor(private service: WebserviceService,private snackBar: MatSnackBar) {
=======
  constructor(private service: WebserviceService, private cdRef: ChangeDetectorRef) {
>>>>>>> ea3ce6f10aec59dc8f1c0576f20bac6e61df8777
    this.server= service.server
    service.getWorld(this.service.user).then(
      world => {
        this.world = world.data.getWorld;
        this.calculateBadgeManagers();
      });
    
  }
<<<<<<< HEAD
  ngOnInit(): void {
    this.calculateBadgeManagers();
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
  
  // Lorsque l'argent change, on met à jour le badge
  onMoneyChange() {
    this.calculateBadgeManagers();
=======
  ngOnInit() {
    this.cdRef.detectChanges(); // Détecte les changements après la mise à jour
>>>>>>> ea3ce6f10aec59dc8f1c0576f20bac6e61df8777
  }
  onProductionDone($event: { p: Product; qt: number }) {
    let moneyMade = $event.qt
    this.world.money += moneyMade;
    this.world.score += moneyMade;
  }


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
    this.cdRef.detectChanges(); 
  }
  
  calcMaxCanBuy(): number {
    if (!this.product || !this.world.money) {return 0};
    const cout = this.product.cout;
    const croissance = this.product.croissance;
    const money = this.world.money;
    return Math.floor(Math.log((money * (croissance - 1) / cout) + 1) / Math.log(croissance));
  }
  calculateTotalCost(quantite: number): number {
    const cout = this.product.cout;
    const croissance = this.product.croissance;
    return cout * ((1 - Math.pow(croissance, quantite)) / (1 - croissance))
  }
  
    updateCost(quantite: number) {
      this.product.cout *= Math.pow(this.product.croissance, quantite);
      this.cdRef.detectChanges(); 
    }
}

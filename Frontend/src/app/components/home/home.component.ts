import { Component, OnInit } from '@angular/core';
import { World } from '../../models/world';
import { WebserviceService } from '../../services/webservice.service';
import { Product } from '../../models/product';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { ProductComponent } from "../product/product.component";
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { ManagerComponent } from "../manager/manager.component";
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-home',
  imports: [SideBarComponent, ProductComponent, DecimalPipe, CommonModule, MatBadgeModule, ManagerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  multiplier: number = 1;
  multiplierLabel: string = 'BUY x1';
  server: string;
  world: World = new World();
  product: Product = new Product();
  showManagers: boolean = false;
  badgeManagers: number = 0;
  constructor(private service: WebserviceService,private snackBar: MatSnackBar) {
    this.server= service.server
    service.getWorld(this.service.user).then(
      world => {
        this.world = world.data.getWorld;
        this.calculateBadgeManagers();
      });
  }
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
  isModalOpen = true;

  handleCloseModal() {
    this.isModalOpen = false;
    // You can add logic to hide the modal
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WebserviceService } from '../../services/webservice.service';
import { World } from '../../models/world';
import { Palier } from '../../models/palier';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Product } from '../../models/product';
@Component({
  selector: 'app-manager',
  imports: [CommonModule,MatSnackBarModule],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent  {
   world: World = new World(); 
   server: string;
   showManagers: boolean = false;
  constructor(private service: WebserviceService, private snackBar: MatSnackBar) {
    this.server = service.server;
  }

  @Output() productUpdated = new EventEmitter<Product>();
  @Output() closeModal = new EventEmitter<void>(); // Nouvel événement pour fermer le modal
  
  @Input() set wor(value: World) {
  console.log("Received world object:", value);  // Vérifier l'objet world
  this.world = value;
  console.log("Managers:", this.world.managers); // Vérifier si managers existe
}
  // Getter to check if all managers are unlocked
  get allManagersUnlocked(): boolean {
    return this.world?.managers?.every(manager => manager.unlocked) ?? false;
  }

  // Nouvelle méthode pour fermer le modal
  closeManagerModal() {
    this.closeModal.emit();
  }

  hireManager(manager: Palier) {
    let targetManager = this.world.managers.find((m) => m.name === manager.name);
    if (!targetManager) {
      // Manager introuvable, sortie de la fonction
      this.snackBar.open("Manager not found!", 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }
  
    if (this.world.money >= targetManager.seuil) {
      this.service.engagerManager(this.world.name, targetManager).then((response) => {
        this.world.money -= targetManager.seuil;
        targetManager.unlocked = true;
        // Set product's manager as unlocked
        const product = this.world.products[targetManager.idcible - 1];
        product.managerUnlocked = true;

        // Immediately trigger first production after manager is hired
        product.timeleft = product.timeleft || 0; // Ensure timeleft is defined
        
        // Send an event or use a service to notify that a manager was hired
        this.productUpdated.emit(product);

        // Affichage de la notification
        this.snackBar.open(`${manager.name} has been hired!`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }).catch(error => {
        this.snackBar.open(`Error hiring ${manager.name}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      });
    } else {
      this.snackBar.open("Not enough money to hire this manager!", "Close", {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
    }
  }
}
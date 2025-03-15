import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WebserviceService } from '../../services/webservice.service';
import { World } from '../../models/world';
import { Palier } from '../../models/palier';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GET_WORLD } from '../../../Graphrequests';

@Component({
  selector: 'app-manager',
  imports: [CommonModule,MatSnackBarModule],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent  {
  @Output() modalClosed = new EventEmitter<void>();
  _world: World = new World(); // Assurez-vous que World est correctement initialisé
  server: string;
  showManagers: boolean = true;

  @Input()
  set world(value: World) {
    this._world = value ?? new World(); 
    
  }
  constructor(private service: WebserviceService, private snackBar: MatSnackBar) {
    this.server = service.server;
    console.log('Données reçues:', {
      managers: this._world.managers,
      products: this._world.products
    });
  }
  // Dans hireManager()
hireManager(manager: Palier) {
  // Utilisez _world partout
  const targetManager = this._world.managers.find((m) => m.name === manager.name);

  if (targetManager && !targetManager.unlocked && this._world.money >= targetManager.seuil) {
    this.service.engagerManager(this._world.name, targetManager).then((response) => {
      this._world.money -= targetManager.seuil;
      targetManager.unlocked = true;
      this._world.products[targetManager.idcible - 1].managerUnlocked = true;
      // ...
    });
  }
}
  createClient() {
    throw new Error('Method not implemented.');
  }

// Dans startProductionForManager()
startProductionForManager(manager: Palier) {
  const product = this._world.products[manager.idcible - 1];
  if (!product.managerUnlocked) {
    this.service.lancerProduction(this._world.name, product);
  }
}

  popMessage(message: string): void {
    this.snackBar.open(message, "", { duration: 2000 });
  }

  closeModal() {
    this.modalClosed.emit();
    this.showManagers = false; // Ferme le modal
  }

}
  


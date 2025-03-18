import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Palier } from '../../models/palier';
import { World } from '../../models/world';
import { WebserviceService } from '../../services/webservice.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-upgrades',
  imports:[CommonModule,MatDialogModule,MatButtonModule,MatIconModule,MatCardModule,MatDividerModule],
  templateUrl: './upgrades.component.html',
  styleUrl: './upgrades.component.css'
})
export class UpgradesComponent {
  constructor(private service: WebserviceService) {
    this.server = service.server
  }
  world: World = new World();
  server: string;
  selectedCategory: string = 'cash';
  @Output() close = new EventEmitter<void>(); // Événement pour fermer la pop-up

  @Input()
  set worldd(value: World) {
    this.world = value;
  }
  buyUpgrade(upgrade: Palier) {
    if (upgrade.seuil <= this.world.money) {
      this.service.acheterCashUpgrade(this.world.name, upgrade).then((response) => {
        this.service.applyBonus(this.world, upgrade);
        this.world.money -= upgrade.seuil;
        upgrade.unlocked = true;
      })
    }
  }
  buyAngelUpgrade(upgrade: Palier) {
    if (upgrade.seuil <= this.world.activeangels) {
      this.service.acheterAngelUpgrade(this.world.name, upgrade).then((response) => {
        this.service.applyBonus(this.world, upgrade);
        this.world.activeangels -= upgrade.seuil;
        upgrade.unlocked = true;
      })
    }
  }
  closeUpgrades() {
    // Ici, tu peux cacher le composant avec une variable ou un EventEmitter
    this.close.emit(); // Émet l'événement pour fermer la pop-up
  }
  
}

import { Component, Input } from '@angular/core';
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
  _world: World = new World();
  server: string;
  selectedCategory: string = 'cash';
  @Input()
  set world(value: World) {
    this._world = value;
  }
  buyUpgrade(upgrade: Palier) {
    if (upgrade.seuil <= this._world.money) {
      this.service.acheterCashUpgrade(this._world.name, upgrade).then((response) => {
        this.service.applyBonus(this._world, upgrade);
        this._world.money -= upgrade.seuil;
        upgrade.unlocked = true;
      })
    }
  }
  buyAngelUpgrade(upgrade: Palier) {
    if (upgrade.seuil <= this._world.activeangels) {
      this.service.acheterAngelUpgrade(this._world.name, upgrade).then((response) => {
        this.service.applyBonus(this._world, upgrade);
        this._world.activeangels -= upgrade.seuil;
        upgrade.unlocked = true;
      })
    }
  }
}

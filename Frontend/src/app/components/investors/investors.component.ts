import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WebserviceService } from '../../services/webservice.service';
import { World } from '../../models/world';

@Component({
  selector: 'app-investors',
  imports: [],
  templateUrl: './investors.component.html',
  styleUrl: './investors.component.css'
})
export class InvestorsComponent {
  constructor(private service: WebserviceService) {
    this.server = service.server
  }

  world: World = new World();

  server: string;
  @Output() close = new EventEmitter<void>(); // Événement pour fermer la pop-up

  @Input()
  set worldd(value: World) {
    this.world = value;
  }

  calcAngelToClaim() {
    return Math.floor(150 * Math.sqrt(this.world.score / Math.pow(10, 4))) - this.world.totalangels;
  }

  resetWorld() {
    this.service.resetWorld(this.service.user).then((response) => {
      this.world = response.data.resetWorld;
      window.location.reload();
    });
  }
  closeModal() {
    this.close.emit(); // Émet l'événement pour fermer la pop-up
  }
}

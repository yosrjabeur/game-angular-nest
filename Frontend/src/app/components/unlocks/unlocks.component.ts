import { Component, EventEmitter, Input, Output } from '@angular/core';
import { World } from '../../models/world';
import { WebserviceService } from '../../services/webservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unlocks',
  imports: [CommonModule],
  templateUrl: './unlocks.component.html',
  styleUrl: './unlocks.component.css'
})
export class UnlocksComponent {
  server: string;
  world: World = new World();
  @Output() close = new EventEmitter<void>(); // Événement pour fermer la pop-up

  constructor(private service: WebserviceService) {
    this.server = service.server;
  }

  @Input()
  set worldd(value: World) {
    this.world = value;
  }
  closeUnlocks() {
    this.close.emit(); // Émet l'événement pour fermer la pop-up
  }
}

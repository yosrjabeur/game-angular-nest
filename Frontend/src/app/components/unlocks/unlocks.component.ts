import { Component, Input } from '@angular/core';
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
  server : string
  world: World =new World();
  constructor(private service: WebserviceService) {
    this.server = service.server
  }
  @Input()
  set wor(value: World) {
    this.world = value;
  }
}

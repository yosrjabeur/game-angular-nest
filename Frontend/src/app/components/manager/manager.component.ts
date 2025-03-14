import { Component, Input } from '@angular/core';
import { WebserviceService } from '../../services/webservice.service';
import { World } from '../../models/world';

@Component({
  selector: 'app-manager',
  imports: [],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {
  constructor(private service: WebserviceService) {
    this.server = service.server
  }
  world: World =new World();

  server: string;
  @Input()
  set wor(value: World) {
    this.world = value;
  }


  hireManager() {
    console.log('Hiring manager');

  }
}

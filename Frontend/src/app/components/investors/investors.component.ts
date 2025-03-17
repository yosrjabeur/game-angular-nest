import { Component, Input } from '@angular/core';
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

  @Input()
  set wor(value: World) {
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
}

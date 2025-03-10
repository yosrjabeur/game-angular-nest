import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { WebserviceService } from './services/webservice.service';
import { World } from './models/world';
import { HeaderComponent } from "./components/header/header.component";
import { ProductComponent } from "./components/product/product.component";
import { SideBarComponent } from "./components/side-bar/side-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductComponent, SideBarComponent, RouterModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  world: World = new World();

  constructor(private service: WebserviceService) {}

  ngOnInit() {
    this.service.getWorld().then(response => {
      if (response.data) {
        this.world = response.data.getWorld;
      }
    }).catch(error => console.error("Erreur lors de la récupération du monde :", error));
  }
}



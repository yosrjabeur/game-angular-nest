import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { World } from '../../models/world';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  @Output() showManagersEvent = new EventEmitter<void>(); // Événement pour afficher les managers
  @Output() showUnlocksEvent = new EventEmitter<void>();
  @Output() showUpgradesEvent = new EventEmitter<void>(); 
  @Output() showInvestorsEvent = new EventEmitter<void>(); 

  world: World = new World(); //  Ajout de la variable 'world'

  constructor(private router: Router) {}
  Upgrades() {
    console.log("Upgrades button clicked, emitting event");
    this.showUpgradesEvent.emit();
  }
  
   Managers() {
 
    this.showManagersEvent.emit();
   }
   Investors() {
    console.log("Investors button clicked, emitting event");
    this.showInvestorsEvent.emit();
   }
   Unlocks() {
    console.log("Unlocks button clicked, emitting event");
    this.showUnlocksEvent.emit();
  }
 
}

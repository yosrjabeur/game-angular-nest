import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  @Output() showManagersEvent = new EventEmitter<void>(); // Événement pour afficher les managers

  constructor(private router: Router) {}
  Upgrades() {
    
     this.router.navigate(['/upgrades'])
   }
   Managers() {
 
    this.showManagersEvent.emit();
   }
   Investors() {

     this.router.navigate(['/investors'])
   }
   Unlocks() {
     this.router.navigate(['/unlocks'])
   }
 
}

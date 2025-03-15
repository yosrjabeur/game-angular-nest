import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  constructor(private router: Router) {}
  Upgrades() {
    
     this.router.navigate(['/upgrades'])
   }
   Managers() {
 
     this.router.navigate(['/managers'])
   }
   Investors() {

     this.router.navigate(['/investors'])
   }
   Unlocks() {
     this.router.navigate(['/unlocks'])
   }
 
}

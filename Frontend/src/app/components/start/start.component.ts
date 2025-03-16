import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importez Router depuis @angular/router

@Component({
  selector: 'app-start',
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {
  backgroundUrl: string = 'assets/images/start.jpg'; //  Chemin dynamique de l’image

  constructor(private router : Router) {
  }
   Start() {
    //naviguer vers home page 
     this.router.navigate(['/home'])
   }
}

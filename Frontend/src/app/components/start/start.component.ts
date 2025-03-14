import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importez Router depuis @angular/router

@Component({
  selector: 'app-start',
  imports: [],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {
  constructor(private router : Router) {
  }
   Start() {
    //naviguer vers home page 
     this.router.navigate(['/home'])
   }
}

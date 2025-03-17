import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importez Router depuis @angular/router
import { WebserviceService } from '../../services/webservice.service';

@Component({
  selector: 'app-start',
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {
  backgroundUrl: string = 'assets/images/start.jpg'; //  Chemin dynamique de l’image

  constructor(private router : Router,private service: WebserviceService) {
  }
  onStartGame() {
    this.service.playMusic(); // Joue la musique
    this.router.navigate(['/home']); // Redirige vers l'interface principale
  }
}
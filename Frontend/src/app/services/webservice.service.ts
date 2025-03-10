import { Injectable } from '@angular/core';
import { Client, fetchExchange } from '@urql/core';
import { GET_WORLD } from '../../Graphrequests';
@Injectable({
  providedIn: 'root'
})
export class WebserviceService {
  private server = 'http://localhost:4200/';
  private user = 'toto';
  private client: Client;

  constructor() {
    // Initialisation unique du client GraphQL
    this.client = new Client({
      url: this.server,
      exchanges: [fetchExchange]
    });
  }

  // Récupération du monde via GraphQL
  getWorld() {
    return this.client.query(GET_WORLD, { user: this.user }).toPromise();
  }
}
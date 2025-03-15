import { Injectable } from '@angular/core';
import { Client, fetchExchange } from '@urql/core';
import { ACHETER_ANGEL_UPGRADE, ACHETER_CASH_UPGRADE, ACHETER_PRODUIT, ENGAGER_MANAGER, GET_WORLD, LANCER_PRODUCTION, RESET_WORLD } from '../../Graphrequests';
import { Product } from '../models/product';
import { Palier } from '../models/palier';
@Injectable({
  providedIn: 'root'
})
export class WebserviceService {
  server = 'http://localhost:3000/';
  user = 'Yosr_Chadha';

  createClient() {
    return new Client({
      url: this.server + 'graphql',
      exchanges: [fetchExchange]
    });
  }

  async getWorld(user: string) {
    const response = await this.createClient().query(GET_WORLD, {"user": user}).toPromise();
    console.log('Response:', response);
    return response;
  }

  async lancerProduction(user: string, product: Product) {
    return await this.createClient().mutation(LANCER_PRODUCTION, {
      user: user,
      id:
      product.id
    }).toPromise();
  }

  async engagerManager(user: string, manager: Palier) {
    return await this.createClient().mutation(ENGAGER_MANAGER, {
      user: user,
      name: manager.name
    }).toPromise();
  }

  async acheterQtProduit(user: string, product: Product, quantite: number) {
    return await this.createClient().mutation(ACHETER_PRODUIT, {
      user: user,
      id: product.id,
      quantite: quantite
    }).toPromise();
  }

  async acheterCashUpgrade(user: string, id: number) {
    return await this.createClient().mutation(ACHETER_CASH_UPGRADE, {
      user,
      id
    }).toPromise();
  }

  async acheterAngelUpgrade(user: string, id: number) {
    return await this.createClient().mutation(ACHETER_ANGEL_UPGRADE, {
      user,
      id
    }).toPromise();
  }

  async resetWorld(user: string) {
    return await this.createClient().mutation(RESET_WORLD, {
      user
    }).toPromise();
  }
  constructor() {
  }
}
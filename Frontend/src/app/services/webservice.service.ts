import { Injectable } from '@angular/core';
import { Client, fetchExchange } from '@urql/core';
import { ACHETER_ANGEL_UPGRADE, ACHETER_CASH_UPGRADE, ACHETER_PRODUIT, ENGAGER_MANAGER, GET_WORLD, LANCER_PRODUCTION, RESET_WORLD } from '../../Graphrequests';
import { Product } from '../models/product';
@Injectable({
  providedIn: 'root'
})
export class WebserviceService {
  server = 'http://localhost:3000/';
  user = 'Toto';

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

  async engageManager(user: string, product: Product) {
    return await this.createClient().mutation(ENGAGER_MANAGER, {
      user: user,
      name: product.name
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
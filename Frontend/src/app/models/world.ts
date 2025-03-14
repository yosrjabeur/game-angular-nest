import { Palier } from "./palier";
import { Product } from "./product";
export class World {
    name: string = "";
    logo: string = "";
    money: number = 0;
    score: number = 0;
    totalangels: number = 0;
    activeangels: number = 0;
    angelbonus: number = 0;
    lastupdate: number = 0;
    products: Product[] = [];
    allunlocks: Palier[] = [];
    upgrades: Palier[] = [];
    angelupgrades: Palier[] = [];
    managers: Palier[] = [];
  }
import { Palier } from "./palier";
import { Product } from "./product";
import { World } from "./world";

export abstract class IMutation {
    abstract acheterQtProduit(user: string, id: number, quantite: number): Nullable<Product> | Promise<Nullable<Product>>;
  
    abstract lancerProductionProduit(user: string, id: number): Nullable<Product> | Promise<Nullable<Product>>;
  
    abstract engagerManager(user: string, name: string): Nullable<Palier> | Promise<Nullable<Palier>>;
  
    abstract acheterCashUpgrade(user: string, name: string): Nullable<Palier> | Promise<Nullable<Palier>>;
  
    abstract acheterAngelUpgrade(user: string, name: string): Nullable<Palier> | Promise<Nullable<Palier>>;
  
    abstract resetWorld(user: string): Nullable<World> | Promise<Nullable<World>>;
  }
  
  type Nullable<T> = T | null;
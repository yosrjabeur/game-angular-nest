import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { origworld } from './origworld';
import { Palier, Product, World } from './graphql';

@Injectable()
export class AppService {
  readUserWorld(user: string): World {
    try {
      let data = fs.readFileSync(
        path.join(process.cwd(), 'userworlds/', user + '-world.json'),
      );
      return JSON.parse(data.toString()) as World;
    } catch (e: unknown) {
      console.log((e as Error).message);
      return origworld;
    }
  }
  //Save World
  saveWorld(user: string, world: World) {
    fs.writeFile(
      path.join(process.cwd(), 'userworlds/', user + '-world.json'),
      JSON.stringify(world),
      (err) => {
        if (err) {
          console.error(err);
          throw new Error(`Erreur d'écriture du monde coté serveur`);
        }
      },
    );
  }
//update World
updateWorld(world: World) {
  let now = Date.now();
  let elapseTime = (now - world.lastupdate) / 1000; // Convertir en secondes
  world.lastupdate = now;

  world.products.forEach((product) => {
    if (product.quantite > 0) { // Vérifier qu'on possède au moins 1 exemplaire du produit
      let bonusMultiplier = 1 + world.activeangels * (world.angelbonus / 100);
      if (!product.managerUnlocked) {
         // Produit sans manager
        if (product.timeleft > 0) {
          if (product.timeleft <= elapseTime) {
            world.money += product.revenu * product.quantite * bonusMultiplier;
              world.score += product.revenu * product.quantite * bonusMultiplier;
              product.timeleft = 0;
          } else {
            product.timeleft -= elapseTime;
          }
        }
      } else {
        // Produit avec manager
        if (product.timeleft > 0) {
          let nbProduction = Math.floor((elapseTime + product.timeleft) / product.vitesse);
          let remainingTime = (elapseTime + product.timeleft) % product.vitesse;
          world.money += nbProduction * product.revenu * product.quantite * bonusMultiplier;
          world.score += nbProduction * product.revenu * product.quantite * bonusMultiplier;
          product.timeleft = remainingTime > 0 ? product.vitesse - remainingTime : 0;
        } else {
          let nbProduction = Math.floor(elapseTime / product.vitesse);
          world.money += nbProduction * product.revenu * product.quantite * bonusMultiplier;
          world.score += nbProduction * product.revenu * product.quantite * bonusMultiplier;
          product.timeleft = elapseTime % product.vitesse;
        }
      }
    }
  });
  this.saveWorld("user", world); // Sauvegarde après mise à jour
}

  // Vérification des paliers spécifiques au produit
  checkUnlocks(world: World, product: Product) {
    product.paliers.forEach((palier) => {
      if (!palier.unlocked && product.quantite >= palier.seuil) {
        palier.unlocked = true;
        this.applyBonus(product, palier, world);
      }
    });
  }
  
  // Vérification des paliers globaux (allunlocks)
  checkAllUnlocks(world: World) {
    world.allunlocks.forEach((palier) => {
      if (!palier.unlocked && world.products.every((p) => p.quantite >= palier.seuil)) {
        palier.unlocked = true;
        world.products.forEach((p) => this.applyBonus(p, palier, world));
      }
    });
  }

   // Appliquer un bonus en fonction du type de palier
   applyBonus(product: Product, palier: Palier, world: World) {
    switch (palier.typeratio) {
      case "gain":
        product.revenu *= palier.ratio;
        break;
      case "vitesse":
        product.vitesse = Math.round(product.vitesse / palier.ratio);
        break;
      case "ange":
        world.angelbonus += palier.ratio;
        break;
      default:
        console.warn(`Type de bonus inconnu : ${palier.typeratio}`);
    }
  }


applyUpgrade(world: World, upgrade: any) {
  if (upgrade.idcible > 0) {
    let product = world.products.find((p) => p.id === upgrade.idcible);
    if (!product) return;

    this.applyBonus(product, upgrade, world);
  } else {
    world.products.forEach((product) => this.applyBonus(product, upgrade, world));
  }
}
}

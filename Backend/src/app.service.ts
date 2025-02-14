import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { origworld } from './origworld';
import { World } from './graphql';

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

  calculateWorldEvolution(world: World): World {
    const now = Date.now();
    const timeElapsed = now - world.lastupdate;

    world.products.forEach((product) => {
      if (product.managerUnlocked) {
        const productionCycles = Math.floor(timeElapsed / product.vitesse);
        world.money += productionCycles * product.quantite * product.revenu;
        world.score += productionCycles * product.quantite * product.revenu;
        product.timeleft = product.vitesse - (timeElapsed % product.vitesse);
      } else if (product.timeleft > 0) {
        if (product.timeleft <= timeElapsed) {
          world.money += product.quantite * product.revenu;
          world.score += product.quantite * product.revenu;
          product.timeleft = 0;
        } else {
          product.timeleft -= timeElapsed;
        }
      }
    });

    world.lastupdate = now;
    return world;
  }
}

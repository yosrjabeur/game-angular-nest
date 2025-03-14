import { Palier, Product, World } from './graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { origworld } from './origworld';

@Resolver('World')
export class GraphQlResolver {
  constructor(private service: AppService) {}
  @Query()
  async getWorld(@Args('user') user: string) {
    let world = await this.service.readUserWorld(user);
    this.service.updateWorld(world);
    this.service.saveWorld(user, world);
    return world;
  }

  @Mutation()
async acheterQtProduit(
  @Args('user') user: string,
  @Args('id') id: number,
  @Args('quantite') quantite: number,
) {
  // Monde du joueur
  let world = this.service.readUserWorld(user);

   // Trouver le produit
   let product = world.products.find((p) => p.id === id);
   if (!product) {
     throw new Error(`Le produit avec l'id ${id} n'existe pas`);
   }

   // Calcul coût total 
   let prix = product.cout * ((1 - Math.pow(product.croissance, quantite)) / (1 - product.croissance));

   // Vérifier si l'utilisateur a assez d'argent
   if (world.money < prix) throw new Error(`Pas assez d'argent`);


   // Augmenter la quantité du produit
   product.quantite += quantite;

   // Déduire l'argent du monde
   world.money -= prix;

   // Mettre à jour le coût 
   product.cout *= Math.pow(product.croissance, quantite);
    
   // Vérifier et appliquer les unlocks
   this.service.checkUnlocks(world, product);

   // Sauvegarder le monde
   await this.service.saveWorld(user, world);
   // Retourner le produit mis à jour
   return product;
 }


@Mutation()
  async lancerProductionProduit(
  @Args('user') user: string,
  @Args('id') id: number,
) {
  let world = await this.service.readUserWorld(user);
  this.service.updateWorld(world);


  // Trouver le produit correspondant à l'id
  let product = world.products.find((p) => p.id === id);

  if (!product) {
    throw new Error(`Le produit avec l'id ${id} n'existe pas`);
  }

  // Demarrage du production et mis à jour timeleft
  if (product.quantite > 0) {
    product.timeleft = product.vitesse;
  } else {
    throw new Error(`Impossible de produire un produit dont la quantité est 0.`);
  }

  // Sauvegarder le monde mis à jour
  await this.service.saveWorld(user, world);
  return product;
}

@Mutation()
async engagerManager(
  @Args('user') user: string,
  @Args('name') name: string,
) {
    let world = await this.service.readUserWorld(user);
    this.service.saveWorld(user, world);

    // find manager correspondant
    let manager = world.managers.find((m) => m.name === name);
    if (!manager) {
      throw new Error(`Le manager avec le nom ${name} n'existe pas.`);
    }

    // find product correspondant to manager
    let product = world.products.find((p) => p.id === manager.idcible);
    if (!product) {
      throw new Error(
        `Le produit avec l'id ${manager.idcible} de manager avec le nom ${name} n'existe pas.`,
      );
    }

    // Vérifier si l'utilisateur a assez d'argent pour acheter le manager
    if (world.money < manager.seuil) {
    throw new Error(`Pas assez d'argent pour engager ${name}`);
  }

    // Débloquer manager and product
    manager.unlocked = true;
    product.managerUnlocked = true;
    // Déduire l'argent dépensé
    world.money-=manager.seuil;

    // Save state
    await this.service.saveWorld(user, world);
    return manager;
  }

  @Mutation()
  async acheterCashUpgrade(
    @Args('user') user: string,
    @Args('name') name: string,
  ) {
    // Charger le monde du joueur
    let world = await this.service.readUserWorld(user);

    // Trouver l'upgrade correspondant
    let upgrade = world.upgrades.find((u) => u.name === name);
    if (!upgrade) {
      throw new Error(`L'upgrade "${name}" n'existe pas.`);
    }

    // Vérifier si le joueur a assez d'argent
    if (world.money < upgrade.seuil) {
      throw new Error(`Fonds insuffisants pour acheter l'upgrade "${name}".`);
    }

    // Déduire l'argent et débloquer l'upgrade
    world.money -= upgrade.seuil;
    upgrade.unlocked = true;

    // Appliquer le bonus de l'upgrade
    if (upgrade.idcible > 0) {
      let product = world.products.find((p) => p.id === upgrade.idcible);
      if (!product) {
        throw new Error(`Produit introuvable pour l'upgrade "${name}" (id cible: ${upgrade.idcible}).`);
      }
      this.service.applyBonus(product, upgrade, world);
    } else {
      world.products.forEach((product) => this.service.applyBonus(product, upgrade, world));
    }

    // Sauvegarde
    await this.service.saveWorld(user, world);
    return upgrade;
  }

@Mutation()
async acheterAngelUpgrade(
  @Args('user') user: string,
  @Args('name') name: string,
) {
  let world = await this.service.readUserWorld(user);
  // Trouver l'upgrade correspondant
  let upgrade = world.angelupgrades.find((u) => u.name === name);
  if (!upgrade) {
    throw new Error(`L'upgrade d'ange ${name} n'existe pas`);
  }
  // Vérifier si l'utilisateur a assez d'anges
  if (world.activeangels < upgrade.seuil) {
    throw new Error(`Pas assez d'anges pour acheter l'upgrade ${name}`);
  }

  world.activeangels -= upgrade.seuil;
  upgrade.unlocked = true;
  this.service.applyUpgrade(world, upgrade);

  this.service.saveWorld(user, world);
  return upgrade;
}

@Mutation()
async resetWorld(@Args('user') user: string) {
  let world = await this.service.readUserWorld(user);

  // Calcul des anges gagnés :
  let nouveauxAnges = Math.floor(150 * Math.sqrt(world.score / Math.pow(10, 5))) - world.totalangels;
  if (nouveauxAnges < 0) nouveauxAnges = 0;

  world.totalangels += nouveauxAnges;
  world.activeangels += nouveauxAnges;

  // Création d'un nouveau monde basé sur le modèle original
  let newWorld: World = JSON.parse(JSON.stringify(origworld));
  // Réinitialiser les valeurs tout en conservant les anges et le score
  newWorld.score = world.score;
  newWorld.totalangels = world.totalangels + nouveauxAnges;
  newWorld.activeangels = world.activeangels + nouveauxAnges;
  newWorld.angelbonus = world.angelbonus;

  // Sauvegarde du nouveau monde
  await this.service.saveWorld(user, newWorld);
  return newWorld;
}

}   
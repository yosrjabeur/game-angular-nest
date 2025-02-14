import { Product } from './graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { origworld } from './origworld';

@Resolver('World')
export class GraphQlResolver {
  constructor(private service: AppService) {}
  @Query()
  getWorld(@Args('user') user: string) {
    let world = this.service.readUserWorld(user);
    world = this.service.calculateWorldEvolution(world);
    this.service.saveWorld(user, world);
    return world;
  }


  @Mutation()
async acheterQtProduit(
  @Args('user') user: string,
  @Args('id') id: number,
  @Args('quantite') quantite: number,
) {
  let world = this.service.readUserWorld(user);
  let product = world.products.find((p) => p.id === id);

  if (!product) {
    throw new Error(`Le produit avec l'id ${id} n'existe pas`);
  }

  // Crée un tableau avec la longueur de 'quantite'
  let { cost, finalCost } = [...Array(quantite)].reduce(
    (acc, _, i) => { // acc est l'accumulateur, et _ représente l'élément courant (non utilisé ici)
      acc.cost += acc.finalCost; // Ajoute le coût actuel (finalCost) à l'accumulateur cost
      acc.finalCost *= product.croissance; // Multiplie le prix actuel par le facteur de croissance (croissance)
      return acc;
    },
    { cost: 0, finalCost: product.cout }
  );

  if (world.money < cost) {
    throw new Error(`Pas assez d'argent pour acheter ${quantite} produits`);
  }

  world.money -= cost;
  product.quantite += quantite;
  product.cout = finalCost;

  this.service.saveWorld(user, world);
  return product;
}


  @Mutation()
  async lancerProductionProduit(
  @Args('user') user: string,
  @Args('id') id: number,
) {
  let world = this.service.readUserWorld(user);
  let product = world.products.find((p) => p.id === id);

  if (!product) {
    throw new Error(`Le produit avec l'id ${id} n'existe pas`);
  }
  product.timeleft = product.vitesse;

  this.service.saveWorld(user, world);
  return product;
}

@Mutation()
async engagerManager(
  @Args('user') user: string,
  @Args('name') name: string,
) {
  let world = this.service.readUserWorld(user);
  let manager = world.managers.find((m) => m.name === name);

  if (!manager) {
    throw new Error(`Le manager avec le nom ${name} n'existe pas`);
  }

  if (world.money < manager.seuil) {
    throw new Error(`Pas assez d'argent pour engager le manager ${name}`);
  }

  world.money -= manager.seuil;
  let product = world.products.find((p) => p.id === manager.idcible);
  if (product) {
    product.managerUnlocked = true;
  }
  manager.unlocked = true;

  this.service.saveWorld(user, world);
  return manager;
}

@Mutation()
async acheterCashUpgrade(
  @Args('user') user: string,
  @Args('name') name: string,
) {
  let world = this.service.readUserWorld(user);
  let upgrade = world.upgrades.find((u) => u.name === name);

  if (!upgrade) {
    throw new Error(`L'upgrade avec le nom ${name} n'existe pas`);
  }

  if (world.money < upgrade.seuil) {
    throw new Error(`Pas assez d'argent pour acheter l'upgrade ${name}`);
  }

  world.money -= upgrade.seuil;
  upgrade.unlocked = true;

  this.service.saveWorld(user, world);
  return upgrade;
}

@Mutation()
async acheterAngelUpgrade(
  @Args('user') user: string,
  @Args('name') name: string,
) {
  let world = this.service.readUserWorld(user);
  let upgrade = world.angelupgrades.find((u) => u.name === name);

  if (!upgrade) {
    throw new Error(`L'upgrade avec le nom ${name} n'existe pas`);
  }

  if (world.activeangels < upgrade.seuil) {
    throw new Error(`Pas assez d'anges pour acheter l'upgrade ${name}`);
  }

  world.activeangels -= upgrade.seuil;
  upgrade.unlocked = true;

  this.service.saveWorld(user, world);
  return upgrade;
}

@Mutation()
async resetWorld(@Args('user') user: string) {
  let world = this.service.readUserWorld(user);
  let angelsGained = Math.floor(Math.sqrt(world.score) / 100);

  world.totalangels += angelsGained;
  world.activeangels += angelsGained;

  let newWorld = { ...origworld };
  newWorld.score = world.score;
  newWorld.totalangels = world.totalangels;
  newWorld.activeangels = world.activeangels;

  this.service.saveWorld(user, newWorld);
  return newWorld;
}
}
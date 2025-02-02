import { Product } from './graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver('World')
export class GraphQlResolver {
  constructor(private service: AppService) {}
  @Query()
  getWorld(@Args('user') user: string) {
    const world = this.service.readUserWorld(user);
    return world;
  }
  @Mutation()
  async acheterQtProduit(
    @Args('user') user: string,
    @Args('id') id: number,
    @Args('quantite') quantite: number,
  ) {

    const world = this.service.readUserWorld(user);
    const product = world.products.find((p) => p.id === id);
    
    if (!product) {
      throw new Error(`Le produit avec l'id ${id} n'existe pas`);
    }

    let cost = 0;
    let currentCost = product.cout;
    for (let i = 0; i < quantite; i++) {
      cost += currentCost;
      currentCost *= product.croissance;
    }
  }
}
import { World } from "./world";

export abstract class IQuery {
    abstract getWorld(user: string): Nullable<World> | Promise<Nullable<World>>;
  }
  type Nullable<T> = T | null;
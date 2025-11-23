import { Link } from "./Link.ts";
import { plainToInstance, Type } from "class-transformer"
import { Client } from "../Client.ts";
import "reflect-metadata";
import { Variable } from "./Variable.ts";

export class Category {
  id!: string;
  name!: string;
  weblink!: string;
  type!: CategoryType;
  rules!: string;
  players!: PlayerSettings;
  miscellaneous!: boolean;
  @Type(() => Link)
  links!: Link[];

  static async fetch(gameId: string): Promise<Category[]> {
    return plainToInstance(
      Category,
      (await (await Client.getData(`/games/${gameId}/categories`)).json() as { data: Category[] }).data
    );
  }

  async fetchVariables(): Promise<Variable[]> {
    return plainToInstance(
      Variable,
      (await (await Client.getData(`/categories/${this.id}/variables`)).json() as { data: Variable[] }).data
    );
  }
}

export enum CategoryType {
  PER_GAME = "per-game",
  PER_LEVEL = "per-level",
}

export class PlayerSettings {
  type!: PlayerType;
  value!: number;
}
export enum PlayerType {
  EXACTLY = "exactly",
  UP_TO = "up to",
}
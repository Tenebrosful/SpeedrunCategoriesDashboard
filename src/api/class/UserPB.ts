import "reflect-metadata";
import { Run } from "./Run.ts";
import { plainToInstance, Type } from "class-transformer";
import { Client } from "../Client.ts";

export class UserPB {
  place!: number;
  @Type(() => Run)
  run!: Run;

  static async fetch(userId: string, game?: string): Promise<UserPB[]> {
    const query = new URLSearchParams();
    if (game) { query.append("game", game); }
    return plainToInstance(
      UserPB,
      (await (await Client.getData(`/users/${userId}/personal-bests`, query)).json() as { data: UserPB[] }).data
    );
  }
}
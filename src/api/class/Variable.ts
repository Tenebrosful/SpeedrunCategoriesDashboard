import { plainToInstance, Type } from "class-transformer"
import "reflect-metadata";
import { Client } from "../Client.ts";

export class Variable {
  id!: string;
  name!: string;
  category?: string;
  mandatory!: boolean;
  obsolete!: boolean;
  @Type(() => VariableValue)
  values!: VariableValue;
  "is-subcategory"!: boolean;

  static async fetch(gameId: string): Promise<Variable[]> {
    return plainToInstance(
      Variable,
      (await (await Client.getData(`/games/${gameId}/variables`)).json() as { data: Variable[] }).data
    );
  }
}

export class VariableValue {
  values!: Map<string, VariableValues>;
  default!: string;
}

export class VariableValues {
  label!: string;
  rules!: string;
  @Type(() => VariableValueFlags)
  flags!: VariableValueFlags;
}

export class VariableValueFlags {
  miscellaneous!: boolean;
}
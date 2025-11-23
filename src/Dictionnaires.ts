import { Category } from "./api/class/Category.ts";
import { Variable } from "./api/class/Variable.ts";
import { SimplifiedCategory, SimplifiedVariable, SimplifiedVariableUnique, SimplifiedVariableValue } from "./SimplifiedClass.ts";

export class DictionnaireCategorie {
  public categories: Map<string, SimplifiedCategory> = new Map();

  async initialize(gameId: string, variables: DictionnaireVariable): Promise<void> {
    const categories = await Category.fetch(gameId);
    categories.forEach((category) => {
      const variablesCategory = Array.from(variables.variables.values().filter(v => v.categoryId == category.id));

      this.categories.set(category.id, new SimplifiedCategory(category.id, category.name, variablesCategory));
    });
  }
}

export class DictionnaireVariable {
  public variables: Map<string, SimplifiedVariable> = new Map();

  async initialize(gameId: string): Promise<void> {
    const variables = (await Variable.fetch(gameId)).filter(v => v["is-subcategory"]);
    variables.forEach((variable) => {
      this.variables.set(variable.id,
        new SimplifiedVariable(variable.id, variable.category, variable.name, variable["is-subcategory"],
          Array.from(Object.entries(variable.values.values)).map(([key, value]) => new SimplifiedVariableValue(key, variable.id, value.label))
        )
      );
    });
  }
}

export class DictionnaireCombinaison {
  public combinaisons: { categorie: SimplifiedCategory, variables: SimplifiedVariableUnique[] }[] = [];

  async initialize(dicoCategories: DictionnaireCategorie) {
    const categories = Array.from(dicoCategories.categories.values());

    categories.forEach(category => {
      if (category.variables === undefined) {
        this.combinaisons.push({ categorie: category, variables: [] })
      } else {
        const result = this.recursiveCategorieVariable([], category.variables, category, []);

        result.forEach(c => {
          this.combinaisons.push(c);
        })
      }
    });
  }

  contain(category: SimplifiedCategory, variables: SimplifiedVariableUnique[]) {
    const finger = getFingerprint(category, variables);

    return this.combinaisons.some(c => getFingerprint(c.categorie, c.variables) === finger);
  }

  private recursiveCategorieVariable(accumulatedValues: SimplifiedVariableUnique[], remainingVariable: SimplifiedVariable[], categorie: SimplifiedCategory, result: { categorie: SimplifiedCategory, variables: SimplifiedVariableUnique[] }[]) {
    const currentVariable = remainingVariable[0];

    if (currentVariable === undefined) {
      result.push({ categorie: categorie, variables: [...accumulatedValues] });
    } else {

      const remainingVariableFuture = remainingVariable.slice(1);

      currentVariable.values.forEach(v => {
        accumulatedValues.push(new SimplifiedVariableUnique(currentVariable.id, categorie.id, currentVariable.name, v))
        result = this.recursiveCategorieVariable(accumulatedValues, remainingVariableFuture, categorie, result);
        accumulatedValues.pop();
      });
    }

    return result;
  }
}

function getFingerprint(category: SimplifiedCategory, variables: SimplifiedVariableUnique[]) {
  return category.id + variables.map(v => v.value.id).join();
}
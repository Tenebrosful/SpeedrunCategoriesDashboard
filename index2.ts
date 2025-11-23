import type { Category } from "./src/api/class/Category.ts";
import { UserPB } from "./src/api/class/UserPB.ts";
import { DictionnaireCategorie, DictionnaireCombinaison, DictionnaireVariable } from "./src/Dictionnaires.ts";
import { SimplifiedVariable, SimplifiedVariableUnique, SimplifiedVariableValue, type SimplifiedCategory } from "./src/SimplifiedClass.ts";

const GAME_ID = "deltarune_category_extensions";
const USER_ID = "tenebrosful";

const dicoVariables = new DictionnaireVariable();
await dicoVariables.initialize(GAME_ID);

// console.log(dicoVariables.variables);

const dicoCategories = new DictionnaireCategorie();
await dicoCategories.initialize(GAME_ID, dicoVariables);

// console.log(dicoCategories.categories)

const dicoCombinaison = new DictionnaireCombinaison();
dicoCombinaison.initialize(dicoCategories);

dicoCombinaison.combinaisons.forEach(c => {
  console.log(`${c.categorie.name} - ${c.variables.map(v => v.value.label).join(", ")}`)
})

const pbs = await UserPB.fetch(USER_ID, GAME_ID);

const combinaisonsPB = new DictionnaireCombinaison();

pbs.forEach(pb => {
  const category = dicoCategories.categories.get(pb.run.category) as SimplifiedCategory;
  const variables = Object.entries(pb.run.values).map(([variableId, valueId]) => {
    const variable = dicoVariables.variables.get(variableId) as SimplifiedVariable;

    if (!variable?.isSubCategory) { return; }

    return new SimplifiedVariableUnique(variableId, category.id, variable.name, variable.values.find(v => v.id === valueId) as SimplifiedVariableValue);
  }).filter(v => v != undefined);

  combinaisonsPB.combinaisons.push({ categorie: category, variables: variables })

  console.log(`(${pb.place}) ${category?.name} - ${Object.entries(pb.run.values)
    .map(([variableId, valueId]) => dicoVariables.variables.get(variableId)?.values.find(v => v.id === valueId)?.label).join(", ")}`)
})

dicoCombinaison.combinaisons.forEach(c => {
  if (!combinaisonsPB.contain(c.categorie, c.variables)) {
    console.log(`Catégorie non jouée : ${c.categorie.name} (${c.variables.map(v => v.value.label).join(", ")})`)
  }
})
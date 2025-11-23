import { resolve } from "bun";
import { Category } from "./src/api/class/Category.ts";
import { Variable, VariableValue, VariableValues } from "./src/api/class/Variable.ts";
import { UserPB } from "./src/api/class/UserPB.ts";

function recursiveVariablePossibilities(accumulatedValues: { variableId: string; variableValue: VariableValues }[], remainingVariable: Variable[], result: { variableId: string; variableValue: VariableValues }[][]) {
  const currentVariable = remainingVariable[0];

  if (currentVariable === undefined) {
    result.push([...accumulatedValues]);
    return result;
  }

  const restVariables = remainingVariable.slice(1);

  Object.entries(currentVariable.values.values).forEach(([valueId, value]) => {
    accumulatedValues.push({ variableId: currentVariable.id, variableValue: value });
    recursiveVariablePossibilities(accumulatedValues, restVariables, result);
    accumulatedValues.pop();
  });

  return result;
}

console.log("Hello via Bun!");

console.log();

const categories = await Category.fetch("deltarune");

const dicoCategories = new Map<string, Category>();

categories.forEach((category) => {
  dicoCategories.set(category.id, category);
});

const variables = (await Variable.fetch("deltarune")).filter(v => v["is-subcategory"]);

const dicoVariables = new Map<string, Variable>();

variables.forEach((variable) => {
  dicoVariables.set(variable.id, variable);
});

const everyCategoryVariables = new Map<string, { variableId: string; variableValue: VariableValues }[][]>();

categories.forEach(async (category) => {
  const variables = (await category.fetchVariables()).filter(v => v["is-subcategory"]);
  console.log(`Category: ${category.name} (ID: ${category.id})`);
  const result = recursiveVariablePossibilities([], variables, []);
  everyCategoryVariables.set(category.id, result);

  console.log(`  - Total combinations of subcategory variables: ${result.length}`);
  result.forEach((combination, index) => {
    console.log(`    Combination ${index + 1}: ${combination.map(v => `${v.variableValue.label} (Variable ID: ${v.variableId})`).join(", ")}`);
  });
});

const myPb = await UserPB.fetch("Tenebrosful", "deltarune");

const everyPBCategoryVariables = new Map<string, { variableId: string; variableValue: VariableValues }[]>();

myPb.forEach((pb) => {
  const categoryName = dicoCategories.get(pb.run.category)?.name || "Unknown Category";
  const variables: [string, string][] = Object.entries(pb.run.values);

  const subcategory = variables.filter(([key, value]) => {
    const variable = dicoVariables.get(key);
    if (!variable) {
      return false;
    }
    return true;
  });

  const variablesNames = subcategory.map(([key, value]) => {
    const variable = dicoVariables.get(key);
    if (!variable) {
      return;
    }

    return variable.values.values[value]?.label || "Unknown Variable";


    // return variable ? Array.from(variable.values.values).map(([variableID, valeur]) => dicoVariables.get(variableID)?.values.values.get(value)?.label) : "Unknown Variable";
  }).join(", ");

  console.log(`User PB ${categoryName} (${variablesNames}) Run ID: ${pb.run.id} in place ${pb.place}`);
  everyPBCategoryVariables.set(pb.run.category, subcategory.map(([key, value]) => {
    const variable = dicoVariables.get(key)
    return { variableId: key, variableValue: variable!.values.values[value] }
  }));
});

const notRunned = new Map([...everyCategoryVariables.entries()].filter(([categoryId, _]) => !everyPBCategoryVariables.has(categoryId)));

notRunned.forEach(([categoryId, variableCombinations]) => {
  const categoryName = dicoCategories.get(categoryId)?.name || "Unknown Category";
  console.log(`Category: ${categoryName} (ID: ${categoryId}) has not been run by the user.`);
  console.log(`  - Total combinations of subcategory variables: ${variableCombinations.length}`);
  variableCombinations.forEach((combination, index) => {
    console.log(`    Combination ${index + 1}: ${combination.map(v => `${v.variableValue.label} (Variable ID: ${v.variableId})`).join(", ")}`);
  });
});


// everyCategoryVariables.forEach((variableCombinations, categoryId) => {
//   console.log(`Category ID: ${categoryId} has ${variableCombinations.length} combinations of subcategory variables.`);
// });

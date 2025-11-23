export class SimplifiedCategory {
  id: string;
  name: string;
  variables?: SimplifiedVariable[];

  constructor(id: string, name: string, variables: SimplifiedVariable[] | undefined) {
    this.id = id;
    this.name = name;
    this.variables = variables;
  }
}

export class SimplifiedVariable {
  id: string;
  categoryId?: string;
  name: string;
  isSubCategory: boolean;
  values: SimplifiedVariableValue[];

  constructor(id: string, categoryId: string | undefined, name: string, isSubCategory: boolean, values: SimplifiedVariableValue[]) {
    this.id = id;
    this.categoryId = categoryId;
    this.name = name;
    this.isSubCategory = isSubCategory;
    this.values = values;
  }
}

export class SimplifiedVariableUnique {
  id: string;
  categoryId?: string;
  name: string;
  value: SimplifiedVariableValue;

  constructor(id: string, categoryId: string | undefined, name: string, value: SimplifiedVariableValue) {
    this.id = id;
    this.categoryId = categoryId;
    this.name = name;
    this.value = value;
  }
}

export class SimplifiedVariableValue {
  id: string;
  variableId: string;
  label: string;

  constructor(id: string, variableId: string, label: string) {
    this.id = id;
    this.variableId = variableId;
    this.label = label;
  }
}
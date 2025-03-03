import { RequestData, ValidationData } from "./types";

export function validateRequestBody(payload: RequestData): void {
  let { rule, data } = payload;

  // rule field is required
  if (!payload.hasOwnProperty("rule")) {
    throw new Error("rule is required.");
  }

  // data field is required
  if (!payload.hasOwnProperty("data")) {
    throw new Error("data is required.");
  }
  // Data can be an object, string or array
  if (!(data === Object(data) || typeof data === "string")) {
    throw new Error("data should be an object, array or a string.");
  }

  // rule must be a valid JSON
  if (!(rule === Object(rule) && !Array.isArray(rule))) {
    throw new Error("rule should be an object.");
  }

  const { field, condition } = rule;

  // VALIDATE FIELD
  if (typeof field !== "string" && rule.hasOwnProperty("field")) {
    throw new Error(`rule.field should be a string.`);
  }
  //  rule field is required
  if (!rule.hasOwnProperty("field") || field.trim() === "" ) {
    throw new Error("rule.field is required.");
  }

  // Split field levels into array
  const field_levels: string[] = field.split(".");

  // ensure nesting is not more than two levels
  if (field_levels.length > 2) {
    throw new Error("nested field object must not exceed two levels.");
  }
  // Check if the field in the data passed to validate the rule against
  if (!data[field_levels[0]]) {
    throw new Error(`field ${field_levels[0]} is missing from data.`);
  }

  if (field_levels.length === 2 && !data[field_levels[0]][field_levels[1]]) {
    throw new Error(`field ${field_levels[0]}.${field_levels[1]} is missing from data.`);
  }

  // VALIDATE CONDITION
  if (typeof condition !== "string" && rule.hasOwnProperty("condition") ) {
    throw new Error(`rule.condition should be a string.`);
  }

  const conditions: string[] = ["eq", "neq", "gt", "gte", "contains"];
  // condition  is required
  if (!rule.hasOwnProperty("condition") || condition.trim() === "") {
    throw new Error("rule.condition is required.");
  }
  // condition  must be  valid
  if (!conditions.includes(condition)) {
    throw new Error(
      `condition '${condition}' is invalid. Condition must be one of ${conditions
        .filter(cond => cond !== conditions[conditions.length - 1])
        .join(", ")} or ${conditions[conditions.length - 1]}.`
    );
  }

  // VALIDATE CONDITION VALUE
  // condition  is required
  if (!rule.hasOwnProperty("condition_value") ) {
    throw new Error("rule.condition_value is required.");
  }

 

}

export function isInValidRule(validation_data: ValidationData): any {
  const { field_value, condition, condition_value } = validation_data.validation;

  let error: boolean = false;
  switch (condition) {
    case "eq":
      error = condition_value === field_value ? false : true;
      break;
    case "neq":
      error = condition_value !== field_value ? false : true;
      break;
    case "gt":
      error = field_value > condition_value ? false : true;
      break;
    case "gte":
      error = field_value >= condition_value ? false : true;
      break;
    case "contains":
      error = field_value.includes(condition_value) ? false : true;
      break;

    default:
      break;
  }

  return error;
}

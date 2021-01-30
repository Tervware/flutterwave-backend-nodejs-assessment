
import  { RequestData, ValidationData } from './types'

export function validateRequestBody(payload: RequestData): any{

  let { rule, data } = payload;
  
  
  // rule field is required
  if (!payload.hasOwnProperty("rule")) {
    throw new Error("rule is required.");
  }

  // data field is required
  if (!payload.hasOwnProperty("data")) {
    throw new Error("data is required.");
  }


   // rule must be a valid JSON
   if (!(rule === Object(rule) && !Array.isArray(rule))) {
    throw new Error("rule should be an object.");
   }

const { field, condition, condition_value } = rule;
 
// VALIDATE FIELD
  //  field is required
  if (!field) {
    throw new Error("rule.field is required.");
  }

  // Split field levels into array
  const fieldLevels: string[] = field.split(".")

  // ensure nesting is not more than two levels
  if (fieldLevels.length > 2) {
    throw new Error("nested field object must not exceed two levels.");
  }
  // Check if the field in the data passed to validate the rule against
  if (!data[fieldLevels[0]]) {
    throw new Error(`field ${fieldLevels[0]} is missing from data.`);
  }

  if (fieldLevels.length === 2 && !data[fieldLevels[0]][fieldLevels[1]]) {
    throw new Error(`field ${fieldLevels[0]}.${fieldLevels[1]} is missing from data.`);
  }


// VALIDATE CONDITION
  const conditions: string[] = ["eq" ,"neq", "gt", "gte", "contains"];
  // condition  is required
  if (!condition) {
    throw new Error("condition is required.");
  }
   // condition  must be  valid 
   if (!conditions.includes(condition)) {
    throw new Error(`condition '${condition}' is valid condition must be one of ${conditions.join(',')}.`);
  }


// VALIDATE CONDITION VALUE
// condition  is required
if (!condition_value) {
  throw new Error("rule.condition_value is required.");
}


// VALIDATE DATA
// TODO: Data can be an object string or array

// TODO: validate for wrong type for rule and data
  return

} 


export function isInValidRule( validation_data: ValidationData ): any{

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
        error = condition_value > field_value ? false : true;
      break;
    case "gte":
        error = condition_value >= field_value ? false : true;
      break;
    case "contains":
      error = field_value.includes(condition_value) ? false : true; 
      break;

    default:
      break;
  }
   
  return error;

} 
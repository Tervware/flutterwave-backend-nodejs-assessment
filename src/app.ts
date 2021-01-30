require("dotenv").config();
import express, { Application, Request, Response, NextFunction , Errback} from 'express';
import {json} from 'body-parser';
import  { User, ResponseData, ValidationData } from './types';
import  { validateRequestBody, isInValidRule } from './validations';

const app: Application = express();
 
const port = process.env.PORT;

// parse application/json
app.use(json())
 
app.use( (err: Errback, req: Request, res: Response, next: NextFunction) => {
 
    if(err instanceof SyntaxError){ //Handle SyntaxError/Invalid JSON payload here.
      return res.status(400).send({
        "message": "Invalid JSON payload passed.",
        "status": "error",
        "data": null
      });
    } 
    return next();
});


app.get('/', (req: Request, res: Response) => {

    const user: User =  {
        name: "Chahur, Terver Timothy",
        github: "@tervware",
        email: "terv.software@gmail.com",
        mobile: "08130129715",
        twitter: null
    };

    const responseData:  ResponseData<User> = {
      message: "My profile details.",
      status: "success",
      data: user
    };
    return res.status(200).send(responseData);
});


app.post('/validate-rule', (req: Request, res: Response) => {
 
  try {
    
  // Validate incoming request body
  validateRequestBody(req.body);

  const {field, condition, condition_value } = req.body.rule;

  const fieldLevels: string[] = field.split(".")


    const field_value =
      fieldLevels.length === 2
        ? req.body.data[fieldLevels[0]][fieldLevels[1]]
        : req.body.data[fieldLevels[0]];
  
   
  const validation_data: ValidationData = {
    validation: {
      error: false,
      field,
      field_value,
      condition,
      condition_value
    }};
    
  if (isInValidRule(validation_data)) {
    validation_data.validation.error = true;
    const responseData:  ResponseData<ValidationData> = {
      message: `field ${field}  failed validation.`,
      status: "error",
      data: validation_data
    }
    return res.status(400).send(responseData);
  
  } 


  const responseData:  ResponseData<ValidationData> = {
    message: `field ${field} successfully validated.`,
    status: "success",
    data: validation_data
  }
  return res.status(200).send(responseData);

  } catch (error) {
    const responseData:  ResponseData<any> = {
      message: error.message,
      status: "error",
      data: null
    }
  return res.status(400).send(responseData);
  }
});


app.all('*', (req: Request, res: Response) => {
  const responseData:  ResponseData<any> = {
    message: `Cannot find ${req.originalUrl} on this server!`,
    status: "error",
    data: null
  }
return res.status(404).send(responseData);
   
});

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})

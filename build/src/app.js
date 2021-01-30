"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const validations_1 = require("./validations");
const app = express_1.default();
const port = 3001;
// parse application/json
app.use(body_parser_1.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) { //Handle SyntaxError/Invalid JSON payload here.
        return res.status(400).send({
            "message": "Invalid JSON payload passed.",
            "status": "error",
            "data": null
        });
    }
    return next();
});
app.get('/', (req, res) => {
    const user = {
        name: "Chahur, Terver Timothy",
        github: "@tervware",
        email: "terv.software@gmail.com",
        mobile: "08130129715",
        twitter: null
    };
    const responseData = {
        message: "My profile details.",
        status: "success",
        data: user
    };
    return res.status(200).send(responseData);
});
app.post('/validate-rule', (req, res) => {
    try {
        // Validate incoming request body
        validations_1.validateRequestBody(req.body);
        const { field, condition, condition_value } = req.body.rule;
        const fieldLevels = field.split(".");
        const field_value = fieldLevels.length === 2
            ? req.body.data[fieldLevels[0]][fieldLevels[1]]
            : req.body.data[fieldLevels[0]];
        const validation_data = {
            validation: {
                error: false,
                field,
                field_value,
                condition,
                condition_value
            }
        };
        if (validations_1.isInValidRule(validation_data)) {
            validation_data.validation.error = true;
            const responseData = {
                message: `field ${field}  failed validation.`,
                status: "error",
                data: validation_data
            };
            return res.status(400).send(responseData);
        }
        const responseData = {
            message: `field ${field} successfully validated.`,
            status: "success",
            data: validation_data
        };
        return res.status(200).send(responseData);
    }
    catch (error) {
        const responseData = {
            message: error.message,
            status: "error",
            data: null
        };
        return res.status(400).send(responseData);
    }
});
app.all('*', (req, res) => {
    const responseData = {
        message: `Can't find ${req.originalUrl} on this server!`,
        status: "error",
        data: null
    };
    return res.status(400).send(responseData);
});
app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
});
// if (!Array.isArray(a) && typeof a !== 'object' && typeof a !== 'string') {}

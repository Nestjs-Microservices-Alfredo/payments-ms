import 'dotenv/config';
import * as joi from 'joi';


interface EnvVars { 
    PORT: number;
    STRIPE_SECRET: string;
    STRIPE_SUCCESS_URL: string;
    STRIPE_CANCEL_URL: string;
    STRIPE_ENDPOINT_SECRET: string;
}

const envVarsSchema = joi.object({
    PORT: joi.number().default(3000),
    STRIPE_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
}).unknown(true);

const { error, value: envVars } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVarsConfig: EnvVars = envVars;

export const envs = {
    port: envVarsConfig.PORT,
    stripeSecret: envVarsConfig.STRIPE_SECRET,
    stripeSuccessUrl: envVarsConfig.STRIPE_SUCCESS_URL,
    stripeCancelUrl: envVarsConfig.STRIPE_CANCEL_URL,
    stripeEndpointSecret: envVarsConfig.STRIPE_ENDPOINT_SECRET,
}
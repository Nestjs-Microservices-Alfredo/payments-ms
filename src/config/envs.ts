import 'dotenv/config';
import * as joi from 'joi';


interface EnvVars { 
    PORT: number;
    STRIPE_SECRET: string;
}

const envVarsSchema = joi.object({
    PORT: joi.number().default(3000),
    STRIPE_SECRET: joi.string().required()
}).unknown(true);

const { error, value: envVars } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVarsConfig: EnvVars = envVars;

export const envs = {
    port: envVarsConfig.PORT,
    stripeSecret: envVarsConfig.STRIPE_SECRET
}
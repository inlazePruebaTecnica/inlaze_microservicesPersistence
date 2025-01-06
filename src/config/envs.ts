import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

// Definir el esquema de validación para las variables de entorno
const envsSchema = joi.object({
  PORT: joi.number().required(),
  DATABASE_URL: joi.string().required(),

}).unknown(true);

// Validar las variables de entorno
const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Validación de la configuración con error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
};

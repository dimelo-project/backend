import Joi from 'joi';

export const configValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  BCRYPT_SALT_ROUNDS: Joi.number().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_SECRET: Joi.string().required(),
  GITHUB_CLIENT_ID: Joi.string().required(),
  NODEMAILER_SERVICE: Joi.string().required(),
  NODEMAILER_HOST: Joi.string().required(),
  NODEMAILER_PORT: Joi.number().required(),
  NODEMAILER_USER: Joi.string().required(),
  NODEMAILER_PASS: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_BUCKET_REGION: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  THROTTLE_TTL: Joi.number().required(),
  THROTTLE_LIMIT: Joi.number().required(),
});

import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  EMAIL_BACKEND_API,
  TOKEN_KEY,
  RESET_PASSWORD_TOKEN_KEY,
  RESET_PASSWORD_PAGE_URL,
  EMAIL_BACKEND_API_USER,
} = process.env;
export const CREDENTIALS = process.env.CREDENTIALS === 'true';

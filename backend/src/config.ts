import * as dotenv from 'dotenv';

dotenv.config();

export const {
    DB_URI
} = process.env as {
  [key: string]: string;
};
import type { Knex } from "knex";
import * as dotenv from 'dotenv';
import { ConfigService } from "@nestjs/config";

dotenv.config();

// Update with your config settings.
const configService = new ConfigService();


const config: Knex.Config  = {
    client: "postgresql",
    connection: {
      user: process.env.DATABASE_USER,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT),
      host: process.env.DATABASE_HOST,
      ssl: {rejectUnauthorized: false}
    },
    migrations: {
      tableName: "knex_migrations",
      directory:"./src/database/migrations"
    }
};

export default config;

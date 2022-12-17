import { DataSource } from "typeorm";
import { Shortlink } from "./entities/Shortlink";

export const AppDataSource = new DataSource({
  type: "mongodb",
  host: "localhost",
  port: 27017,
  database: "test",
  synchronize: true,
  logging: true,
  entities: [Shortlink],
});

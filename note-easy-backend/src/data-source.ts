import "reflect-metadata";
import { DataSource } from "typeorm";
import { CategoryNote } from "./entity/CategoryNote";
import { Customer } from "./entity/Customer";
import { HistoryNote } from "./entity/HistoryNote";
import { Note } from "./entity/Note";

export const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  host: "localhost",
  username: "postgres",
  password: "015651113",
  database: "note-easy",
  synchronize: true,
  logging: false,
  entities: [Customer, Note, HistoryNote, CategoryNote],
  migrations: [],
  subscribers: [],
});

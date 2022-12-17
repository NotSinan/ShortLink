import express, { Express } from "express";
import shortlinkRoute from "./routes/shortlinkRoute";
import bodyParser from "body-parser";
import { initialiseDataSource } from "./connection";

const app: Express = express();
const port: number = 3000;

initialiseDataSource();

app.use(bodyParser.json());

app.use("/", shortlinkRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});

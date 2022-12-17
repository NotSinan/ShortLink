import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Shortlink } from "./entities/Shortlink";
import { check, validationResult } from "express-validator";
import bodyParser from "body-parser";

const app: Express = express();

const port: number = 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.use(bodyParser.json());

app.get("/", async (req: Request, res: Response): Promise<void> => {
  const link = await AppDataSource.getRepository(Shortlink).find();
  res.send(link);
});

app.post(
  "/add",
  [
    check("short")
      .exists()
      .custom(async (value: string) => {
        const shortlink = await AppDataSource.getRepository(
          Shortlink
        ).findOneBy({
          short_link: value,
        });

        if (shortlink) {
          throw new Error("Already exists");
        }
        return true;
      }),
    check("full")
      .exists()
      .isURL({ require_host: true, protocols: ["http", "https"] }),
    check("clicks"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const shortlink: Shortlink = new Shortlink();

      shortlink.short_link = `${req.body.short}`;
      shortlink.full_link = `${req.body.full}`;
      shortlink.clicks = 0;

      await AppDataSource.getRepository(Shortlink).save(shortlink);

      res.send("Successfully added.");
    }
  }
);

app.get("/:shortlink", async (req: Request, res: Response): Promise<void> => {
  const link = await AppDataSource.getRepository(Shortlink).findOneBy({
    short_link: `${req.params.shortlink}`,
  });

  if (link) {
    res.redirect(link.full_link);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});

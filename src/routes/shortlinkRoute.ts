import express, { Request, Response, Router } from "express";
const router: Router = express.Router();
import { AppDataSource } from "../data-source";
import { Shortlink } from "../entities/Shortlink";
import { check, validationResult } from "express-validator";

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const link = await AppDataSource.getRepository(Shortlink).find();
  res.send(link);
});

router.post(
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

router.get(
  "/:shortlink",
  async (req: Request, res: Response): Promise<void> => {
    const link = await AppDataSource.getRepository(Shortlink).findOneBy({
      short_link: `${req.params.shortlink}`,
    });

    if (link) {
      res.redirect(link.full_link);
    } else {
      res.sendStatus(404);
    }
  }
);

export default router;

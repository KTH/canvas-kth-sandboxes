import express from "express";
import { Router, Request, Response } from "express";

const app = express();
const port = 3000;

app.listen(port, () => console.log("It is working!"));

const router = Router();

app.use("/canvas-kth-sandboxes", router);

router.get("/_monitor", monitor);

async function monitor(req: Request, res: Response) {
  try {
    res.send("OK");
  } catch (error) {
    res.send("Application status: ERROR");
  }
}

import "./config/start";
import express from "express";
import { Router, Request, Response } from "express";
import log from "skog";

const app = express();
const port = 3000;

app.listen(port, () => log.info("Sandbox app up and running"));

const router = Router();

app.use("/canvas-kth-sandboxes", router);

router.get("/_monitor", monitor);

async function monitor(req: Request, res: Response) {  
  try {
    res.send("OK");
  } catch (error) {
    res.send("Application status: ERROR");
    log.error("Error: something went wrong.")
  }
}

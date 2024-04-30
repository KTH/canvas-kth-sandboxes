import "./config/start";
import authRouter from "./auth/auth";
import express from "express";
import { Router, Request, Response } from "express";
import sessionMiddleware from "express-session";
import log from "skog";

const app = express();
const port = 3000;

app.listen(port, () => log.info("Sandbox app up and running"));
app.use(
    sessionMiddleware({
      name: "canvas-kth-sandboxes.sid",
      proxy: true,
      cookie: {
        domain: new URL(process.env.PROXY_HOST || "").hostname,
        maxAge: 14 * 24 * 3600 * 1000,
        httpOnly: true,
        secure: "auto",
        sameSite: "none",
      },
  
      // Read more: https://www.npmjs.com/package/express-session#resave
      resave: false,
  
      // Save only sessions when user is authenticated. Setting "saveUnitialized"
      // to "false" prevents creation of sessions when app is accessed via API
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "",
    })
  );

const router = Router();


app.use("/canvas-kth-sandboxes", router);
app.use("/canvas-kth-sandboxes/auth", authRouter);

router.get("/_monitor", monitor);

async function monitor(req: Request, res: Response) {  
  try {
    res.send("OK");
  } catch (error) {
    res.send("Application status: ERROR");
    log.error("Error: something went wrong.")
  }
}

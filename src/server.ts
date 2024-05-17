import "./env";
import express from "express";
import sessionMiddleware from "express-session";
import { Router} from "express";
import log from "skog";

import session from "express-session";


const app = express();
const port = 3000;


app.listen(port, () => log.info("Sandbox app up and running"));
app.set("trust proxy", 1);
app.use(express.urlencoded({extended: false}));
app.use(
    sessionMiddleware({
      name: "canvas-kth-sandboxes.sid",
      proxy: true,
      store: new session.MemoryStore(),
      cookie: {
        domain: new URL(process.env.PROXY_HOST || "").hostname,
        maxAge: 14 * 24 * 3600 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: false,
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

export default router;
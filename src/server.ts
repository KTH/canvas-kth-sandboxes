import "./env";
import express from "express";
import sessionMiddleware from "express-session";
import session from "express-session";
import authRouter from "./auth/auth";
import router from "./router";
import { errorHandler } from "./error";

const server = express();

server.set("trust proxy", 1);
server.use(express.urlencoded({ extended: false }));
server.use(
  sessionMiddleware({
    name: "canvas-kth-sandboxes.sid",
    proxy: true,
    store: new session.MemoryStore(),
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
  }),
);

server.use("/canvas-kth-sandboxes", router);
server.use("/canvas-kth-sandboxes", errorHandler);
server.use("/canvas-kth-sandboxes/auth", authRouter);

export default server;

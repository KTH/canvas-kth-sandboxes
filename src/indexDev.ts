import "./config/start";
import selfsigned from "selfsigned";
import https from "https";
import server from "./server";
import log from "skog";

const selfSigned = selfsigned.generate(
  [{ name: "commonName", value: "kth.se" }],
  { days: 365 },
);
let opts = {
  key: selfSigned.private,
  cert: selfSigned.cert,
};
https.createServer(opts, server).listen(process.env.PORT, () => {
  log.info("Sandbox app up and running");
});

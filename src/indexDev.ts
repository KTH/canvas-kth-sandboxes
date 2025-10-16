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
  log.info(`Sandbox is up and running on https://localdev.kth.se:3000/canvas-kth-sandboxes/public`);
  // localdev.kth.se is something we set up in .hosts to enable https and local certificates.
});

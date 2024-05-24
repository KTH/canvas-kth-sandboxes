import "./config/start";
import server from "./server";
import log from "skog";


server.listen(process.env.PORT, () => {log.info("Sandbox app up and running")});
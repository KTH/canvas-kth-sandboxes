import "./config/start";
import server from "./server";
import log from "skog";


server.listen(3000, () => {log.info("Sandbox app up and running")});
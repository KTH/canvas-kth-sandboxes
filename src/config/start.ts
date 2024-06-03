import log from "skog";
require("dotenv").config();

process.on("uncaughtException", (err) => {
  log.fatal(err, "UncaughtException");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  if (reason instanceof Error) {
    log.fatal(reason, "UnhandledRejection");
  } else {
    log.fatal(
      "UnhandledRejection: some promise have been rejected but didn't throw an `Error` object. It is not possible to show a stack trace",
    );
  }
  process.exit(1);
});

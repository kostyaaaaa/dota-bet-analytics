const fs = require("fs");
const logger = fs.createWriteStream("logs.log", {
  // flags: "a", // 'a' means appending (old data will be preserved)
});

const errorLogger = fs.createWriteStream("errors.log", {
  // flags: "a", // 'a' means appending (old data will be preserved)
});

class Logger {
  log(message) {
    if (typeof message === "string") {
      logger.write(`${new Date()}${message}\n`);
    } else {
      logger.write(`${new Date()}${JSON.stringify(message)}\n`);
    }
  }

  error(message) {
    errorLogger.write(`${new Date()}${message}\n`);
  }
}

module.exports = new Logger();

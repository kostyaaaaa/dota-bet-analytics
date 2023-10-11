const fs = require("fs");
const logger = fs.createWriteStream("logs/logs.log", {
  // flags: "a", // 'a' means appending (old data will be preserved)
});

const errorLogger = fs.createWriteStream("logs/errors.log", {
  // flags: "a", // 'a' means appending (old data will be preserved)
});

const statsLogger = fs.createWriteStream("logs/stats.log", {
  flags: "a", // 'a' means appending (old data will be preserved)
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

  stats(data) {
    statsLogger.write(`${new Date()}\n ${data} \n`);
  }
}

module.exports = new Logger();

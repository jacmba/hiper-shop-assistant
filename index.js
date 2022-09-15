const logger = require("./src/logging");
const driver = require("./src/driver");
const express = require("express");
const api = require("./src/api");

const app = express();

(async () => {
  const init = await driver.init();

  if (!init) {
    logger.warn("Error initializing driver");
    return;
  }

  api.init(app, driver);

  try {
    app.listen(3000, (err) => {
      if (err) {
        driver.shutdown();
        throw err;
      }

      logger.info('Server listening on port 3000');
    });
  } catch (e) {
    logger.error("Error on initialization", e);
  }
})();

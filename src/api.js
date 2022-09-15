const logger = require('./logging');

let app, driver;

const login = async(req, res) => {
  try {
    await driver.login();
    logger.info('Login success');
    return res.json({login: 'OK'});
  } catch (e) {
    logger.error('Error on login', e)
    return res.status(409).send(e);
  }
}

const search = async(req, res) => {
  const name = req.query.name;
  try {
    const result = await driver.find(name);
    logger.debug(`Return search ${"name"}`, result);
    res.json(result);
  } catch (e) {
    logger.error('Error searching item', e);
    return res.status(409).send(e);
  }
}

const init = (a, d) => {
  app = a;
  driver = d;

  app.get('/login', login);
  app.get('/search', search);
}

module.exports = {init};
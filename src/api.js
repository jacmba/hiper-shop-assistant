const logger = require('./logging');

let app, driver;

const login = async (req, res) => {
  logger.info('Requested login from ' + req.ip);
  try {
    await driver.login();
    logger.info('Login success');
    return res.json({login: 'OK'});
  } catch (e) {
    logger.error('Error on login', e)
    return res.status(409).send(e);
  }
}

const search = async (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).send('Missing "name" param');
  }
  try {
    const result = await driver.find(name);
    logger.debug(`Return search ${"name"}`, result);
    res.json(result);
  } catch (e) {
    logger.error('Error searching item', e);
    return res.status(409).send(e);
  }
}

const add = async (req, res) => {
  const name = req.query.name;
  const amount = req.query.amount;
  if (!name || !amount) {
    return res.status(400).send('Missing params. Required "name" and "amount"');
  }
  try {
    await driver.add(name, amount);
    return res.json({
      item: name,
      amount,
      added: 'OK'
    });
  } catch (e) {
    logger.error('Error adding item', e);
    return res.status(409).send(e);
  }
}

const showCart = async (req, res) => {
  try {
    const result = await driver.showCart();
    return res.json(result);
  } catch (e) {
    logger.error('Error showing cart', e);
    return res.status(409).send(e);
  }
}

const logout = async (req, res) => {
  driver.shutdown();
  return res.json({
    logout: 'OK'
  });
}

const init = (a, d) => {
  app = a;
  driver = d;

  app.get('/login', login);
  app.get('/search', search);
  app.get('/add', add);
  app.get('/cart', showCart);
  app.get('/logout', logout);
}

module.exports = {init};
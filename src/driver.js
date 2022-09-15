const { Browser, Builder, By, Key, until } = require("selenium-webdriver");
const b64 = require("crypto-js/enc-base64");
const CryptoJS = require("crypto-js");
const { Options } = require("selenium-webdriver/firefox");
const logger = require("./logging");

let user, pass;
let driver;

const init = async () => {
  const credentials = process.env.SHOP_CREDENTIALS;
  if (!credentials) {
    logger.error("Credentials not set");
    return false;
  }
  const decoded = b64.parse(credentials).toString(CryptoJS.enc.Utf8);
  const separator = ":";
  if (!decoded.includes(separator)) {
    logger.error("Invalid credentials format");
    return false;
  }
  [username, password] = decoded.split(separator);
  user = username;
  pass = password;

  const options = new Options();
  options.setPreference(
    "general.useragent.override",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
  );
  driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .build();

  return true;
};

const shutdown = () => {
  driver.quit();
};

const login = async () => {
  await driver.get("https://www.hiperdino.es");
  await driver.findElement(By.id("btn-cookie-allow--all")).click();
  await driver.findElement(By.className("icon-user")).click();
  await driver.findElement(By.name("login[username]")).sendKeys(user);
  await driver
    .findElement(By.name("login[password]"))
    .sendKeys(pass, Key.RETURN);
  await driver.sleep(5000);
};

const find = async (text) => {
  await driver.findElement(By.id("search-input")).sendKeys(text, Key.RETURN);
  await driver.sleep(5000);
  const items = await driver.findElements(By.className("product-list-item"));
  const result = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const img = await item
      .findElement(By.className("image--wrapper"))
      .getAttribute("src");
    const name = await item
      .findElement(By.className("description__text name"))
      .getText();
    const price = await item.findElement(By.className("price__text")).getText();

    result.push({ img, name, price });
  }

  return result;
};

const add = async (title, amount) => {
  await driver.findElement(By.id("search-input")).sendKeys(title, Key.RETURN);
  await driver.sleep(5000);
  await driver.findElement(By.id("deny-newsletter-form")).click();
  await driver.sleep(500);
  const [item] = await driver.findElements(By.className("product-list-item"));
  await item.findElement(By.className("product__add2cart")).click();
  const amtBox = await item.findElement(
    By.className("hdcheckout-list-qty-box")
  );
  await driver.wait(until.elementIsVisible(amtBox), 5000);
  await amtBox.sendKeys(Key.BACK_SPACE);
  await driver.sleep(500);
  await amtBox.sendKeys(amount);
  await driver.sleep(500);
};

const showCart = async () => {
  await driver.findElement(By.id("show-cart")).click();
  await driver.sleep(2000);
  const itemsList = await driver.findElements(
    By.className("cart-item__content")
  );
  const itemsResult = [];

  for (let i = 0; i < itemsList.length; i++) {
    const item = itemsList[i];
    const img = await item
      .findElement(By.className("image--wrapper"))
      .getAttribute("src");
    const name = await item
      .findElement(By.className("cart__description"))
      .getText();

    itemsResult.push({ img, name });
  }

  const total = await driver
    .findElement(By.id("cart-subtotal-with-discount"))
    .getText();

  return {
    total,
    items: itemsResult,
  };
};

module.exports = { init, shutdown, login, find, add, showCart };

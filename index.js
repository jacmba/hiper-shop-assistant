const { Browser, Builder, By, Key, until } = require("selenium-webdriver");
const b64 = require("crypto-js/enc-base64");
const CryptoJS = require("crypto-js");

const credentials = process.env.SHOP_CREDENTIALS;
if(!credentials) {
  console.error('Credentials not set');
  return;
}
const decoded = b64.parse(credentials).toString(CryptoJS.enc.Utf8);
const separator = ':';
if(!decoded.includes(separator)) {
  console.error('Invalid credentials format');
  return;
}
[username, password] = decoded.split(separator);

(async () => {
  const driver = await new Builder().forBrowser("firefox").build();

  try {
    await driver.get("https://www.hipercor.es/supermercado/");
    await driver.findElement(By.id('cookies-agree-all')).click();
    await driver.sleep(1000);
    await driver.findElement(By.className('ts-login-desktop')).click();
    await driver.sleep(1000);
    await driver.findElement(By.id('login')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.id('cookies-agree-all')).click();
    await driver.sleep(2000);
    await driver.findElement(By.id('login-btn')).click();
    await driver.sleep(10000);
  } finally {
    driver.quit();
  }
})();

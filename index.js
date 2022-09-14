const { Browser, Builder, By, Key, until } = require("selenium-webdriver");
const b64 = require("crypto-js/enc-base64");
const CryptoJS = require("crypto-js");
const { Options } = require("selenium-webdriver/firefox");

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
  const options = new Options();
  options.setPreference("general.useragent.override", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36");
  const driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .build();

  try {
    await driver.get('https://www.hiperdino.es');
    await driver.findElement(By.id('btn-cookie-allow--all')).click();
    await driver.findElement(By.className('icon-user')).click();
    await driver.findElement(By.name('login[username]')).sendKeys(username);
    await driver.findElement(By.name('login[password]')).sendKeys(password, Key.RETURN);
    await driver.sleep(5000);
  } finally {
    driver.quit();
  }
})();

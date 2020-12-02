const puppeteer = require("puppeteer");
const fs = require("fs");
const cookies = require("./cookies.json");
const C = require("./constanst");
const USERNAME_SELECTOR = "div._1HkukX div ._56AraZ";
const PASSWORD_SELECTOR = "div._3Uo2e7 div ._56AraZ";
const CTA_SELECTOR = "div._1B7mke button._35rr5y";

async function startBrowser() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  return { browser, page };
}

async function closeBrowser(browser) {
  return browser.close();
}

async function playTest(url) {
  const { browser, page } = await startBrowser();
  page.setViewport({ width: 1366, height: 768 });
  if (!Object.keys(cookies).length) {
    await page.goto(url);
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(C.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(C.password);
    setTimeout(async () => {
      await page.click(CTA_SELECTOR);
    }, 1000);
    await page.waitForNavigation();
    let currentCookies = await page.cookies();
    fs.writeFileSync("./cookies.json", JSON.stringify(currentCookies));
  } else {
    await page.setCookie(...cookies);
    await page.goto(
      "https://shopee.co.id/checkout/?state=H8KLCAAAAAAAAAPDlVTDi8Kuw6MgDMO9F8OWWcOQV8Kaw6ZXwq4qRMOAbcORJcOAw7DCqBpdw7XDn8OHwpDCkHbCrnTCpcOZw4xiVgHDm8OHPj52w7giUcKNECIfHcOpNy1twrvDk8K%2Bw50eGhJuw5ZZL8OBB8OSf3zClSvDqcOnwq%2FCkhjCusOpw5rCjnbCh2dDVMKEcQ7DisKnw6I8w67DtsOdwqnCpcObXUNGK0Fnw6Nuw5PCtsOtacOXbsO2w5vChnApwpk1TALDl8KsIA7Du8Ojwp4eMVlgwosvwqTCgcOlwoTCpMK%2FcB1gwq7Dg8Kuw54mVyBkw4HCkMKGw7xKw5xEFSfDjMOzPDdEw5vCqwpRwonCkAl7EHYcw4FIwpBMw5zCuDHCmQ16TMOSGsOJD2kCwp9LegjCgUkeeQZFw77CqDYswoQVw4B7w6sZw4oUw5NiwqnCkDg5ID1dDcKZw5rCqcOdHWhHMX0ADSJiw6nDisOpw4XCgcO0HcKlXcKXwpVWw44pc8KdwoV4w4M4DxcswozCpyzDoR3DvMOEw7LCsMKYdVHCoUA5wpzDvkV4w5A2wpbDoMOSw7LDuR3DgSdUJlZOa8O7wogNWMKhwrDDuRZTeMKfKMONw405b0dbwqhUYArDgMKEVSbCrEPCu3hABsK1w4PCu03DosKGeitzwrE5w74Hw6%2FDnMKYVMKBDxppesOgIcKzw4nDvH%2FDiihww43DsmAyLcONw6PDhcO6wrHDusOybsKew6fChcO%2BZsOCwqPDuGTDrw7ChsKtem4Ewrw6w6ApWsOGwp3Dk8OTH8KRwosfw6tJwrgrAWtPw7Uqw6c9WcKuFyQLw555ZcOibMKPw5ZcZTJsw5BcfA7DtjFbw6d1wqzCmi8pwp9YRHAfX8K7JsK0KsO%2BWcKowrzCrcK1ejnDi0UJw6nCrXttw5cSw6Fuw5YAM2kcchNlwrlNw5F5w63DmMOwwrFqwrnCosOfwp%2FCgsOJCMOSR8Kfw6DDv8O%2Fw5XDqiPCh8OqSHjDpMKpf8OQc8Klwoopw55lw7rDp8O%2Fw6XDjCQ5wpQGXsKzw78NCHDCggLCogUAAA%3D%3D",
      { waitUntil: "networkidle2", timeout: 0 }
    );
    var status = false;
    var harga = 15000;
    var time = null;

    // setTimeout(() => {
    //   harga = 100000;
    // }, 2000);
    status && clearInterval(time);
    time = setInterval(async () => {
      await page.setDefaultNavigationTimeout(0);
      let data = await page.evaluate(() =>
        document
          .querySelector(
            ".checkout-product-ordered-list-item__header--subtotal"
          )
          .innerText.trim()
      );
      let title = await page.evaluate(() =>
        document
          .querySelector(
            ".checkout-product-ordered-list-item__header .checkout-product-ordered-list-item__product-info"
          )
          .innerText.trim()
      );

      // let judul =

      if (number(data) > 0 && number(data) < harga) {
        try {
          status = true;
          await console.log("loading...");
          await console.log("pembelian sedang di proses");
          // klik cekout
          await console.log("pembelian berhasil", title);
          await page.click("div.OR36Xx div button.stardust-button");
        } catch (error) {
          // console.log()
        }
        // process.exit(1);
      } else {
        status = false;
        await console.log(`pembelian ${title} gagal`);
        await console.log("harga", number(data));
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      }
    }, 1500);

    status && clearInterval(time);
  }

  //   await page.screenshot({ path: "linkedin.png" });
}

(async () => {
  await playTest("https://shopee.co.id/buyer/login");

  //   process.exit(1);
})();

const number = (text) => {
  let number = text.split("Rp")[1];
  return number.split(".").join("");
};

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
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
      "https://shopee.co.id/checkout/?state=H8KLCAAAAAAAAAPDlVTDi8KOw6MgEMO8F8OOOTjDjjrDscO4V0YRw4LDkE7DkGBgeETCsUbDucO3bcOAOMKZwpVGe8Oaw4PCngzDvcKqw6rDqsOGXyTDiBl8YMKzJcODw77DmMKcDsO7Y8OfdTvDosKvw4YaJ8OAeTLCvH%2FDpSsZw4pXCjLDvGrCmsK2w63DtsKPHcKRAcOmEsKTTsOJw5d2fcOTwr3DtcKnw4NpR2YjQGVjw5t0w73CoW9zcSYENcKaCmDCiiZnwoNlPF3CrT7CjjTClSLDg8OEwpTCh8KCQC%2FDjkRbwoM%2FI8OTQcKGBSk%2Fw447wqLDjEXDuiDCuU8MHXAzw4%2FCoAUIw4rCr0zDq8KEwo8eHcKVQsK6Y1zDgCUoB8OeU8OBAktJwoHDncKrwo0MwoTDrAg4ZxxFXUJcLTUlLBYywonDlcKQKMK9HQ9dw5M3WMOewoMCHhDCunJ6ciBDw580fcKfwqTClcOWSn3DicOdw6xfcsKswoMJwoHDscKURMK7woFbaMKaDjU2SBRmbcO%2Bwq%2FDoV7CmcKQwoNzw4vDp8OXDMK2wqAywqFyw5rDmsKvw7fClWTDlzbCiMKzGcKTw7zClcKCwp5MSsO4diXDvVtOw5kTFABpeHTDocOAw7Fiwp3CmU3CjsKsSMORA8OlRmrCv013csKAwpTCqyQ3E8O5FQdUwoF%2Bw7AWJcKEw7RsVMOYwpcDw6YTZmrDuMKnwoocNzFNMsORUixMw4bDjcOVwpfDlsO3XFbDvg8THsO5B311UMOUw48xw43DocOZAcKLw4FQZsKtWsK%2BRcKufsOEE3DCkxzCtsKew6pVwpTDhVrCrxPCkgVnwp3DlMKhw5jCg8ORFxE1HRXDox%2FCo8K5F2vDmcOfOsOIwrXDpANBOHPDocK5wpxcw4nDrC9CwqXDtcKuw6jDuSxWJcKEM8O2wrnCjmvChMK9Gg1Uw4d5TE3DpMOXwqDCs8OOW8OHwprDjVXDiy3Du8O1Z8KxaE7ChsOgIsO8w79vwrPDvgZRHQHDtzTDtcO3w6ZcwqliwokqU1nCvX%2FDvsKUC8KXaFEceE7DvzfCtMOMw5VLw4YFAAA%3D",
      { waitUntil: "networkidle2", timeout: 0 }
    );
    var status = true;
    var harga = 1000;
    var time = null;

    // setTimeout(() => {
    //   harga = 100000;
    // }, 2000);
    while (status) {
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
      let start = new Date().getTime();
      let end = new Date("04-12-2020 23:59:59").getTime();
      console.log(start, end);
      if (number(data) > 0 && number(data) < harga) {
        try {
          status = false;
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
        status = true;
        await console.log(`pembelian ${title} gagal`);
        await console.log("harga", number(data));
        await console.log("target", harga);
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      }
    }
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

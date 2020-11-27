const puppeteer = require("puppeteer");
const fs = require("fs");
const cookies = require("./cookies.json");
const C = require("./constanst");
const USERNAME_SELECTOR = "div._1HkukX div ._56AraZ";
const PASSWORD_SELECTOR = "div._3Uo2e7 div ._56AraZ";
const CTA_SELECTOR = "div._1B7mke button._35rr5y";

async function startBrowser() {
  const browser = await puppeteer.launch({ headless: true });
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
    fs.writeFileSync("./cookies.json", JSON.stringify(currentCookies, null));
  } else {
    await page.setCookie(...cookies);
    await page.goto(
      "https://shopee.co.id/checkout/?state=H8KLCAAAAAAAAAPCtVTDi8KOGyEQw7zClRFna8KFd8O9GMOPD8OkFMOlwpbDi8OKQhh6bGQGCA%2FDi8KjwpXDvz0Nw7PCsMKzw4lGOWxOw4Z0NVVdw509byTCqg5Cw6TCnSPDjXJDN8KrbcK9XcKtFiTCnMKswrNewoIPwqR5fSt%2FSTPDvCpJwpo1w53DksKaPsOvbgvCoiJ0AyjCn3LCsMKmwpt6R8Kfw5fDtcKCdFbCgsOOdxvDusKyw5otd3RFw7FxLiXCs8KGScOgwprDpcOgcsO9woJwDMKow4DDhlhIB8KWw58jTcOLdcKAwoHChh3CvU3CrsKkwpAxwocsw4jCj8OETVTCscOHd27DuwXDkcO2wqhCVCJkwr0ewoTDrTowEiQTJ25MVsKDEcKTwrRGw63Ch8OUwoPDj8KUHkJgwpJHwp7Ck8OAe8OrGcKaEsOTCC3Ckgsmw7YOSEPDp8KLYsOGZlPDl8ObOsKbEUDCg8KISDbCqcK4wrNmX2hdZ2vClXPDihzCh8OSH3LCnMKHFsK5w7HClE3Cu8KAw69Zw64OwrMuKsK0JMODw6k%2Fw4DCg8K2wrHCgEvCkcO7w4cMw57Coxdxw5I0F8KMwrkBGcKKwpp3wpjContHKcOFw6LCnMK3wp0tUsKmw4QUwoAJwqtMwpjDm8OUekAFU8KFF8Kbw4QJHVbCpsK1GcO%2FQXQoTMKqw4APGmV6w6Ahwqshw58HQMO1w4XDs8KoQsO1w40cw4%2FDildRSX7CrgI%2FPVVfw63DicKaw4opwq1Ow5XDpcKPYMONwpV5Ih%2FDqRI4wp7DiENyccKaw4fDlsO6bsKKw6XCkcOeD3vDsMOuCsKPw6LDjB4DDA3Ds8OcCMK4w7vDgFPCtMKMO8Knw7tfwpBjHMO5JFzClMKAw5nCmcOpbx5tMkdbFAvDnnllw6JwH8KtOcOKZMOYQXNxPsOYw6twO8KMw7HDlMK5w7HDiRvCkgjDrsOjfWTChVYlPsOYHcO5dWYvZzk6IcK9dcO3GR0RDsKNBmZSd8OIRWRSMMKlW3PDhcKGd8KTwpdzw7bDoxfCpDfCgjTDkSfDuMKMFcO9bR3Dv8KywrPCn8KxwqLDk8OXEMO9wpBww419fsKlw7tJHD7DsWjDjH%2FDn8OnQUlyaAbDnMK7w70TwrJUecKgw4sFAAA%3D",
      { waitUntil: "networkidle2", timeout: 0 }
    );

    setInterval(async () => {
      await page.setDefaultNavigationTimeout(0);
      let data = await page.evaluate(() =>
        document
          .querySelector(
            ".checkout-product-ordered-list-item__header--subtotal"
          )
          .innerText.trim()
      );
      if (number(data) > 16000) {
        await console.log("dapat");
        clearInterval();
        // klik cekout

        process.exit(1);
      } else {
        await console.log("gagal, harga", number(data));
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      }
    }, 1500);
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

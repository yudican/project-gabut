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
      "https://shopee.co.id/checkout/?state=H8KLCAAAAAAAAAPCtVTDi8KOw5swDMO8FUPDp2DCoTwRw6cHeip6w6tlEQjCikTDh0JkScOVI8KIwrHDiMK%2FwpfCkh9JwrfDncO2wrI9WSbCh8Kew6HCkMOyG8KJwqrCgxB5w6fDiGHCucKjwrtNwr1dw5HDlcKCwoTDljrDqyXDuEAOwq9vw6XClRzChsKnwpIIw51uw6tNwr1ew5PDu8KCwqgIw53CgMOKwqfCnF3CrcOXw4vDvXrCt8KjdEE6K0HDp8OgwobDrsK2wpRuanwsCMKXwpJZw4MkcMONchLCgSrCsDEaw5LCicOlT8KRQ8ODdcKAwoHCgcKdwr1NbgLDv0jDnEQVe1RyPy7CiMK2ZxXCohIha8O0IGzDl8KBwpEgwplowrkxwpkfMyZpwo1yT8KpB8Kfwqk8woTDgCTCjzwXwoHDt8OWMzQiwqYRWkQWTMOsHRTDljHCkDXDlMK7w7XClsOuc8O7ATTCiMKIXMKTwogHKTnDrMO3wpQuwrPCm8OKOWXDjkXDvsOywqnDhnlowpAaT8OZwqUrw7jCnsOlwoEww6vCokInw4Zuw78JD8Oaw4YCLj0ewp8reMKPVsOEScOTw5wvw5YGZChqw55hworDrsKaw5LDnMKcw7PCtsKzRcOKVMKYAjBhwpUJw7N0Gg%2FCqGDDqsOwasKTaMORYGUawpvDsR9kwofDhsKkCsO8wqRRwqYHHsKyGsOyfQBUXzzCjypUw5%2FDjMO5wqJ8FcKVw6TClyrDsMO2wqXDumpbayrCp8K0asKrw6sfw4HCmivDs0I%2Bw5IlcB%2FCkcKHw6TDpjTCj8KNw7XDncKUw4tLfBxWw79dCMKPw6LDgsKeEwwNw7PDnAh4w7jDgFPCtMKMO8Knw7tfwpBjHsO5JFzClcKAw5nCmcOpVWY5c8K2QcKxw6DCnVcmDsOxaMONWSbDg07CmsKLw4vDicOewobDqMKww4XDk8Okw4ZPw57CkURwHx8bK8K0KsO5w4HDrsOIbzN7OcOLw5EJw6nCrXvDrMOowohwaDQwwpPCulNuIsKTwoIpw5PCmjs2wrzCm8K8wpzCq8KffxrCvRHDpBB9woLDj8K4wqHCv8Odw4bCv1zDmU%2FCuMKhw5PDvw%2FDrcKQcMOLY37CpcOHSRt%2Bw6LDmcKXw79%2Bwp0HJcOJwqEXw7AYw7ZPHcOBbiPCvQUAAA%3D%3D",
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
      if (number(data) < 100000) {
        await console.log("dapat");
        clearInterval();
        // klik cekout
        await page.click("div.OR36Xx div button.stardust-button");
        clearInterval();
        // process.exit(1);
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

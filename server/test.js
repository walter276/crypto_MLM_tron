const puppeteer = require("puppeteer-core");

import GoLogin from "../node_modules/gologin/src/gologin.js";

const { connect } = puppeteer;

(async () => {
  const GL = new GoLogin({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGRmM2M2YWQ0ODE4NTQzZDI3NDA5YzciLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NGUyZDUyNTI0MTc0ZDYxMzI0MmU5NWYifQ.l1Drs7hPbFKsd2bJSil9J3AhsTQo96OkIpnjwg-9ebg",
    profile_id: "yU0Pr0f1leiD",
  });

  const { status, wsUrl } = await GL.start().catch((e) => {
    console.trace(e);

    return { status: "failure" };
  });

  if (status !== "success") {
    console.log("Invalid status");

    return;
  }

  const browser = await connect({
    browserWSEndpoint: wsUrl.toString(),
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.goto("https://myip.link/mini");
  console.log(await page.content());
  await browser.close();
  await GL.stop();
})();

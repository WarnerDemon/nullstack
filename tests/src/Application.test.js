const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
});

test('the application is running', async () => {
  const response = await page.goto('http://localhost:6969');
  const status = response.status();
  expect(status).toBe(200);
});

test('the static start function runs on startup', async () => {
  const h1 = await page.$('h1');
  const text = await page.evaluate(element => element.innerText, h1);
  expect(text).toMatch('Nullstack Tests');
});

afterAll(async () => {
  browser.close();
});
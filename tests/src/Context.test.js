const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:5000/context');
});

describe('Context', () => {

  test('setting a key to the server context makes it permanent', async () => {
    await page.waitForSelector('[data-framework="Nullstack"]');
    const element = await page.$('[data-framework="Nullstack"]');
    expect(element).toBeTruthy();
  });

  test('keys of the server context are available to all server functions', async () => {
    await page.waitForSelector('[data-framework="Nullstack"]');
    const element = await page.$('[data-framework="Nullstack"]');
    expect(element).toBeTruthy();
  });

  test('setting a key to the client context makes it permanent', async () => {
    await page.waitForSelector('[data-framework="Nullstack"]');
    const element = await page.$('[data-framework="Nullstack"]');
    expect(element).toBeTruthy();
  });

  test('keys of the client context are available to all client functions', async () => {
    await page.waitForSelector('[data-framework="Nullstack"]');
    const element = await page.$('[data-framework="Nullstack"]');
    expect(element).toBeTruthy();
  });

  test('the client context is merged into all instance methods', async () => {
    await page.waitForSelector('[data-framework-initial="N"]');
    const element = await page.$('[data-framework-initial="N"]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
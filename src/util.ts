import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";

export const getArgUrl = (arg: string): string => {
  let argPair = arg.split("=");
  switch (argPair.length) {
    case 1:
      throw "Please input url to run the script eg `node.js main.ts --url=https://example.com`";
    case 2:
      return argPair[1];
    default:
      throw "Please use the format --url=https://example.com";
  }
};

export const getArgWords = (arg: string): string[] => {
  let argPair = arg.split("=");

  switch (argPair.length) {
    case 1:
      throw "Please input words to run the script eg `node.js main.ts --words=Fruit,Mango,Apple`";
    case 2:
      let value = argPair[1];
      if (value.length === 0)
        throw "Please input words to run the script eg `node.js main.ts --words=Fruit,Mango,Apple`";

      return value.split(",");
    default:
      throw "Please use the format --words=Fruit,Mango,Apple";
  }
};

// Scrolls the page all the way to bottom in batches (100 ms)
const autoScroll = async (page: Page): Promise<void> => {
  await page.evaluate(async () => {
    await new Promise((resolve: (val?: any) => void, _) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

export const getPageContent = async (url: string): Promise<string> => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  await autoScroll(page);

  // Get all text content, from page
  const content = await page.evaluate(
    () => document.querySelector("body").innerText
  );

  await browser.close();

  return content;
};

export const countWords = (
  source: string,
  words: string[]
): Map<string, number> => {
  const countMap: Map<string, number> = new Map<string, number>();

  words.forEach((word) => countMap.set(word, 0));

  source.split(/\s+/).forEach((sourceWord) => {
    words.forEach((word) => {
      if (sourceWord.toLowerCase() === word) {
        let count = countMap.get(word);
        countMap.set(word, count + 1);
      }
    });
  });

  return countMap;
};

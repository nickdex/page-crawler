"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countWords = exports.getPageContent = exports.getArgWords = exports.getArgUrl = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const getArgUrl = (arg) => {
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
exports.getArgUrl = getArgUrl;
const getArgWords = (arg) => {
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
exports.getArgWords = getArgWords;
// Scrolls the page all the way to bottom in batches (100 ms)
const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve, _) => {
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
const getPageContent = async (url) => {
    const browser = await puppeteer_1.default.launch({
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
    const content = await page.evaluate(() => document.querySelector("body").innerText);
    await browser.close();
    return content;
};
exports.getPageContent = getPageContent;
const countWords = (source, words) => {
    const countMap = new Map();
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
exports.countWords = countWords;

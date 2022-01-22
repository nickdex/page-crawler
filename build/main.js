"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
// To respect the time constraints, I marked and left some obvious stuff as todo
//#region Handle Arguments
const args = process.argv.slice(2);
let url, words;
args.forEach((arg) => {
    if (arg.startsWith("--url")) {
        url = (0, util_1.getArgUrl)(arg);
        //todo: check if it is valid url
    }
    if (arg.startsWith("--words")) {
        words = (0, util_1.getArgWords)(arg).map((word) => word.toLowerCase()); // Case Insensitive Matching
    }
});
//#endregion
//#region Crawl Webpage
(0, util_1.getPageContent)(url)
    .then((content) => (0, util_1.countWords)(content, words))
    .then((countMap) => {
    for (let [key, value] of countMap) {
        console.log(key + ": " + value);
    }
})
    .catch(console.error);

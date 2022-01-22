import { countWords, getArgUrl, getArgWords, getPageContent } from "./util";

// To respect the time constraints, I marked and left some obvious stuff as todo

//#region Handle Arguments
const args = process.argv.slice(2);

let url: string, words: string[];

args.forEach((arg) => {
  if (arg.startsWith("--url")) {
    url = getArgUrl(arg);
    //todo: check if it is valid url
  }
  if (arg.startsWith("--words")) {
    words = getArgWords(arg).map((word) => word.toLowerCase()); // Case Insensitive Matching
  }
});
//#endregion

//#region Crawl Webpage
getPageContent(url)
  .then((content) => countWords(content, words))
  .then((countMap) => {
    for (let [key, value] of countMap) {
      console.log(key + ": " + value);
    }
  })
  .catch(console.error);

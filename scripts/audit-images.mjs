import fs from "fs";

const content = fs.readFileSync("./lib/catalog-data.ts", "utf8");
const urlMatches = content.match(/https:\/\/images\.unsplash\.com\/[^\s\"\'\`,]+/g);
const uniqueUrls = [...new Set(urlMatches)];
console.log(`Found ${uniqueUrls.length} unique Unsplash URLs in lib/catalog-data.ts`);

async function testUrls() {
  let allPassed = true;
  for (const url of uniqueUrls) {
    try {
      const res = await fetch(url);
      const contentType = res.headers.get("content-type");
      const contentLength = res.headers.get("content-length");
      if (res.status === 200 && contentType?.startsWith("image/")) {
        console.log(`[PASS 200] Size: ${contentLength}b - ${url}`);
      } else {
        console.error(`[FAIL ${res.status}] Type: ${contentType} - ${url}`);
        allPassed = false;
      }
    } catch (e) {
      console.error(`[ERROR] ${url}: ${e.message}`);
      allPassed = false;
    }
  }
  console.log(`\nOverall URL Health: ${allPassed ? "ALL 200 OK" : "SOME FAILED"}`);
}

testUrls();

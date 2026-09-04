async function searchYahoo(q) {
  const res = await fetch(`https://search.yahoo.com/search?p=${encodeURIComponent(q)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
  });
  const html = await res.text();
  const photos = [...new Set(html.match(/unsplash\.com\/photos\/[a-zA-Z0-9_\-]+/g) || [])];
  console.log("Yahoo photos:", photos);
}
searchYahoo("black hoodie mockup site:unsplash.com");

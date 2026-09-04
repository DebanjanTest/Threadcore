async function searchBing(q) {
  const res = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(q)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
  });
  const html = await res.text();
  const matches = [...new Set(html.match(/https:\/\/[a-zA-Z0-9_\-\.\/]*unsplash\.com[a-zA-Z0-9_\-\.\/]*/gi) || [])];
  console.log("Bing Unsplash matches:", matches);
}
searchBing("black hoodie mockup unsplash");

async function searchBingImages(q) {
  const res = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(q)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
  });
  const html = await res.text();
  const matches = [...new Set(html.match(/https?:\/\/(images\.)?unsplash\.com\/photo-[a-zA-Z0-9_\-]+/gi) || [])];
  console.log("Bing Images Unsplash count:", matches.length);
  matches.slice(0, 10).forEach(u => console.log(" ", u));
}
searchBingImages("black hoodie blank unsplash");

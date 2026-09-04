async function searchDDG(q) {
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
  });
  const html = await res.text();
  const photos = [...new Set(html.match(/unsplash\.com\/photos\/[a-zA-Z0-9_\-]+/g) || [])];
  console.log("Photos:", photos);
}
searchDDG("site:unsplash.com/photos black tshirt blank mockup");

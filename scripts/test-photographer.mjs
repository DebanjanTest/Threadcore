async function searchDDG(q) {
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
  });
  const html = await res.text();
  const urls = [...new Set(html.match(/uddg=([^&]+)/g) || [])].map(u => decodeURIComponent(u.replace("uddg=", "")));
  const photos = urls.filter(u => u.includes("unsplash.com/photos/"));
  console.log("Photos:", photos);
}
searchDDG("black t-shirt mockup site:unsplash.com/photos");

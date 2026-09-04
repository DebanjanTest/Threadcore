async function searchGoogle(q) {
  const res = await fetch(`https://www.google.com/search?q=${encodeURIComponent(q)}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  const html = await res.text();
  const urls = [...new Set(html.match(/\/url\?q=([^&]+)/g) || [])].map(u => decodeURIComponent(u.replace("/url?q=", "")));
  console.log("URLs:", urls.filter(u => u.includes("unsplash.com")));
}
searchGoogle("black hoodie mockup site:unsplash.com");

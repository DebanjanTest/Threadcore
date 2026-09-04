async function searchDDG(q) {
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const html = await res.text();
  const uddg = [...new Set(html.match(/uddg=([^&]+)/g) || [])].map(u => decodeURIComponent(u.replace("uddg=", "")));
  return uddg;
}
async function run() {
  const links = await searchDDG("clothing mockup photo unsplash.com");
  console.log("Links:", links.filter(l => l.includes("unsplash.com")).slice(0, 10));
}
run();

async function searchDDGImages(q) {
  const tokenRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&iax=images&ia=images`);
  const tokenHtml = await tokenRes.text();
  const vqdMatch = tokenHtml.match(/vqd=([0-9\-]+)/) || tokenHtml.match(/vqd=\"([0-9\-]+)\"/);
  if (!vqdMatch) return [];
  const vqd = vqdMatch[1];
  const imgRes = await fetch(`https://duckduckgo.com/i.js?q=${encodeURIComponent(q)}&o=json&vqd=${vqd}`, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const data = await imgRes.json();
  return data.results || [];
}
async function test() {
  const res = await searchDDGImages("5gYpgixB9PE");
  console.log(res.map(r => r.image));
}
test();

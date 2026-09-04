async function searchDDGImages(q) {
  const tokenRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&iax=images&ia=images`);
  const tokenHtml = await tokenRes.text();
  const vqdMatch = tokenHtml.match(/vqd=([0-9\-]+)/) || tokenHtml.match(/vqd=\"([0-9\-]+)\"/);
  if (!vqdMatch) {
    console.log("No vqd found");
    return [];
  }
  const vqd = vqdMatch[1];
  const imgRes = await fetch(`https://duckduckgo.com/i.js?q=${encodeURIComponent(q)}&o=json&vqd=${vqd}`, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const data = await imgRes.json();
  const unsplash = (data.results || []).filter(r => r.image.includes("unsplash.com"));
  console.log(`Found ${unsplash.length} Unsplash images for "${q}":`);
  unsplash.slice(0, 10).forEach(r => console.log(r.title, "->", r.image));
  return unsplash;
}
searchDDGImages("black t shirt mockup unsplash");

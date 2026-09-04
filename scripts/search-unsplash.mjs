async function searchUnsplash(query) {
  try {
    const res = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=10`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (!res.ok) {
      console.log(`Query "${query}" failed:`, res.status);
      return [];
    }
    const data = await res.json();
    return (data.results || []).map(r => ({
      id: r.id,
      description: r.description || r.alt_description,
      url: r.urls.raw,
      width: r.width,
      height: r.height
    }));
  } catch (e) {
    console.log("Error:", e.message);
    return [];
  }
}

async function run() {
  const queries = [
    "black t-shirt mockup blank",
    "white t-shirt mockup blank",
    "black hoodie mockup blank",
    "white hoodie mockup blank",
    "black athletic jersey blank",
    "black cotton fabric texture macro"
  ];
  for (const q of queries) {
    const res = await searchUnsplash(q);
    console.log(`=== Query: ${q} (found ${res.length}) ===`);
    res.slice(0, 3).forEach(r => console.log(` - ID: ${r.id} | Desc: ${r.description}`));
  }
}
run();

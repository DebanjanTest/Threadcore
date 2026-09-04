async function fetchCollection() {
  const res = await fetch("https://unsplash.com/collections/IINJekWDeF8/mockup", {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
  });
  const html = await res.text();
  const photos = [...new Set(html.match(/photo-[a-zA-Z0-9_\-]+/g) || [])];
  console.log("Found photos in collection:", photos);
}
fetchCollection();

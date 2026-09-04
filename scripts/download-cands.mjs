import fs from "fs";

const urls = [
  { name: "cand_hoodie_1722363497275.jpg", url: "https://images.unsplash.com/photo-1722363497275-9e28fa9752b8?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_hoodie_1554178558.jpg", url: "https://images.unsplash.com/photo-1554178558-3183e57c6655?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_hoodie_1534265618661.jpg", url: "https://images.unsplash.com/photo-1534265618661-adfe32dfe515?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_hoodie_1618066782082.jpg", url: "https://images.unsplash.com/photo-1618066782082-b1ed08561aa1?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_tee_1562135291.jpg", url: "https://images.unsplash.com/photo-1562135291-7728cc647783?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_macro_1737044266225.jpg", url: "https://images.unsplash.com/photo-1737044266225-6954d4dcb966?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_macro_1675784332655.jpg", url: "https://images.unsplash.com/photo-1675784332655-675d1a1ddcf6?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_jersey_1580691129325.jpg", url: "https://images.unsplash.com/photo-1580691129325-3140c6b86712?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_jersey_1619735497547.jpg", url: "https://images.unsplash.com/photo-1619735497547-fafaf52c8b01?auto=format&fit=crop&w=400&q=80" }
];

for (const u of urls) {
  const res = await fetch(u.url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(`./scripts/audit_images/${u.name}`, buf);
  console.log(`Saved ${u.name} (${buf.length}b)`);
}

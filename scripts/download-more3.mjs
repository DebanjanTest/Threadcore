import fs from "fs";

const list = [
  { name: "hoodie_studio_1739001409.jpg", url: "https://images.unsplash.com/photo-1739001409719-a166b2928e4b?auto=format&fit=crop&w=400&q=80" },
  { name: "hoodie_studio_1739001410.jpg", url: "https://images.unsplash.com/photo-1739001410169-9deead6f3330?auto=format&fit=crop&w=400&q=80" },
  { name: "hoodie_studio_1634853166.jpg", url: "https://images.unsplash.com/photo-1634853166008-2c9e90321c92?auto=format&fit=crop&w=400&q=80" },
  { name: "jersey_1580969661165.jpg", url: "https://images.unsplash.com/photo-1580969661165-8c2b5d9721b5?auto=format&fit=crop&w=400&q=80" },
  { name: "jersey_1618212765496.jpg", url: "https://images.unsplash.com/photo-1618212765496-d572be8cbfc5?auto=format&fit=crop&w=400&q=80" }
];

for (const item of list) {
  const res = await fetch(item.url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(`./scripts/audit_images/${item.name}`, buf);
  console.log(`Saved ${item.name} (${buf.length}b)`);
}

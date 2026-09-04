import fs from "fs";

const list = [
  { name: "white_hoodie_1620799140.jpg", url: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=400&q=80" },
  { name: "black_hoodie_1579572331.jpg", url: "https://images.unsplash.com/photo-1579572331145-5e53b299c64e?auto=format&fit=crop&w=400&q=80" },
  { name: "black_hoodie_1596075780.jpg", url: "https://images.unsplash.com/photo-1596075780750-81249df16d19?auto=format&fit=crop&w=400&q=80" },
  { name: "black_hoodie_1648320397.jpg", url: "https://images.unsplash.com/photo-1648320397369-85ab3fa368bc?auto=format&fit=crop&w=400&q=80" },
  { name: "black_hoodie_1581726707.jpg", url: "https://images.unsplash.com/photo-1581726707445-75cbe4efc586?auto=format&fit=crop&w=400&q=80" }
];

for (const item of list) {
  const res = await fetch(item.url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(`./scripts/audit_images/${item.name}`, buf);
  console.log(`Saved ${item.name} (${buf.length}b)`);
}

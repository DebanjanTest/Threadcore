import fs from "fs";

const list = [
  { name: "cand_1618517351.jpg", url: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_1571455786.jpg", url: "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_1657364890.jpg", url: "https://images.unsplash.com/photo-1657364890995-1ec4bb3aefcf?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_1562135291.jpg", url: "https://images.unsplash.com/photo-1562135291-7728cc647783?auto=format&fit=crop&w=400&q=80" }
];

for (const item of list) {
  const res = await fetch(item.url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(`./scripts/audit_images/${item.name}`, buf);
  console.log(`Saved ${item.name} (${buf.length}b)`);
}

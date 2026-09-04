import fs from "fs";

const list = [
  { name: "cand_1556905055.jpg", url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_1509967419.jpg", url: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_1512436991.jpg", url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_1578587018.jpg", url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=400&q=80" },
  { name: "cand_1508214751.jpg", url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80" }
];

for (const item of list) {
  try {
    const res = await fetch(item.url);
    if (res.status === 200) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(`./scripts/audit_images/${item.name}`, buf);
      console.log(`Saved ${item.name} (${buf.length}b)`);
    } else {
      console.log(`Failed ${item.name}: ${res.status}`);
    }
  } catch (e) {
    console.log(`Error ${item.name}:`, e.message);
  }
}

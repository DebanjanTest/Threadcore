import fs from "fs";
import path from "path";

const dir = "./scripts/audit_images";

const moreImages = [
  { name: "tee_white_back.jpg", url: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=400&q=80" },
  { name: "tee_heather_front.jpg", url: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=400&q=80" },
  { name: "tee_offblack_front.jpg", url: "https://images.unsplash.com/photo-1618354691714-7d92150909db?auto=format&fit=crop&w=400&q=80" },
  { name: "hod_charcoal_front.jpg", url: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?auto=format&fit=crop&w=400&q=80" },
  { name: "hod_heather_front.jpg", url: "https://images.unsplash.com/photo-1632073143817-8cd5b2165e20?auto=format&fit=crop&w=400&q=80" }
];

for (const img of moreImages) {
  const dest = path.join(dir, img.name);
  const res = await fetch(img.url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`Saved ${img.name} (${buf.length} bytes)`);
}

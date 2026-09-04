import fs from "fs";
import path from "path";

const dir = "./scripts/audit_images";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const images = [
  // TC-TEE-001
  { name: "tee_front_black.jpg", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80" },
  { name: "tee_back.jpg", url: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=400&q=80" },
  { name: "tee_macro.jpg", url: "https://images.unsplash.com/photo-1594332495179-d979bcd18142?auto=format&fit=crop&w=400&q=80" },
  { name: "tee_model.jpg", url: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&q=80" },
  { name: "tee_front_white.jpg", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80" },

  // TC-HOD-001
  { name: "hod_front_black.jpg", url: "https://images.unsplash.com/photo-1555644459-c1fa07852459?auto=format&fit=crop&w=400&q=80" },
  { name: "hod_back.jpg", url: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=400&q=80" },
  { name: "hod_macro.jpg", url: "https://images.unsplash.com/photo-1643313262763-4056bfa99dd7?auto=format&fit=crop&w=400&q=80" },
  { name: "hod_model.jpg", url: "https://images.unsplash.com/photo-1576110621281-b1cd0e258162?auto=format&fit=crop&w=400&q=80" },
  { name: "hod_front_white.jpg", url: "https://images.unsplash.com/photo-1616030257764-0fe6a2f05138?auto=format&fit=crop&w=400&q=80" },

  // TC-JER-001
  { name: "jer_front_black.jpg", url: "https://images.unsplash.com/photo-1580089595767-98745d7025c5?auto=format&fit=crop&w=400&q=80" },
  { name: "jer_back.jpg", url: "https://images.unsplash.com/photo-1752166672544-c31d040b3b8f?auto=format&fit=crop&w=400&q=80" },
  { name: "jer_macro.jpg", url: "https://images.unsplash.com/photo-1637004732258-4b792ce8f474?auto=format&fit=crop&w=400&q=80" },
  { name: "jer_model.jpg", url: "https://images.unsplash.com/photo-1758745369561-e963bc5202fe?auto=format&fit=crop&w=400&q=80" },
  { name: "jer_front_white.jpg", url: "https://images.unsplash.com/photo-1551330299-3db95c0ca3d4?auto=format&fit=crop&w=400&q=80" },

  // Editorial
  { name: "ed_print_detail.jpg", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80" },
  { name: "ed_urban.jpg", url: "https://images.unsplash.com/photo-1552168212-9ceb61083ba0?auto=format&fit=crop&w=400&q=80" }
];

for (const img of images) {
  const dest = path.join(dir, img.name);
  const res = await fetch(img.url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`Saved ${img.name} (${buf.length} bytes)`);
}

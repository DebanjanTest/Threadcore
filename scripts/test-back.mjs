async function testBack() {
  const url = "https://images.unsplash.com/photo-1618453292610-4119319e5ac7?auto=format&fit=crop&w=400&q=80";
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const fs = await import("fs");
  fs.writeFileSync("./scripts/audit_images/tee_back_cand.jpg", buf);
  console.log("Downloaded tee_back_cand.jpg:", buf.length);
}
testBack();

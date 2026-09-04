async function testIt() {
  const url = "https://images.unsplash.com/photo-1612978322313-be209301e185?auto=format&fit=crop&w=400&q=80";
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const fs = await import("fs");
  fs.writeFileSync("./scripts/audit_images/cand_hoodie_1612978322.jpg", buf);
  console.log("Saved cand_hoodie_1612978322.jpg:", buf.length);
}
testIt();

async function testOne() {
  const url = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80";
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const fs = await import("fs");
  fs.writeFileSync("./scripts/audit_images/white_tee_real.jpg", buf);
  console.log("Downloaded white_tee_real.jpg:", buf.length);
}
testOne();

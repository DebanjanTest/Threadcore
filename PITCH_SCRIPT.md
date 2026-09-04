# THREAD//CORE — 5-Minute Pitch Video Blueprint & Script
**Submission for Razorpay AI Buildathon 2026**
*Track 01: AI Growth & Agentic Commerce (with Track 03: AI Revenue Recovery)*

---

## 📹 Video Overview & Preparation
* **Target Duration**: Exactly 4:30 to 5:00 minutes.
* **Recording Tool**: Loom, OBS Studio, or YouTube Unlisted.
* **Prerequisites**:
  - Terminal open with `npm run dev` running.
  - Browser open at `http://localhost:3000`.
  - Second terminal split for `npm run agent:buy`.

---

## ⏱️ Second-by-Second Pitch Script

### [0:00 – 0:45] The Problem & The Shift to Agentic Commerce
* **Screen**: Camera on face or Title Slide ("THREAD//CORE: Agentic Commerce Studio for NPCI UAP").
* **Spoken Script**:
  > *"Hi, I'm [Your Name], and this is THREAD//CORE — our submission for Track 01: AI Growth and Agentic Commerce at the Razorpay AI Buildathon.*
  > 
  > *In 2026, the way goods are purchased is undergoing a fundamental transformation. With NPCI's Unified Agentic Protocol and the rise of autonomous personal styling and procurement agents, commerce is shifting from humans clicking buttons to AI agents transacting directly with merchants.*
  > 
  > *However, current e-commerce platforms are completely unsuited for AI buyers. They have opaque pricing, unconstrained carts that invite runaway agent spending, and brittle payment flows that fail silently without telemetry.*
  > 
  > *THREAD//CORE solves this by building an agent-transactable custom apparel studio with non-bypassable financial guardrails, transparent line-item pricing, self-healing remediation, and full Razorpay integration."*

---

### [0:45 – 1:45] Dual Interface & 21st.dev UI Walkthrough
* **Screen**: Switch to browser at `http://localhost:3000`.
* **Action**:
  - Scroll past the Hero with 21st.dev shimmer CTA buttons.
  - Hover over product cards to show front/back flip, color swatches, and the quick view modal.
  - Click "Enter Studio ✦" or navigate to `/studio`.
* **Spoken Script**:
  > *"ThreadCore provides a dual-native interface. For human creators, we've implemented an editorial-grade custom studio with 21st.dev component styling, multi-angle picture galleries, macro fabric weave inspection, and live SVG canvas overlays.*
  > 
  > *Behind this human interface lies our machine-readable protocol layer. If we open `/.well-known/agentic-commerce.json` or query `/api/agent/catalog`, any external agent can discover our product specifications, millimeter print bounds, fabric weights, and surcharge formulas.*
  > 
  > *Most importantly, our catalog enforces strict financial rules: a non-bypassable hard ceiling of ₹5,000, a minimum floor of ₹100, and a quantity cap of 50 units."*

---

### [1:45 – 3:00] Live Autonomous Purchase (CLI & In-Browser Autopilot)
* **Screen**: Split screen: Terminal on left, Browser on right.
* **Action**:
  - In Terminal: run `npm run agent:buy`.
  - Watch the ANSI color logs print Phase 1 through Phase 5.
  - In Browser: Click the glowing **⚡ AI Autopilot** button in the Studio header, select "1. Autonomous Direct Buyer", and click "Run Autonomous Agent".
* **Spoken Script**:
  > *"Now let's demonstrate the core of Track 01: a fully autonomous AI buyer transacting end-to-end without human intervention.*
  > 
  > *I'll execute our autonomous buyer agent script in the terminal. Notice the sequence:*
  > 1. *It probes our discovery endpoint and validates the UAP handshake.*
  > 2. *It ingests the catalog and selects SKU TC-TEE-001 — our 220 GSM heavyweight tee.*
  > 3. *It calls `POST /api/agent/evaluate` to perform an automated canvas fit check and 300 DPI tolerance test.*
  > 4. *Once verified, it initiates a bounded Razorpay order via `POST /api/razorpay/create-order` and captures the transaction.*
  > 
  > *We've also built this directly into our web app as an in-browser Autopilot so anyone reviewing the project can experience the agent lifecycle instantly."*

---

### [3:00 – 4:00] The Bar: Explainable Pricing & The Audit Trail
* **Screen**: Expand the **Agent Audit Log** drawer on the right side of `/studio`.
* **Action**:
  - Point to the timestamped audit entries.
  - Point to the line-item pricing breakdown in the bottom bar.
* **Spoken Script**:
  > *"Razorpay set a very explicit bar for this track: every money action must be explainable, bounded, and gated with an audit trail.*
  > 
  > *In ThreadCore, every single rupee is mathematically explainable. You can see the exact breakdown: Garment Base (₹599) + Print Surcharge (₹0) + Surface Markup (15% DTG = ₹90) + 18% GST (₹124) = Total ₹813. Not a single paisa is hidden or estimated.*
  > 
  > *Simultaneously, our live Audit Drawer records every millisecond-timestamped money action: from schema fetch and canvas validation to order creation and signature verification. Evaluators have complete cryptographic visibility into what the agent did and why."*

---

### [4:00 – 4:45] Graceful Failure Handling & Track 03 Revenue Recovery
* **Screen**: Studio UI or Terminal.
* **Action**:
  - Option A (Terminal): Run `node scripts/ai-buyer.mjs --overflow` to show self-healing remediation.
  - Option B (Browser): Toggle "Fail Sim: ON", click "Buy Now", and show the test card decline triggering the **Track 03 Revenue Recovery panel**.
  - Click "Instant UPI Recovery Failover" to show successful drop-off recovery.
* **Spoken Script**:
  > *"The prompt specifically requires showing a failure handled gracefully. ThreadCore handles two critical failure modes:*
  > 
  > *First, pre-purchase ceiling overflow: if an over-ambitious agent attempts to order 6 technical hoodies totaling over ₹9,000, our evaluator rejects the request, but autonomously computes a self-healing remediation proposal — recommending an adapted quantity of 2 hoodies to safely bring the transaction back under the ₹5,000 ceiling.*
  > 
  > *Second, payment-rail failure: if an issuing bank declines a test card, our Track 03 Revenue Recovery module immediately diagnoses the decline and deploys a 1-click UPI Dynamic QR failover, rescuing the checkout drop-off and capturing the revenue without corrupting state."*

---

### [4:45 – 5:00] Wrap-up & Architecture Summary
* **Screen**: Show `PROTOCOL_SPEC.md` or README in the GitHub repo.
* **Spoken Script**:
  > *"In summary, THREAD//CORE brings together editorial-grade 21st.dev UI, NPCI UAP protocol compliance, strict mathematical financial guardrails, and Razorpay test-mode settlement.*
  > 
  > *All code, automated test suites, and protocol documentation are open-source in our GitHub repository. Thank you, and I look forward to discussing this in the panel interview."*

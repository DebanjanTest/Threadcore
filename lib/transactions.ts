import fs from "fs";
import path from "path";

export type TransactionStatus = "PENDING" | "VERIFIED" | "FAILED";

export interface TransactionRecord {
  id: string; // Razorpay order_id
  receipt: string;
  amountPaise: number;
  currency: string;
  status: TransactionStatus;
  source: "HUMAN_WEB" | "AGENT_AUTOPILOT" | "AGENT_CLI" | "SIMULATOR";
  idempotencyKey: string;
  paymentId?: string;
  signature?: string;
  failureReason?: string;
  recoveryMethod?: "UPI_FAILOVER" | "RECOVERY_LINK" | "WALLET";
  recoveryStatus?: "IDLE" | "OFFERED" | "RECOVERED";
  notes?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  rawPayload?: Record<string, unknown>;
}

// Global symbol for dev HMR preservation
const GLOBAL_STORE_KEY = Symbol.for("threadcore.transactions");

interface GlobalWithTransactions {
  [GLOBAL_STORE_KEY]?: TransactionRecord[];
}

const g = globalThis as unknown as GlobalWithTransactions;

const STORAGE_FILE = path.join(process.cwd(), ".transactions.json");

const SEED_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "order_demo_1719940120",
    receipt: "rcpt_TC-HOODIE-001_1719940120",
    amountPaise: 153282, // ₹1,532.82
    currency: "INR",
    status: "VERIFIED",
    source: "AGENT_CLI",
    idempotencyKey: "idemp_cli_uap_984f1a2e",
    paymentId: "pay_demo_verified_9123",
    signature: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    notes: {
      sku: "TC-HOODIE-001",
      color: "black",
      size: "XL",
      quantity: "1",
      client: "AutonomousAgent-v2.4",
      protocol: "UAP-1.0",
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2 + 12000).toISOString(),
    rawPayload: {
      action: "agent_purchase",
      budget_paise: 500000,
      print_zone: "front-center",
      dpi: 300,
      validation_status: "PASSED",
    },
  },
  {
    id: "order_demo_1719942400",
    receipt: "rcpt_TC-TEE-001_1719942400",
    amountPaise: 70682, // ₹706.82
    currency: "INR",
    status: "FAILED",
    source: "SIMULATOR",
    idempotencyKey: "idemp_sim_fail_1023_declined",
    failureReason: "BAD_REQUEST_ERROR: Your card was declined. Simulation card 4000 0000 0000 1023 triggered issuer decline.",
    recoveryMethod: "UPI_FAILOVER",
    recoveryStatus: "OFFERED",
    notes: {
      sku: "TC-TEE-001",
      color: "vintage-grey",
      size: "L",
      testCard: "4000 0000 0000 1023",
      failoverAction: "Dynamic UPI QR Generated",
    },
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1790000).toISOString(),
    rawPayload: {
      decline_code: "card_declined_by_bank",
      idempotency_lock: "ACTIVE_PREVENT_DUPLICATE",
      fallback_uri: "upi://pay?pa=razorpay@icici&pn=Threadcore&am=706.82",
    },
  },
  {
    id: "order_demo_1719946800",
    receipt: "rcpt_TC-JERSEY-001_1719946800",
    amountPaise: 106082, // ₹1,060.82
    currency: "INR",
    status: "VERIFIED",
    source: "HUMAN_WEB",
    idempotencyKey: "idemp_web_human_33b82c",
    paymentId: "pay_demo_human_7741",
    signature: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    notes: {
      sku: "TC-JERSEY-001",
      color: "cream",
      size: "M",
      quantity: "1",
      checkout: "OneClickRazorpay",
    },
    createdAt: new Date(Date.now() - 600000).toISOString(),
    updatedAt: new Date(Date.now() - 580000).toISOString(),
    rawPayload: {
      channel: "web_studio",
      checkout_flow: "standard_modal",
    },
  },
];

function loadDiskTransactions(): TransactionRecord[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to read transactions from disk:", e);
  }
  return SEED_TRANSACTIONS;
}

function saveDiskTransactions(txs: TransactionRecord[]) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(txs, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to write transactions to disk:", e);
  }
}

export function getTransactions(): TransactionRecord[] {
  if (!g[GLOBAL_STORE_KEY]) {
    g[GLOBAL_STORE_KEY] = loadDiskTransactions();
  }
  return g[GLOBAL_STORE_KEY]!;
}

export function recordTransaction(tx: Omit<TransactionRecord, "createdAt" | "updatedAt">): TransactionRecord {
  const list = getTransactions();
  const now = new Date().toISOString();
  
  // Check if exists
  const existingIdx = list.findIndex((t) => t.id === tx.id);
  if (existingIdx >= 0) {
    const updated: TransactionRecord = {
      ...list[existingIdx],
      ...tx,
      updatedAt: now,
    };
    list[existingIdx] = updated;
    saveDiskTransactions(list);
    return updated;
  }

  const newTx: TransactionRecord = {
    ...tx,
    createdAt: now,
    updatedAt: now,
  };

  list.unshift(newTx);
  saveDiskTransactions(list);
  return newTx;
}

export function updateTransactionStatus(
  id: string,
  status: TransactionStatus,
  details?: {
    paymentId?: string;
    signature?: string;
    failureReason?: string;
    recoveryMethod?: "UPI_FAILOVER" | "RECOVERY_LINK" | "WALLET";
    recoveryStatus?: "IDLE" | "OFFERED" | "RECOVERED";
    rawPayload?: Record<string, unknown>;
  }
): TransactionRecord | null {
  const list = getTransactions();
  const idx = list.findIndex((t) => t.id === id);
  if (idx < 0) return null;

  const now = new Date().toISOString();
  const updated: TransactionRecord = {
    ...list[idx],
    status,
    ...(details?.paymentId && { paymentId: details.paymentId }),
    ...(details?.signature && { signature: details.signature }),
    ...(details?.failureReason && { failureReason: details.failureReason }),
    ...(details?.recoveryMethod && { recoveryMethod: details.recoveryMethod }),
    ...(details?.recoveryStatus && { recoveryStatus: details.recoveryStatus }),
    ...(details?.rawPayload && {
      rawPayload: { ...list[idx].rawPayload, ...details.rawPayload },
    }),
    updatedAt: now,
  };

  list[idx] = updated;
  saveDiskTransactions(list);
  return updated;
}

export function resetTransactions() {
  g[GLOBAL_STORE_KEY] = [...SEED_TRANSACTIONS];
  saveDiskTransactions(SEED_TRANSACTIONS);
  return SEED_TRANSACTIONS;
}

import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { google } from "googleapis";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dataDir = path.resolve(process.cwd(), "data");
const csvPath = path.join(dataDir, "subscribers.csv");

function ensureCsvWithHeader() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, "email,timestamp\n", "utf8");
  }
}

function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const re =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email.trim());
}

async function appendToGoogleSheet({ email, timestamp }) {
  const sheetId = process.env.GOOGLE_SHEETS_WAITLIST_ID;
  if (!sheetId) return { ok: false, skipped: true, reason: "No sheet ID" };
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!clientEmail || !privateKeyRaw) {
    return { ok: false, skipped: true, reason: "Missing service account env" };
  }
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const range = process.env.GOOGLE_SHEETS_RANGE || "Sheet1!A:B";
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[email, timestamp]],
    },
  });
  return { ok: true };
}

app.post("/api/subscribe", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: "Invalid email" });
    }
    ensureCsvWithHeader();
    const ts = new Date().toISOString();
    const line = `${email.trim()},${ts}\n`;
    try {
      await fs.promises.appendFile(csvPath, line);
    } catch (e) {
      console.error("CSV append failed:", e);
      return res.status(500).json({ ok: false, error: "Failed to write CSV" });
    }
    // Attempt Sheets append and include diagnostic info in response
    let sheets = { ok: false, skipped: true, reason: "Not attempted" };
    try {
      const result = await appendToGoogleSheet({ email: email.trim(), timestamp: ts });
      sheets = result;
      if (!result.ok) {
        console.warn("Sheets append skipped or failed:", result);
      }
    } catch (e) {
      console.error("Sheets append error:", e);
      sheets = { ok: false, error: (e && e.message) || "Unknown Sheets error" };
    }
    return res.json({ ok: true, sheets });
  } catch (e) {
    console.error("Subscribe handler error:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.get("/api/shots", (_req, res) => {
  try {
    const publicShotsDir = path.resolve(process.cwd(), "public", "shots");
    if (!fs.existsSync(publicShotsDir)) {
      return res.json({ ok: true, shots: [] });
    }
    const files = fs
      .readdirSync(publicShotsDir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".png"))
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
    const urls = files.map((name) => `/shots/${name}`);
    return res.json({ ok: true, shots: urls });
  } catch (_e) {
    return res.status(500).json({ ok: false, error: "Failed to list shots" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API server listening on :${PORT}`);
});
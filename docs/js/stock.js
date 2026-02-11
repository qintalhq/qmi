import { supabase } from "./supabase.js";

// 🔑 Finnhub API key (MVP only)
const FINNHUB_API_KEY = "d664mv9r01qssgecgdogd664mv9r01qssgecgdp0";

// Get ticker from URL
const params = new URLSearchParams(window.location.search);
const ticker = params.get("ticker")?.toUpperCase();

if (!ticker) {
  alert("No stock ticker provided");
  throw new Error("Ticker missing");
}

async function loadStock() {
  // ---------- FETCH RESEARCH ----------
  const { data, error } = await supabase
    .from("research")
    .select("*")
    .eq("ticker", ticker);

  if (error || !data || data.length === 0) {
    console.error("Research error:", error);
    alert("Research not found");
    return;
  }

  const r = data[0];

  // ---------- BIND RESEARCH ----------
  document.title = `${r.company} (${r.ticker}) | QMI`;
  document.getElementById("companyName").innerText =
    `${r.company} (${r.ticker})`;

  document.getElementById("overview").innerText = r.overview || "-";
  document.getElementById("summary").innerText = r.summary || "-";
  document.getElementById("country").innerText = r.country || "Global";
  document.getElementById("updated").innerText =
    "Last updated: " + new Date(r.created_at).toDateString();

  const positivesEl = document.getElementById("positives");
  positivesEl.innerHTML = "";
  (Array.isArray(r.positives) ? r.positives : r.positives?.split(",") || [])
    .forEach(p => positivesEl.innerHTML += `<li>${p}</li>`);

  const risksEl = document.getElementById("risks");
  risksEl.innerHTML = "";
  (Array.isArray(r.risks) ? r.risks : r.risks?.split(",") || [])
    .forEach(risk => risksEl.innerHTML += `<li>${risk}</li>`);

  // ---------- FETCH LIVE PRICE ----------
  try {
    const priceRes = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`
    );
    const price = await priceRes.json();

    document.getElementById("livePrice").innerText =
      price.c ? `$${price.c.toFixed(2)}` : "$--";

    document.getElementById("priceChange").innerText =
      price.dp ? `${price.dp.toFixed(2)}%` : "--";

    document.getElementById("priceChange").style.color =
      price.dp >= 0 ? "#22c55e" : "#ef4444";

  } catch (err) {
    console.error("Price API error", err);
  }
}

loadStock();

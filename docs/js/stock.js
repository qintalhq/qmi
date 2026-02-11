import { supabase } from "./supabase.js";

const params = new URLSearchParams(window.location.search);
const ticker = params.get("ticker");

async function loadResearch() {
  const { data } = await supabase
    .from("research")
    .select("*")
    .eq("ticker", ticker)
    .single();

  document.getElementById("companyName").innerText =
    `${data.company} (${data.ticker})`;

  document.getElementById("overview").innerText = data.overview;
  document.getElementById("summary").innerText = data.summary;
  document.getElementById("country").innerText = data.country;
  document.getElementById("updated").innerText =
    "Last updated: " + new Date(data.created_at).toDateString();

  data.positives.forEach(p => {
    document.getElementById("positives").innerHTML += `<li>${p}</li>`;
  });

  data.risks.forEach(r => {
    document.getElementById("risks").innerHTML += `<li>${r}</li>`;
  });
}

async function loadPrice() {
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=d664mv9r01qssgecgdogd664mv9r01qssgecgdp0`
  );
  const data = await res.json();
  document.getElementById("price").innerText = data.c;
}

loadResearch();
loadPrice();

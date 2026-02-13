import { requireAuth } from "./auth.js";
import { supabase } from "./supabase.js";

requireAuth(loadStock);

async function loadStock() {
  const ticker = new URLSearchParams(location.search).get("ticker");

  const { data } = await supabase
    .from("research")
    .select("*")
    .eq("ticker", ticker)
    .single();

  company.innerText = data.company + " (" + data.ticker + ")";
  meta.innerText = data.country + " • " + new Date(data.created_at).toDateString();
  banner.src = data.banner_url || "";
  content.innerHTML = data.content;

  sources.innerHTML = "";
  data.sources.forEach(s => {
    sources.innerHTML += `<li><a href="${s}" target="_blank">${s}</a></li>`;
  });
}

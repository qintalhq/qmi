import { requireAuth } from "./auth.js";
import { supabase } from "./supabase.js";

requireAuth(load);

async function load() {
  const { data } = await supabase
    .from("research")
    .select("company,ticker,banner_url")
    .order("created_at", { ascending: false });

  const el = document.getElementById("list");
  el.innerHTML = "";

  data.forEach(d => {
    el.innerHTML += `
      <div class="card">
        <img src="${d.banner_url || ''}">
        <h3>${d.company}</h3>
        <a href="stock.html?ticker=${d.ticker}">Read</a>
      </div>`;
  });
}

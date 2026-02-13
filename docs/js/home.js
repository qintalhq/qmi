import { supabase } from "./supabase.js";

supabase.auth.onAuthStateChange((_, session) => {
  if (!session) location.href = "login.html";
  load();
});

async function load() {
  const { data } = await supabase
    .from("research")
    .select("company,ticker,banner_url")
    .order("created_at", { ascending: false })
    .limit(6);

  const el = document.getElementById("latest");
  data.forEach(r => {
    el.innerHTML += `
      <div class="card">
        <img src="${r.banner_url}">
        <h4>${r.company}</h4>
        <a href="stock.html?ticker=${r.ticker}">Read</a>
      </div>
    `;
  });
}
import { supabase } from "./supabase.js";

supabase.auth.onAuthStateChange((_, s) => {
  if (!s) location.href = "login.html";
  load();
});

async function load() {
  const t = new URLSearchParams(location.search).get("ticker");

  const { data } = await supabase
    .from("research")
    .select("*")
    .eq("ticker", t)
    .single();

  document.getElementById("company").innerText =
    `${data.company} (${data.ticker})`;

  document.getElementById("meta").innerText =
    `${data.country} · ${new Date(data.created_at).toDateString()}`;

  document.getElementById("banner").src = data.banner_url;
  document.getElementById("content").innerHTML = data.content;

  data.sources.forEach(s => {
    document.getElementById("sources").innerHTML += `<li>${s}</li>`;
  });
}
import { supabase } from "./supabase.js";

async function loadHomeResearch() {
  const { data, error } = await supabase
    .from("research")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) return console.error(error);

  const container = document.getElementById("research-list");
  container.innerHTML = "";

  data.forEach(stock => {
    container.innerHTML += `
      <div class="research-card">
        <h3>${stock.company}</h3>
        <p class="ticker">${stock.ticker}</p>
        <p class="summary">${stock.summary}</p>
        <a href="stock.html?id=${stock.id}">Read Analysis →</a>
      </div>
    `;
  });
}

loadHomeResearch();

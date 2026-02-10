import { supabase } from "./supabase.js";

const input = document.querySelector(".search-input");

input.addEventListener("input", async () => {
  const query = input.value;

  const { data } = await supabase
    .from("research")
    .select("*")
    .ilike("company", `%${query}%`);

  const grid = document.querySelector(".card-grid");
  grid.innerHTML = "";

  data.forEach(stock => {
    grid.innerHTML += `
      <div class="research-card">
        <h3>${stock.company}</h3>
        <p class="ticker">${stock.ticker}</p>
        <a href="stock.html?id=${stock.id}">View →</a>
      </div>
    `;
  });
});

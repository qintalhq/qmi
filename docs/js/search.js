import { supabase } from "./supabase.js";

async function search() {
  const { data } = await supabase
    .from("research")
    .select("company,ticker")
    .ilike("company", `%${q.value}%`);

  res.innerHTML = "";
  data.forEach(d => {
    res.innerHTML += `<p><a href="stock.html?ticker=${d.ticker}">${d.company}</a></p>`;
  });
}

window.search = search;

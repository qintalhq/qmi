import { supabase } from "./supabase.js";

async function loadStock() {
  const { data, error } = await supabase
    .from("research")
    .select("*")
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error(error);
    return;
  }

  const r = data[0];

  // BASIC INFO
  document.getElementById("company").innerText =
    `${r.company} (${r.ticker})`;

  document.getElementById("country").innerText = r.country;
  document.getElementById("overview").innerText = r.overview;
  document.getElementById("summary").innerText = r.summary;

  document.getElementById("updated").innerText =
    "Last updated: " + new Date(r.created_at).toDateString();

  // POSITIVES
  const positivesEl = document.getElementById("positives");
  positivesEl.innerHTML = "";
  r.positives.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    positivesEl.appendChild(li);
  });

  // RISKS
  const risksEl = document.getElementById("risks");
  risksEl.innerHTML = "";
  r.risks.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    risksEl.appendChild(li);
  });
}

loadStock();

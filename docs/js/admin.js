import { supabase } from "./supabase.js";

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = e.target.querySelectorAll("input, textarea");

  const payload = {
    company: inputs[0].value,
    ticker: inputs[1].value,
    country: inputs[2].value,
    overview: inputs[3].value,
    positives: inputs[4].value,
    risks: inputs[5].value,
    summary: inputs[6].value,
  };

  const { error } = await supabase.from("research").insert([payload]);

  if (error) alert("Error publishing");
  else alert("Research published");
});

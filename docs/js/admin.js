import { supabase } from "./supabase.js";

document.getElementById("admin-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    company: document.getElementById("company").value,
    ticker: document.getElementById("ticker").value,
    country: document.getElementById("country").value,
    overview: document.getElementById("overview").value,
    positives: document.getElementById("positives").value.split(","),
    risks: document.getElementById("risks").value.split(","),
    summary: document.getElementById("summary").value,
  };

  const { data, error } = await supabase
    .from("research")
    .insert([payload])
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    alert(error.message);
  } else {
    alert("Published successfully");
  }
});

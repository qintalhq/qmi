import { supabase } from "./supabase.js";

// Form submission logic
document.getElementById("admin-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form fields
  const inputs = e.target.querySelectorAll("input, textarea");

  // Prepare payload
  const payload = {
    company: inputs[0].value,
    ticker: inputs[1].value,
    country: inputs[2].value,
    overview: inputs[3].value,
    positives: inputs[4].value.split(","),
    risks: inputs[5].value.split(","),
    summary: inputs[6].value,
  };

  // Insert data into Supabase
  const { data, error } = await supabase.from("research").insert([payload]);

  if (error) {
    alert("Error publishing research: " + error.message);
  } else {
    alert("Research published successfully!");
  }
});

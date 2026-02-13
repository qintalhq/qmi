import { supabase } from "./supabase.js";

async function publish() {
  const data = {
    company: company.value,
    ticker: ticker.value,
    country: country.value,
    banner_url: banner.value,
    content: content.value,
    sources: sources.value.split(",").map(s => s.trim())
  };

  const { error } = await supabase.from("research").insert([data]);

  msg.innerText = error ? error.message : "Published successfully";
}

window.publish = publish;
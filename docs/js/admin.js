import { requireAuth } from "./auth.js";
import { supabase } from "./supabase.js";

requireAuth(() => {});

async function publish() {
  const { error } = await supabase.from("research").insert([{
    company: company.value,
    ticker: ticker.value,
    country: country.value,
    banner_url: banner.value,
    content: content.value,
    sources: sources.value.split(",")
  }]);

  msg.innerText = error ? error.message : "Published";
}

window.publish = publish;

import { supabase } from "./supabase.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadStock() {
  const { data } = await supabase
    .from("research")
    .select("*")
    .eq("id", id)
    .single();

  document.querySelector("h1").textContent = data.company;
  document.querySelector(".ticker").textContent = data.ticker;
}

loadStock();

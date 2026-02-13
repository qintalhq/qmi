import { supabase } from "./supabase.js";

/* ---------- AUTH SAFE LOAD ---------- */
supabase.auth.onAuthStateChange((event, session) => {
  if (!session) {
    window.location.href = "login.html";
    return;
  }
  loadStock();
});

/* ---------- MAIN LOAD FUNCTION ---------- */
async function loadStock() {
  try {
    const params = new URLSearchParams(window.location.search);
    const ticker = params.get("ticker");

    if (!ticker) {
      document.getElementById("content").innerHTML =
        "<p>Invalid stock request.</p>";
      return;
    }

    const { data, error } = await supabase
      .from("research")
      .select("*")
      .eq("ticker", ticker)
      .single();

    if (error || !data) {
      document.getElementById("content").innerHTML =
        "<p>Research not found.</p>";
      console.error(error);
      return;
    }

    /* ---------- BASIC INFO ---------- */
    document.getElementById("company").innerText =
      `${data.company} (${data.ticker})`;

    document.getElementById("meta").innerText =
      `${data.country} · Last updated ${formatDate(data.created_at)}`;

    /* ---------- BANNER ---------- */
    const banner = document.getElementById("banner");
    banner.src = data.banner_url || "https://placehold.co/900x500?text=QMI";
    banner.alt = data.company;

    /* ---------- ARTICLE CONTENT ---------- */
    document.getElementById("content").innerHTML =
      data.content || "<p>No article content available.</p>";

    /* ---------- SOURCES ---------- */
    renderSources(data.sources);

  } catch (err) {
    console.error("Unexpected error:", err);
    document.getElementById("content").innerHTML =
      "<p>Something went wrong.</p>";
  }
}

/* ---------- HELPERS ---------- */
function renderSources(sources) {
  const list = document.getElementById("sources");
  list.innerHTML = "";

  if (!sources || sources.length === 0) {
    list.innerHTML = "<li>No sources provided.</li>";
    return;
  }

  sources.forEach(src => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = src;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerText = src;
    li.appendChild(a);
    list.appendChild(li);
  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
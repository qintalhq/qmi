import { supabase } from "./supabase.js";
import { login, logout, getUser } from "./auth.js";

const loginBox = document.getElementById("loginBox");
const contentBox = document.getElementById("contentBox");
const logoutBtn = document.getElementById("logoutBtn");

document.getElementById("loginBtn").onclick = () => {
  login(
    document.getElementById("email").value,
    document.getElementById("password").value
  );
};

logoutBtn.onclick = logout;

const user = await getUser();

if (user) {
  loginBox.style.display = "none";
  contentBox.style.display = "block";
  logoutBtn.style.display = "inline-block";

  const { data } = await supabase
    .from("research")
    .select("company,ticker,created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  document.getElementById("recentResearch").innerHTML =
    data.map(r =>
      `<p><a href="stock.html?ticker=${r.ticker}">
        ${r.company} (${r.ticker})
      </a></p>`
    ).join("");
}

import { supabase } from "./supabase.js";

let mode = "login";

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const subtitle = document.getElementById("subtitle");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("authForm");
const message = document.getElementById("message");

loginTab.onclick = () => switchMode("login");
registerTab.onclick = () => switchMode("register");

function switchMode(type) {
  mode = type;
  loginTab.classList.toggle("active", type === "login");
  registerTab.classList.toggle("active", type === "register");
  subtitle.textContent = type === "login"
    ? "Login to your account"
    : "Create a new account";
  submitBtn.textContent = type === "login" ? "Login" : "Register";
  message.textContent = "";
}

form.onsubmit = async (e) => {
  e.preventDefault();

  const email = email.value;
  const password = password.value;

  message.textContent = "Processing...";
  message.style.color = "#94a3b8";

  if (mode === "login") {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      message.textContent = error.message;
      message.style.color = "#f87171";
    } else {
      window.location.href = "index.html";
    }
  }

  if (mode === "register") {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://qmi.pages.dev/index.html"
      }
    });

    if (error) {
      message.textContent = error.message;
      message.style.color = "#f87171";
    } else {
      message.textContent =
        "Check your email to confirm your account.";
      message.style.color = "#38bdf8";
    }
  }
};

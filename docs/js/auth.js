import { supabase } from "./supabase.js";

/* ===============================
   AUTH STATE HANDLER (GLOBAL)
================================ */
export function requireAuth(callback) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
      window.location.href = "login.html";
      return;
    }

    if (typeof callback === "function") {
      callback(session.user);
    }
  });
}

/* ===============================
   OPTIONAL: GET USER (SAFE)
================================ */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

/* ===============================
   LOGOUT
================================ */
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

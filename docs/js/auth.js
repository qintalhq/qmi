import { supabase } from "./supabase.js";

export function requireAuth(callback) {
  supabase.auth.onAuthStateChange((_e, session) => {
    if (!session) {
      location.href = "login.html";
    } else {
      callback(session.user);
    }
  });
}

export async function logout() {
  await supabase.auth.signOut();
  location.href = "login.html";
}

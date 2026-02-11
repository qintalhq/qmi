import { supabase } from "./supabase.js";

// LOGIN
export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return false;
  }

  window.location.reload();
  return true;
}

// LOGOUT
export async function logout() {
  await supabase.auth.signOut();
  window.location.reload();
}

// CHECK SESSION
export async function getUser() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user || null;
}

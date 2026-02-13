import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://swdsyfsidgjjkvdjsqkc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3ZHN5ZnNpZGdqamt2ZGpzcWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzcyNTUsImV4cCI6MjA4NjExMzI1NX0.DHRZSwv4DvAW1W4ZdUkuD_Vi_usv1N4IzgC07_fYF9A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
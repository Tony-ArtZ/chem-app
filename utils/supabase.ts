import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aaumkordeyweshjjuhts.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhdW1rb3JkZXl3ZXNoamp1aHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDg5NDYsImV4cCI6MjA1Nzk4NDk0Nn0.yIb18uzZioTnHCIKPZKQGdRjJRz9KEKLxNnkiUnjMRs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

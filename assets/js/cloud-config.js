/* =========================================================
   Cloud connection (Supabase) — optional
   ---------------------------------------------------------
   Fill these two values to make admin changes go live for
   every customer. Leave them empty to use local mode.

   Supabase dashboard > Project Settings > API
     supabaseUrl      = "Project URL"
     supabaseAnonKey  = "anon public" key

   The anon key is safe to put here: only the logged-in admin
   can change data (see supabase-setup.sql).
   ========================================================= */

window.CLOUD = {
  /* GitHub mode (used by blushingbeautybd.github.io): admin.html publishes
     straight into this repository with the owner's GitHub token. */
  github: { owner: "blushingbeautybd", repo: "blushingbeautybd.github.io", branch: "main" },

  /* Supabase mode (only used when github above is removed) */
  supabaseUrl: "",
  supabaseAnonKey: ""
};

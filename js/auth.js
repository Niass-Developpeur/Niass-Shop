// =====================================================
// AUTHENTIFICATION NIASS-SHOP AVEC SUPABASE
// =====================================================

// 1. CONFIGURATION SUPABASE
// ⚠️ Remplace ces deux valeurs par les tiennes (Project Settings → API)
const SUPABASE_URL = "https://rlrkujrwomxkfoucttac.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscmt1anJ3b214a2ZvdWN0dGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MTYyMTMsImV4cCI6MjEwMjk5MjIxM30.Rkb4pvG79ZImOawhpIxRwjElJK83JuOM9XVgkCCV6VU";

// Création du client Supabase (nécessite le script CDN, voir index.html)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// =====================================================
// 2. FONCTION D'INSCRIPTION
// =====================================================
async function handleRegister(event) {
  event.preventDefault();
  const form = event.target;

  // Validation Bootstrap classique
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  const submitBtn = form.querySelector("button[type='submit']");
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Création en cours...";

  // Inscription via Supabase Auth
  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: name, // stocké dans les métadonnées utilisateur
      },
    },
  });

  submitBtn.disabled = false;
  submitBtn.textContent = originalText;

  if (error) {
    afficherErreur(form, traduireErreur(error.message));
    return;
  }

  // Succès
  afficherSucces(form, "Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.");
  form.reset();
  form.classList.remove("was-validated");
}


// =====================================================
// 3. FONCTION DE CONNEXION
// =====================================================
async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const submitBtn = form.querySelector("button[type='submit']");
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Connexion en cours...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  submitBtn.disabled = false;
  submitBtn.textContent = originalText;

  if (error) {
    afficherErreur(form, traduireErreur(error.message));
    return;
  }

  // Connexion réussie → redirection
  window.location.href = "mon-compte.html"; // change vers ta page souhaitée
}


// =====================================================
// 4. DÉCONNEXION
// =====================================================
async function handleLogout() {
  const { error } = await supabaseClient.auth.signOut();
  if (!error) {
    window.location.href = "index.html";
  }
}


// =====================================================
// 5. VÉRIFIER SI L'UTILISATEUR EST DÉJÀ CONNECTÉ
// (à appeler sur chaque page pour adapter l'affichage : afficher "Mon compte"
// au lieu de "Connexion", par exemple)
// =====================================================
async function verifierSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  const elementConnecte = document.querySelectorAll("[data-auth='connecte']");
  const elementDeconnecte = document.querySelectorAll("[data-auth='deconnecte']");

  if (session) {
    // Utilisateur connecté
    elementConnecte.forEach(el => el.style.display = "");
    elementDeconnecte.forEach(el => el.style.display = "none");

    // Affiche le nom si un élément avec id="userName" existe
    const userNameEl = document.getElementById("userName");
    if (userNameEl) {
      userNameEl.textContent = session.user.user_metadata.full_name || session.user.email;
    }
  } else {
    elementConnecte.forEach(el => el.style.display = "none");
    elementDeconnecte.forEach(el => el.style.display = "");
  }

  return session;
}


// =====================================================
// 6. FONCTIONS UTILITAIRES (affichage erreurs/succès)
// =====================================================
function afficherErreur(form, message) {
  // Supprime une ancienne alerte si présente
  const ancienneAlerte = form.querySelector(".auth-alert");
  if (ancienneAlerte) ancienneAlerte.remove();

  const alerte = document.createElement("div");
  alerte.className = "alert alert-danger auth-alert mt-2";
  alerte.textContent = message;
  form.appendChild(alerte);
}

function afficherSucces(form, message) {
  const ancienneAlerte = form.querySelector(".auth-alert");
  if (ancienneAlerte) ancienneAlerte.remove();

  const alerte = document.createElement("div");
  alerte.className = "alert alert-success auth-alert mt-2";
  alerte.textContent = message;
  form.appendChild(alerte);
}

// Traduit les messages d'erreur Supabase (en anglais) en français
function traduireErreur(messageAnglais) {
  const traductions = {
    "Invalid login credentials": "E-mail ou mot de passe incorrect.",
    "User already registered": "Un compte existe déjà avec cet e-mail.",
    "Email not confirmed": "Merci de confirmer ton e-mail avant de te connecter.",
    "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères.",
  };
  return traductions[messageAnglais] || messageAnglais;
}


// =====================================================
// 7. INITIALISATION AU CHARGEMENT DE LA PAGE
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  // Vérifie la session sur chaque page
  verifierSession();

  // Attache les gestionnaires aux formulaires (uniquement s'ils existent sur la page)
  const loginForm = document.querySelector("#login-pane form");
  const registerForm = document.querySelector("#register-pane form");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  // Bouton de déconnexion (ajoute data-action="logout" sur ton bouton/lien)
  const logoutBtn = document.querySelector("[data-action='logout']");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
});
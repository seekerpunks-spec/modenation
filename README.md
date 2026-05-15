# Modénation

Plateforme de recrutement de modérateurs Discord, Twitch, YouTube — recruteurs et candidats se rencontrent.

## Structure du projet

```
projet amine/
├── index.html              # Page d'accueil
├── moderateurs.html        # Liste des modérateurs (avec filtres + recherche)
├── offres.html             # Offres de recrutement + formulaire candidature
├── dashboard.html          # Tableau de bord (XP, candidatures, avis, signalements)
├── profil.html             # Profil détaillé d'un modérateur
├── blog.html               # Articles, guides, témoignages
├── signalement.html        # Centre de signalements
├── login.html              # Connexion / Inscription
├── apropos.html            # À propos & équipe
├── contact.html            # Contact + FAQ
├── mentions.html           # Mentions légales / CGU / RGPD
└── assets/
    ├── css/style.css       # Design system complet (thème sombre)
    ├── js/main.js          # Interactions (modales, filtres, recherche)
    └── images/
        └── logo.png        # Logo Modénation
```

## Lancer le site

Aucune dépendance — c'est du HTML/CSS/JS statique.

**Option 1 — Ouvrir directement :**
Double-clique sur `index.html`.

**Option 2 — Serveur local Python :**
```bash
cd "projet amine"
python3 -m http.server 8000
# Puis ouvrir http://localhost:8000
```

**Option 3 — Live Server (VSCode/Cursor) :**
Clic droit sur `index.html` → "Open with Live Server".

## Fonctionnalités

### Pour les modérateurs
- Profil avec avatar, niveau XP, badges, spécialités
- Postuler aux offres avec message personnalisé
- Recevoir des avis et augmenter sa réputation
- Tableau de bord avec suivi candidatures + progression

### Pour les recruteurs
- Publier des offres (Discord / Twitch / YouTube)
- Filtrer les modérateurs par plateforme, niveau, statut
- Gérer les candidatures reçues (Accepté / En cours / Refusé)
- Laisser des avis aux modérateurs

### Système commun
- Signalements (arnaques, faux profils, harcèlement) traités sous 48h
- Système d'XP & niveaux (1 → 10)
- Badges (Vérifié, Top 1%, Rapide, 100 avis…)
- Avis publics avec note 1-5★
- Charte de modération transparente

## Design

- Thème sombre avec accent dégradé bleu → violet
- Logo "M" à priorité (déjà intégré)
- Icônes Bootstrap Icons
- Police Inter (Google Fonts)
- 100% responsive (mobile / tablette / desktop)

## Prochaines évolutions possibles

- Backend Node.js + base de données (Postgres / Supabase)
- Authentification OAuth Discord
- Messagerie temps réel entre recruteurs et modérateurs
- Système de paiement pour les missions rémunérées
- App mobile (React Native)

# Miniakits – structure du site (miniakits.com)

État au 17 novembre 2026 : identique au déploiement de production en ligne (déploiement 75108d66, publié vers 20h35, heure du Maroc).

## 1. Technologie
- Site **statique** : HTML + CSS + JavaScript « vanilla » (sans framework). **Aucune étape de build** : les fichiers du dossier `site/` sont publiés tels quels.
- CSS : `style.css` (base) + `refinement.css` (finitions). Polices Google Fonts : Fredoka et Nunito (chargées depuis fonts.googleapis.com, pas de fichiers de police locaux).
- JS :
  - `main.js` : grille des kits de l'accueil (données dans le tableau `KITS`), formulaire de devis (calcul 40 DH × quantité), occasions, avis, FAQ et bannière d'installation PWA.
  - `i18n.js` : sélecteur de langue. Chaque langue a sa propre URL (`/`, `/en/`, `/ar/`) et ses pages HTML déjà traduites. Le script gère le lien de langue, le choix mémorisé dans `localStorage` et un dictionnaire de textes EN pour les parties générées en JS.
  - `kits.js` : visionneuse (lightbox) de la page « Nos kits », avec un bouton WhatsApp par modèle.
  - `chime-popup.js` : pop-up de bienvenue avec petit son (`audio/chime.*`), une fois par session, sur les 3 pages d'accueil (FR, EN, AR).
  - `promo.js` (chargé par `main.js`) : pop-up de l'offre « Novembre Créatif », actif du 6 au 30 nov. 2026 (heure du Maroc), sur les pages hors accueil.
- **PWA** : `manifest.webmanifest`, icônes `img/icon-m-*.png`, service worker `sw.js` (cache `miniakits-v27` : réseau d'abord pour les pages, cache d'abord pour CSS/JS/images).
- SEO : balises hreflang FR/EN/AR, données structurées JSON-LD, `sitemap.xml` (24 URL), `robots.txt`, image de partage `img/og-miniakits.jpg`.
- Publicité : Google AdSense (`ca-pub-4941148055124415`, identifiant public) dans le `<head>` de chaque page.

## 2. Pages
- **Français (principal)** : `index.html` (accueil), `kits.html` (nos modèles), `anniversaire.html`, `idee-cadeau.html`, `ecoles-evenements.html`, `ados-adultes.html`, `reglement-novembre.html` (règlement de l'offre de novembre), `credits.html`.
- **Anglais (`en/`)** : `index.html`, `kits.html`, `birthday-party.html`, `gift-ideas.html`, `schools-events.html`, `teens-adults.html`, `credits.html`, `legal-notice.html`, `terms.html`.
- **Arabe (`ar/`)** : `index.html` uniquement (page d'accueil, sens RTL).
- **Blog (FR, `blog/`)** : `index.html` + 4 articles (anniversaire créatif, activités à la maison, atelier peinture à l'école, guide pour peindre une figurine en plâtre).
- **Pages légales** : `mentions-legales.html`, `conditions-de-vente.html`, `politique-de-confidentialite.html` (FR ; les anciennes URL EN de confidentialité redirigent vers la page FR), `en/legal-notice.html`, `en/terms.html`.
- **404** : `404.html`.
- Les URL sont « propres » (sans `.html`) grâce à Cloudflare Pages, par exemple `/kits` ou `/en/kits`.

## 3. Informations produits et images
- Il n'y a pas de base de données ni de CMS : les produits sont écrits directement dans le code.
  - Accueil : tableau `KITS` dans `main.js` (n° de photo, nom, description FR, traduction EN dans `KEN`).
  - Page « Nos kits » : les 21 modèles sont écrits dans `kits.html` et `en/kits.html` (une `<figure class="kp">` par modèle, avec son message WhatsApp dans `data-wa`).
  - Offre (40 DH : 2 grandes, 3 moyennes ou 5 petites figurines, peintures et pinceaux inclus) : texte des pages HTML, de `promo.js` et de `chime-popup.js`.
- Images (format WebP, versions `-s` = miniatures) :
  - `img/kits/kit-01…21.webp` : photos des modèles (page Nos kits).
  - `img/kitNN.webp` et `img/cut-kitNN.webp` : photos de la grille de l'accueil.
  - `img/life/` : photos d'ambiance (famille, ados).
  - `img/scene-*.webp`, `img/poster-*.webp`, `img/promo-novembre*.webp` : visuels de sections, affiches des vidéos et bannière de promo.
  - Logos : `img/logo-miniakits(.png/.webp)` et `img/logo-miniakits-white(.png/.webp)` ; favicons à la racine ; icônes PWA dans `img/`.
- Vidéos : `vid/HERO.mp4`, `vid/chambre.mp4`, `vid/ecole.mp4`, `vid/anniversaire.mp4` (chargées à la demande, avec image d'affiche).
- Logos officiels d'origine : dossier `brand/` du ZIP.

## 4. Commande et WhatsApp
- **Il n'y a ni panier, ni paiement en ligne, ni serveur de commandes.** Toute commande passe par WhatsApp, au **+212 700-563350**.
- Les boutons sont des liens `https://wa.me/212700563350?text=…` avec un **message pré-rempli** selon le contexte (kit à 40 DH, modèle n°XX, anniversaire, école, cadeau…) et la langue (FR/EN/AR).
- Page Nos kits : chaque modèle a son message (« Je voudrais le modèle n°XX… ») ; `kits.js` reprend ce message dans la visionneuse.
- Formulaire de devis de l'accueil (`#qf`, géré par `main.js`) : occasion, nombre de kits, thème, ville, date et note. Il affiche une estimation (quantité × 40 DH + livraison confirmée sur WhatsApp, remise possible à partir de 5 kits), puis ouvre WhatsApp avec un récapitulatif. Rien n'est envoyé à un serveur.
- Contact secondaire : e-mail miniakits@gmail.com (Cloudflare le masque contre les robots sur le site en ligne).

## 5. Déploiement sur Cloudflare
- **Cloudflare Pages**, projet `miniakits`, en **téléversement direct** (« Direct Upload ») avec Wrangler depuis l'ordinateur. **Pas d'intégration Git** : chaque mise à jour se fait par une commande.
  - Commande de production : `npx wrangler pages deploy site --project-name miniakits --branch main`
- Domaines : `miniakits.com` (principal), `www.miniakits.com` et `miniakits.pages.dev`.
- Redirection `www` → `miniakits.com` (301) par `_worker.js`, le Worker du projet en mode avancé. `functions/_middleware.js` fait la même chose, mais il est exclu de l'envoi par `.assetsignore` et ignoré quand `_worker.js` existe. `_routes.json` envoie toutes les URL au Worker, qui sert ensuite les fichiers statiques.
- `_redirects` : redirections 301 des anciennes URL ou de celles mal tapées (privacy, cgv, terms, legal…).
- `wrangler.toml` : nom du projet, date de compatibilité, dossier de sortie `.`.
- Cloudflare ajoute automatiquement la protection des e-mails (`/cdn-cgi/l/email-protection`) : c'est la seule différence entre les fichiers source et les pages en ligne.
- Aperçu de revue : une branche séparée, `review`, déployée en « Preview » (voir README). Elle n'a aucun effet sur miniakits.com.

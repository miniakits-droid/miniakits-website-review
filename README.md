# Miniakits – code source du site miniakits.com (pour revue externe)

> **English summary.** This is the complete source of https://miniakits.com, a static website (plain HTML/CSS/vanilla JS, no build step, no framework) for Miniakits, a Moroccan brand that sells made-to-order plaster-figurine painting kits. The site is in French (main), English (`/en/`) and Arabic (`/ar/`, home page only). Ordering is done only through WhatsApp links with pre-filled messages (+212 700-563350). There is no cart, no online payment and no backend. It is hosted on Cloudflare Pages (project `miniakits`), deployed by Direct Upload with Wrangler (no Git integration). A small `_worker.js` redirects `www` to the apex domain. The snapshot is identical to production on 17 Nov 2026. Secrets, `node_modules`, `.git` and `.wrangler` are excluded. To run it locally: `cd site && python3 -m http.server 8080` and open http://localhost:8080. Please review only; nothing should be changed on the live site.

Instantané du 17 novembre 2026, identique au site en ligne (production Cloudflare, déploiement `75108d66`).

## Contenu du ZIP
- `site/` : le site complet, tel qu'il est publié (HTML, CSS, JS, images, vidéos, sons, icônes, manifest, service worker, sitemap, robots, `_redirects`, `_routes.json`, `_worker.js`, `wrangler.toml`).
- `brand/` : les 4 fichiers du logo officiel (PNG transparent, PNG fond blanc, PDF transparent, PDF fond blanc). Attention : ils sont en 524 × 183 px, donc pas adaptés à une impression en grand format.
- `deploy/` : `package.json` et `package-lock.json` de l'outil de déploiement (Wrangler uniquement).
- `structure_miniakits.md` : explication détaillée de la structure (le même texte est repris ci-dessous).

Exclus : `node_modules`, `.git`, `.wrangler`, caches, sauvegardes et tout identifiant secret. Aucun mot de passe, jeton ni clé d'API n'a été trouvé dans les fichiers. Le seul identifiant présent est l'ID éditeur AdSense `ca-pub-4941148055124415`, qui est public.

## Lancer le site en local
Aucune installation n'est nécessaire, car il n'y a pas d'étape de build :
```bash
cd site
python3 -m http.server 8080      # ou : npx serve .
# puis ouvrir http://localhost:8080
```
Différences en local :
- les URL propres (`/kits` au lieu de `/kits.html`), les règles de `_redirects` et la redirection `www` de `_worker.js` ne fonctionnent que sur Cloudflare (ouvrez `/kits.html` directement) ;
- AdSense ne s'affiche pas hors du domaine autorisé.

Pour reproduire fidèlement Cloudflare : `cd deploy && npm install && npx wrangler pages dev ../site`.

## Aperçu public temporaire
- https://review.miniakits.pages.dev (branche `review`)
- https://b1290daa.miniakits.pages.dev (adresse fixe de ce déploiement)

C'est un déploiement « Preview » séparé : il ne change rien à miniakits.com. Il porte un en-tête `noindex`, donc Google ne l'indexe pas. Les publicités AdSense et le service worker peuvent s'y comporter autrement qu'en production.

## Structure du site

État au 17 novembre 2026 : identique au déploiement de production en ligne (déploiement 75108d66, publié vers 20h35, heure du Maroc).

### 1. Technologie
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

### 2. Pages
- **Français (principal)** : `index.html` (accueil), `kits.html` (nos modèles), `anniversaire.html`, `idee-cadeau.html`, `ecoles-evenements.html`, `ados-adultes.html`, `reglement-novembre.html` (règlement de l'offre de novembre), `credits.html`.
- **Anglais (`en/`)** : `index.html`, `kits.html`, `birthday-party.html`, `gift-ideas.html`, `schools-events.html`, `teens-adults.html`, `credits.html`, `legal-notice.html`, `terms.html`.
- **Arabe (`ar/`)** : `index.html` uniquement (page d'accueil, sens RTL).
- **Blog (FR, `blog/`)** : `index.html` + 4 articles (anniversaire créatif, activités à la maison, atelier peinture à l'école, guide pour peindre une figurine en plâtre).
- **Pages légales** : `mentions-legales.html`, `conditions-de-vente.html`, `politique-de-confidentialite.html` (FR ; les anciennes URL EN de confidentialité redirigent vers la page FR), `en/legal-notice.html`, `en/terms.html`.
- **404** : `404.html`.
- Les URL sont « propres » (sans `.html`) grâce à Cloudflare Pages, par exemple `/kits` ou `/en/kits`.

### 3. Informations produits et images
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

### 4. Commande et WhatsApp
- **Il n'y a ni panier, ni paiement en ligne, ni serveur de commandes.** Toute commande passe par WhatsApp, au **+212 700-563350**.
- Les boutons sont des liens `https://wa.me/212700563350?text=…` avec un **message pré-rempli** selon le contexte (kit à 40 DH, modèle n°XX, anniversaire, école, cadeau…) et la langue (FR/EN/AR).
- Page Nos kits : chaque modèle a son message (« Je voudrais le modèle n°XX… ») ; `kits.js` reprend ce message dans la visionneuse.
- Formulaire de devis de l'accueil (`#qf`, géré par `main.js`) : occasion, nombre de kits, thème, ville, date et note. Il affiche une estimation (quantité × 40 DH + livraison confirmée sur WhatsApp, remise possible à partir de 5 kits), puis ouvre WhatsApp avec un récapitulatif. Rien n'est envoyé à un serveur.
- Contact secondaire : e-mail miniakits@gmail.com (Cloudflare le masque contre les robots sur le site en ligne).

### 5. Déploiement sur Cloudflare
- **Cloudflare Pages**, projet `miniakits`, en **téléversement direct** (« Direct Upload ») avec Wrangler depuis l'ordinateur. **Pas d'intégration Git** : chaque mise à jour se fait par une commande.
  - Commande de production : `npx wrangler pages deploy site --project-name miniakits --branch main`
- Domaines : `miniakits.com` (principal), `www.miniakits.com` et `miniakits.pages.dev`.
- Redirection `www` → `miniakits.com` (301) par `_worker.js`, le Worker du projet en mode avancé. `functions/_middleware.js` fait la même chose, mais il est exclu de l'envoi par `.assetsignore` et ignoré quand `_worker.js` existe. `_routes.json` envoie toutes les URL au Worker, qui sert ensuite les fichiers statiques.
- `_redirects` : redirections 301 des anciennes URL ou de celles mal tapées (privacy, cgv, terms, legal…).
- `wrangler.toml` : nom du projet, date de compatibilité, dossier de sortie `.`.
- Cloudflare ajoute automatiquement la protection des e-mails (`/cdn-cgi/l/email-protection`) : c'est la seule différence entre les fichiers source et les pages en ligne.
- Aperçu de revue : une branche séparée, `review`, déployée en « Preview » (voir README). Elle n'a aucun effet sur miniakits.com.

## Arborescence
```
miniakits_website/
├── README.md
├── structure_miniakits.md
├── brand/
│   ├── README.txt
│   ├── miniakits_logo_final.pdf
│   ├── miniakits_logo_final.png
│   ├── miniakits_logo_final_white.pdf
│   └── miniakits_logo_final_white.png
├── deploy/
│   ├── package-lock.json
│   └── package.json
└── site/
    ├── .assetsignore
    ├── 404.html
    ├── _redirects
    ├── _routes.json
    ├── _worker.js
    ├── ados-adultes.html
    ├── anniversaire.html
    ├── ar/
    │   └── index.html
    ├── audio/
    │   ├── chime.m4a
    │   ├── chime.mp3
    │   └── chime.ogg
    ├── blog/
    │   ├── 10-idees-anniversaire-creatif-enfants-maroc.html
    │   ├── activites-creatives-enfants-maison-maroc.html
    │   ├── index.html
    │   ├── organiser-atelier-peinture-ecole.html
    │   └── peindre-figurine-platre-guide.html
    ├── chime-popup.js
    ├── conditions-de-vente.html
    ├── credits.html
    ├── ecoles-evenements.html
    ├── en/
    │   ├── birthday-party.html
    │   ├── credits.html
    │   ├── gift-ideas.html
    │   ├── index.html
    │   ├── kits.html
    │   ├── legal-notice.html
    │   ├── schools-events.html
    │   ├── teens-adults.html
    │   └── terms.html
    ├── favicon-16.png
    ├── favicon-32.png
    ├── favicon.ico
    ├── favicon.svg
    ├── functions/
    │   └── _middleware.js
    ├── i18n.js
    ├── idee-cadeau.html
    ├── img/
    │   ├── apple-touch-icon-m.png
    │   ├── apple-touch-icon.png
    │   ├── cut-kit01.webp
    │   ├── cut-kit05.webp
    │   ├── cut-kit10-sm.webp
    │   ├── cut-kit10.webp
    │   ├── cut-kit13.webp
    │   ├── cut-kit14.webp
    │   ├── cut-kit15.webp
    │   ├── cut-kit16.webp
    │   ├── icon-192.png
    │   ├── icon-512.png
    │   ├── icon-m-192.png
    │   ├── icon-m-512.png
    │   ├── icon-m-maskable-512.png
    │   ├── icon-maskable-512.png
    │   ├── kit00-s.webp
    │   ├── kit00.webp
    │   ├── kit01-s.webp
    │   ├── kit01.webp
    │   ├── kit02-s.webp
    │   ├── kit02.webp
    │   ├── kit03-s.webp
    │   ├── kit03.webp
    │   ├── kit04-s.webp
    │   ├── kit04.webp
    │   ├── kit05-s.webp
    │   ├── kit05.webp
    │   ├── kit06-s.webp
    │   ├── kit06.webp
    │   ├── kit07-s.webp
    │   ├── kit07.webp
    │   ├── kit08-s.webp
    │   ├── kit08.webp
    │   ├── kit09-s.webp
    │   ├── kit09.webp
    │   ├── kit10-s.webp
    │   ├── kit10.webp
    │   ├── kit11-s.webp
    │   ├── kit11.webp
    │   ├── kit12-s.webp
    │   ├── kit12.webp
    │   ├── kit13-s.webp
    │   ├── kit13.webp
    │   ├── kit14-s.webp
    │   ├── kit14.webp
    │   ├── kit15-s.webp
    │   ├── kit15.webp
    │   ├── kit16-s.webp
    │   ├── kit16.webp
    │   ├── kits/
    │   │   └── (42 fichiers .webp)
    │   ├── life/
    │   │   └── (12 fichiers .webp)
    │   ├── logo-mark.svg
    │   ├── logo-miniakits-white.png
    │   ├── logo-miniakits-white.webp
    │   ├── logo-miniakits.png
    │   ├── logo-miniakits.webp
    │   ├── logo.svg
    │   ├── og-miniakits.jpg
    │   ├── og.jpg
    │   ├── poster-HERO.webp
    │   ├── poster-anniversaire.webp
    │   ├── poster-chambre.webp
    │   ├── poster-ecole.webp
    │   ├── promo-novembre-600.webp
    │   ├── promo-novembre.webp
    │   ├── scene-anniversaire.webp
    │   ├── scene-ecole.webp
    │   ├── scene-famille.webp
    │   └── scene-mains.webp
    ├── index.html
    ├── kits.html
    ├── kits.js
    ├── main.js
    ├── manifest.webmanifest
    ├── mentions-legales.html
    ├── politique-de-confidentialite.html
    ├── promo.js
    ├── refinement.css
    ├── reglement-novembre.html
    ├── robots.txt
    ├── sitemap.xml
    ├── style.css
    ├── sw.js
    ├── vid/
    │   ├── HERO.mp4
    │   ├── anniversaire.mp4
    │   ├── chambre.mp4
    │   └── ecole.mp4
    └── wrangler.toml
```

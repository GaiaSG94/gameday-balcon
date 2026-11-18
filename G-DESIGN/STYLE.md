# STYLE — Balcon · Morning light (passe moderne + verdure, V4) — VERROUILLÉ le 2026-11-18

> **Style verrouillé** (`/lock`, Gaia, 2026-11-18). Fin des explorations : toute évolution passe par `/delta` et une nouvelle version datée dans `DESIGN.md`. Référence : `planches/v4/`.

Direction validée le 2026-11-18 : Morning light (V1-01) → scène isométrique (V3/V4) → passe moderne inspirée de BridgeLab (V5) → **fond de verdure luxuriante (V6)**. Planches de référence : `planches/v4/`. Desktop 1440 × 900 uniquement.

## Palette

| Rôle | Nom | Hex | Usage |
|------|-----|-----|-------|
| Fond du jeu | Chalk | `#faf8f5` | Fond de la zone de jeu |
| Surface | White | `#ffffff` | Cartes, étiquettes, boutons secondaires |
| Texte | Ink | `#12161c` | Titres, chiffres |
| Texte secondaire | Slate | `#6b7178` | Légendes, libellés, preuve sociale |
| Filet | Line | `#e7e3da` | Bordures 1 px, jauge vide |
| **Accent unique (UI)** | Pine | `#17594c` | Bouton principal, plante en cours, gain, série, ma barre, « You » |
| Accent clair | Pine light | `#e4efeb` | Halo de sélection, fond de pastille de gain, ligne « You » |
| Pots | Terracotta / d. | `#c46a4a` / `#a9563a` | Les pots uniquement (objet, pas interface) ; texte d'alerte |
| Lumière | Sun | `#f2b84b` | Soleil, heures, floraisons, point de marque |
| Feuillage | Sage / Sage d. | `#8fae96` / `#5f8a72` | Feuillage uniquement |
| Eau | Rain | `#8fb3c6` | Gouttes uniquement |
| Scène | Floor / Wall / Rail | `#f1ece4` / `#ece6dc` / `#2b3138` | Sol, mur, rambarde en métal sombre fin |
| Ombre | Shadow | `rgba(40,35,25,.12)` | Seule ombre : ombres physiques de la scène |

Règle : une seule couleur d'accent d'interface (Pine). Jaune = lumière, vert sauge = feuillage, bleu = eau, terre cuite = pots.

## Fond de verdure (identité, V6)

- La zone de jeu n'est plus beige : ciel vert pâle en dégradé doux (`Mist` `#eaf2e2` → `#d9e9cf`), bordure `#cfe0c4`.
- Derrière le balcon, des feuilles en fer de lance en **6 nuances de vert**, du fond vers l'avant : `#c4dcb6` (buissons lointains), `#93c08c`, `#5c9a6c`, `#2f7352`, `#1d5641`, `#123a2d` (premier plan). Les feuilles foncées ont une nervure blanche à 16 %.
- Composition fixe (graine déterministe) : massif dense en bas, feuilles qui montent le long des bords gauche et droit, quelques feuilles qui pendent en haut au centre-gauche. Le centre-haut reste dégagé pour l'arc du soleil.
- Le panneau d'action (règle, plantes, score, bouton) est une **carte blanche à 96 %** posée sur la verdure : rayon 12, filet blanc, une seule ombre douce `0 14px 34px -20px rgba(12,48,32,.55)`. C'est la seule ombre d'interface autorisée, car elle détache la carte du feuillage.
- Le mot « Balcon » et les étiquettes de l'en-tête sont sur des fonds blancs translucides, pour rester lisibles au-dessus des feuilles.
- Pine reste l'unique accent d'interface : les verts du fond sont du décor, jamais des états.

## Typographie

- Famille : grotesque **Inter** (licence OFL, à embarquer en local dans l'app : CSP Devvit). Repli des planches : Helvetica Neue → Nimbus Sans → Arial.
- Graisses : 400 texte, **500 titres et chiffres**, 600 mot « Balcon ». Pas de 700.
- Interlettrage : −0,02 em titres, −0,03 em grands chiffres, +0,08 em libellés en capitales.
- Chiffres tabulaires partout.
- Échelle (px) : **44** score / **22** titre / **15** bouton / **13** texte / **11** libellé capitales.

## Grille et mise en page

- Le jeu vit dans le post : zone 708 × 560 dans une colonne de feed de 748.
- Deux colonnes : **scène 1.55 fr** (arc + balcon), **colonne d'action 1 fr** (règle, plantes, score, bouton, preuve sociale).
- Marges intérieures 18 px, gouttières 8–12 px, rayon 12 px (zone de jeu), 10 px (cartes), 8 px (boutons), 6 px (étiquettes), 4 px (étiquette « PLACING »). Aucune pilule.
- Hiérarchie à deux niveaux : la scène est grande, tout le reste est petit. Pas de niveau intermédiaire.

## Composants

- **En-tête** : point soleil + « Balcon » (18/600) ; étiquettes à filet, rayon 6 : « Day 23 · Nov 18 » et « 5-day streak » (point + texte Pine).
- **Libellé** : 11 px capitales espacées au-dessus de chaque titre (« Today's rule », « Daily balcony #23 »).
- **Scène (isométrique, validée le 2026-11-18)** : projection isométrique en SVG, caméra fixe (axe x de la rambarde vers la droite et vers le bas, axe y vers la gauche et vers le bas, 1 unité = 52 px). Balcon de 4 × 2 unités : mur et porte à gauche (`Wall` `#ece6dc` / `#e1d9cc`), sol en dalles (`Floor`, joints `#e5ded2`), chants de dalle `#e4ddd1` / `#d8cfc1`. Rambarde au fond en métal sombre fin : barreaux `Rail` 1,3 px, main courante `#3d444c`, face `Rail`, bout `#1b1f24`. 4 emplacements sur la main courante, 4 au sol.
- **Ombres de la scène** : l'ombre des barreaux et de la main courante est projetée au sol dans la direction opposée au soleil (`Shadow`). Elle montre pourquoi le sol est moins ensoleillé, donc elle fait partie de la lecture du jeu.
- **Arc du soleil** : trait fin Slate pointillé (1 px) en perspective, au-dessus et au-delà de la rambarde, avec repères d'heure (9 am, 1 pm, 5 pm). Soleil plein + halo à l'heure du jour.
- **Emplacement vide** : losange blanc en pointillé posé sur la surface (affiné à la largeur de la main courante pour la rambarde), étiquette blanche à filet, rayon 6, au-dessus : point soleil + « 6h », 1 à 3 gouttes.
- Les planches V1/V2 restent comme historique ; la référence est `planches/v3/`.
- **Pot** : en volume (corps terre cuite, flanc droit assombri, bord elliptique foncé, terre visible), ombre au sol orientée selon le soleil ; terre cuite + bord foncé, silhouette de feuillage propre à chaque plante, 3 emplacements de fleur (pleins = jaune cerclé de terre cuite, vides = cercle pointillé).
- **Carte plante** : blanche, filet 1 px, rayon 10 ; icône sur tuile `#f4f1eb` rayon 8 ; nom 13/500 ; besoin (soleil + gouttes). États : libre ; en cours (bord Pine 1,5 px + halo Pine light 3 px + étiquette « PLACING » Pine rayon 4) ; posée (opacité 55 %).
- **Score** : nombre 44/500 serré + « / 18 blooms » + pastille de gain Pine light (« +3 if placed here », rayon 6). Jauge de 18 segments de 6 px : plein = jaune, aperçu = hachuré.
- **Bouton principal** : 44 px, rayon 8, Pine + texte blanc 15/500, sans ombre. Désactivé : `#ebe8e2`, texte `#9aa0a6`, libellé qui dit ce qui manque (« Place 2 more plants »).
- **Bouton secondaire** : 40 px, rayon 8, blanc à filet `Line`, texte Ink 14/500.
- **Preuve sociale** : une ligne 12 px sous le bouton principal, chiffres en gras.

## Mouvement

- Prise d'une plante : bord Pine + halo (120 ms, ease-out), pas de translation.
- Survol d'un emplacement : pot fantôme à 60 % + cadre pointillé Pine + pastille de gain Pine.
- Pose : le pot tombe de 6 px avec un léger rebond (180 ms), puis les fleurs s'ouvrent une à une (80 ms d'écart).
- L'ombre des pots suit la position du soleil ; elle ne bouge pas pendant une partie.
- Aucune animation en boucle. Respecter `prefers-reduced-motion` (on coupe les rebonds et l'éclosion).

## Règles d'états

- Mauvais placement : la fleur manquante reste en cercle pointillé et une alerte courte en terre cuite foncée s'affiche (« Too sunny », « Too dry »).
- Le bouton principal reste désactivé tant que les 6 plantes ne sont pas posées.
- Après validation, la partie du jour est figée : on passe à la carte de fin.
- Aucun emoji, aucun logo tiers, aucun dégradé décoratif.

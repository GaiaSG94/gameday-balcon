# STYLE — Balcon · Morning light

Direction validée par Gaia le 2026-11-18 (V1, planche 01). Planches rendues en **desktop 1440 × 900 uniquement** (le règlement du hackathon n'exige pas le mobile).

## Palette

| Rôle | Nom | Hex | Usage |
|------|-----|-----|-------|
| Fond du jeu | Linen | `#fbf7f0` | Fond de la zone de jeu |
| Surface | Paper | `#fffdf9` | Cartes, pastilles, emplacements vides |
| Texte | Ink | `#2e2622` | Titres, chiffres |
| Texte secondaire | Ink 2 | `#7a6d63` | Légendes, preuve sociale |
| Filet | Line | `#ebe2d5` | Bordures, jauge vide |
| **Accent unique** | Terracotta | `#c46a4a` | Pots, plante en cours, bouton principal, ma barre dans un classement |
| Accent foncé | Terracotta d. | `#a9563a` | Bord des pots, texte d'alerte, survol du bouton |
| Lumière | Sun | `#f2c14e` | Soleil, arc, heures de soleil, floraisons. Jamais décoratif |
| Feuillage | Sage / Sage d. | `#8fa98a` / `#6c8a68` | Feuillage uniquement, et l'état « réussi » |
| Eau | Rain | `#9bb8c7` | Gouttes d'eau uniquement |
| Structure | Rail / Floor | `#8c7666` / `#f1e7d9` | Rambarde et sol du balcon |
| Ombre | Shadow | `rgba(110,70,40,.18)` | Seule ombre autorisée : l'ombre physique des pots |

Règle : une seule couleur d'accent (terre cuite). Le jaune veut toujours dire lumière ou floraison, le vert toujours feuillage, le bleu toujours eau.

## Typographie

- Famille : sans humaniste (Seravek → Gill Sans Nova → Ubuntu → Segoe UI → sans-serif). À embarquer en fichier local dans l'app (CSP Devvit : aucune police distante).
- Chiffres : `font-variant-numeric: tabular-nums` partout.
- Échelle (px) : **40** score / **19** titre et règle / **15** texte / **13** libellés / **11** légendes. Graisses : 400, 600, 700.

## Grille et mise en page

- Le jeu vit dans le post : zone 708 × 560 dans une colonne de feed de 748.
- Deux colonnes : **scène 1.55 fr** (arc + balcon), **colonne d'action 1 fr** (règle, plantes, score, bouton, preuve sociale).
- Marges intérieures 18 px, gouttières 8–12 px, rayon 12–14 px (cartes), 99 px (pastilles, boutons).
- Hiérarchie à deux niveaux : la scène est grande, tout le reste est petit. Pas de niveau intermédiaire.

## Composants

- **En-tête** : mot « Balcon » (20/700) + pastilles « Day 23 · Nov 18 » et « 5-day streak » (terre cuite).
- **Scène** : arc du soleil en pointillé avec repères d'heure, soleil plein + halo, rambarde (4 emplacements) et sol (4 emplacements).
- **Emplacement vide** : carte papier en pointillé, point soleil + « 6h », 1 à 3 gouttes.
- **Pot** : terre cuite + bord foncé, silhouette de feuillage propre à chaque plante, 3 emplacements de fleur (pleins = jaune cerclé de terre cuite, vides = cercle pointillé).
- **Carte plante** : icône du pot, nom, besoin (soleil + gouttes). États : libre, en cours (bord terre cuite 2 px + étiquette « Placing »), posée (bord pointillé, texte atténué).
- **Score** : nombre 40/700 + « / 18 blooms » + pastille de gain (« +3 if placed here »). Jauge de 18 segments : plein = jaune, aperçu = hachuré.
- **Bouton principal** : pilule 46 px, terre cuite + texte blanc. Désactivé : `#eadfd3`, texte `#9b8b7d`, libellé qui dit ce qui manque (« Place 2 more plants »).
- **Bouton secondaire** : pilule contour `Line`, texte Ink.
- **Preuve sociale** : une ligne 12 px sous le bouton principal, chiffres en gras.

## Mouvement

- Prise d'une plante : la carte monte de 2 px (120 ms, ease-out).
- Survol d'un emplacement : pot fantôme à 60 % + cadre pointillé terre cuite + pastille de gain.
- Pose : le pot tombe de 6 px avec un léger rebond (180 ms), puis les fleurs s'ouvrent une à une (80 ms d'écart).
- L'ombre des pots suit la position du soleil ; elle ne bouge pas pendant une partie.
- Aucune animation en boucle. Respecter `prefers-reduced-motion` (on coupe les rebonds et l'éclosion).

## Règles d'états

- Mauvais placement : la fleur manquante reste en cercle pointillé et une alerte courte en terre cuite foncée s'affiche (« Too sunny », « Too dry »).
- Le bouton principal reste désactivé tant que les 6 plantes ne sont pas posées.
- Après validation, la partie du jour est figée : on passe à la carte de fin.
- Aucun emoji, aucun logo tiers, aucun dégradé décoratif.

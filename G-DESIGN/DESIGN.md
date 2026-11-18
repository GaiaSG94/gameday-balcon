# DESIGN — Balcon (journal)

Journal des versions de design. Les versions ne sont jamais écrasées : chaque nouvelle version s'ajoute en dessous.

## V1 — 2026-11-18 · Exploration de la page principale (Jeu)

**Fait**
- Références ouvertes et décodées → `REFS.md` (Concept Studio : hiérarchie à deux niveaux, flat, un seul geste dessiné ; Teko : un arc unique comme horizon, preuve sociale collée à l'action).
- Pages proposées → `PAGES.md` (Post, Jeu, Carte de fin, Séries & classement) + 5 questions produit ouvertes.
- 3 planches de la page Jeu, chacune avec les cadres desktop 1440 × 900 et mobile 390 × 844 dans un post de feed neutre :
  - `planches/v1/01-morning-light.html` — **Morning light** : linge clair, terre cuite en accent unique, vue de face depuis l'intérieur (rambarde + sol), arc du soleil en pointillé, ombres des pots inclinées selon l'heure. Sans humaniste.
  - `planches/v1/02-cyanotype-plan.html` — **Cyanotype plan** : bleu de Prusse façon tirage au soleil, plan d'architecte vu du dessus, sol éclairé selon les heures de soleil, plantes en tableau de plantation. Sans humaniste + mono pour les chiffres. *S'écarte de la direction de départ.*
  - `planches/v1/03-first-light.html` — **First light** : fond sombre chaud à l'aube, dôme lumineux unique (principe Teko), colonnes de lumière aussi hautes que les heures, pots en silhouettes avec ombres longues. Serif humaniste. *S'écarte de la direction de départ.*

**Données de démo communes** (identiques sur les 3 planches pour comparer à état égal)
- Balcon #23 du 18 nov. : 8 emplacements (4 sur la rambarde : 6h/7h/8h/5h, 4 au sol : 3h/2h/2h/4h ; eau 1–3).
- 6 plantes : Lavender 8h·1, Geranium 7h·1, Basil 6h·2, Begonia 3h·2, Mint 4h·3, Fern 2h·3.
- État montré : 4 plantes posées (10/18 floraisons dont Mint « too sunny »), Basil en cours de placement (+3 en aperçu), Begonia restante, bouton désactivé « 2 plants left », preuve sociale « 2,318 balconies · median 13 ».

**Décisions provisoires (à valider)**
- Score affiché en floraisons 0–3 par plante, total /18.
- Une seule règle écrite : « Give each plant the sun it needs. »
- La preuve sociale vit sous le bouton principal, pas dans un écran séparé.

**En attente** : choix de direction par Gaia, réponses aux questions de `PAGES.md`. Ensuite : `STYLE.md` puis planches Post, Carte de fin, Séries & classement.

## V2 — 2026-11-18 · Style validé, déclinaison des 4 pages

**Décisions de Gaia**
- Direction retenue : **01 Morning light**.
- **Desktop seul** : le règlement Devpost n'exige pas le mobile (le « mobile first » venait de notre `IDEES.md`). Règle par défaut pour les planches : desktop uniquement, téléphone seulement si le hackathon le demande. Les planches V1 gardent leur cadre mobile (historique, non modifiées).

**Fait**
- `STYLE.md` : palette avec hex et rôles, échelle typo 40/19/15/13/11, grille de la zone de jeu (708 × 600, scène 1.55 fr / action 1 fr), composants, mouvement, règles d'états.
- Planches desktop 1440 × 900, chacune dans un post de feed neutre (`planches/v2/`) :
  - `01-post.html` — état dans le feed : balcon vide avec heures de soleil, les 6 plantes du jour, bouton « Plant today's balcony », preuve sociale.
  - `02-jeu.html` — la planche V1-01 reprise en desktop seul, avec les libellés d'heures déplacés au-dessus de l'arc (ils chevauchaient les pastilles).
  - `03-carte-de-fin.html` — balcon final 16/18, « more blooms than 81% », série de 6 jours sur la semaine, aperçu du commentaire, « Share in the comments », compte à rebours.
  - `04-series-classement.html` — répartition des scores du jour (ma barre en terre cuite, médiane), meilleurs balcons (floraisons puis temps), mes séries.
- `tools/gen-planches-v2.py` : génère les 4 planches depuis un tronc commun (style, données, dessin des pots). Les HTML restent autonomes, sans build pour les voir.

**Hypothèses de démo à valider** : partage par commentaire avec un texte prérempli ; départage du classement au temps ; « avg blooms » dans les statistiques de série.

**En attente** : revue des 4 planches par Gaia, puis `/lock`.

## V3 — 2026-11-18 · Variante isométrique de la page Jeu (/variantes + /compare)

**Demande de Gaia** : « tu pourrais le faire en 3D ? » → option 1 retenue : isométrique en SVG (pas de WebGL : aucune librairie à embarquer, compatible CSP Devvit, caméra fixe pour garder la lecture en 5 s).

**Fait**
- `planches/v2/02-jeu-iso.html` : même style Morning light, mêmes données et états que `02-jeu.html`. Le balcon devient une petite maquette : mur et porte à gauche, rambarde avec sa main courante, sol en dalles. L'ombre des barreaux et de la main courante est projetée au sol (elle explique pourquoi le sol reçoit moins de soleil), les pots ont du volume et une ombre orientée selon le soleil, l'arc du soleil passe au-dessus du balcon en perspective.
- `planches/v2/compare-jeu-plat-vs-iso.html` : A plat (validé) contre B isométrique, côte à côte.
- Générateur : `isoScene()` ajouté dans `tools/gen-planches-v2.py` ; les autres planches ne changent pas.

**En attente** : choix A ou B par Gaia. Si B : déclinaison iso de Post et Carte de fin (Séries & classement n'a pas de scène), puis mise à jour de `STYLE.md`.

## V4 — 2026-11-18 · Isométrique retenu, déclinaison

**Décision de Gaia** : variante **B isométrique** retenue pour la scène.

**Fait**
- `planches/v2/01-post-iso.html` (balcon vide, 8 emplacements avec heures et eau) et `planches/v2/03-carte-de-fin-iso.html` (balcon final 16/18), générés depuis les mêmes pages que la version plate.
- Emplacements vides de la rambarde affinés à la largeur de la main courante (ils la faisaient paraître rayée) ; s'applique aussi à `02-jeu-iso.html`.
- `STYLE.md` : la scène, ses ombres, l'arc et le pot sont décrits en isométrique ; les planches plates restent comme historique.
- `04-series-classement.html` inchangée (pas de scène).

**Jeu de référence** : `01-post-iso`, `02-jeu-iso`, `03-carte-de-fin-iso`, `04-series-classement`.

**En attente** : revue de Gaia, puis `/lock`.

## V5 — 2026-11-18 · Passe moderne inspirée de BridgeLab

**Demande de Gaia** : au moment du `/lock`, « non, rends ça plus moderne ; inspire-toi du design de BridgeLab ». Le lock est annulé.

**Fait**
- Référence ouverte et décodée → `REFS.md` (bridgelab.io).
- `planches/v3/` : les 4 pages (Post, Jeu, Carte de fin, Séries & classement) en scène isométrique, restylées :
  - accent d'interface unique **Pine** `#17594c` (boutons, sélection, gain, série, « You ») ; la terre cuite ne sert plus qu'aux pots ;
  - typo grotesque (Inter à embarquer) en graisse 500, interlettrage serré ; libellés en capitales espacées au-dessus des titres ;
  - cartes blanches à filet 1 px, zéro ombre d'interface, boutons à angles de 8 px, plus aucune pilule ;
  - scène : rambarde en métal sombre fin, arc du soleil en trait fin gris, étiquettes d'emplacement blanches à filet.
- `STYLE.md` réécrit (palette, typo, composants, états) ; `PAGES.md` pointe vers `planches/v3/`.
- `tools/gen-planches-v3.py` (copie du générateur V2 + passe moderne) ; V1 et V2 non modifiées.

**Note** : la machine de rendu n'a pas Inter ; les planches retombent sur Nimbus Sans (pas de graisse 500, d'où des titres un peu plus légers qu'avec Inter).

**En attente** : revue de Gaia, puis `/lock`.

## V6 — 2026-11-18 · Identité renforcée : fond de verdure luxuriante

**Demande de Gaia** : refus du lock ; « améliore l'identité visuelle, qu'il y ait plus de nuances de vert luxuriant en background, pas juste du beige » (message coupé à la fin, suite à recevoir).

**Fait**
- `planches/v4/` : les 4 pages avec un fond de jungle douce derrière le balcon, 6 nuances de vert du plus clair au plus profond, ciel vert pâle. Le panneau d'action devient une carte blanche posée sur la verdure ; « Balcon » et les étiquettes ont un fond blanc translucide.
- `STYLE.md` : nouvelle section « Fond de verdure », exception d'ombre pour le panneau.
- `tools/gen-planches-v4.py` (V3 + couche de feuillage déterministe `leafBg()`) ; V1 à V3 non modifiées.

**En attente** : la fin du message de Gaia, sa revue, puis `/lock`.

## LOCK — 2026-11-18

`/lock` par Gaia. Style verrouillé sur la V6 : Morning light, scène isométrique, passe moderne (réf. BridgeLab), fond de verdure luxuriante. Les 4 pages sont validées. Référence pour le build : `STYLE.md` + `planches/v4/` (Post, Jeu, Carte de fin, Séries & classement).

Restent ouvertes pour le build (questions produit de `PAGES.md`) : nombre d'emplacements, formule de score, eau fixe ou à répartir, déplacement avant validation, place des séries et du classement.

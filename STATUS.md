# STATUS gameday-balcon
Phase: design-impl (fait)
Etat: design verrouille implemente (ecart planches/produit ferme sur la scene iso) ; restent demo & diffusion, soumission
Round: R1
Maj: 2026-11-20
Hackathon: reddit-gameday-2026 / Best Daily Game
Deadline: 2026-12-09 03:00

Slot projet 16/30 (decision H du 2026-11-16) : idee a produire (lot d'ideation a definir), soumission unique par projet.

Idees validees par H le 2026-11-17 (30/30) : passage en phase build.

## opencode

### 2026-11-20 — 07b implementation du design (PR #14, mergee)

- Design verrouille implemente : **scene isometrique** V4 (projection, mur + porte,
  rambarde + main courante, ombres des barreaux et de la main courante projetees au sol,
  arc du soleil en perspective, pots en volume avec terre visible, apercu Pine « +N »).
  Remplace la scene frontale simplifiee (delta D2 de la verification 04).
- Splash = page **Post** de la planche : grille 1.55 fr / 1 fr, tray « Today's plants »,
  CTA « Plant today's balcony ».
- Carte de fin : compte a rebours au format `HH:MM:SS` de la planche.
- Revue : section « Revue d'implementation » dans `G-DESIGN/DESIGN.md` + captures
  planche | produit 1440x900 dans `G-DESIGN/revue/` (outil `tools/make-review-captures.py`).
- Commits : 4 (scene / splash / carte de fin / revue). PR #14 mergee (rebase), CI verte
  (ci, ci-budget, couche0, test).
- Gates locaux : `test:types` OK, lint 0 erreur (5 warnings react-refresh), tests 10/10,
  build OK, `check-limits.py` 0 probleme.
- Ecarts volontairement listes (soumis a Gaia) : splash sans chiffres de preuve sociale
  ni streak (inline Devvit = pas d'appel API), pas de grille semaine 7 jours (le serveur
  n'historise pas les journees), pas de classement nominatif (choix anti-classement).

## Claude

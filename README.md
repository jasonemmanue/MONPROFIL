# Emmanuel Sakam Fotsing

**Développeur full-stack mobile et web · Abidjan, Côte d'Ivoire**

Je suis ingénieur des travaux en informatique et je poursuis une formation d'analyste statisticien à l'ENSEA d'Abidjan.
Je développe des applications mobiles et web en Flutter, Next.js et FastAPI, je les mets en ligne
et j'y branche le paiement Mobile Money quand le projet en a besoin.

- **Portfolio :** https://portfolio-production-d388.up.railway.app
- **E-mail :** emmanuel.sakam@ensea.edu.ci
- **Téléphone :** +225 01 72 95 71 71
- **CV :** [CV_Emmanuel_Sakam_Fotsing.pdf](site/assets/CV_Emmanuel_Sakam_Fotsing.pdf)

## Projets

| Projet | Période | Ce que fait l'application | Stack |
|---|---|---|---|
| [Prepaxia](https://webapp.prepaxia.com) | Depuis mai 2026 | SaaS de préparation aux concours : cours, concours blancs, assistant IA, paiement Mobile Money et carte | Flutter, Next.js, FastAPI, PostgreSQL, Redis, Firebase, GeniusPay |
| AgriSmart CI | Décembre 2025 | Lauréat du Concours Moov Innovation 2026 (Moov Africa) : diagnostic IA des maladies des plantes, météo, marketplace | Flutter, FastAPI, MongoDB |
| Port Autonome d'Abidjan | Juillet - septembre 2026 | Analyse des temps de traversée portuaires, veille stratégique, génération automatique des rapports de suivi | Next.js, TypeScript, FastAPI, PostgreSQL |
| [Flora Hair](https://www.florahair.online) | Depuis juillet 2026 | Salon de coiffure : vitrine, réservation, acompte Mobile Money, back-office | Next.js, FastAPI, PostgreSQL, GeniusPay |
| [Eslie Sport](https://www.esliesport.com) | Depuis juillet 2026 | Salle de sport : vitrine, réservation, acompte Mobile Money, back-office | Next.js, FastAPI, PostgreSQL, GeniusPay |
| [Chic Résidence Meublée](https://www.chicresidencemeublee.com) | Depuis juillet 2026 | Résidences meublées : vitrine, réservation, acompte Mobile Money, back-office | Next.js, FastAPI, PostgreSQL, GeniusPay |
| [Ruah-Statistics](https://www.ruah-statistics.com) | Depuis juillet 2026 | Cabinet d'études : vitrine, réservation, acompte Mobile Money, back-office | Next.js, FastAPI, PostgreSQL, GeniusPay |

## Compétences

- **Mobile :** Flutter, Dart, Firebase
- **Web :** Next.js, React, TypeScript, Tailwind CSS
- **Back-end :** Python, FastAPI, PostgreSQL, MongoDB, Redis
- **Paiement digital :** GeniusPay, Orange Money, MTN MoMo, Wave, carte bancaire
- **Données et suivi-évaluation :** KoboToolbox, CSPro, Excel / VBA, KPI, tableaux de bord, LaTeX
- **Mise en ligne :** Git, GitHub, Docker, Railway

## Formation

- **2025 - 2028 :** Analyste Statisticien, ENSEA d'Abidjan
- **2022 - 2025 :** Ingénieur des Travaux en Informatique

## Ce dépôt

Le code de mon portfolio. J'ai gardé quelque chose de simple : du HTML, du CSS et du JavaScript, sans framework ni étape de build.
Le site a un thème clair et un thème sombre, et le fond animé s'arrête si le système demande moins d'animations.
En production, le dossier `site/` tourne dans une image Docker BusyBox d'environ 5 Mo, ce qui coûte presque rien sur Railway.

```
site/          page, styles, script, photo, CV et image de partage
Dockerfile     image BusyBox qui sert le dossier site/
httpd.conf     types MIME et page 404
```

Lancer en local :

```bash
python -m http.server 8765 --directory site
```

Déployer sur Railway depuis ce dossier :

```bash
railway up --service portfolio
```

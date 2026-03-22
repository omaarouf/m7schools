---
id: efms-intro
title: Évaluations de Fin de Module
sidebar_label: Introduction
---

> Cette section regroupe les **Évaluations de Fin de Module (EFM)** officielles de l'OFPPT, corrigées et annotées pour t'aider à préparer ton examen dans les meilleures conditions.

---

## Comment fonctionne cette section ?

Chaque EFM disponible ici est une copie fidèle de l'examen original, enrichie de réponses détaillées masquées. La structure est toujours la même :

- **Dossier I** — Partie théorique : questions de cours, définitions, explications de commandes
- **Dossier II** — Partie pratique : scénarios réels avec topologie réseau, configuration de services

Les réponses sont cachées derrière un bouton **"Voir la réponse"** — clique dessus uniquement après avoir essayé de répondre par toi-même.

---

## Comment bien utiliser les EFMs ?

###  Fais l'examen en conditions réelles

Avant de regarder la moindre réponse, essaie de traiter l'examen complet dans le temps imparti indiqué sur la page. Utilise une feuille de brouillon ou un éditeur de texte vide.



###  Compare avec les corrections

Une fois terminé, compare tes réponses question par question. Pour chaque erreur, identifie si c'est :
- Un **oubli de commande** → révise la leçon correspondante
- Une **erreur de syntaxe** → pratique en TP
- Un **manque de compréhension** → relis le cours et le TP associé

###  Refais les points ratés

Ne passe pas à l'EFM suivant avant d'avoir maîtrisé les points faibles de celui-ci. Un point raté à l'entraînement est un point perdu à l'examen.

---

## Ce que l'examinateur attend

Les EFMs OFPPT évaluent deux choses distinctes :

| Dossier | Ce qui est évalué | Erreurs fréquentes |
|---|---|---|
| **Théorique** | Comprendre les concepts, savoir expliquer | Réponses vagues sans exemples concrets |
| **Pratique** | Écrire les bonnes commandes dans le bon ordre | Syntaxe incorrecte, ordre des étapes inversé |

:::warning Les pièges classiques
- Oublier de **vérifier** après chaque configuration (systemctl status, named-checkzone, dhcpd -t...)
- Confondre les commandes **Ubuntu** et **Fedora** — toujours préciser la distribution
- Négliger la **persistance** : démarrer un service sans l'activer au boot (`enable`)
- Ne pas **tester la syntaxe** avant de redémarrer un service
:::

---

## Barème type d'un EFM M203

Les points sont répartis ainsi dans la majorité des variantes :

| Exercice | Thèmes typiques | Points |
|---|---|---|
| Dossier I | Commandes, services, concepts | 10 pts |
| Exercice 1 | DNS + DHCP | 15 — 18 pts |
| Exercice 2 | Service web (Apache) ou Messagerie | 3 — 4 pts |
| Exercice 3 | SSH, SAMBA, ou NFS | 2 — 3 pts |
| **Total** | | **40 pts** |

---

:::info D'autres EFMs arrivent
D'autres variantes et régions seront ajoutées progressivement. Si tu as un EFM original à partager, contacte moi.
:::

---


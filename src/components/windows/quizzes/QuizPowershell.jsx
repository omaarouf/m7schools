import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "La commande `Get-Help` affiche la documentation d'une commande PowerShell ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `Get-Help NomCommande` affiche l'aide detaillee. Avec `-Full` on obtient tous les details incluant les exemples.",
  },
  {
    id: 2, type: "vf",
    question: "`Where-Object` permet de trier les objets par ordre alphabetique ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `Where-Object` filtre les objets selon une condition. C'est `Sort-Object` qui trie.",
  },
  {
    id: 3, type: "vf",
    question: "Le symbole `|` (pipeline) transmet les objets d'une commande a la suivante ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le pipeline `|` passe les objets produits par une commande en entree de la commande suivante.",
  },
  {
    id: 4, type: "vf",
    question: "`Select-Object` modifie les proprietes des objets et les sauvegarde ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `Select-Object` selectionne et affiche des proprietes specifiques mais ne modifie pas les objets.",
  },
  {
    id: 5, type: "vf",
    question: "La variable automatique `$_` represente l'objet courant dans un pipeline PowerShell ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `$_` (ou `$PSItem`) represente l'objet en cours de traitement dans le pipeline, notamment avec `Where-Object` et `ForEach-Object`.",
  },
  {
    id: 6, type: "vf",
    question: "`New-Item -ItemType Directory` cree un nouveau fichier texte ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `-ItemType Directory` cree un dossier. Pour un fichier, il faut utiliser `-ItemType File`.",
  },
  {
    id: 7, type: "vf",
    question: "`Sort-Object -Descending` trie les resultats du plus grand au plus petit ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le parametre `-Descending` inverse l'ordre de tri (decroissant).",
  },
  {
    id: 8, type: "vf",
    question: "`Export-Csv` genere un fichier CSV que l'on peut ouvrir dans Excel ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `Export-Csv` exporte les objets PowerShell au format CSV, lisible par Excel et d'autres outils.",
  },
  {
    id: 9, type: "vf",
    question: "La commande `Set-ExecutionPolicy RemoteSigned` permet d'executer tous les scripts sans restriction ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `RemoteSigned` autorise les scripts locaux non signes et les scripts telecharges s'ils sont signes. `Unrestricted` supprime toutes les restrictions.",
  },
  {
    id: 10, type: "vf",
    question: "`Measure-Object` peut compter, sommer et calculer la moyenne d'une propriete numerique ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `Measure-Object` accepte les parametres `-Count`, `-Sum`, `-Average`, `-Minimum` et `-Maximum`.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande affiche les 5 processus qui consomment le plus de memoire ?",
    options: [
      "Get-Process | Select-Object -First 5",
      "Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5",
      "Get-Process | Where-Object {$_.WorkingSet -gt 5}",
      "Get-Process | Measure-Object WorkingSet -Maximum",
    ],
    correct: 1,
    explanation: "Il faut d'abord trier par WorkingSet decroissant avec `Sort-Object WorkingSet -Descending` puis prendre les 5 premiers avec `Select-Object -First 5`.",
  },
  {
    id: 12, type: "qcm",
    question: "Quel operateur PowerShell verifie l'egalite entre deux valeurs ?",
    options: ["==", "=", "-eq", "-is"],
    correct: 2,
    explanation: "PowerShell utilise `-eq` pour l'egalite (equal). `==` et `=` ne sont pas des operateurs de comparaison en PowerShell.",
  },
  {
    id: 13, type: "qcm",
    question: "Comment afficher uniquement les services en etat `Stopped` ?",
    options: [
      "Get-Service -Status Stopped",
      "Get-Service | Where-Object {$_.Status -eq 'Stopped'}",
      "Get-Service | Select-Object Stopped",
      "Get-Service | Sort-Object Stopped",
    ],
    correct: 1,
    explanation: "`Where-Object {$_.Status -eq 'Stopped'}` filtre les objets service dont la propriete Status vaut 'Stopped'.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle commande compte le nombre total de fichiers dans un dossier ?",
    options: [
      "Get-ChildItem C:\\Dossier | Count",
      "Get-ChildItem C:\\Dossier | Select-Object -Count",
      "Get-ChildItem C:\\Dossier | Measure-Object",
      "Get-ChildItem C:\\Dossier -Count",
    ],
    correct: 2,
    explanation: "`Measure-Object` sans parametre retourne un objet avec la propriete `Count` qui indique le nombre d'elements.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle structure permet de repeter un bloc de code tant qu'une condition est vraie ?",
    options: ["foreach", "for", "while", "if"],
    correct: 2,
    explanation: "`while (condition) { ... }` execute le bloc tant que la condition est vraie. La condition est verifiee avant chaque iteration.",
  },
  {
    id: 16, type: "qcm",
    question: "Comment stocker plusieurs valeurs dans une variable PowerShell ?",
    options: ["$var = (val1, val2)", "$var = [val1, val2]", "$var = @(val1, val2)", "$var = {val1, val2}"],
    correct: 2,
    explanation: "`@(val1, val2)` est la syntaxe d'un tableau en PowerShell. `@()` est l'operateur tableau.",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle commande lit le contenu d'un fichier texte en PowerShell ?",
    options: ["Read-File", "Get-Content", "Open-File", "Import-File"],
    correct: 1,
    explanation: "`Get-Content` lit le contenu d'un fichier. Chaque ligne devient un objet dans le pipeline.",
  },
  {
    id: 18, type: "qcm",
    question: "Comment grouper les services par etat et afficher le nombre dans chaque groupe ?",
    options: [
      "Get-Service | Select-Object Status",
      "Get-Service | Sort-Object Status",
      "Get-Service | Group-Object Status | Select-Object Name, Count",
      "Get-Service | Measure-Object Status",
    ],
    correct: 2,
    explanation: "`Group-Object Status` groupe les services par valeur de Status. `Select-Object Name, Count` affiche le nom du groupe et le nombre d'elements.",
  },
  {
    id: 19, type: "qcm",
    question: "Quel parametre de `Get-ChildItem` recherche recursivement dans les sous-dossiers ?",
    options: ["-All", "-Deep", "-Recurse", "-SubFolders"],
    correct: 2,
    explanation: "`-Recurse` parcourt tous les sous-dossiers de facon recursive.",
  },
  {
    id: 20, type: "qcm",
    question: "Comment redemarrer le service `Spooler` en une seule commande ?",
    options: [
      "Stop-Service Spooler; Start-Service Spooler",
      "Restart-Service -Name Spooler",
      "Reset-Service -Name Spooler",
      "Reload-Service Spooler",
    ],
    correct: 1,
    explanation: "`Restart-Service -Name Spooler` arrete puis redémarre le service en une seule commande.",
  },
];

export default function QuizPowershell() {
  return <QuizEngine questions={questions} title="PowerShell - Commandes de Base" />;
}

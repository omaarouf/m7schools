import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  {
    id: 1,
    type: "qcm",
    question: "Quelle commande initialise un nouveau dépôt Git dans le répertoire courant ?",
    options: ["git start", "git init", "git create", "git new"],
    correct: 1,
    explanation: "`git init` crée un nouveau dépôt Git local dans le répertoire courant.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Quelle commande affiche l'état des fichiers du dépôt ?",
    options: ["git log", "git show", "git status", "git branch"],
    correct: 2,
    explanation: "`git status` indique les fichiers modifiés, indexés et non suivis.",
  },
  {
    id: 3,
    type: "qcm",
    question: "Quelle commande ajoute le fichier `README.md` à la zone d'index avant un commit ?",
    options: ["git commit README.md", "git add README.md", "git push README.md", "git track README.md"],
    correct: 1,
    explanation: "`git add README.md` place les changements du fichier dans la zone d'index pour le prochain commit.",
  },
];

export default function QuizzGitCommandes() {
  return (
    <QuizEngine
      questions={questions}
      title="Quiz Git - Commandes de base"
      courseLink="/cours/DevSecOps/git-01-commandes-de-base"
    />
  );
}

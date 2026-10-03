import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  {
    id: 1,
    type: "qcm",
    question: "Où faut-il stocker les secrets nécessaires à une application conteneurisée ?",
    options: ["Dans le Dockerfile", "Dans une couche de l'image", "Dans un mécanisme de gestion de secrets adapté", "Dans le nom du conteneur"],
    correct: 2,
    explanation: "Les secrets ne doivent pas être intégrés au Dockerfile, à l'image ou au contexte de construction. Utilisez un mécanisme de gestion de secrets adapté à l'environnement.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Pourquoi éviter l'option `--privileged` sans nécessité ?",
    options: ["Elle empêche le conteneur de démarrer", "Elle accorde au conteneur des privilèges très étendus", "Elle désactive le réseau Docker", "Elle rend l'image en lecture seule"],
    correct: 1,
    explanation: "`--privileged` accorde des capacités très larges au conteneur et peut réduire fortement son isolation vis-à-vis de l'hôte.",
  },
  {
    id: 3,
    type: "qcm",
    question: "Quelle pratique réduit les privilèges d'une application dans un conteneur ?",
    options: ["L'exécuter en root", "Utiliser uniquement des ports privilégiés", "L'exécuter avec un utilisateur non privilégié quand c'est possible", "Monter le socket Docker"],
    correct: 2,
    explanation: "Un utilisateur non privilégié et des capacités minimales réduisent l'impact potentiel d'une compromission du processus applicatif.",
  },
];

export default function QuizzDockerSecurite() {
  return (
    <QuizEngine
      questions={questions}
      title="Quiz Docker - Sécurité"
      courseLink="/cours/DevSecOps/docker-07-securite"
    />
  );
}

import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  {
    id: 1,
    type: "qcm",
    question: "Quelle commande crée un réseau Docker nommé app-net ?",
    options: ["docker network create app-net", "docker net add app-net", "docker compose network app-net", "docker run --network-create app-net"],
    correct: 0,
    explanation: "`docker network create` crée un réseau Docker défini par l'utilisateur.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Comment un conteneur peut-il joindre un autre conteneur du même réseau Docker utilisateur ?",
    options: ["Avec le nom du conteneur comme nom d'hôte", "Avec son identifiant d'image", "Uniquement avec une IP publique", "En publiant obligatoirement tous les ports"],
    correct: 0,
    explanation: "Sur un réseau utilisateur, Docker fournit la résolution de noms entre conteneurs connectés au même réseau.",
  },
  {
    id: 3,
    type: "qcm",
    question: "La connexion de conteneurs au même réseau publie-t-elle automatiquement leurs ports sur l'hôte ?",
    options: ["Oui, tous les ports", "Oui, uniquement le port 80", "Non, il faut publier les ports explicitement", "Non, les conteneurs ne peuvent pas communiquer"],
    correct: 2,
    explanation: "La communication interne au réseau n'expose pas automatiquement les ports sur l'hôte ; utilisez `-p` seulement si nécessaire.",
  },
];

export default function QuizzDockerReseaux() {
  return (
    <QuizEngine
      questions={questions}
      title="Quiz Docker - Réseaux"
      courseLink="/cours/DevSecOps/docker-05-reseaux"
    />
  );
}

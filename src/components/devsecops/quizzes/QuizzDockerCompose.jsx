import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  {
    id: 1,
    type: "qcm",
    question: "Quelle commande démarre tous les services d'un projet Compose en arrière-plan ?",
    options: ["docker compose run", "docker compose start -d", "docker compose up -d", "docker-compose build -d"],
    correct: 2,
    explanation: "`docker compose up -d` crée et démarre les services en arrière-plan. `--build` force la reconstruction des images.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Quelle est la différence entre `docker compose stop` et `docker compose down` ?",
    options: [
      "stop arrête les conteneurs sans les supprimer ; down les arrête et les supprime avec le réseau",
      "Aucune, ce sont des alias",
      "stop supprime les volumes ; down les conserve",
      "down ne fonctionne que sur un seul service",
    ],
    correct: 0,
    explanation: "Après `stop`, les conteneurs existent encore et `start` les relance. `down` supprime conteneurs et réseau, mais pas les volumes sauf avec `-v`.",
  },
  {
    id: 3,
    type: "qcm",
    question: "Dans le code Flask, quel hôte utiliser pour joindre un service Compose nommé `db` ?",
    options: ["localhost", "127.0.0.1", "L'IP de la VM", "db"],
    correct: 3,
    explanation: "Compose crée un réseau où les services se joignent par leur nom. `localhost` désignerait le conteneur Flask lui-même.",
  },
  {
    id: 4,
    type: "qcm",
    question: "Comment faire attendre à Flask que MySQL soit réellement prêt avant de démarrer ?",
    options: [
      "Ajouter depends_on: [db] seulement",
      "Ajouter un healthcheck à db et depends_on avec condition: service_healthy",
      "Utiliser restart: always",
      "Publier le port 3306",
    ],
    correct: 1,
    explanation: "`depends_on` seul n'assure que l'ordre de démarrage. Avec `condition: service_healthy`, Flask attend que le `healthcheck` de MySQL réussisse.",
  },
  {
    id: 5,
    type: "qcm",
    question: "Que faut-il faire du fichier `.env` contenant les mots de passe ?",
    options: [
      "Le publier sur Git pour le partager avec l'équipe",
      "L'ajouter au .gitignore pour ne jamais le publier",
      "Le copier dans l'image avec COPY",
      "Le renommer en compose.yaml",
    ],
    correct: 1,
    explanation: "Compose lit `.env` automatiquement pour remplacer `${VARIABLE}`. Ce fichier contient des secrets : il ne doit jamais être versionné.",
  },
  {
    id: 6,
    type: "qcm",
    question: "Quelle règle s'applique à l'indentation d'un fichier YAML Compose ?",
    options: [
      "Des tabulations uniquement",
      "Des espaces uniquement, jamais de tabulations",
      "Peu importe, tabulations ou espaces",
      "Une indentation de 8 espaces obligatoire",
    ],
    correct: 1,
    explanation: "Les tabulations provoquent des erreurs du type `mapping values are not allowed here`. Validez avec `docker compose config`.",
  },
  {
    id: 7,
    type: "qcm",
    question: "À quoi sert `docker compose config` ?",
    options: [
      "À configurer le démarrage automatique de Docker",
      "À créer un fichier compose.yaml vide",
      "À valider le YAML et afficher la configuration finale (variables substituées)",
      "À supprimer la configuration du projet",
    ],
    correct: 2,
    explanation: "La commande détecte les erreurs de syntaxe et montre le résultat de la substitution de `${VAR}`, ce qui la rend utile avant un `up`.",
  },
  {
    id: 8,
    type: "qcm",
    question: "Un service `proxy` est sur le réseau `front`, `app` sur `front` et `back`, `db` sur `back`. Quel service le proxy peut-il joindre ?",
    options: [
      "db uniquement",
      "app et db",
      "Aucun service",
      "app uniquement",
    ],
    correct: 3,
    explanation: "Deux services ne communiquent que s'ils partagent un réseau. `proxy` et `app` partagent `front`, mais `db` n'est que sur `back` : la base reste isolée.",
  },
];

export default function QuizzDockerCompose() {
  return (
    <QuizEngine
      questions={questions}
      title="Quiz Docker - Compose"
      courseLink="/cours/DevSecOps/docker-06-compose"
    />
  );
}

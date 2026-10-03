import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  {
    id: 1,
    type: "qcm",
    question: "Comment distingue-t-on un volume nommé d'un bind mount dans l'option `-v` ?",
    options: [
      "Un volume nommé commence par /, un bind mount non",
      "La source d'un volume est un nom simple, celle d'un bind mount est un chemin",
      "Il n'y a aucune différence",
      "Un bind mount se déclare uniquement avec --mount",
    ],
    correct: 1,
    explanation: "`-v donnees:/data` désigne un volume géré par Docker. `-v $(pwd):/data` ou `-v ~/site:/data` désigne un dossier de l'hôte (bind mount).",
  },
  {
    id: 2,
    type: "qcm",
    question: "Quel dossier du conteneur faut-il relier à un volume pour persister les données d'une base MySQL ?",
    options: ["/etc/mysql", "/var/lib/mysql", "/usr/share/mysql", "/tmp"],
    correct: 1,
    explanation: "MySQL stocke ses données dans `/var/lib/mysql`. Avec `-v mysql_data:/var/lib/mysql`, la base survit à la suppression du conteneur.",
  },
  {
    id: 3,
    type: "qcm",
    question: "Que devient un volume nommé après `docker rm -f` du conteneur qui l'utilisait ?",
    options: [
      "Il est supprimé avec le conteneur",
      "Il est vidé mais conservé",
      "Il est conservé avec ses données",
      "Il est converti en bind mount",
    ],
    correct: 2,
    explanation: "Un conteneur et ses volumes ont des cycles de vie indépendants. Le volume doit être supprimé explicitement avec `docker volume rm`.",
  },
  {
    id: 4,
    type: "qcm",
    question: "Que signifie `:ro` dans `-v ~/site:/usr/share/nginx/html:ro` ?",
    options: [
      "Le dossier est monté en lecture seule dans le conteneur",
      "Le dossier est supprimé à l'arrêt",
      "Le conteneur s'exécute en root",
      "Le dossier est monté en mémoire (tmpfs)",
    ],
    correct: 0,
    explanation: "`ro` (read-only) empêche le conteneur de modifier les fichiers montés. C'est plus sûr pour un site statique.",
  },
  {
    id: 5,
    type: "qcm",
    question: "Quelle est la différence entre `docker compose down` et `docker compose down -v` ?",
    options: [
      "Aucune, -v augmente seulement la verbosité",
      "-v supprime aussi les images",
      "-v arrête les conteneurs plus vite",
      "-v supprime aussi les volumes du projet, donc les données",
    ],
    correct: 3,
    explanation: "`down` conserve les volumes. `down -v` les supprime : une base de données déclarée avec un volume est alors perdue.",
  },
  {
    id: 6,
    type: "qcm",
    question: "Que supprime `docker volume prune` ?",
    options: [
      "Tous les volumes, même utilisés",
      "Les volumes qui ne sont rattachés à aucun conteneur",
      "Uniquement les volumes vides",
      "Les volumes des conteneurs arrêtés uniquement",
    ],
    correct: 1,
    explanation: "Un volume n'est « utilisé » que s'il est rattaché à un conteneur, même arrêté. Si vous avez supprimé le conteneur de votre base, son volume sera effacé : examinez `docker volume ls` avant.",
  },
  {
    id: 7,
    type: "qcm",
    question: "Que se passe-t-il avec `--mount type=bind` si le dossier source n'existe pas ?",
    options: [
      "Docker le crée automatiquement",
      "Docker crée un volume nommé à la place",
      "Docker renvoie une erreur",
      "Le conteneur démarre sans montage",
    ],
    correct: 2,
    explanation: "`--mount` est plus explicite et signale l'erreur. Avec `-v`, Docker crée le dossier source (en root), ce qui cause souvent des problèmes de droits.",
  },
  {
    id: 8,
    type: "qcm",
    question: "Dans `docker run nginx -v /data:/data`, pourquoi le montage n'est-il pas appliqué ?",
    options: [
      "Le chemin /data est interdit",
      "Il faut utiliser --mount à la place de -v",
      "Tout ce qui suit le nom de l'image est transmis au conteneur, pas à Docker",
      "Nginx ne supporte pas les volumes",
    ],
    correct: 2,
    explanation: "Les options `-v` et `--mount` se placent avant l'image : `docker run -v /data:/data nginx`.",
  },
];

export default function QuizzDockerVolumes() {
  return (
    <QuizEngine
      questions={questions}
      title="Quiz Docker - Volumes"
      courseLink="/cours/DevSecOps/docker-04-volumes"
    />
  );
}

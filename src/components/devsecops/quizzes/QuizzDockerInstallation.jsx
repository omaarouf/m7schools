import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  {
    id: 1,
    type: "qcm",
    question: "Quelle commande liste les conteneurs en cours d'exécution ?",
    options: ["docker image ls", "docker ps", "docker volume ls", "docker network ls"],
    correct: 1,
    explanation: "`docker ps` liste les conteneurs actifs ; `docker ps -a` inclut aussi ceux qui sont arrêtés.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Quelle commande affiche les journaux du conteneur nommé web ?",
    options: ["docker history web", "docker logs web", "docker inspect --logs web", "docker ps web"],
    correct: 1,
    explanation: "`docker logs web` affiche la sortie standard et la sortie d'erreur du conteneur.",
  },
  {
    id: 3,
    type: "qcm",
    question: "Quelle commande arrête proprement un conteneur nommé web ?",
    options: ["docker pause web", "docker stop web", "docker rm web", "docker image stop web"],
    correct: 1,
    explanation: "`docker stop web` demande au processus principal du conteneur de s'arrêter proprement.",
  },
  {
    id: 4,
    type: "qcm",
    question: "Quelle commande ouvre un shell interactif sh dans le conteneur actif web ?",
    options: ["docker exec -it web sh", "docker run web sh", "docker start -it web", "docker logs -it web"],
    correct: 0,
    explanation: "`docker exec -it` exécute une commande dans un conteneur actif et ouvre un terminal interactif.",
  },
  {
    id: 5,
    type: "qcm",
    question: "Dans `docker run -p 127.0.0.1:8080:80 nginx:alpine`, quel port est publié sur l'hôte ?",
    options: ["Le port 80", "Le port 8080", "Les ports 80 et 8080 sur toutes les interfaces", "Aucun port"],
    correct: 1,
    explanation: "Le format est `adresse:port_hôte:port_conteneur` : le port 8080 local est relié au port 80 du conteneur.",
  },
  {
    id: 6,
    type: "qcm",
    question: "Quelle commande liste tous les conteneurs, y compris ceux qui sont arrêtés ?",
    options: ["docker ps -q", "docker images -a", "docker ps -a", "docker container top"],
    correct: 2,
    explanation: "L'option `-a` (all) de `docker ps` ajoute les conteneurs arrêtés. `-q` n'affiche que les identifiants.",
  },
  {
    id: 7,
    type: "qcm",
    question: "Quelle commande supprime de force tous les conteneurs ?",
    options: [
      "docker rm -f $(docker ps -a)",
      "docker rm -f $(docker ps -aq)",
      "docker rm all",
      "docker stop --all",
    ],
    correct: 1,
    explanation: "`docker ps -aq` renvoie uniquement les identifiants (`-q`). Sans `-q`, `docker ps -a` renvoie un tableau avec ses en-têtes, inutilisable comme liste d'identifiants.",
  },
  {
    id: 8,
    type: "qcm",
    question: "Dans `docker run -d --name nginx nginx -v /data`, pourquoi l'option `-v` ne monte-t-elle pas de volume ?",
    options: [
      "Docker ignore les options placées après -d",
      "Il faut écrire -v avant -p",
      "Le conteneur est arrêté",
      "Ce qui suit le nom de l'image est transmis au conteneur et non à Docker",
    ],
    correct: 3,
    explanation: "La syntaxe est `docker run [OPTIONS] IMAGE [COMMANDE]`. Les options Docker (`-v`, `-p`, `-e`, `--name`) se placent avant l'image.",
  },
  {
    id: 9,
    type: "qcm",
    question: "Quelle option du client `mysql` exécute une requête passée en argument ?",
    options: ["-c", "-q", "-e", "-r"],
    correct: 2,
    explanation: "`mysql -u root -ppassword -e \"SELECT * FROM devSecOps.emp;\"` exécute la requête. Le mot de passe s'écrit sans espace après `-p`.",
  },
  {
    id: 10,
    type: "qcm",
    question: "Pourquoi `http://172.17.0.2:8080` ne fonctionne-t-il pas depuis le PC ?",
    options: [
      "C'est l'IP interne du conteneur : il faut l'IP de la machine et le port publié",
      "Le port 8080 est réservé par Docker",
      "Nginx n'accepte pas le protocole HTTP",
      "Il faut utiliser HTTPS",
    ],
    correct: 0,
    explanation: "`172.17.x.x` est le réseau interne de Docker. On ouvre `http://IP_MACHINE:PORT_PUBLIÉ`, l'IP s'obtenant avec `hostname -I`.",
  },
];

export default function QuizzDockerInstallation() {
  return (
    <QuizEngine
      questions={questions}
      title="Quiz Docker - Installation"
      courseLink="/cours/DevSecOps/docker-01-installation"
    />
  );
}

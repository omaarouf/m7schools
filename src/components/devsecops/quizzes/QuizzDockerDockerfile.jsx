import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  {
    id: 1,
    type: "qcm",
    question: "Pourquoi copie-t-on `requirements.txt` et installe-t-on les dépendances avant de copier le reste du code ?",
    options: [
      "Parce que Docker l'exige",
      "Pour que pip fonctionne en root",
      "Pour profiter du cache : si seul le code change, l'installation n'est pas refaite",
      "Pour réduire la taille du fichier requirements.txt",
    ],
    correct: 2,
    explanation: "Chaque instruction crée une couche mise en cache. Si `requirements.txt` ne change pas, la couche `pip install` est réutilisée.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Quelle est la différence entre `RUN` et `CMD` ?",
    options: [
      "RUN s'exécute au démarrage du conteneur, CMD pendant la construction",
      "RUN s'exécute pendant la construction de l'image, CMD au démarrage du conteneur",
      "Il n'y a aucune différence",
      "CMD ne peut contenir qu'une seule commande, RUN plusieurs",
    ],
    correct: 1,
    explanation: "`RUN` est exécuté une fois au build (ex. installer des paquets). `CMD` définit la commande par défaut à chaque démarrage.",
  },
  {
    id: 3,
    type: "qcm",
    question: "Dans quel cas utilise-t-on `ADD` plutôt que `COPY` ?",
    options: [
      "Pour copier un fichier .zip",
      "Pour copier depuis une étape précédente avec --from",
      "Pour extraire automatiquement une archive .tar.gz locale dans l'image",
      "Pour télécharger un fichier en toute sécurité",
    ],
    correct: 2,
    explanation: "`ADD` extrait les archives tar locales. Il n'extrait pas les .zip, et son téléchargement via URL est déconseillé (pas de vérification d'intégrité). Par défaut, utilisez `COPY`.",
  },
  {
    id: 4,
    type: "qcm",
    question: "Quelle instruction définit la commande fixe d'un conteneur, qui n'est pas remplacée par les arguments de `docker run` ?",
    options: ["CMD", "RUN", "ENTRYPOINT", "LABEL"],
    correct: 2,
    explanation: "Avec `ENTRYPOINT`, ce qui suit le nom de l'image est ajouté comme arguments. Seule l'option `--entrypoint` permet de le remplacer.",
  },
  {
    id: 5,
    type: "qcm",
    question: "Avec `ENTRYPOINT [\"ping\"]` et `CMD [\"localhost\"]`, que lance `docker run --rm monping 8.8.8.8` ?",
    options: ["ping localhost", "ping localhost 8.8.8.8", "8.8.8.8", "ping 8.8.8.8"],
    correct: 3,
    explanation: "L'argument `8.8.8.8` remplace le `CMD` (`localhost`) et s'ajoute à l'`ENTRYPOINT` : la commande finale est `ping 8.8.8.8`.",
  },
  {
    id: 6,
    type: "qcm",
    question: "Avec seulement `CMD [\"ping\", \"localhost\"]` (sans ENTRYPOINT), que se passe-t-il avec `docker run monping 8.8.8.8` ?",
    options: [
      "Docker exécute ping 8.8.8.8",
      "Docker tente d'exécuter 8.8.8.8 comme programme et échoue",
      "Docker ignore l'argument",
      "Docker lance ping localhost 8.8.8.8",
    ],
    correct: 1,
    explanation: "Sans `ENTRYPOINT`, ce qu'on écrit après l'image remplace toute la commande `CMD`. Il faudrait écrire `docker run monping ping 8.8.8.8`.",
  },
  {
    id: 7,
    type: "qcm",
    question: "À quoi sert l'instruction `LABEL` ?",
    options: [
      "À définir une variable d'environnement accessible dans le conteneur",
      "À publier un port",
      "À ajouter des métadonnées à l'image (auteur, version, source)",
      "À nommer le conteneur au démarrage",
    ],
    correct: 2,
    explanation: "`LABEL` ajoute des paires clé=valeur utiles à la documentation, à la traçabilité et au filtrage. Pour une variable utilisable dans le conteneur, on utilise `ENV`.",
  },
  {
    id: 8,
    type: "qcm",
    question: "Quel code de retour d'un `HEALTHCHECK` indique que le conteneur est sain ?",
    options: ["0", "1", "2", "Un code HTTP 200"],
    correct: 0,
    explanation: "Code `0` : sain (`healthy`). Code `1` : défaillant. Après `--retries` échecs consécutifs, l'état devient `unhealthy`.",
  },
  {
    id: 9,
    type: "qcm",
    question: "Que fait `COPY --from=build /app/dist /usr/share/nginx/html` dans un build multi-étapes ?",
    options: [
      "Il copie des fichiers de l'hôte vers l'image",
      "Il copie des fichiers de l'étape nommée build vers l'image finale",
      "Il télécharge le dossier dist depuis Internet",
      "Il supprime l'étape build",
    ],
    correct: 1,
    explanation: "On compile dans une première étape lourde, puis on ne copie que le résultat dans l'image finale. L'image obtenue est plus petite et expose moins de paquets.",
  },
  {
    id: 10,
    type: "qcm",
    question: "Pourquoi faut-il écrire `app.run(host=\"0.0.0.0\")` pour une application Flask dans un conteneur ?",
    options: [
      "Avec 127.0.0.1, Flask n'écoute qu'à l'intérieur du conteneur et reste inaccessible de l'extérieur",
      "Pour activer le mode production",
      "Pour que Flask utilise Gunicorn",
      "Pour publier automatiquement le port 5000",
    ],
    correct: 0,
    explanation: "`0.0.0.0` fait écouter Flask sur toutes les interfaces du conteneur. Il faut ensuite publier le port avec `-p 5000:5000`.",
  },
];

export default function QuizzDockerDockerfile() {
  return (
    <QuizEngine
      questions={questions}
      title="Quiz Docker - Dockerfile"
      courseLink="/cours/DevSecOps/docker-03-dockerfile"
    />
  );
}

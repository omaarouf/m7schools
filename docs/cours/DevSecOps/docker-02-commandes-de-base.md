---
id: docker-02-commandes-de-base
title: Docker - Commandes de base
sidebar_label: 2. Commandes de base
---

# Commandes de base Docker

## Objectifs

À la fin de cette leçon, vous saurez télécharger une image, lancer et administrer un conteneur, entrer dedans pour diagnostiquer un problème, gérer volumes et réseaux, puis nettoyer votre environnement.

## Télécharger et examiner une image

Une image est composée de couches réutilisables. On peut la télécharger depuis un registre, puis l'utiliser pour créer un ou plusieurs conteneurs.

```bash
# Télécharger l'image Nginx
docker pull nginx:alpine

# Lister les images locales
docker image ls

# Examiner les métadonnées de l'image
docker image inspect nginx:alpine
```

Le tag `alpine` indique ici une variante de l'image. Un tag facilite l'identification d'une version, mais ne garantit pas à lui seul que le contenu restera immuable.

Autres commandes utiles sur les images :

| Commande | Rôle |
|---|---|
| `docker images` | Liste les images locales (équivalent de `docker image ls`) |
| `docker search nginx` | Cherche une image sur Docker Hub |
| `docker rmi nginx:alpine` | Supprime une image locale |
| `docker tag monapp:1.0 user/monapp:1.0` | Ajoute un nom (tag) à une image |
| `docker push user/monapp:1.0` | Envoie l'image vers un registre |
| `docker build -t monapp:1.0 .` | Construit une image depuis un Dockerfile |

## Lancer un conteneur

```bash
docker run --name site-test -d -p 8080:80 nginx:alpine
```

- `--name` donne un nom au conteneur.
- `-d` le lance en arrière-plan.
- `-p 8080:80` publie le port 80 du conteneur sur le port 8080 de la machine.

Ouvrez `http://localhost:8080` dans un navigateur, puis inspectez son état :

```bash
docker ps
docker logs site-test
docker inspect site-test
```

### Les options de `docker run` à connaître

| Option | Signification |
|---|---|
| `-d` | Lance en arrière-plan (detached) |
| `-it` | Mode interactif avec un terminal |
| `-p hôte:conteneur` | Publie un port |
| `-v source:destination` | Monte un volume ou un dossier local |
| `-e VAR=valeur` | Définit une variable d'environnement |
| `--name` | Donne un nom au conteneur |
| `--rm` | Supprime le conteneur à son arrêt |
| `--restart always` | Redémarre automatiquement le conteneur |
| `--network` | Connecte le conteneur à un réseau |

Exemples :

```bash
# Conteneur jetable : exécute une commande puis se supprime
docker run --rm alpine echo "bonjour"

# Terminal interactif dans une image Ubuntu
docker run -it ubuntu bash

# Servir un dossier local avec Nginx (lecture seule)
docker run -d --name nginx -p 8080:80 -v ~/site:/usr/share/nginx/html:ro nginx
```

:::warning L'ordre compte

La syntaxe est `docker run [OPTIONS] IMAGE [COMMANDE]`. Tout ce qui est écrit **après le nom de l'image** est transmis au conteneur, pas à Docker. Ainsi `docker run -d --name nginx nginx -v /data` envoie `-v /data` à Nginx. Placez toujours `-d`, `-p`, `-v`, `-e` et `--name` **avant** l'image.

:::

## Lister les conteneurs

```bash
docker ps          # conteneurs en cours d'exécution
docker ps -a       # tous les conteneurs, y compris arrêtés
docker ps -q       # seulement les identifiants
docker ps -aq      # identifiants de tous les conteneurs
```

## Administrer et supprimer le conteneur

```bash
# Arrêter et redémarrer
docker stop site-test
docker start site-test
docker restart site-test

# Exécuter une commande dans un conteneur actif
docker exec site-test nginx -v

# Arrêter puis supprimer le conteneur
docker stop site-test
docker rm site-test

# Forcer la suppression d'un conteneur actif
docker rm -f site-test
```

Supprimer un conteneur ne supprime pas automatiquement l'image utilisée pour le créer. Ne supprimez une image qu'après avoir vérifié qu'aucun autre conteneur ou projet n'en dépend.

### Supprimer plusieurs conteneurs à la fois

```bash
docker rm -f $(docker ps -aq)
```

`$(...)` insère le résultat de `docker ps -aq`, c'est-à-dire la liste des identifiants. L'option `-q` est indispensable : sans elle, `docker ps -a` renvoie un tableau avec ses en-têtes, qui n'est pas utilisable comme liste d'identifiants. Cette commande supprime **tous** les conteneurs : réservez-la à un lab.

:::note Guillemets et backticks

Dans le shell, les backticks `` ` `` exécutent une commande (substitution), comme `$(...)`. Ce ne sont pas des guillemets. Pour passer du texte à une commande, utilisez `"..."` ou `'...'`.

:::

## Entrer dans un conteneur et diagnostiquer

```bash
docker exec -it site-test sh       # ouvre un shell interactif
docker exec site-test ls /etc      # exécute une commande sans entrer
docker logs site-test              # affiche les journaux
docker logs -f site-test           # suit les journaux en temps réel
docker inspect site-test           # configuration complète (JSON)
docker stats                       # consommation CPU et mémoire en direct
docker top site-test               # processus du conteneur
docker cp fichier.txt site-test:/tmp   # copie un fichier de l'hôte vers le conteneur
```

Les options de `docker exec` :

| Option | Effet |
|---|---|
| `-i` | Garde l'entrée standard ouverte |
| `-t` | Alloue un terminal |
| `-d` | Exécute en arrière-plan (inutile pour un shell) |

Pour ouvrir un shell, il faut **`-it`**. L'argument `nginx` désigne le **nom ou l'identifiant du conteneur**, pas l'image. Le programme à lancer s'écrit sans slash : `bash`, et non `/bash`.

```bash
docker exec -it nginx bash    # image Debian/Ubuntu (Nginx standard)
docker exec -it site-test sh  # image Alpine, qui n'a pas bash
```

Pour sortir du shell, tapez `exit` : le conteneur continue de tourner.

### Extraire une information précise avec `inspect`

```bash
docker inspect -f '{{.State.Status}}' site-test
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' site-test
docker inspect -f '{{json .Mounts}}' site-test
```

### Exécuter une requête dans un conteneur MySQL

```bash
docker exec -it mysql mysql -u root -ppassword -e "SELECT * FROM devSecOps.emp;"
```

- `-e` exécute la requête (et non `-c`).
- `-ppassword` s'écrit **sans espace** entre `-p` et le mot de passe.
- La requête SQL doit être complète, avec `FROM`.

## Accéder à l'application depuis le PC

```bash
hostname -I
```

Cette commande, lancée sur la machine qui héberge Docker, affiche son adresse IP. Utilisez **cette IP avec le port publié** :

```text
http://IP_DE_LA_MACHINE:8080
```

| Adresse | Utilisable depuis le PC ? | Pourquoi |
|---|---|---|
| `http://IP_MACHINE:8080` | Oui | Port publié avec `-p 8080:80` |
| `http://172.17.0.2:8080` | Non | IP interne du conteneur, et Nginx écoute sur le port 80 |

Les images minimales (Nginx, Alpine) ne contiennent pas toujours `ip`, `ifconfig` ou `ping`. Pour obtenir l'IP d'un conteneur sans rien installer, utilisez `docker inspect` depuis la machine hôte.

## Volumes et réseaux

### Volumes : conserver les données

Un conteneur supprimé perd ses données, sauf si elles sont stockées dans un volume.

```bash
docker volume create data
docker volume ls
docker run -d --name db -e MYSQL_ROOT_PASSWORD=password -v data:/var/lib/mysql mysql:8
docker volume inspect data
```

| Type | Syntaxe | Usage |
|---|---|---|
| Volume nommé | `-v data:/var/lib/mysql` | Données gérées par Docker (bases de données) |
| Bind mount | `-v $(pwd):/app` | Dossier local monté dans le conteneur (développement) |
| Lecture seule | `-v ~/site:/usr/share/nginx/html:ro` | Le conteneur ne peut pas modifier les fichiers |

### Réseaux : faire communiquer des conteneurs

Sur un réseau créé par l'utilisateur, les conteneurs se joignent par leur **nom**.

```bash
docker network create mon-reseau
docker run -d --name db --network mon-reseau -e MYSQL_ROOT_PASSWORD=password mysql:8
docker run -d --name app --network mon-reseau nginx
docker network ls
docker network inspect mon-reseau
```

Depuis `app`, la base est joignable à l'adresse `db`.

## Nettoyer l'environnement

Avant de nettoyer, mesurez l'espace utilisé :

```bash
docker system df
```

| Commande | Ce qui est supprimé |
|---|---|
| `docker container prune` | Conteneurs arrêtés |
| `docker image prune` | Images sans tag (dangling) |
| `docker volume prune` | Volumes non utilisés |
| `docker network prune` | Réseaux non utilisés |
| `docker system prune` | Conteneurs arrêtés, réseaux inutilisés, images dangling, cache de build |
| `docker system prune -a` | Idem, plus **toutes** les images non utilisées |
| `docker system prune --volumes` | Idem, plus les volumes non utilisés (**données perdues**) |

Le nom exact est `prune`. Par défaut, `docker system prune` ne touche ni aux volumes ni aux conteneurs en cours d'exécution. Vérifiez avec `docker ps -a` et `docker volume ls` avant d'ajouter `-a` ou `--volumes`.

:::warning

Ne publiez pas un port sur une interface accessible au réseau sans vérifier les règles de pare-feu et les besoins d'accès. Pour un service de test local, limitez l'écoute à la machine avec `-p 127.0.0.1:8080:80`.

:::

## Erreurs fréquentes

| Erreur ou commande | Problème | Correction |
|---|---|---|
| `docker run ... nginx -v /data` | Option placée après l'image | Placer les options **avant** l'image |
| `docker exec -d nginx /bash` | `-d` n'ouvre pas de terminal, et `/bash` n'existe pas | `docker exec -it nginx bash` |
| `docker rm -f \`docker ps -a\`` | `ps -a` renvoie un tableau | `docker rm -f $(docker ps -aq)` |
| `mysql -c "select * devSecOps.emp"` | `-c` n'exécute pas de requête, et `FROM` manque | `mysql -e "SELECT * FROM devSecOps.emp;"` |
| `No such container` | Mauvais nom de conteneur | `docker ps -a` pour vérifier le nom |
| `container is not running` | Conteneur arrêté | `docker start nom` |
| `executable file not found: bash` | Image sans bash (Alpine) | `docker exec -it nom sh` |
| `Conflict. The container name is already in use` | Nom déjà pris | `docker rm -f nom` |
| `port is already allocated` | Port déjà utilisé sur la machine | Changer le port de gauche : `-p 8081:80` |
| `docker system prun` | Faute de frappe | `docker system prune` |

## Workflow type

```bash
docker pull nginx:alpine
docker run -d --name web -p 8080:80 nginx:alpine
docker ps
docker logs web
docker exec -it web sh
docker stop web
docker rm web
```

## À retenir

- `docker run` crée et lance un conteneur à partir d'une image ; les options se placent **avant** l'image.
- `docker ps`, `docker logs` et `docker inspect` aident à diagnostiquer son état.
- Un conteneur arrêté peut être redémarré ; il peut aussi être supprimé indépendamment de son image.
- `-it` ouvre un shell avec `docker exec` ; `-d` lance en arrière-plan.
- `docker ps -aq` donne la liste des identifiants, utile avec `$(...)`.
- Pour joindre une application depuis le PC, utilisez l'IP de la machine et le port publié, jamais l'IP interne du conteneur.
- Un volume conserve les données ; un réseau créé par l'utilisateur permet de joindre un conteneur par son nom.
- Mesurez avec `docker system df` avant de nettoyer, et méfiez-vous de `-a` et `--volumes`.
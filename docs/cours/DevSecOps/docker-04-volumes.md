---
id: docker-04-volumes
title: Docker - Volumes et données
sidebar_label: 4. Volumes
---

# Persister les données avec les volumes

Par défaut, les fichiers écrits dans la couche modifiable d'un conteneur sont liés à son cycle de vie : si le conteneur est supprimé, ses données disparaissent. Pour conserver ou partager des données, Docker propose notamment les volumes et les montages de répertoire (*bind mounts*).

## Objectifs

À la fin de cette leçon, vous saurez choisir entre un volume nommé et un bind mount, persister les données d'une base MySQL, monter un dossier en lecture seule, utiliser les volumes avec Docker Compose et supprimer des volumes sans perdre de données par erreur.

## Les trois types de stockage

| Type | Syntaxe | Géré par | Usage typique |
|---|---|---|---|
| **Volume nommé** | `-v donnees:/chemin` | Docker | Bases de données, données à conserver |
| **Bind mount** | `-v $(pwd):/chemin` | Vous (chemin de l'hôte) | Développement, servir un site local |
| **tmpfs** | `--tmpfs /chemin` | Mémoire de l'hôte | Données temporaires, jamais écrites sur disque |

La différence se voit à la **source** : un nom simple (`donnees`) désigne un volume, un chemin (`/home/omar/site`, `./site`, `$(pwd)`) désigne un bind mount.

## Volumes nommés

Un volume est géré par Docker et peut être réutilisé par plusieurs conteneurs :

```bash
# Créer un volume
docker volume create donnees-demo

# Lister les volumes
docker volume ls

# L'utiliser dans un conteneur temporaire
docker run --rm -v donnees-demo:/data alpine sh -c "echo 'donnee persistante' > /data/message.txt"

# Lire le fichier depuis un autre conteneur
docker run --rm -v donnees-demo:/data alpine cat /data/message.txt

# Inspecter le volume
docker volume inspect donnees-demo
```

Le volume `donnees-demo` reste disponible après la suppression des conteneurs. L'option `--rm` supprime le conteneur à l'arrêt, mais **pas** le volume.

Si le volume n'existe pas au moment du `docker run`, Docker le crée automatiquement.

## Exemple concret : persister une base MySQL

```bash
docker run -d --name mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=devSecOps \
  -v mysql_data:/var/lib/mysql \
  mysql:8
```

`/var/lib/mysql` est le dossier où MySQL stocke ses données. En le reliant à un volume, la base survit à la suppression du conteneur.

**Test de persistance :**

```bash
# 1. Créer une table et une ligne
docker exec -it mysql mysql -u root -ppassword -e \
  "CREATE TABLE devSecOps.emp (id INT, nom VARCHAR(50)); INSERT INTO devSecOps.emp VALUES (1, 'Omar');"

# 2. Supprimer le conteneur (le volume reste)
docker rm -f mysql

# 3. Recréer un conteneur avec le même volume
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=password -v mysql_data:/var/lib/mysql mysql:8

# 4. Vérifier : les données sont toujours là (attendre quelques secondes le démarrage)
docker exec -it mysql mysql -u root -ppassword -e "SELECT * FROM devSecOps.emp;"
```

`-ppassword` s'écrit sans espace entre `-p` et le mot de passe. Pour un vrai projet, ne laissez pas un mot de passe en clair dans la commande : utilisez un fichier `.env` ou les secrets Docker.

## Montages de répertoire (bind mounts)

Un *bind mount* relie un chemin de la machine hôte à un chemin du conteneur. Il est utile pour travailler sur des fichiers du projet :

```bash
docker run --rm \
  -p 127.0.0.1:8080:80 \
  --mount type=bind,source="$(pwd)",target=/usr/share/nginx/html,readonly \
  nginx:alpine
```

Cette commande est adaptée à un terminal Linux ou macOS. Sous Windows, lancez-la depuis un terminal compatible avec Docker Desktop et WSL, depuis le répertoire contenant les fichiers du site.

Le montage `readonly` permet au conteneur de lire les fichiers sans les modifier.

:::note Accès depuis un autre poste

`127.0.0.1:8080` limite l'accès à la machine qui exécute Docker. Si Docker tourne sur une VM et que vous ouvrez la page depuis votre PC, utilisez `-p 8080:80` puis `http://IP_DE_LA_VM:8080` (voir `hostname -I`), ou l'onglet **Ports** de VS Code Remote-SSH.

:::

### Servir son propre site avec Nginx

```bash
mkdir -p ~/site
echo "<h1>Hello M7</h1>" > ~/site/index.html

docker run -d --name nginx -p 8080:80 -v ~/site:/usr/share/nginx/html nginx
```

Toute modification de `~/site/index.html` est visible immédiatement, sans reconstruire l'image.

### Lecture seule avec `:ro`

```bash
docker run -d --name nginx -p 8080:80 -v ~/site:/usr/share/nginx/html:ro nginx
```

`:ro` (*read-only*) empêche le conteneur de modifier vos fichiers : c'est plus sûr pour un site statique.

### Mode développement avec Flask

```bash
docker run -d --name flask -p 5000:5000 \
  -v $(pwd):/app \
  -e FLASK_DEBUG=1 \
  flask-app:1.0 flask run --host=0.0.0.0 --port=5000
```

Le bind mount synchronise votre code local avec le conteneur : chaque modification est prise en compte sans reconstruire l'image.

## `-v` ou `--mount` ?

Les deux options font la même chose. `--mount` est plus explicite et signale une erreur si le chemin source n'existe pas.

| | `-v` | `--mount` |
|---|---|---|
| Volume nommé | `-v donnees:/data` | `--mount type=volume,source=donnees,target=/data` |
| Bind mount | `-v $(pwd):/app` | `--mount type=bind,source="$(pwd)",target=/app` |
| Lecture seule | `-v donnees:/data:ro` | `--mount ...,readonly` |
| Source inexistante | Crée le dossier (en `root`) | **Erreur** |

L'ordre des deux côtés est toujours `source:destination`, c'est-à-dire **hôte puis conteneur**.

:::warning Piège de l'ordre

Les options `-v` et `--mount` se placent **avant le nom de l'image**. Tout ce qui suit l'image est transmis au conteneur : `docker run nginx -v /data` envoie `-v /data` à Nginx, pas à Docker.

:::

## Volumes et Docker Compose

```yaml
services:
  db:
    image: mysql:8
    container_name: mysql
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=devSecOps
    volumes:
      - db_data:/var/lib/mysql

  web:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./site:/usr/share/nginx/html:ro

volumes:
  db_data:
```

- `db_data` est un volume nommé, déclaré dans la section `volumes:` en bas du fichier.
- `./site` est un bind mount relatif au dossier du fichier Compose.

| Commande | Effet sur les volumes |
|---|---|
| `docker compose down` | Supprime conteneurs et réseau, **conserve** les volumes |
| `docker compose down -v` | Supprime aussi les volumes : **données perdues** |
| `docker compose up -d` | Recrée les conteneurs et réutilise les volumes existants |

## Inspecter et mesurer

```bash
docker volume ls
docker volume inspect mysql_data
docker system df          # espace utilisé par images, conteneurs et volumes
docker system df -v       # détail, volume par volume
docker inspect -f '{{json .Mounts}}' mysql    # volumes montés dans un conteneur
```

`docker inspect -f '{{json .Mounts}}' nom` indique, pour un conteneur, quels volumes et bind mounts il utilise.

## Copier des fichiers sans volume

Pour un échange ponctuel, `docker cp` suffit :

```bash
docker cp fichier.txt web:/tmp           # hôte -> conteneur
docker cp web:/etc/nginx/nginx.conf .    # conteneur -> hôte
```

## Nettoyage

```bash
# Supprimer le volume de démonstration lorsque ses données ne sont plus nécessaires
docker volume rm donnees-demo
```

Un volume utilisé par un conteneur (même arrêté) ne peut pas être supprimé : supprimez d'abord le conteneur.

| Commande | Ce qui est supprimé |
|---|---|
| `docker volume rm nom` | Un volume précis |
| `docker volume prune` | Tous les volumes **non utilisés** par un conteneur |
| `docker system prune --volumes` | Idem, avec conteneurs arrêtés, réseaux et images inutilisées |

:::warning Suppression des données

La suppression d'un volume supprime ses données. Vérifiez son nom et son contenu avant de le retirer. N'utilisez pas `docker volume prune` sans avoir examiné les volumes concernés : un volume n'est « utilisé » que s'il est rattaché à un conteneur, même arrêté. Si vous avez supprimé le conteneur de votre base de données, son volume est considéré comme inutilisé et sera effacé.

:::

## Erreurs fréquentes

| Problème | Cause | Solution |
|---|---|---|
| Les données disparaissent | Aucun volume sur le dossier de données | Ajouter `-v nom:/chemin/des/données` |
| `volume is in use` | Un conteneur utilise encore le volume | `docker rm -f` du conteneur, puis `docker volume rm` |
| Page Nginx par défaut au lieu de la mienne | Mauvais chemin source ou dossier vide | Vérifier `~/site` et `ls ~/site` |
| `Permission denied` dans le conteneur | Droits du dossier hôte ou volume monté en `:ro` | Ajuster les droits, ou retirer `:ro` |
| Dossier créé par `root` sur l'hôte | `-v` avec une source inexistante | Créer le dossier avant, ou utiliser `--mount` |
| Base vide après `down -v` | Le volume a été supprimé | Ne pas utiliser `-v` ; restaurer une sauvegarde |

## À retenir

- Utilisez un volume nommé pour conserver des données indépendamment d'un conteneur.
- Utilisez un *bind mount* pour accéder à des fichiers de la machine hôte.
- Accordez seulement les accès nécessaires ; montez les répertoires en lecture seule (`:ro` ou `readonly`) lorsqu'une écriture n'est pas requise.
- Les options de montage se placent **avant** l'image dans `docker run`.
- `docker rm` supprime un conteneur mais pas son volume ; `docker compose down -v` et `docker volume prune` suppriment les données.
- Mesurez avec `docker system df` et vérifiez avec `docker volume ls` avant de nettoyer.
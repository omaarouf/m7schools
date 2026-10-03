---
id: docker-06-compose
title: Docker - Docker Compose
sidebar_label: 6. Docker Compose
---

# Décrire une application avec Docker Compose

Docker Compose permet de décrire les services et leurs paramètres dans un fichier YAML, puis de les gérer ensemble. Le format moderne du fichier Compose n'exige pas de champ `version`.

## Objectifs

À la fin de cette leçon, vous saurez écrire un fichier Compose, lancer et arrêter un projet, relier une application Flask à une base MySQL, attendre qu'un service soit prêt avec un `healthcheck`, externaliser les mots de passe dans un fichier `.env` et isoler les services avec des réseaux.

## Pourquoi utiliser Compose ?

- Une seule commande pour démarrer ou arrêter tous les services, au lieu de longues commandes `docker run`.
- La configuration est versionnable dans Git et reproductible.
- Un **réseau est créé automatiquement** : les services se joignent par leur **nom**.
- Idéal pour une application, sa base de données et un reverse proxy.

Vérifiez l'installation (le plugin `docker-compose-plugin` installé avec Docker) :

```bash
docker compose version
```

La commande moderne est `docker compose` (avec un espace). L'ancienne commande `docker-compose` (avec un tiret) n'est plus recommandée.

## Préparer le projet

Créez un répertoire `docker-compose-demo`, puis ajoutez un sous-répertoire `site` contenant le fichier `index.html` :

```html
<!doctype html>
<html lang="fr">
  <meta charset="utf-8">
  <title>Compose</title>
  <h1>Application lancée avec Docker Compose</h1>
</html>
```

À la racine du projet, créez `compose.yaml` :

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "127.0.0.1:8080:80"
    volumes:
      - ./site:/usr/share/nginx/html:ro
    restart: unless-stopped
```

Le service `web` utilise l'image Nginx, publie le port 80 du conteneur sur `localhost:8080` et monte le répertoire du site en lecture seule.

:::note Docker sur une VM

`127.0.0.1:8080` limite l'accès à la machine qui exécute Docker. Si Docker tourne sur une VM et que vous ouvrez la page depuis votre PC, remplacez par `"8080:80"` puis ouvrez `http://IP_DE_LA_VM:8080` (obtenez l'IP avec `hostname -I`), ou utilisez l'onglet **Ports** de VS Code Remote-SSH.

:::

## Anatomie d'un fichier Compose

```yaml
services:
  nom_du_service:
    image: ...              # ou build: .
    container_name: ...
    ports:
      - "hôte:conteneur"
    environment:
      - VAR=valeur
    volumes:
      - ...
    depends_on:
      - autre_service
    healthcheck:
      test: [...]
    networks:
      - ...
    restart: always
```

| Clé | Rôle | Équivalent `docker run` |
|---|---|---|
| `image` | Image à utiliser | `docker run IMAGE` |
| `build` | Construit l'image depuis un Dockerfile (`build: .`) | `docker build` |
| `container_name` | Nom du conteneur | `--name` |
| `ports` | Ports publiés | `-p` |
| `environment` | Variables d'environnement | `-e` |
| `volumes` | Volumes et bind mounts | `-v` |
| `depends_on` | Ordre de démarrage entre services | (aucun) |
| `healthcheck` | Test de santé du service | `--health-cmd` |
| `networks` | Réseaux auxquels le service est rattaché | `--network` |
| `restart` | Politique de redémarrage | `--restart` |

Le fichier peut s'appeler `compose.yaml` ou `docker-compose.yml`.

:::warning YAML : espaces uniquement

L'indentation du YAML se fait avec des **espaces**, jamais des tabulations. Une erreur du type `mapping values are not allowed here` ou `yaml: line X` signale presque toujours un problème d'indentation.

:::

### Politiques de redémarrage

| Valeur | Comportement |
|---|---|
| `no` | Ne redémarre jamais (défaut) |
| `always` | Redémarre toujours, y compris au démarrage de Docker |
| `unless-stopped` | Comme `always`, sauf si vous l'avez arrêté vous-même |
| `on-failure` | Redémarre seulement si le conteneur s'arrête en erreur |

## Démarrer et gérer le projet

Depuis le répertoire contenant `compose.yaml` :

```bash
# Vérifier la configuration Compose
docker compose config

# Construire/télécharger les images et démarrer les services
docker compose up -d

# Consulter l'état et les logs
docker compose ps
docker compose logs
```

Visitez `http://localhost:8080`. Après modification du fichier `site/index.html`, actualisez la page : le répertoire est monté dans le conteneur.

Lorsque vous avez terminé :

```bash
docker compose down
```

Cette commande arrête et supprime les conteneurs et le réseau du projet. Elle ne supprime pas les fichiers du projet. L'option `-v` supprime également les volumes gérés par le projet ; ne l'utilisez que si vous souhaitez réellement effacer leurs données.

### Les commandes essentielles

| Commande | Rôle |
|---|---|
| `docker compose up` | Lance les services (logs en direct) |
| `docker compose up -d` | Lance en arrière-plan |
| `docker compose up -d --build` | Reconstruit les images, puis lance |
| `docker compose down` | Arrête et supprime conteneurs et réseau |
| `docker compose down -v` | Supprime aussi les **volumes** (données perdues) |
| `docker compose ps` | État des services |
| `docker compose logs -f app` | Suit les logs d'un service |
| `docker compose exec app bash` | Ouvre un shell dans un service |
| `docker compose exec db mysql -uroot -ppassword` | Ouvre le client MySQL |
| `docker compose build` | Reconstruit les images sans démarrer |
| `docker compose stop` / `start` / `restart` | Contrôle les services sans les supprimer |
| `docker compose config` | Valide le YAML et affiche la configuration finale |

`stop` met en pause les conteneurs, alors que `down` les **supprime**.

## Exemple complet : Flask + MySQL

Structure du projet :

```text
flask-mysql/
├── compose.yaml
├── .env
├── .gitignore
└── app/
    ├── Dockerfile
    ├── app.py
    └── requirements.txt
```

`compose.yaml` :

```yaml
services:
  app:
    build: ./app
    container_name: flask
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - DB_NAME=devSecOps
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: mysql:8
    container_name: mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=devSecOps
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s

volumes:
  db_data:
```

Points clés :

- `build: ./app` construit l'image depuis le Dockerfile du dossier `app` (voir la leçon sur le Dockerfile).
- Dans le code Flask, l'hôte de la base est **`db`** (le nom du service), jamais `localhost` ni une IP.
- `db_data` est un volume nommé : les données MySQL survivent à `docker compose down`.
- Le service `db` ne publie **aucun port** : seule l'application peut le joindre, ce qui réduit la surface d'attaque.

### `depends_on` et `healthcheck`

`depends_on` seul ne garantit que l'ordre de **démarrage**, pas que la base soit **prête**. Avec `condition: service_healthy`, Flask attend que le `healthcheck` de MySQL réussisse.

| Condition | Attend que... |
|---|---|
| `service_started` | Le conteneur soit démarré (défaut) |
| `service_healthy` | Le `healthcheck` soit au statut `healthy` |
| `service_completed_successfully` | Le service se termine avec le code 0 (tâche d'initialisation) |

Les clés du `healthcheck` en Compose sont les mêmes que dans un Dockerfile : `test`, `interval`, `timeout`, `retries`, `start_period`. La forme `["CMD", ...]` est la forme exec ; `["CMD-SHELL", "..."]` lance la commande dans un shell.

Vérifiez l'état :

```bash
docker compose ps        # STATUS : Up ... (healthy)
```

## Variables avec un fichier `.env`

Placez les mots de passe dans un fichier `.env`, à côté de `compose.yaml` :

```text
MYSQL_ROOT_PASSWORD=ChangeMoi!2026
```

Compose le lit automatiquement et remplace `${MYSQL_ROOT_PASSWORD}` dans le fichier YAML.

Ajoutez `.env` à `.gitignore` (et à `.dockerignore`) pour ne **jamais** publier vos secrets sur GitHub ou GitLab :

```text
.env
```

Pour vérifier la substitution :

```bash
docker compose config
```

## Réseaux personnalisés

Par défaut, Compose crée un réseau commun à tous les services. Pour isoler certains services, déclarez vos propres réseaux :

```yaml
services:
  proxy:
    image: nginx:alpine
    ports:
      - "80:80"
    networks: [front]

  app:
    build: ./app
    networks: [front, back]

  db:
    image: mysql:8
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    networks: [back]

networks:
  front:
  back:
```

Ici, `proxy` joint `app`, `app` joint `db`, mais `proxy` ne peut **pas** atteindre `db` : la base n'est accessible que depuis le réseau `back`.

## Cycle de travail

```bash
docker compose up -d --build     # démarrer (et reconstruire si le code a changé)
docker compose ps                # vérifier l'état et la santé
docker compose logs -f           # déboguer
docker compose exec db mysql -uroot -p -e "SELECT * FROM devSecOps.emp;"
docker compose down              # tout arrêter
```

## Erreurs fréquentes

| Problème | Cause | Solution |
|---|---|---|
| `yaml: line X: mapping values...` | Tabulations ou indentation incorrecte | Utiliser des espaces, vérifier avec `docker compose config` |
| `port is already allocated` | Port déjà utilisé sur l'hôte | Changer le port de gauche : `"8081:80"` |
| Flask ne se connecte pas à la base | Hôte `localhost` au lieu de `db` | `DB_HOST=db` |
| Flask démarre avant MySQL | `depends_on` sans condition de santé | `condition: service_healthy` + `healthcheck` |
| Variable `${...}` vide | `.env` absent ou mal placé | Le placer à côté de `compose.yaml` |
| Données perdues | Utilisation de `down -v` ou absence de volume | Déclarer un volume, éviter `-v` |
| Modification du code non prise en compte | Image non reconstruite | `docker compose up -d --build` |
| `Conflict. The container name is already in use` | `container_name` déjà pris par un ancien conteneur | `docker rm -f nom` |
| `docker compose` introuvable | Plugin absent | `sudo apt install docker-compose-plugin` |

## Bonnes pratiques

:::tip Bonnes habitudes

- Versionnez `compose.yaml`, mais **jamais** `.env`.
- Publiez le minimum de ports, et limitez-les à `127.0.0.1` si le service est local.
- Utilisez un `healthcheck` avec `depends_on: condition: service_healthy` pour les bases de données.
- Déclarez un volume nommé pour toute donnée à conserver.
- Placez les bases sur un réseau interne, sans port publié.
- Validez toujours avec `docker compose config` avant `up`.

:::

## À retenir

- `compose.yaml` rend la configuration du projet lisible et reproductible.
- `docker compose up -d` démarre les services en arrière-plan.
- `docker compose down` arrête les services et retire les ressources du projet, sans effacer les volumes par défaut ; `down -v` les efface.
- Les services se joignent par leur **nom**, grâce au réseau créé automatiquement.
- `depends_on` avec `service_healthy` attend qu'un service soit réellement prêt.
- Les secrets vont dans `.env`, qui ne doit jamais être publié.

## Lexique

| Terme | Définition |
|---|---|
| **Service** | Un conteneur (ou groupe de conteneurs) décrit dans `compose.yaml` |
| **Projet** | Ensemble des services, réseaux et volumes d'un même fichier Compose |
| **`depends_on`** | Définit l'ordre de démarrage entre services |
| **`healthcheck`** | Test qui détermine si un service est prêt (`healthy`) |
| **`service_healthy`** | Condition : attendre que le test de santé réussisse |
| **`.env`** | Fichier de variables lu automatiquement par Compose |
| **Substitution** | Remplacement de `${VAR}` par sa valeur |
| **Volume nommé** | Stockage persistant géré par Docker, déclaré sous `volumes:` |
| **Bind mount** | Dossier local monté dans un conteneur (`./site:/...`) |
| **Réseau (`networks`)** | Réseau virtuel isolant les services |
| **`restart`** | Politique de redémarrage (`no`, `always`, `unless-stopped`, `on-failure`) |
| **`build`** | Construit l'image à partir d'un Dockerfile |
| **`container_name`** | Nom fixe du conteneur |
| **YAML** | Format du fichier : indentation en espaces, pas de tabulations |
| **Reverse proxy** | Service frontal qui redirige les requêtes vers les applications |
---
id: docker-03-dockerfile
title: Docker - Construire une image
sidebar_label: 3. Dockerfile
---

# Construire une image avec un Dockerfile

Un **Dockerfile** décrit les étapes de construction d'une image. Le fichier doit s'appeler `Dockerfile` (sans extension).

## Créer un premier projet

Dans un nouveau répertoire de travail, créez ces deux fichiers.

`index.html` :

```html
<!doctype html>
<html lang="fr">
  <meta charset="utf-8">
  <title>Mon premier conteneur</title>
  <h1>Bonjour depuis Docker !</h1>
</html>
```

`Dockerfile` :

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
```

`FROM` choisit l'image de base et `COPY` ajoute le fichier au chemin attendu par Nginx.

## Construire et lancer l'image

Depuis le répertoire contenant les deux fichiers :

```bash
# Construire l'image à partir du contexte courant
docker build -t site-demo:1.0 .

# Créer et lancer un conteneur
docker run --name site-demo -d -p 127.0.0.1:8080:80 site-demo:1.0
```

Visitez `http://localhost:8080` pour vérifier le résultat. Pour reconstruire l'image après une modification, relancez `docker build`, puis recréez le conteneur.

## Réduire le contexte avec `.dockerignore`

Le contexte de construction contient les fichiers transmis au moteur lors de `docker build`. Ajoutez un fichier `.dockerignore` pour exclure les éléments inutiles :

```text
.git
.env
node_modules
```

N'ajoutez pas de secrets ou de fichiers de configuration sensibles au contexte de construction. `.dockerignore` réduit le risque de les intégrer par erreur à l'image.

:::tip Bonnes habitudes

- Conservez le Dockerfile et les fichiers nécessaires au projet dans le contrôle de version.
- Utilisez des instructions explicites et limitez les fichiers copiés dans l'image.
- Recréez l'image après une modification au lieu de modifier manuellement le conteneur.

:::

## Nettoyage

```bash
docker stop site-demo
docker rm site-demo
docker image rm site-demo:1.0
```

---
id: docker-05-reseaux
title: Docker - Réseaux
sidebar_label: 5. Réseaux
---

# Faire communiquer les conteneurs

Les réseaux Docker permettent aux conteneurs de communiquer sans exposer automatiquement leurs ports au réseau extérieur. Un réseau défini par l'utilisateur fournit la résolution des noms entre conteneurs qui y sont connectés.

## Créer un réseau et tester la résolution de noms

```bash
# Créer un réseau dédié
docker network create reseau-demo

# Lancer un serveur web sur ce réseau
docker run -d --name web-demo --network reseau-demo nginx:alpine

# Depuis un conteneur temporaire du même réseau, interroger le serveur par son nom
docker run --rm --network reseau-demo busybox:1.36 wget -qO- http://web-demo
```

La dernière commande récupère la page par défaut de Nginx. Le nom `web-demo` est résolu à l'intérieur du réseau Docker.

## Inspecter et nettoyer le réseau

```bash
docker network inspect reseau-demo
docker stop web-demo
docker rm web-demo
docker network rm reseau-demo
```

## Publication des ports

Pour rendre un service accessible depuis la machine hôte, publiez explicitement son port :

```bash
docker run -d --name web-local -p 127.0.0.1:8080:80 nginx:alpine
```

Le préfixe `127.0.0.1` limite l'accès à la machine locale. Sans adresse d'écoute spécifiée, Docker publie généralement le port sur les interfaces réseau de l'hôte.

:::warning

Les ports publiés peuvent rendre un service accessible au-delà de l'hôte. N'exposez que les services nécessaires et vérifiez les règles de pare-feu et les exigences de sécurité de votre environnement.

:::

## À retenir

- Les conteneurs d'un même réseau utilisateur peuvent se joindre par leur nom.
- Un réseau Docker n'expose pas, à lui seul, les ports du conteneur à l'hôte.
- `-p` publie un port ; limitez l'adresse d'écoute lorsque l'accès doit rester local.

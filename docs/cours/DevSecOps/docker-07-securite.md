---
id: docker-07-securite
title: Docker - Sécurité
sidebar_label: 7. Sécurité
---

# Sécuriser les images et les conteneurs

Un conteneur améliore l'isolation et la portabilité, mais ne remplace pas les contrôles de sécurité du système hôte ou de l'application. Le moteur Docker et les images doivent être traités comme des éléments sensibles de l'infrastructure.

## Réduire les risques lors de la construction

- Choisissez des images de base provenant d'éditeurs de confiance et maintenues.
- Utilisez des versions explicites et mettez-les à jour régulièrement. Pour les déploiements qui exigent une version strictement immuable, vérifiez et utilisez le digest de l'image.
- Réduisez le contenu de l'image et excluez les fichiers inutiles avec `.dockerignore`.
- Ne placez jamais de mots de passe, de jetons ou de clés dans une image, un Dockerfile ou le contexte de construction.
- Analysez les images avec un outil de vulnérabilités maintenu dans votre environnement et traitez les résultats avant le déploiement.

## Limiter les privilèges à l'exécution

- N'utilisez pas `--privileged` sauf besoin exceptionnel, documenté et évalué.
- N'exécutez pas l'application en tant que `root` dans le conteneur lorsque l'image permet un utilisateur non privilégié.
- N'ajoutez que les capacités Linux nécessaires ; retirez celles dont l'application n'a pas besoin.
- Montez uniquement les fichiers indispensables et privilégiez les montages en lecture seule.
- Ne publiez que les ports utiles ; limitez l'accès à `127.0.0.1` pour un usage local.
- Évitez de monter le socket Docker dans un conteneur : cela peut donner le contrôle du moteur et de l'hôte.

Pour un conteneur de test qui n'a besoin d'aucune capacité Linux supplémentaire, vous pouvez essayer :

```bash
docker run --rm \
  --read-only \
  --cap-drop=ALL \
  --security-opt=no-new-privileges \
  alpine:3.23 id
```

L'option `--read-only` rend le système de fichiers du conteneur non inscriptible. Certaines applications ont besoin de répertoires temporaires ou d'autres ajustements ; testez leurs besoins avant d'appliquer ces restrictions.

## Protéger l'environnement Docker

Le contrôle d'accès au moteur Docker est critique : un utilisateur capable de contrôler le moteur peut souvent obtenir des privilèges élevés sur l'hôte. Limitez les personnes et les services qui y ont accès, protégez les identifiants de registre et maintenez le moteur et l'hôte à jour.

:::warning

Ne lancez pas de conteneurs non fiables sur une machine contenant des données sensibles ou ayant accès à des réseaux critiques. L'isolation des conteneurs ne doit pas être considérée comme une frontière de sécurité absolue.

:::

## Vérification avant déploiement

- L'image provient-elle d'une source fiable et est-elle à jour ?
- Les secrets sont-ils fournis séparément et protégés ?
- Le conteneur fonctionne-t-il avec les privilèges minimums ?
- Les ports et les montages sont-ils strictement nécessaires ?
- Les vulnérabilités connues et les mises à jour sont-elles suivies ?

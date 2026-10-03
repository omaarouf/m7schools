---
id: docker-01-installation
title: Docker - Installation
sidebar_label: 1. Installation
---

# Installer et vérifier Docker

## Objectifs

À la fin de cette leçon, vous saurez identifier les composants principaux de Docker, installer un environnement Docker adapté à votre système (y compris sur une VM Ubuntu Server) et vérifier qu'il fonctionne.

## Docker en quelques mots

Docker permet de construire et d'exécuter des applications dans des **conteneurs**. Un conteneur regroupe une application et ses dépendances dans un environnement isolé. Il partage le noyau du système hôte : ce n'est pas une machine virtuelle complète.

Les principaux composants sont :

| Composant | Rôle |
|---|---|
| Docker Engine | Construit et exécute les conteneurs |
| Docker CLI | Envoie des commandes au moteur Docker |
| Image | Modèle en lecture seule utilisé pour créer un conteneur |
| Conteneur | Instance en cours d'exécution d'une image |
| Registre | Service qui stocke et distribue des images |

## Prérequis et installation

- **Windows** : installez Docker Desktop en suivant la [documentation officielle Docker Desktop pour Windows](https://docs.docker.com/desktop/setup/install/windows-install/). Le moteur Linux utilise généralement WSL 2.
- **macOS** : installez Docker Desktop en suivant la [documentation officielle pour macOS](https://docs.docker.com/desktop/setup/install/mac-install/).
- **Linux** : suivez la procédure officielle correspondant à votre distribution dans la [documentation Docker Engine](https://docs.docker.com/engine/install/). Évitez les scripts d'installation non vérifiés.

Après l'installation, ouvrez un terminal et vérifiez la version du client :

```bash
docker --version
docker compose version
```

## Installer Docker sur Ubuntu Server (VM)

Un lab sur une machine virtuelle Ubuntu Server (VMware, VirtualBox, Proxmox...) est un très bon moyen de s'entraîner. Docker utilise les conteneurs Linux et non la virtualisation : la **virtualisation imbriquée n'est pas nécessaire**.

### Prérequis de la VM

| Ressource | Minimum | Recommandé |
|---|---|---|
| RAM | 2 Go | 4 Go |
| Disque | 20 Go | 30 Go ou plus |
| Réseau | Accès Internet (NAT ou Bridge) | Bridge pour joindre la VM depuis le PC |

### Étape 1 : préparer le système

```bash
sudo apt update
sudo apt install -y ca-certificates curl
```

### Étape 2 : ajouter la clé GPG officielle de Docker

```bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

### Étape 3 : ajouter le dépôt Docker

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### Étape 4 : installer Docker Engine

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

| Paquet | Contenu |
|---|---|
| `docker-ce` | Docker Engine (le moteur) |
| `docker-ce-cli` | Le client `docker` |
| `containerd.io` | Le runtime de conteneurs |
| `docker-buildx-plugin` | Construction d'images avancée (`docker buildx`) |
| `docker-compose-plugin` | La commande `docker compose` |

### Étape 5 : vérifier que le service tourne

```bash
sudo systemctl status docker
sudo systemctl enable --now docker
```

`enable --now` démarre Docker immédiatement et à chaque démarrage de la VM.

### Étape 6 : utiliser Docker sans `sudo` (optionnel)

Par défaut, seul `root` peut accéder au socket Docker (`/var/run/docker.sock`). Pour un lab personnel, on ajoute son utilisateur au groupe `docker` :

```bash
sudo usermod -aG docker $USER
newgrp docker
```

:::warning Sécurité

Appartenir au groupe `docker` revient à avoir les droits **root** sur la machine. C'est acceptable sur un lab personnel, mais à éviter sur un serveur partagé ou de production (préférez alors le mode **rootless**). N'utilisez jamais `chmod 666 /var/run/docker.sock` : cela donne l'accès à tout le monde.

:::

Si le groupe n'existe pas : `sudo groupadd docker`, puis relancez `usermod`.

### Alternative rapide pour un lab

```bash
sudo apt install -y docker.io docker-compose-v2
```

Plus court, mais la version fournie par les dépôts Ubuntu peut être plus ancienne que celle du dépôt officiel Docker. À réserver aux tests.

## Premier test

L'image `hello-world` confirme que le client peut communiquer avec le moteur et qu'un conteneur peut être lancé :

```bash
docker run hello-world
```

Sur Ubuntu, si vous n'avez pas configuré le groupe `docker`, utilisez `sudo docker run hello-world`.

La première exécution télécharge l'image si elle n'est pas déjà présente localement. Listez ensuite les conteneurs terminés :

```bash
docker ps -a
```

`docker ps` affiche uniquement les conteneurs en cours d'exécution ; l'option `-a` inclut aussi ceux qui sont arrêtés.

### Tester avec un vrai service : Nginx

```bash
docker run -d --name nginx -p 8080:80 nginx
docker ps
curl http://localhost:8080
```

Le message **Welcome to nginx!** confirme que le conteneur répond. Pour l'ouvrir depuis le navigateur du PC, récupérez l'IP de la VM :

```bash
hostname -I
```

Puis ouvrez `http://IP_DE_LA_VM:8080` (exemple : `http://192.168.13.139:8080`).

:::note IP de la VM et IP du conteneur

Utilisez l'IP de la **VM** avec le port **publié** (`-p 8080:80`). L'IP interne du conteneur (`172.17.x.x`) n'est pas joignable depuis votre PC. Ignorez aussi `172.17.0.1` dans la sortie de `hostname -I` : c'est la passerelle interne de Docker.

:::

Nettoyez ensuite le test :

```bash
docker rm -f nginx
```

## Utiliser Docker avec VS Code (Remote-SSH)

L'extension **Remote-SSH** permet de piloter la VM depuis VS Code, et l'extension Docker affiche les conteneurs dans l'interface. L'onglet **Ports** redirige automatiquement les ports publiés vers `localhost` sur votre PC.

Si VS Code affiche l'erreur suivante, c'est un problème de droits sur le socket :

```text
permission denied while trying to connect to the docker API at unix:///var/run/docker.sock
```

Solution :

1. Ajoutez votre utilisateur au groupe `docker` : `sudo usermod -aG docker $USER`.
2. Dans VS Code : `Ctrl+Shift+P`, puis **Remote-SSH: Kill VS Code Server on Host...**
3. Reconnectez-vous en SSH.
4. Vérifiez dans le terminal :

```bash
groups          # doit afficher "docker"
docker ps       # doit fonctionner sans sudo
```

`newgrp docker` ne suffit pas ici : VS Code garde son ancien processus serveur, qui ne connaît pas encore le nouveau groupe.

## Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `permission denied ... docker.sock` | Utilisateur absent du groupe `docker` | `sudo usermod -aG docker $USER`, puis nouvelle session |
| `Cannot connect to the Docker daemon` | Service arrêté | `sudo systemctl enable --now docker` |
| `docker: command not found` | Installation incomplète | Reprendre les étapes 1 à 4 |
| `port is already allocated` | Port déjà utilisé | Changer le port de gauche : `-p 8081:80` |
| Page inaccessible depuis le PC | VM en NAT ou pare-feu actif | Passer en Bridge, ou `sudo ufw allow 8080/tcp` |
| `docker compose` introuvable | Plugin absent | `sudo apt install docker-compose-plugin` |

:::tip Dépannage général

Si Docker ne répond pas, vérifiez que Docker Desktop est démarré ou que le service Docker est actif sur Linux (`sudo systemctl status docker`). Sur Linux, certaines installations nécessitent des privilèges administrateur pour accéder au moteur ; n'ajoutez pas un utilisateur au groupe `docker` sans comprendre que ce groupe donne des privilèges élevés sur la machine.

:::

## À retenir

- Une image sert de modèle ; un conteneur est une instance créée à partir de cette image.
- Le client Docker doit pouvoir joindre le moteur Docker.
- Utilisez les instructions officielles adaptées à votre système.
- Sur Ubuntu Server, installez Docker depuis le **dépôt officiel** : clé GPG, dépôt, puis `docker-ce`.
- Le groupe `docker` donne un accès équivalent à root : à réserver à un lab personnel.
- Pour joindre une application depuis le PC, utilisez **l'IP de la VM** et le **port publié**, jamais l'IP du conteneur.
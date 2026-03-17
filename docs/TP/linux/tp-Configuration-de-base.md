---
id: tp-Configuration-de-base
title: TP — Configuration de Base Linux Server
sidebar_label: TP Configuration de Base
---

# TP — Configuration de Base Linux Server

7 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 — Demons et Services (Facile)

**Objectif :** Comprendre et manipuler les demons et services avec systemd.

---

**1. Afficher l etat du service SSH.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
systemctl status ssh
```

Fedora :
```bash
systemctl status sshd
```

</details>

---

**2. Verifier si le service SSH demarre automatiquement au boot.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
systemctl is-enabled ssh
```

Fedora :
```bash
systemctl is-enabled sshd
```

Si la sortie est `enabled` — le service demarre au boot.
Si `disabled` — il ne demarre pas automatiquement.

</details>

---

**3. Demarrer, arreter puis redemarrer le service SSH.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo systemctl start ssh
sudo systemctl stop ssh
sudo systemctl restart ssh
```

Fedora :
```bash
sudo systemctl start sshd
sudo systemctl stop sshd
sudo systemctl restart sshd
```

</details>

---

**4. Activer le service SSH au demarrage.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo systemctl enable ssh
```

Fedora :
```bash
sudo systemctl enable sshd
```

</details>

---

**5. Afficher les 20 derniers logs du service SSH.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
journalctl -u ssh -n 20
```

Fedora :
```bash
journalctl -u sshd -n 20
```

</details>

---

**6. Afficher les logs du service SSH en temps reel.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
journalctl -f -u ssh
```

Fedora :
```bash
journalctl -f -u sshd
```

Appuyer sur `Ctrl + C` pour quitter.

</details>

---

**7. Afficher uniquement les erreurs dans les logs systeme.**

<details>
<summary>Voir la reponse</summary>

```bash
journalctl -p err
```

</details>

---

## TP n°2 — Hostname et Configuration Reseau (Facile)

**Objectif :** Configurer le hostname et verifier les parametres reseau de base.

---

**1. Afficher le hostname actuel de la machine.**

<details>
<summary>Voir la reponse</summary>

```bash
hostname
hostname -f
```

</details>

---

**2. Changer le hostname en `srv1.ofppt.local` de maniere permanente.**

<details>
<summary>Voir la reponse</summary>

```bash
hostnamectl set-hostname srv1.ofppt.local
```

</details>

---

**3. Modifier le fichier `/etc/hosts` pour associer le hostname a l adresse locale.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo nano /etc/hosts
```

Ajouter :
```
127.0.0.1   localhost
127.0.1.1   srv1.ofppt.local srv1
```

</details>

---

**4. Afficher toutes les adresses IP configurees sur le systeme.**

<details>
<summary>Voir la reponse</summary>

```bash
ip a
```

</details>

---

**5. Afficher la table de routage.**

<details>
<summary>Voir la reponse</summary>

```bash
ip route
# ou
route -n
```

</details>

---

**6. Verifier le DNS configure sur le systeme.**

<details>
<summary>Voir la reponse</summary>

```bash
cat /etc/resolv.conf
```

</details>

---

**7. Tester la connectivite vers Internet.**

<details>
<summary>Voir la reponse</summary>

```bash
ping 8.8.8.8
ping google.com
```

</details>

---

## TP n°3 — Configuration IP avec nmcli (Moyen)

**Objectif :** Configurer une adresse IP statique et DHCP via nmcli.

---

**1. Installer NetworkManager si absent.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo apt update
sudo apt install network-manager -y
sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager
```

Fedora :
```bash
sudo dnf install NetworkManager -y
sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager
```

</details>

---

**2. Configurer une IP statique `192.168.1.50/24` avec gateway `192.168.1.1` et DNS `8.8.8.8`.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
nmcli connection modify ens3 ipv4.method manual
nmcli connection modify ens3 ipv4.addresses 192.168.1.50/24
nmcli connection modify ens3 ipv4.gateway 192.168.1.1
nmcli connection modify ens3 ipv4.dns 8.8.8.8
nmcli connection up ens3
```

Fedora :
```bash
nmcli connection modify enp0s3 ipv4.method manual
nmcli connection modify enp0s3 ipv4.addresses 192.168.1.50/24
nmcli connection modify enp0s3 ipv4.gateway 192.168.1.1
nmcli connection modify enp0s3 ipv4.dns 8.8.8.8
nmcli connection up enp0s3
```

</details>

---

**3. Verifier que la configuration a bien ete appliquee.**

<details>
<summary>Voir la reponse</summary>

```bash
ip a
ip route
cat /etc/resolv.conf
```

</details>

---

**4. Reconfigurer l interface en DHCP.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
nmcli connection modify ens3 ipv4.method auto
nmcli connection up ens3
```

Fedora :
```bash
nmcli connection modify enp0s3 ipv4.method auto
nmcli connection up enp0s3
```

</details>

---

**5. Configurer une IP temporaire `10.0.0.20/24` sans modifier les fichiers.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo ip addr add 10.0.0.20/24 dev ens3
```

Fedora :
```bash
sudo ip addr add 10.0.0.20/24 dev enp0s3
```

</details>

---

**6. Supprimer la configuration IP temporaire.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo ip addr flush dev ens3
```

Fedora :
```bash
sudo ip addr flush dev enp0s3
```

</details>

---

**7. Verifier que le fichier Netplan a les bonnes permissions sur Ubuntu.**

<details>
<summary>Voir la reponse</summary>

```bash
ls -l /etc/netplan/
sudo chmod 600 /etc/netplan/01-netcfg.yaml
sudo netplan apply
```

</details>

---

## TP n°4 — Gestion des Packages et Services (Moyen)

**Objectif :** Installer et gerer des packages et services.

---

**1. Installer le serveur SSH sur le systeme.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo apt install openssh-server -y
```

Fedora :
```bash
sudo dnf install openssh-server -y
```

</details>

---

**2. Activer SSH au demarrage et le demarrer immediatement.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo systemctl enable ssh
sudo systemctl start ssh
```

Fedora :
```bash
sudo systemctl enable sshd
sudo systemctl start sshd
```

</details>

---

**3. Installer nmap et verifier que le port 22 est ouvert.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo apt install nmap -y
nmap -p 22 127.0.0.1
```

Fedora :
```bash
sudo dnf install nmap -y
nmap -p 22 127.0.0.1
```

</details>

---

**4. Lister tous les packages installes et filtrer ceux qui contiennent `ssh`.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
dpkg -l | grep ssh
```

Fedora :
```bash
rpm -qa | grep ssh
```

</details>

---

**5. Sur Fedora, verifier si le package `dhcp` est installe.**

<details>
<summary>Voir la reponse</summary>

```bash
rpm -q dhcp
```

</details>

---

**6. Afficher les ports en ecoute sur le systeme.**

<details>
<summary>Voir la reponse</summary>

```bash
netstat -tulnp
# ou
ss -tulnp
```

</details>

---

**7. Redemarrer le service SSH et verifier son etat.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo systemctl restart ssh
systemctl status ssh
```

Fedora :
```bash
sudo systemctl restart sshd
systemctl status sshd
```

</details>

---

## TP n°5 — Gestion des Utilisateurs et Groupes (Moyen-Difficile)

**Objectif :** Creer et gerer des utilisateurs, groupes et mots de passe.

---

**1. Creer un utilisateur `stagiaire`.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
adduser stagiaire
```

Fedora :
```bash
useradd stagiaire
passwd stagiaire
```

</details>

---

**2. Changer le mot de passe de `stagiaire`.**

<details>
<summary>Voir la reponse</summary>

```bash
passwd stagiaire
```

</details>

---

**3. Forcer `stagiaire` a changer son mot de passe a la prochaine connexion.**

<details>
<summary>Voir la reponse</summary>

```bash
passwd -e stagiaire
```

</details>

---

**4. Creer un groupe `formation` et ajouter `stagiaire` a ce groupe.**

<details>
<summary>Voir la reponse</summary>

```bash
groupadd formation
usermod -aG formation stagiaire
```

</details>

---

**5. Ajouter `stagiaire` au groupe sudo (Ubuntu) ou wheel (Fedora).**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
usermod -aG sudo stagiaire
```

Fedora :
```bash
usermod -aG wheel stagiaire
```

</details>

---

**6. Verifier les groupes et l UID de `stagiaire`.**

<details>
<summary>Voir la reponse</summary>

```bash
id stagiaire
groups stagiaire
grep stagiaire /etc/passwd
```

</details>

---

**7. Retirer `stagiaire` du groupe `formation` puis supprimer l utilisateur avec son repertoire home.**

<details>
<summary>Voir la reponse</summary>

```bash
# Retirer du groupe
gpasswd -d stagiaire formation

# Supprimer l utilisateur et son home
userdel -r stagiaire
```

</details>

---

## TP n°6 — SSH et Authentification par Cles (Difficile)

**Objectif :** Configurer l authentification SSH par cles RSA et securiser le serveur.

---

**1. Generer un couple de cles RSA 4096 bits.**

<details>
<summary>Voir la reponse</summary>

```bash
ssh-keygen -t rsa -b 4096
```

Cles generees dans :
- `~/.ssh/id_rsa` — cle privee (ne jamais partager)
- `~/.ssh/id_rsa.pub` — cle publique

</details>

---

**2. Copier la cle publique vers un serveur distant `192.168.1.100`.**

<details>
<summary>Voir la reponse</summary>

```bash
ssh-copy-id omar@192.168.1.100
```

</details>

---

**3. Se connecter au serveur sans mot de passe.**

<details>
<summary>Voir la reponse</summary>

```bash
ssh omar@192.168.1.100
```

</details>

---

**4. Copier un fichier vers le serveur et recuperer un fichier depuis le serveur via SCP.**

<details>
<summary>Voir la reponse</summary>

```bash
# Envoyer
scp fichier.txt omar@192.168.1.100:/home/omar/

# Recevoir
scp omar@192.168.1.100:/home/omar/fichier.txt /tmp/
```

</details>

---

**5. Securiser SSH en interdisant la connexion directe en root.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo nano /etc/ssh/sshd_config
```

```
PermitRootLogin no
PasswordAuthentication yes
```

Ubuntu :
```bash
sudo systemctl restart ssh
```

Fedora :
```bash
sudo systemctl restart sshd
```

</details>

---

**6. Verifier que le port 22 est en ecoute.**

<details>
<summary>Voir la reponse</summary>

```bash
netstat -tulnp | grep 22
# ou
ss -tulnp | grep 22
```

</details>

---

**7. Consulter les logs SSH pour voir les connexions recentes.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
journalctl -u ssh -n 30
# ou
grep sshd /var/log/auth.log | tail -20
```

Fedora :
```bash
journalctl -u sshd -n 30
```

</details>

---

## TP n°7 — Scenario Reel Complet (Difficile)

**Objectif :** Configurer un serveur Linux complet pour l entreprise `OFPPT`.

**Contexte :** Tu es administrateur systeme. Tu dois preparer un serveur Linux avec les parametres suivants :

| Parametre | Valeur |
|-----------|--------|
| Hostname | `srv-ofppt.ofppt.local` |
| Adresse IP | `192.168.10.1/24` |
| Gateway | `192.168.10.254` |
| DNS | `192.168.10.1` |
| Utilisateur admin | `adminofppt` |
| Groupe | `it-team` |

---

**1. Configurer le hostname du serveur.**

<details>
<summary>Voir la reponse</summary>

```bash
hostnamectl set-hostname srv-ofppt.ofppt.local
sudo nano /etc/hosts
```

Ajouter :
```
127.0.0.1   localhost
127.0.1.1   srv-ofppt.ofppt.local srv-ofppt
```

</details>

---

**2. Configurer l IP statique via nmcli.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
nmcli connection modify ens3 ipv4.method manual
nmcli connection modify ens3 ipv4.addresses 192.168.10.1/24
nmcli connection modify ens3 ipv4.gateway 192.168.10.254
nmcli connection modify ens3 ipv4.dns 192.168.10.1
nmcli connection up ens3
```

Fedora :
```bash
nmcli connection modify enp0s3 ipv4.method manual
nmcli connection modify enp0s3 ipv4.addresses 192.168.10.1/24
nmcli connection modify enp0s3 ipv4.gateway 192.168.10.254
nmcli connection modify enp0s3 ipv4.dns 192.168.10.1
nmcli connection up enp0s3
```

</details>

---

**3. Creer le groupe `it-team` et l utilisateur `adminofppt`.**

<details>
<summary>Voir la reponse</summary>

```bash
groupadd it-team

# Ubuntu
adduser adminofppt
usermod -aG sudo,it-team adminofppt

# Fedora
useradd adminofppt
passwd adminofppt
usermod -aG wheel,it-team adminofppt
```

</details>

---

**4. Installer, activer et securiser SSH.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo apt install openssh-server -y
sudo systemctl enable ssh
sudo systemctl start ssh
```

Fedora :
```bash
sudo dnf install openssh-server -y
sudo systemctl enable sshd
sudo systemctl start sshd
```

Securisation :
```bash
sudo nano /etc/ssh/sshd_config
```

```
PermitRootLogin no
PasswordAuthentication yes
```

</details>

---

**5. Generer une cle RSA et configurer l authentification sans mot de passe.**

<details>
<summary>Voir la reponse</summary>

```bash
ssh-keygen -t rsa -b 4096
ssh-copy-id adminofppt@192.168.10.1
ssh adminofppt@192.168.10.1
```

</details>

---

**6. Verifier tous les services actifs et les ports en ecoute.**

<details>
<summary>Voir la reponse</summary>

```bash
# Services actifs
systemctl list-units --type=service --state=running

# Ports en ecoute
netstat -tulnp
# ou
ss -tulnp

# Port 22 specifiquement
nmap -p 22 127.0.0.1
```

</details>

---

**7. Verification finale complete — IP, utilisateur, SSH, logs.**

<details>
<summary>Voir la reponse</summary>

```bash
# IP et reseau
ip a
ip route
cat /etc/resolv.conf

# Utilisateur
id adminofppt
groups adminofppt

# SSH actif
systemctl status ssh      # Ubuntu
systemctl status sshd     # Fedora

# Logs recents
journalctl -u ssh -n 10   # Ubuntu
journalctl -u sshd -n 10  # Fedora

# Hostname
hostname -f
```

</details>

---

:::info Testez vos connaissances sur cette lecon

[Faire le quiz →](/quizzes/linux/ConfigurationDeBaseLinuxServer)

:::
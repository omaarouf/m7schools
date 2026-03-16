---
id: tp-Configuration-de-base
title: Configuration-de-base
---

# TP — Configuration de Base Linux Server

7 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 — Hostname et Verification Reseau (Facile)

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

Ajouter ou modifier :

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

## TP n°2 — Configuration IP avec nmcli (Facile-Moyen)

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

**2. Configurer une IP statique `192.168.1.50/24` avec gateway `192.168.1.1` et DNS `8.8.8.8` sur l interface principale.**

<details>
<summary>Voir la reponse</summary>

Ubuntu (ens3) :
```bash
nmcli connection modify ens3 ipv4.method manual
nmcli connection modify ens3 ipv4.addresses 192.168.1.50/24
nmcli connection modify ens3 ipv4.gateway 192.168.1.1
nmcli connection modify ens3 ipv4.dns 8.8.8.8
nmcli connection up ens3
```

Fedora (enp0s3) :
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

**5. Renouveler le bail DHCP.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
nmcli device reapply ens3
```

Fedora :
```bash
nmcli device reapply enp0s3
```

</details>

---

## TP n°3 — Configuration IP via Fichiers (Moyen)

**Objectif :** Configurer une IP statique permanente via les fichiers de configuration.

---

**1. Sur Ubuntu, creer le fichier Netplan avec une IP statique `10.0.0.10/24`, gateway `10.0.0.1`, DNS `1.1.1.1`.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

```yaml
network:
  version: 2
  ethernets:
    ens3:
      dhcp4: no
      addresses:
        - 10.0.0.10/24
      gateway4: 10.0.0.1
      nameservers:
        addresses:
          - 1.1.1.1
```

</details>

---

**2. Corriger les permissions du fichier Netplan et appliquer la configuration.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo chmod 600 /etc/netplan/01-netcfg.yaml
sudo netplan generate
sudo netplan apply
```

</details>

---

**3. Sur Fedora, afficher le contenu du fichier de configuration reseau.**

<details>
<summary>Voir la reponse</summary>

```bash
more /etc/sysconfig/network-scripts/ifcfg-enp0s3
```

</details>

---

**4. Sur Fedora, editer le fichier pour configurer une IP statique `10.0.0.10`, masque `255.255.255.0`, gateway `10.0.0.1`.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo nano /etc/sysconfig/network-scripts/ifcfg-enp0s3
```

```
DEVICE=enp0s3
BOOTPROTO=static
IPADDR=10.0.0.10
NETMASK=255.255.255.0
GATEWAY=10.0.0.1
DNS1=1.1.1.1
ONBOOT=yes
```

```bash
sudo chmod 600 /etc/sysconfig/network-scripts/ifcfg-enp0s3
sudo systemctl restart NetworkManager
```

</details>

---

**5. Configurer une IP temporaire `10.0.0.20/24` sur l interface sans modifier les fichiers.**

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

**6. Supprimer la configuration IP temporaire ajoutee.**

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

## TP n°4 — Gestion des Services et Packages (Moyen)

**Objectif :** Installer, demarrer et gerer des services Linux.

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

**3. Verifier que le service SSH est actif.**

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

**4. Installer nmap et verifier que le port 22 est ouvert sur le serveur local.**

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

**5. Sur Fedora, verifier si le package `dhcp` est installe.**

<details>
<summary>Voir la reponse</summary>

```bash
rpm -q dhcp
```

</details>

---

**6. Lister tous les packages installes et filtrer ceux qui contiennent `ssh`.**

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

**7. Redemarrer le service SSH apres modification de la configuration.**

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

## TP n°5 — SSH et Authentification par Cles (Moyen-Difficile)

**Objectif :** Configurer l authentification SSH par cles RSA.

---

**1. Generer un couple de cles RSA 4096 bits.**

<details>
<summary>Voir la reponse</summary>

```bash
ssh-keygen -t rsa -b 4096
```

Les cles sont generees dans :
- `~/.ssh/id_rsa` — cle privee
- `~/.ssh/id_rsa.pub` — cle publique

</details>

---

**2. Copier la cle publique vers un serveur distant `192.168.1.100` avec l utilisateur `omar`.**

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

**4. Copier un fichier local vers le serveur distant via SCP.**

<details>
<summary>Voir la reponse</summary>

```bash
scp fichier.txt omar@192.168.1.100:/home/omar/
```

</details>

---

**5. Copier un fichier depuis le serveur vers la machine locale.**

<details>
<summary>Voir la reponse</summary>

```bash
scp omar@192.168.1.100:/home/omar/fichier.txt /tmp/
```

</details>

---

**6. Securiser SSH en interdisant la connexion directe en root.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo nano /etc/ssh/sshd_config
```

Modifier ou ajouter :
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

**7. Verifier que le port 22 est en ecoute sur le serveur.**

<details>
<summary>Voir la reponse</summary>

```bash
netstat -tulnp | grep 22
# ou
ss -tulnp | grep 22
```

</details>

---

## TP n°6 — Gestion Utilisateurs et Diagnostic Reseau (Difficile)

**Objectif :** Gerer les utilisateurs et effectuer un diagnostic reseau complet.

---

**1. Creer un utilisateur `stagiaire` avec un mot de passe.**

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

**2. Ajouter `stagiaire` au groupe sudo (Ubuntu) ou wheel (Fedora).**

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

**3. Creer un groupe `formation` et ajouter `stagiaire` a ce groupe.**

<details>
<summary>Voir la reponse</summary>

```bash
groupadd formation
usermod -aG formation stagiaire
```

</details>

---

**4. Verifier les groupes de l utilisateur `stagiaire`.**

<details>
<summary>Voir la reponse</summary>

```bash
id stagiaire
groups stagiaire
```

</details>

---

**5. Effectuer un diagnostic reseau complet : afficher IP, table ARP, table de routage et sockets actifs.**

<details>
<summary>Voir la reponse</summary>

```bash
# Adresses IP
ip a

# Table ARP
arp -a
# ou
ip neigh

# Table de routage
ip route
# ou
route -n
# ou
netstat -nr

# Sockets actifs
netstat -an

# Applications qui ouvrent un port
netstat -anp

# Ports en ecoute
netstat -tulnp
```

</details>

---

**6. Scanner les ports ouverts sur la machine locale.**

<details>
<summary>Voir la reponse</summary>

```bash
nmap -sT 127.0.0.1
```

</details>

---

**7. Afficher les statistiques des interfaces reseau et identifier l interface active.**

<details>
<summary>Voir la reponse</summary>

```bash
netstat -i
# ou
ip -s link
```

</details>

---

## TP n°7 — Scenario Reel Complet (Difficile)

**Objectif :** Configurer un serveur Linux complet pour une entreprise `OFPPT`.

**Contexte :** Tu es administrateur systeme. Tu dois preparer un serveur Linux pour l entreprise OFPPT avec les parametres suivants :

| Parametre | Valeur |
|-----------|--------|
| Hostname | `srv-ofppt.ofppt.local` |
| Adresse IP | `192.168.10.1/24` |
| Gateway | `192.168.10.254` |
| DNS | `192.168.10.1` |
| Utilisateur admin | `adminofppt` |

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
192.168.10.1 srv-ofppt.ofppt.local srv-ofppt
```

</details>

---

**2. Configurer l IP statique via nmcli selon le tableau.**

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

**3. Creer l utilisateur `adminofppt` et l ajouter au groupe sudo/wheel.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
adduser adminofppt
usermod -aG sudo adminofppt
```

Fedora :
```bash
useradd adminofppt
passwd adminofppt
usermod -aG wheel adminofppt
```

</details>

---

**4. Installer et activer SSH sur le serveur.**

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

</details>

---

**5. Securiser SSH en interdisant la connexion root.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo nano /etc/ssh/sshd_config
```

```
PermitRootLogin no
PasswordAuthentication yes
```

Ubuntu : `sudo systemctl restart ssh`
Fedora : `sudo systemctl restart sshd`

</details>

---

**6. Verifier que tout est correctement configure : IP, SSH, utilisateur.**

<details>
<summary>Voir la reponse</summary>

```bash
# Verification IP
ip a
ip route
cat /etc/resolv.conf

# Verification SSH
systemctl status ssh   # Ubuntu
systemctl status sshd  # Fedora
nmap -p 22 127.0.0.1

# Verification utilisateur
id adminofppt
groups adminofppt
```

</details>

---

**7. Tester la connexion SSH depuis un autre poste vers le serveur avec l utilisateur `adminofppt`.**

<details>
<summary>Voir la reponse</summary>

```bash
ssh adminofppt@192.168.10.1
```

Si la cle SSH est configuree :
```bash
ssh-copy-id adminofppt@192.168.10.1
ssh adminofppt@192.168.10.1
```

</details>

---

:::info Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/linux/ConfigurationDeBaseLinuxServer)

:::
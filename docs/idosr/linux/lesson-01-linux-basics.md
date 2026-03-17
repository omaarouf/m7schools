---
id: lesson-01
title: Configuration de Base Linux Server
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



# Lecon 01 : Concepts Fondamentaux

---

## 1 Demons et Services Linux

###  Demon (Daemon)

Un **démon** est un programme qui travaille en arrière-plan. Sans les demons, il faudrait demarrer manuellement chaque service a chaque fois qu un client en a besoin. Grace aux demons, les services sont toujours disponibles,

**À quoi ça sert ?**

*Service continu* : Il offre un service (réseau ou système) 24h/24.

*Autonomie* : Il démarre souvent en même temps que l'ordinateur.

*Disponibilité* : Le service est toujours prêt.

---

### systemd — Gestionnaire de services

**systemd** est le systeme d initialisation et de gestion des services sur les distributions Linux modernes (Ubuntu, Fedora, Debian, Red Hat).

***Exemple***
```bash
# Demarrer un service
sudo systemctl start nomservice

# Arreter un service
sudo systemctl stop nomservice

# Redemarrer un service
sudo systemctl restart nomservice

# Recharger la configuration sans redemarrage
sudo systemctl reload nomservice

# Verifier l etat d un service
systemctl status nomservice

# Activer au demarrage
sudo systemctl enable nomservice

# Desactiver au demarrage
sudo systemctl disable nomservice

# Verifier si un service est actif
systemctl is-active nomservice

# Verifier si un service est active au demarrage
systemctl is-enabled nomservice
```

---

### Etats d un service

| Etat | Signification |
|------|--------------|
| `active (running)` | Le service tourne correctement |
| `inactive (dead)` | Le service est arrete |
| `failed` | Le service a rencontre une erreur |
| `activating` | Le service est en cours de demarrage |
| `enabled` | Le service demarre automatiquement au boot |
| `disabled` | Le service ne demarre pas au boot |

---

### journalctl — Consulter les logs
```bash
# Voir tous les logs
journalctl

# Logs d un service specifique
journalctl -u sshd

# Logs en temps reel
journalctl -f

# Logs depuis le dernier boot
journalctl -b

# Derniers 50 logs d un service
journalctl -u named -n 50

# Logs avec erreurs uniquement
journalctl -p err
```

---

### Notions

| Notion | Definition |
|--------|-----------|
| **Socket** | Combinaison IP + Port. Ex : `192.168.1.1:22` |
| **PID** | Process ID — numero unique attribue a chaque processus |
| **Init system** | Premier processus lance au boot (systemd sur les distros modernes) |

---


## 2. Hostname

Le hostname identifie ton serveur dans le reseau. Il doit correspondre au DNS si utilise.

**Fichiers concernes :**
- `/etc/hostname`
- `/etc/hosts`

### Configurer le hostname

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
hostnamectl set-hostname srv1.ofppt.local
```

Modifier aussi `/etc/hosts` :

```
127.0.0.1   localhost
127.0.1.1   srv1.ofppt.local srv1
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
hostnamectl set-hostname srv1.ofppt.local
```

Modifier aussi `/etc/hosts` :

```
127.0.0.1   localhost
127.0.1.1   srv1.ofppt.local srv1
```

</TabItem>
</Tabs>

### Verification

```bash
hostname
hostname -f
```

---

## 3. Configuration IP via nmcli (NetworkManager)

`nmcli` est l'outil en ligne de commande de NetworkManager pour gerer les connexions reseau.

### Installer NetworkManager

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt update
sudo apt install network-manager -y

sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo dnf install NetworkManager -y

sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager
```

</TabItem>
</Tabs>

### IP Statique + Gateway + DNS

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
nmcli connection modify ens3 ipv4.method manual
nmcli connection modify ens3 ipv4.addresses 172.16.1.50/24
nmcli connection modify ens3 ipv4.gateway 172.16.1.1
nmcli connection modify ens3 ipv4.dns 8.8.8.8
nmcli connection up ens3
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
nmcli connection modify enp0s3 ipv4.method manual
nmcli connection modify enp0s3 ipv4.addresses 172.16.1.50/24
nmcli connection modify enp0s3 ipv4.gateway 172.16.1.1
nmcli connection modify enp0s3 ipv4.dns 8.8.8.8
nmcli connection up enp0s3
```
### Permissions (important)

Si les permissions sont trop ouvertes, Netplan affiche un avertissement et refuse d'appliquer la configuration :
```bash
sudo chmod 600 /etc/netplan/01-netcfg.yaml
sudo netplan apply
```
</TabItem>
</Tabs>

### Configurer en DHCP

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
nmcli connection modify ens3 ipv4.method auto
nmcli connection up ens3
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
nmcli connection modify enp0s3 ipv4.method auto
nmcli connection up enp0s3
```

</TabItem>
</Tabs>

### Renouveler DHCP

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
nmcli device reapply ens3
# ou
dhclient -r ens3
dhclient ens3
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
nmcli device reapply enp0s3
# ou
dhclient -r enp0s3
dhclient enp0s3
```

</TabItem>
</Tabs>

### Verification

> Bonne pratique : apres chaque configuration reseau, toujours configurer puis verifier.

| Commande | Verification |
|----------|-------------|
| `ip a` | Verifie que l'adresse IP est bien assignee a l'interface |
| `ip route` | Verifie que la passerelle par defaut est correcte |
| `cat /etc/resolv.conf` | Verifie que le DNS est bien configure |

## 4. Configuration IP Statique (Fichiers)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

Ubuntu Server utilise **Netplan** pour la configuration reseau permanente.

**Fichier :** `/etc/netplan/*.yaml`

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
        - 172.16.1.50/24
      gateway4: 172.16.1.1
      nameservers:
        addresses:
          - 8.8.8.8
```
### Permissions (important)

Si les permissions sont trop ouvertes, Netplan affiche un avertissement et refuse d'appliquer la configuration ondoit faire:
```bash
sudo chmod 600 /etc/netplan/01-netcfg.yaml
sudo netplan apply
```

```
Puis: 
```bash
sudo netplan generate
sudo netplan apply
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

Red Hat / Fedora utilise les fichiers dans `/etc/sysconfig/network-scripts/`.

**Fichier :** `/etc/sysconfig/network-scripts/ifcfg-enp0s3`

```bash
more /etc/sysconfig/network-scripts/ifcfg-enp0s3
```

Exemple de contenu :

```
DEVICE=enp0s3
BOOTPROTO=static
IPADDR=192.168.1.10
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=8.8.8.8
ONBOOT=yes
```

```bash
sudo chmod 600 /etc/sysconfig/network-scripts/ifcfg-eth0
sudo systemctl restart NetworkManager
```

### Permissions (important)


```bash
sudo systemctl restart network
```

</TabItem>
</Tabs>

---

## 5. Configuration IP via Shell (Temporaire)

> **Important :** Ces commandes sont temporaires. Apres redemarrage, la configuration est perdue.



<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Ajouter une IP
sudo ip addr add 192.168.1.10/24 dev ens3

# Activer / desactiver une interface
sudo ip link set ens3 up
sudo ip link set ens3 down

# Configurer la passerelle par defaut
sudo ip route add default via 192.168.1.1

# Supprimer une passerelle
sudo ip route del default

# Supprimer la configuration IP
sudo ip addr flush dev ens3

# Verification
ip a
ip route
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Ajouter une IP
sudo ip addr add 192.168.1.10/24 dev enp0s3

# Activer / desactiver une interface
sudo ip link set enp0s3 up
sudo ip link set enp0s3 down

# Configurer la passerelle par defaut
sudo ip route add default via 192.168.1.1

# Supprimer une passerelle
sudo ip route del default

# Supprimer la configuration IP
sudo ip addr flush dev enp0s3

# Verification
ip a
ip route
```

</TabItem>
</Tabs>

---


## 6. Gestion des Packages

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

Ubuntu utilise **apt** comme gestionnaire de packages.

```bash
# Mettre a jour la liste des packages
sudo apt update

# Installer un package
sudo apt install nompackage -y

# Desinstaller un package
sudo apt remove nompackage

# Mettre a jour un package
sudo apt upgrade nompackage

# Lister les packages installes
dpkg -l

# Verifier l existence d un package
dpkg -l | grep dhcp
# ou
apt list --installed | grep dhcp
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

Red Hat / Fedora utilise **rpm** et **dnf** comme gestionnaires de packages.

```bash
# Installer un fichier .rpm
rpm -ivh fichier.rpm

# Desinstaller un package
rpm -e nompackage

# Mettre a jour un package
rpm -uvh fichier.rpm

# Lister tous les packages installes
rpm -qa

# Verifier l existence d un package (ex: dhcp)
rpm -q dhcp

# Avec dnf (recommande)
sudo dnf install nompackage -y
sudo dnf remove nompackage
sudo dnf update nompackage
sudo dnf list installed
sudo dnf list installed | grep dhcp
```

</TabItem>
</Tabs>

---


### netstat — Statistiques reseau

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Installer net-tools si absent
sudo apt install net-tools -y

# Afficher la table de routage
netstat -nr

# Afficher les statistiques des interfaces
netstat -i

# Afficher les sockets actifs
netstat -an

# Afficher les applications qui ouvrent un port
netstat -anp

# Afficher ports TCP/UDP en ecoute avec processus
netstat -tulnp
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Installer net-tools si absent
sudo dnf install net-tools -y

# Afficher la table de routage
netstat -nr

# Afficher les statistiques des interfaces
netstat -i

# Afficher les sockets actifs
netstat -an

# Afficher les applications qui ouvrent un port
netstat -anp

# Afficher ports TCP/UDP en ecoute avec processus
netstat -tulnp
```

</TabItem>
</Tabs>


---
## 7. SSH — Secure Shell

**SSH (Secure Shell)** est un outil qui permet de se connecter à un autre ordinateur (souvent un serveur) à distance, d'une manière sécurisée grâce au chiffrement, à l'intégrité et à l'authenticité.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">
```bash
# Installer SSH
sudo apt install openssh-server -y

# Activer et demarrer SSH
sudo systemctl enable ssh
sudo systemctl start ssh

# Verifier le statut
systemctl status ssh

# Connexion depuis un client
ssh omar@192.168.7.10
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">
```bash
# Installer SSH
sudo dnf install openssh-server -y

# Activer et demarrer SSH
sudo systemctl enable sshd
sudo systemctl start sshd

# Verifier le statut
systemctl status sshd

# Connexion depuis un client
ssh omar@192.168.7.10
```
</TabItem>
</Tabs>

### Commandes SSH et leurs rôles
| Commande | Role | Remplace |
|----------|------|---------|
| `sshd` | Demon SSH — logiciel serveur actif sur le port TCP 22 | — |
| `ssh` | Connexion et execution de commandes a distance | `rlogin`, `rsh` |
| `scp` | Copier un fichier a distance de maniere securisee | `rcp` |
| `ssh-keygen` | Generer un couple de cles publique/privee (RSA ou DSA) | — |

### Exemples scp
```bash
# Copier un fichier local vers un serveur distant
scp fichier.txt omar@192.168.7.10:/home/omar/

# Copier un fichier distant vers la machine locale
scp omar@192.168.7.10:/home/omar/fichier.txt /tmp/

# Copier un dossier entier (recursif)
scp -r dossier/ omar@192.168.7.10:/home/omar/
```


### Securisation SSH (base)

Fichier de configuration : `/etc/ssh/sshd_config`
```
PermitRootLogin no
PasswordAuthentication yes
```

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">
```bash
sudo systemctl restart ssh
systemctl status ssh
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">
```bash
sudo systemctl restart sshd
systemctl status sshd
```

</TabItem>
</Tabs>

---


## 8. Gestion Utilisateurs et Groupes

### Creer un utilisateur

```bash
# Ubuntu — cree le repertoire home automatiquement et demande le mot de passe
adduser user1

# Fedora / Red Hat — plus manuel
useradd user1
passwd user1          # definir le mot de passe

# Creer un utilisateur avec un repertoire home specifique
useradd -d /home/user1 -m user1

# Creer un utilisateur avec un shell specifique
useradd -s /bin/bash user1


```

---



### Modifier un utilisateur

```bash

# Ajouter au groupe sudo 
usermod -aG sudo user1


# Ajouter a plusieurs groupes
usermod -aG sudo,admins,www-data user1

# Changer son propre mot de passe
passwd

# Changer le mot de passe d un autre utilisateur (root uniquement)
passwd user1

# Forcer l utilisateur a changer son mot de passe a la prochaine connexion
passwd -e user1

# Renommer un utilisateur
usermod -l nouveaunom anciennom

# Supprimer un utilisateur (garde le repertoire home)
userdel user1

# Supprimer un utilisateur ET son repertoire home
userdel -r user1

```
---

### Gestion des groupes

```bash
# Creer un groupe
groupadd admins

# Creer un groupe avec un GID specifique
groupadd -g 1500 admins

# Renommer un groupe
groupmod -n nouveau_nom ancien_nom

# Supprimer un groupe
groupdel admins

# Ajouter un utilisateur a un groupe
usermod -aG admins user1

# Retirer un utilisateur d un groupe
gpasswd -d user1 admins
```

---

### Fichiers systeme importants

| Fichier | Contenu |
|---------|---------|
| `/etc/passwd` | Liste des utilisateurs (nom, UID, GID, home, shell) |
| `/etc/shadow` | Mots de passe chiffres et politiques de mots de passe |
| `/etc/group` | Liste des groupes et leurs membres |
| `/etc/gshadow` | Mots de passe des groupes |

### Vérification
```bash
# Afficher les informations d un utilisateur
id user1

# Afficher les groupes d un utilisateur
groups user1

# Afficher le contenu de /etc/passwd pour un utilisateur
grep user1 /etc/passwd

# Afficher tous les utilisateurs
cat /etc/passwd

# Afficher tous les groupes
cat /etc/group

# Afficher qui est connecte
who
w
```

---

### Structure de /etc/passwd

```
user1 : x : 1001 : 1001 : Description : /home/user1 : /bin/bash
  |     |    |      |         |               |              |
  nom   mdp  UID   GID    commentaire       home           shell
```

---



:::info Testez vos connaissances sur cette lecon

<Tabs>
  <TabItem value="quizzes" label="Quizzes">

[Faire le quiz →](/quizzes/linux/ConfigurationDeBaseLinuxServer)

  </TabItem>
  <TabItem value="tp" label="TP">

[Faire les TP →](/TP/linux/TpLinuxServer)

  </TabItem>
</Tabs>

:::
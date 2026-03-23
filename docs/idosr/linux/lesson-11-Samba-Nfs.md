---
id: lesson-11
title:  Samba et nfs 
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Samba et NFS — Partage de fichiers réseau

---

## Partie 1 — Samba

### 1. Installation

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt install samba -y
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo dnf install samba samba-client -y
```

</TabItem>
</Tabs>

---

### 2. Fichiers de configuration

| Fichier | Rôle |
|---------|------|
| `/etc/samba/smb.conf` | Configuration principale |
| `/var/lib/samba/private/passdb.tdb` | Base de données des mots de passe Samba |
| `/var/log/samba/` | Logs Samba |

---

### 3. Configuration principale

Éditer `/etc/samba/smb.conf` :

```bash
[global]
   workgroup = WORKGROUP
   server string = Serveur Samba
   security = user
   map to guest = bad user

# Partage avec authentification
[data]
   path = /srv/samba/data
   browseable = yes
   writable = yes
   valid users = @sambausers
   create mask = 0660
   directory mask = 0770

# Partage public (sans mot de passe)
[public]
   path = /srv/samba/public
   browseable = yes
   writable = no
   guest ok = yes
```

---

### 4. Créer un utilisateur Samba

L'utilisateur doit d'abord exister en tant qu'utilisateur Linux.

```bash
sudo useradd -M -s /sbin/nologin sambauser  # Créer un utilisateur sans home ni shell
sudo smbpasswd -a sambauser                 # Ajouter à Samba et définir le mot de passe
sudo smbpasswd -e sambauser                 # Activer le compte
sudo smbpasswd -d sambauser                 # Désactiver le compte
sudo smbpasswd -x sambauser                 # Supprimer le compte Samba
```

---

### 5. Démarrage du service

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo systemctl enable --now smbd nmbd
sudo systemctl restart smbd nmbd
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo systemctl enable --now smb
sudo systemctl restart smb
```

</TabItem>
</Tabs>

---

### 6. Vérifier la syntaxe et les erreurs

```bash
testparm                          # Vérifier la syntaxe de smb.conf
testparm -s                       # Afficher la config finale sans commentaires
smbclient -L localhost -N         # Lister les partages disponibles localement
```

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
journalctl -u samba -f            # Logs en temps réel
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
journalctl -u smb -f              # Logs en temps réel
```

</TabItem>
</Tabs>

---

### 7. Tester la connexion depuis un client Linux

```bash
smbclient //192.168.1.1/data -U sambauser
```

---

### 8. Pare-feu

Samba utilise les ports 139 et 445 :

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo ufw allow 139/tcp
sudo ufw allow 445/tcp
sudo ufw allow 137/udp
sudo ufw allow 138/udp
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo firewall-cmd --add-service=samba --permanent
sudo firewall-cmd --reload
```

</TabItem>
</Tabs>

---
### Resume
```bash
# ─── 1. Installation ───────────────────────────────────────────────────────────
sudo apt install samba smbclient cifs-utils -y

# ─── 2. Créer l'utilisateur Linux ──────────────────────────────────────────────
sudo useradd -M -s /sbin/nologin sambauser
sudo smbpasswd -a sambauser        # Définir le mot de passe Samba
sudo smbpasswd -e sambauser        # Activer le compte

# ─── 3. Créer les dossiers de partage ──────────────────────────────────────────
sudo mkdir -p /srv/samba/data
sudo mkdir -p /srv/samba/public
sudo chown -R sambauser:sambauser /srv/samba/data
sudo chmod 0770 /srv/samba/data
sudo chmod 0775 /srv/samba/public

# ─── 4. Configurer smb.conf ────────────────────────────────────────────────────
sudo nano /etc/samba/smb.conf
# Ajouter à la fin :
#
# [data]
#    path = /srv/samba/data
#    browseable = yes
#    writable = yes
#    valid users = sambauser
#    create mask = 0660
#    directory mask = 0770
#
# [public]
#    path = /srv/samba/public
#    browseable = yes
#    writable = no
#    guest ok = yes

# ─── 5. Vérifier la syntaxe ────────────────────────────────────────────────────
testparm

# ─── 6. Démarrer les services ──────────────────────────────────────────────────
sudo systemctl enable --now smbd nmbd
sudo systemctl restart smbd nmbd

# ─── 7. Tester en local ────────────────────────────────────────────────────────
smbclient -L localhost -N
smbclient //localhost/data -U sambauser

# ─── 8. Tester depuis un client Linux ──────────────────────────────────────────
sudo mkdir -p /mnt/samba
sudo mount -t cifs //192.168.7.41/data /mnt/samba -o username=sambauser

# ─── 9. Tester depuis Windows ──────────────────────────────────────────────────
# Explorateur : \\192.168.7.41\data
# PowerShell  :
# net use Z: \\192.168.7.41\data /user:sambauser

```

---
### 9. SELinux sur Red Hat

Sur Red Hat/Rocky, SELinux peut bloquer Samba même si la configuration est correcte :

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# SELinux non applicable sur Ubuntu/Debian
# AppArmor est utilisé à la place — aucune action requise pour Samba
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo setsebool -P samba_enable_home_dirs on
sudo setsebool -P samba_export_all_rw on
```

</TabItem>
</Tabs>

---

## Partie 2 — NFS (Network File System)

### 1. Installation

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Serveur
sudo apt install nfs-kernel-server -y

# Client
sudo apt install nfs-common -y
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Serveur
sudo dnf install nfs-utils -y

# Client
sudo dnf install nfs-utils -y
```

</TabItem>
</Tabs>

---

### 2. Fichiers de configuration

| Fichier | Rôle |
|---------|------|
| `/etc/exports` | Définition des partages NFS |
| `/var/lib/nfs/etab` | Table interne des exports actifs |
| `/etc/fstab` | Montages persistants côté client |

---

### 3. Configurer les partages

Éditer `/etc/exports` :

```bash
# Syntaxe : <répertoire> <client>(<options>)

/srv/data    192.168.1.0/24(rw,sync,no_subtree_check)
/srv/public  *(ro,sync,no_subtree_check)
/srv/admin   192.168.1.10(rw,sync,no_root_squash)
```

| Option | Description |
|--------|-------------|
| `rw` | Lecture et écriture |
| `ro` | Lecture seule |
| `sync` | Écriture synchrone, plus sûr |
| `no_subtree_check` | Désactive la vérification de sous-arborescence, améliore les performances |
| `no_root_squash` | Le root client garde ses privilèges root sur le partage |
| `root_squash` | Le root client est mappé sur nobody (défaut, plus sûr) |

---

### 4. Commandes côté serveur

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo systemctl enable --now nfs-kernel-server  # Démarrer le serveur NFS
sudo exportfs -a                               # Appliquer /etc/exports sans redémarrer
sudo exportfs -r                               # Recharger et re-exporter
sudo exportfs -v                               # Afficher les partages actifs
showmount -e localhost                         # Lister les partages exportés
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo systemctl enable --now nfs-server         # Démarrer le serveur NFS
sudo exportfs -a                               # Appliquer /etc/exports sans redémarrer
sudo exportfs -r                               # Recharger et re-exporter
sudo exportfs -v                               # Afficher les partages actifs
showmount -e localhost                         # Lister les partages exportés
```

</TabItem>
</Tabs>

---

### 5. Commandes côté client

```bash
showmount -e 192.168.1.1                              # Lister les partages disponibles
sudo mount -t nfs 192.168.1.1:/srv/data /mnt/data     # Monter un partage manuellement
sudo umount /mnt/data                                 # Démonter
```

---

### 6. Montage persistant — /etc/fstab

```bash
192.168.1.1:/srv/data  /mnt/data  nfs  defaults,_netdev  0  0
```

:::info `_netdev`
L'option `_netdev` indique au système d'attendre que le réseau soit disponible avant de monter le partage au démarrage.
:::

---

### 7. Vérifier la syntaxe et les erreurs

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo exportfs -v                        # Vérifier les exports actifs
journalctl -u nfs-kernel-server -f      # Logs en temps réel
showmount -e localhost                  # Confirmer que les partages sont bien exportés
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo exportfs -v                        # Vérifier les exports actifs
journalctl -u nfs-server -f             # Logs en temps réel
showmount -e localhost                  # Confirmer que les partages sont bien exportés
```

</TabItem>
</Tabs>

---

### 8. Pare-feu

NFS utilise le port 2049 :

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo ufw allow 2049/tcp
sudo ufw allow 2049/udp
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo firewall-cmd --add-service=nfs --permanent
sudo firewall-cmd --reload
```

</TabItem>
</Tabs>


### Resume

```bash
# ─── 1. Installation ───────────────────────────────────────────────────────────
sudo apt install nfs-kernel-server -y          # Serveur
sudo apt install nfs-common -y                 # Client

# ─── 2. Créer les dossiers de partage ──────────────────────────────────────────
sudo mkdir -p /srv/nfs/data
sudo mkdir -p /srv/nfs/public
sudo chown -R nobody:nogroup /srv/nfs/data
sudo chown -R nobody:nogroup /srv/nfs/public
sudo chmod 0770 /srv/nfs/data
sudo chmod 0775 /srv/nfs/public

# ─── 3. Configurer /etc/exports ────────────────────────────────────────────────
sudo nano /etc/exports
# Ajouter :
#
# /srv/nfs/data    192.168.7.0/24(rw,sync,no_subtree_check)
# /srv/nfs/public  *(ro,sync,no_subtree_check)

# ─── 4. Appliquer les exports ──────────────────────────────────────────────────
sudo exportfs -a
sudo exportfs -v                               # Vérifier les partages actifs

# ─── 5. Démarrer le service ────────────────────────────────────────────────────
sudo systemctl enable --now nfs-kernel-server
sudo systemctl restart nfs-kernel-server

# ─── 6. Vérifier les partages exportés ────────────────────────────────────────
showmount -e localhost

# ─── 7. Tester depuis un client Linux ──────────────────────────────────────────
sudo apt install nfs-common -y                 # Sur le client
showmount -e 192.168.7.41                      # Lister les partages disponibles
sudo mkdir -p /mnt/nfs
sudo mount -t nfs 192.168.7.41:/srv/nfs/data /mnt/nfs
df -h | grep nfs                               # Vérifier le montage

# ─── 8. Montage persistant /etc/fstab (client) ────────────────────────────────
# Ajouter dans /etc/fstab :
# 192.168.7.41:/srv/nfs/data  /mnt/nfs  nfs  defaults,_netdev  0  0

# ─── 9. Démonter ───────────────────────────────────────────────────────────────
sudo umount /mnt/nfs
```
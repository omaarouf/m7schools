---
id: lesson-04
title: LVM - Gestion des Volumes Logiques
sidebar_label: LVM - Gestion des Disques
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> **Objectif :** Comprendre et maitriser LVM (Logical Volume Manager) pour creer, etendre, reduire et supprimer des volumes logiques sous Linux.

---

## 1. Presentation

Le but principal de LVM (Logical Volume Manager) sous Linux est d'offrir une gestion flexible
et dynamique de l'espace de stockage, dépassant les limites du partitionnement classique.

Il permet de redimensionner, créer ou déplacer des partitions (volumes logiques) à chaud
sans interrompre le système, tout en agrégeant plusieurs disques physiques en un seul grand
espace de stockage (groupe de volumes)

LVM est un **outil kernel** — il n'y a pas de demon principal. Le service `lvm2-monitor` assure uniquement la surveillance.

### 1.1 Installation

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt install lvm2 -y
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo dnf install lvm2 -y
```

</TabItem>
</Tabs>

### 1.2 Fichiers principaux

| Fichier | Role |
|---|---|
| `/etc/lvm/lvm.conf` | Configuration globale LVM |
| `/etc/fstab` | Montages permanents des volumes logiques |

---

## 2. Ordre Obligatoire de Creation 

:::info ``` PVLMM ```
```
PV  →  VG  →  LV  →  mkfs  →  mount
```
**PV d'abord, toujours.** Inverser cet ordre provoque des erreurs irrecuperables.
:::

| Etape | Composant | Description |
|---|---|---|
| 1 | **PV** — Physical Volume | Disque physique initialise pour LVM |
| 2 | **VG** — Volume Group | Groupe de disques physiques |
| 3 | **LV** — Logical Volume | Volume logique decoupe depuis le VG |
| 4 | **mkfs** | Formatage du volume logique |
| 5 | **mount** | Montage dans l'arborescence Linux |

---

## 3. Creation pas a pas

### 3.1 Creer des volumes physiques (PV)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Initialiser un seul disque
sudo pvcreate /dev/sdb

# Initialiser plusieurs disques en une commande
sudo pvcreate /dev/sdc /dev/sdd

# Verifier
sudo pvs
sudo pvdisplay
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Initialiser un seul disque
sudo pvcreate /dev/sdb

# Initialiser plusieurs disques en une commande
sudo pvcreate /dev/sdc /dev/sdd

# Verifier
sudo pvs
sudo pvdisplay
```

</TabItem>
</Tabs>

### 3.2 Creer un groupe de volumes (VG)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Creer le VG avec plusieurs PV
sudo vgcreate NomVG /dev/sdb /dev/sdc

# Verifier
sudo vgs
sudo vgdisplay
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Creer le VG avec plusieurs PV
sudo vgcreate NomVG /dev/sdb /dev/sdc

# Verifier
sudo vgs
sudo vgdisplay
```

</TabItem>
</Tabs>

### 3.3 Creer un volume logique (LV)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Creer un LV avec une taille fixe
sudo lvcreate -L 50G -n NomLV NomVG

# Creer un LV qui utilise tout l'espace disponible
sudo lvcreate -l 100%FREE -n NomLV NomVG

# Verifier
sudo lvs
sudo lvdisplay
sudo lvscan
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Creer un LV avec une taille fixe
sudo lvcreate -L 50G -n NomLV NomVG

# Creer un LV qui utilise tout l'espace disponible
sudo lvcreate -l 100%FREE -n NomLV NomVG

# Verifier
sudo lvs
sudo lvdisplay
sudo lvscan
```

</TabItem>
</Tabs>

### 3.4 Formater et monter

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Formater en ext4
sudo mkfs.ext4 /dev/NomVG/NomLV

# Creer le point de montage et monter
sudo mkdir -p /mnt/data
sudo mount /dev/NomVG/NomLV /mnt/data
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Formater en xfs (format par defaut sur Fedora)
sudo mkfs.xfs /dev/NomVG/NomLV

# Creer le point de montage et monter
sudo mkdir -p /mnt/data
sudo mount /dev/NomVG/NomLV /mnt/data
```

</TabItem>
</Tabs>

**Montage permanent dans `/etc/fstab` :**

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/fstab
```

```fstab title="/etc/fstab"
/dev/NomVG/NomLV   /mnt/data   ext4   defaults   0 2
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/fstab
```

```fstab title="/etc/fstab"
/dev/NomVG/NomLV   /mnt/data   xfs   defaults   0 2
```

</TabItem>
</Tabs>

---

## 4. Etendre un VG et un LV

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# 1. Initialiser le nouveau disque comme PV
sudo pvcreate /dev/sde

# 2. Ajouter le PV au VG existant
sudo vgextend NomVG /dev/sde

# 3. Etendre le LV
sudo lvextend -L +20G /dev/NomVG/NomLV

# 4. Etendre le systeme de fichiers SANS demonter
sudo resize2fs /dev/NomVG/NomLV
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# 1. Initialiser le nouveau disque comme PV
sudo pvcreate /dev/sde

# 2. Ajouter le PV au VG existant
sudo vgextend NomVG /dev/sde

# 3. Etendre le LV
sudo lvextend -L +20G /dev/NomVG/NomLV

# 4. Etendre le systeme de fichiers SANS demonter (XFS)
sudo xfs_growfs /mnt/data
```

</TabItem>
</Tabs>


:::tip Extension a chaud
Avec **ext4** et **XFS**, l'extension peut se faire **sans demonter** le volume. C'est l'un des grands avantages de LVM en production.
:::

---

## 5. Reduire un LV

:::danger Ordre OBLIGATOIRE pour la reduction — ext4 uniquement
```
umount → e2fsck → resize2fs → lvreduce → mount
```
**resize2fs AVANT lvreduce, toujours.** Inverser cet ordre detruit les donnees.
:::

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# 1. Demonter le volume
sudo umount /mnt/data

# 2. Verifier le systeme de fichiers   `e2fsck = ext2 file system check`
sudo e2fsck -f /dev/NomVG/NomLV

# 3. Reduire le systeme de fichiers    `resize2fs = resize ext2 file system`
sudo resize2fs /dev/NomVG/NomLV 30G  

# 4. Reduire le volume logique
sudo lvreduce -L 30G /dev/NomVG/NomLV

# 5. Remonter
sudo mount /dev/NomVG/NomLV /mnt/data
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# 1. Demonter le volume
sudo umount /mnt/data

# 2. Verifier le systeme de fichiers
sudo e2fsck -f /dev/NomVG/NomLV

# 3. Reduire le systeme de fichiers
sudo resize2fs /dev/NomVG/NomLV 30G

# 4. Reduire le volume logique
sudo lvreduce -L 30G /dev/NomVG/NomLV

# 5. Remonter
sudo mount /dev/NomVG/NomLV /mnt/data
```

</TabItem>
</Tabs>

:::warning XFS ne peut pas etre reduit
**XFS** ne supporte que l'extension, **jamais la reduction**. Si vous avez besoin de reduire, il faut sauvegarder les donnees, supprimer le volume et le recreer.
:::

---

## 6. Snapshots

Un snapshot est une **copie instantanee** de l'etat d'un volume a un moment donne. Utile avant une mise a jour risquee ou une modification de base de donnees.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Creer un snapshot (10G d'espace pour stocker les differences)

sudo lvcreate --size 10G --snapshot --name snap1 /dev/NomVG/NomLV

# Vérifier
sudo lvs

# Restaurer
sudo umount /mnt/data
sudo lvconvert --merge /dev/NomVG/snap1
sudo mount /dev/NomVG/NomLV /mnt/data

# OU supprimer sans restaurer
sudo lvremove /dev/NomVG/snap1
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Creer un snapshot (10G d'espace pour stocker les differences)
sudo lvcreate --size 10G --snapshot --name snap1 /dev/NomVG/NomLV

# Restaurer depuis un snapshot (le LV doit etre demonte)
sudo umount /mnt/data
sudo lvconvert --merge /dev/NomVG/snap1

# Supprimer un snapshot
sudo lvremove /dev/NomVG/snap1
```

</TabItem>
</Tabs>

:::info Comment fonctionne un snapshot
Le snapshot ne copie pas toutes les donnees immediatement. Il enregistre uniquement les **blocs modifies** apres sa creation (Copy-on-Write). Plus vous modifiez de donnees apres le snapshot, plus il consomme d'espace.
:::

---

## 7. Suppression (ordre OBLIGATOIRE)

:::danger Ordre de suppression
```
umount → lvremove → vgremove → pvremove
```
:::

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# 1. Demonter
sudo umount /mnt/data

# 2. Supprimer le volume logique
sudo lvremove /dev/NomVG/NomLV

# 3. Supprimer le groupe de volumes
sudo vgremove NomVG

# 4. Supprimer les volumes physiques
sudo pvremove /dev/sdb /dev/sdc
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# 1. Demonter
sudo umount /mnt/data

# 2. Supprimer le volume logique
sudo lvremove /dev/NomVG/NomLV

# 3. Supprimer le groupe de volumes
sudo vgremove NomVG

# 4. Supprimer les volumes physiques
sudo pvremove /dev/sdb /dev/sdc
```

</TabItem>
</Tabs>

---

## 8. Commandes de Reference

### 8.1 Commandes de Verification et Diagnostic

Apres chaque operation LVM, il est important de verifier l'etat du systeme. Voici les commandes essentielles.

#### Verifier les disques et partitions disponibles


```bash
# Afficher tous les disques et leurs partitions (vue arborescente)
lsblk

# Afficher avec la taille des systemes de fichiers
lsblk -f

# Afficher uniquement les disques sans partitions LVM
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
```



#### Verifier l'espace disque utilise

```bash
# Afficher l'espace utilise sur tous les volumes montes
df

# Afficher en format lisible (Go, Mo)
df -h

# Afficher uniquement un point de montage specifique
df -h /mnt/data

# Afficher le type de systeme de fichiers
df -hT
```

#### Verifier l'espace utilise dans un dossier

```bash
# Taille totale d'un dossier
du -sh /mnt/data

# Taille de chaque sous-dossier
du -h /mnt/data

# Taille des 10 dossiers les plus lourds
du -h /mnt/data | sort -rh | head -10
```

### 8.2 Resume 
| Commande | Usage |
|---|---|
| `lsblk` | Voir tous les disques et leur organisation |
| `lsblk -f` | Voir le type de systeme de fichiers de chaque partition |
| `df -h` | Voir l'espace utilise/disponible sur les volumes montes |
| `df -hT` | Idem avec le type de systeme de fichiers |
| `du -sh /dossier` | Voir la taille totale d'un dossier specifique |


<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# --- PV ---
sudo pvcreate /dev/sdX          # initialiser un disque
sudo pvs                        # liste courte
sudo pvdisplay                  # details complets
sudo pvremove /dev/sdX          # supprimer

# --- VG ---
sudo vgcreate NomVG /dev/sdX    # creer
sudo vgextend NomVG /dev/sdX    # ajouter un PV
sudo vgreduce NomVG /dev/sdX    # retirer un PV
sudo vgs                        # liste courte
sudo vgdisplay                  # details complets
sudo vgremove NomVG             # supprimer

# --- LV ---
sudo lvcreate -L 50G -n NomLV NomVG       # creer (taille fixe)
sudo lvcreate -l 100%FREE -n NomLV NomVG  # tout l'espace
sudo lvextend -L +20G /dev/NomVG/NomLV    # etendre
sudo lvreduce -L 30G /dev/NomVG/NomLV     # reduire
sudo lvs                                   # liste courte
sudo lvdisplay                             # details complets
sudo lvscan                                # scanner tous les LV
sudo lvremove /dev/NomVG/NomLV            # supprimer

# --- Systeme de fichiers ---
sudo mkfs.ext4 /dev/NomVG/NomLV   # formater ext4
sudo resize2fs /dev/NomVG/NomLV   # redimensionner ext4
sudo e2fsck -f /dev/NomVG/NomLV   # verifier ext4
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# --- PV ---
sudo pvcreate /dev/sdX          # initialiser un disque
sudo pvs                        # liste courte
sudo pvdisplay                  # details complets
sudo pvremove /dev/sdX          # supprimer

# --- VG ---
sudo vgcreate NomVG /dev/sdX    # creer
sudo vgextend NomVG /dev/sdX    # ajouter un PV
sudo vgreduce NomVG /dev/sdX    # retirer un PV
sudo vgs                        # liste courte
sudo vgdisplay                  # details complets
sudo vgremove NomVG             # supprimer

# --- LV ---
sudo lvcreate -L 50G -n NomLV NomVG       # creer (taille fixe)
sudo lvcreate -l 100%FREE -n NomLV NomVG  # tout l'espace
sudo lvextend -L +20G /dev/NomVG/NomLV    # etendre
sudo lvreduce -L 30G /dev/NomVG/NomLV     # reduire
sudo lvs                                   # liste courte
sudo lvdisplay                             # details complets
sudo lvscan                                # scanner tous les LV
sudo lvremove /dev/NomVG/NomLV            # supprimer

# --- Systeme de fichiers ---
sudo mkfs.xfs /dev/NomVG/NomLV    # formater xfs
sudo xfs_growfs /mnt/data          # etendre xfs
sudo e2fsck -f /dev/NomVG/NomLV   # verifier ext4
```

</TabItem>
</Tabs>
## Pour aller plus loin
 
- [Quiz ](/quizzes/linux/quizzLVM) — testez vos connaissances sur ce cours
- [TP ](/TP/linux/tp-LVM) — mise en pratique guidee
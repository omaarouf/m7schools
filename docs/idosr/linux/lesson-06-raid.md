---
id: lesson-06
title: RAID LOGICIEL – mdadm
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> Comprendre les niveaux RAID et configurer un RAID logiciel sous Linux avec l'outil mdadm pour assurer la redondance et la tolerance aux pannes du stockage.

## 1. Qu'est-ce que le RAID ?

Le RAID (Redundant Array of Independent Disks) est un ensemble de techniques de virtualisation du stockage permettant de repartir des donnees sur plusieurs disques durs afin d'ameliorer soit les performances, soit la securite ou la tolerance aux pannes.

### Niveaux RAID principaux

| Niveau | Nom | Disques min | Pannes tolerees | Espace utile | Usage typique |
|---|---|---|---|---|---|
| **RAID 0** | Striping | 2 | 0 | 100% (N x taille) | Performances — pas de redondance |
| **RAID 1** | Mirroring | 2 | 1 | 50% (1 x taille) | Redondance — serveurs critiques |
| **RAID 5** | Striping + parite | 3 | 1 | (N-1) x taille | Equilibre perfs / redondance |
| **RAID 6** | Double parite | 4 | 2 | (N-2) x taille | Haute disponibilite |



---

## 2. Le disque Spare (Hot Spare)

Un disque Spare est un disque de reserve branche au systeme mais inactif en temps normal. En cas de panne d'un disque actif, le systeme :

1. **Detecte** la panne automatiquement
2. **Active** le disque Spare immediatement
3. **Reconstruit** les donnees manquantes depuis les autres disques

:::tip Avantage majeur
Sans Spare, le systeme reste vulnerable jusqu'a l'intervention humaine. Avec un Spare, la reparation commence instantanement, meme a 3h du matin.
:::

---

## 3. Presentation de mdadm

`mdadm` (Multiple Device ADMinistrator) est l'outil standard sous Linux pour creer, gerer et surveiller des systemes RAID logiciel. 
**Fonctions principales :**
- **Create** : grouper plusieurs disques en un volume RAID
- **Manage** : ajouter/retirer des disques a chaud
- **Monitor** : surveiller en arriere-plan et alerter en cas de panne
- **Grow** : agrandir la grappe RAID sans eteindre le systeme

### Installation et activation

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt update
sudo apt install mdadm -y

sudo systemctl enable mdmonitor
sudo systemctl start mdmonitor
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo dnf install mdadm -y

sudo systemctl enable mdmonitor
sudo systemctl start mdmonitor
```

</TabItem>
</Tabs>

---

## 4. Verification des disques

Avant de creer un RAID, identifier les disques disponibles :

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Lister tous les disques
sudo fdisk -l

# Vue arborescente
lsblk
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Lister tous les disques
sudo fdisk -l

# Vue arborescente
lsblk
```

</TabItem>
</Tabs>

Exemple de sortie `fdisk -l` :
```
Disque /dev/sdb : 8 GiB, 8589934592 octets, 16777216 secteurs
Disque /dev/sdc : 8 GiB, 8589934592 octets, 16777216 secteurs
Disque /dev/sdd : 8 GiB, 8589934592 octets, 16777216 secteurs
```

---

## 5. Creer un RAID

### RAID 1 (Mirroring — 2 disques)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc
```

</TabItem>
</Tabs>

### RAID 5 (Striping + parite — 3 disques minimum)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb /dev/sdc /dev/sdd
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb /dev/sdc /dev/sdd
```

</TabItem>
</Tabs>

### Creer un RAID avec un disque manquant

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# RAID 1 avec un seul disque au depart
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb missing

# Ajouter le second disque plus tard
sudo mdadm --manage /dev/md0 --add /dev/sdc
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# RAID 1 avec un seul disque au depart
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb missing

# Ajouter le second disque plus tard
sudo mdadm --manage /dev/md0 --add /dev/sdc
```

</TabItem>
</Tabs>

:::info Synchronisation initiale
Apres la creation, le RAID se synchronise. Surveiller la progression avec :
```bash
watch cat /proc/mdstat
```
Attendre que la synchronisation soit a 100% avant de continuer.
:::

---

## 6. Formater et monter le volume RAID

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Formater en ext4
sudo mkfs.ext4 /dev/md0

# Creer le point de montage
sudo mkdir /mnt/raid

# Monter le volume
sudo mount /dev/md0 /mnt/raid

# Verifier
df -h /mnt/raid
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Formater en xfs (defaut Fedora)
sudo mkfs.xfs /dev/md0

# Creer le point de montage
sudo mkdir /mnt/raid

# Monter le volume
sudo mount /dev/md0 /mnt/raid

# Verifier
df -h /mnt/raid
```

</TabItem>
</Tabs>

:::warning XFS sur Fedora
Le systeme de fichiers XFS (defaut sur Fedora/RHEL) ne peut PAS etre reduit — contrairement a ext4. Prendre en compte cette contrainte lors du dimensionnement.
:::

---

## 7. Gestion des disques

### Ajouter un disque (Spare)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo mdadm --manage /dev/md0 --add /dev/sdd

# Verifier — le nouveau disque apparait en (S) = Spare
cat /proc/mdstat
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo mdadm --manage /dev/md0 --add /dev/sdd

# Verifier — le nouveau disque apparait en (S) = Spare
cat /proc/mdstat
```

</TabItem>
</Tabs>

### Simuler la panne d'un disque

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Marquer un disque comme defaillant
sudo mdadm --manage /dev/md0 --fail /dev/sdc

# Verifier l'etat degrade
sudo mdadm --detail /dev/md0
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Marquer un disque comme defaillant
sudo mdadm --manage /dev/md0 --fail /dev/sdc

# Verifier l'etat degrade
sudo mdadm --detail /dev/md0
```

</TabItem>
</Tabs>

### Retirer un disque defaillant

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# En une commande
sudo mdadm --manage /dev/md0 --fail /dev/sdc --remove /dev/sdc

# Ou en deux etapes
sudo mdadm --manage /dev/md0 --fail /dev/sdc
sudo mdadm --manage /dev/md0 --remove /dev/sdc
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# En une commande
sudo mdadm --manage /dev/md0 --fail /dev/sdc --remove /dev/sdc

# Ou en deux etapes
sudo mdadm --manage /dev/md0 --fail /dev/sdc
sudo mdadm --manage /dev/md0 --remove /dev/sdc
```

</TabItem>
</Tabs>

:::info Reconstruction automatique
En RAID 5, quand un disque tombe en panne et qu'un Spare est disponible, la reconstruction demarre automatiquement. Le Spare prend la place du disque defaillant.
:::

---

## 8. Arreter et reassembler un RAID

### Arreter le RAID

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Demonter d'abord
sudo umount /dev/md0

# Arreter le RAID
sudo mdadm --stop /dev/md0
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Demonter d'abord
sudo umount /dev/md0

# Arreter le RAID
sudo mdadm --stop /dev/md0
```

</TabItem>
</Tabs>

### Reassembler un RAID degrade

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Reassembler avec les disques survivants (ex: RAID 5 avec sdb, sdd, sde)
sudo mdadm --assemble /dev/md0 /dev/sdb /dev/sdd /dev/sde

# Ou en mode force (avec un seul disque survivant)
sudo mdadm --assemble --run /dev/md0 /dev/sdc --force
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Reassembler avec les disques survivants
sudo mdadm --assemble /dev/md0 /dev/sdb /dev/sdd /dev/sde

# Ou en mode force
sudo mdadm --assemble --run /dev/md0 /dev/sdc --force
```

</TabItem>
</Tabs>

---

## 9. Agrandir un RAID

Pour agrandir un RAID 5 de 3 a 4 disques actifs :

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# 1. Ajouter le nouveau disque (devient Spare)
sudo mdadm --manage /dev/md0 --add /dev/sde

# 2. Etendre le RAID au 4eme disque
sudo mdadm --grow /dev/md0 --raid-devices=4

# 3. Surveiller la reconstruction
watch cat /proc/mdstat

# 4. Etendre le systeme de fichiers (ext4 — a chaud)
sudo resize2fs /dev/md0

# 5. Verifier le nouvel espace
df -h /mnt/raid
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# 1. Ajouter le nouveau disque (devient Spare)
sudo mdadm --manage /dev/md0 --add /dev/sde

# 2. Etendre le RAID au 4eme disque
sudo mdadm --grow /dev/md0 --raid-devices=4

# 3. Surveiller la reconstruction
watch cat /proc/mdstat

# 4. Etendre le systeme de fichiers (xfs — a chaud)
sudo xfs_growfs /mnt/raid

# 5. Verifier le nouvel espace
df -h /mnt/raid
```

</TabItem>
</Tabs>

---

## 10. Persistance de la configuration

:::danger Etape obligatoire
Sans cette etape, le RAID ne se remontera pas correctement apres un redemarrage.
:::

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Sauvegarder la configuration RAID
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf

# Mettre a jour l'initramfs
sudo update-initramfs -u

# Ajouter le montage automatique dans /etc/fstab
echo '/dev/md0 /mnt/raid ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Sauvegarder la configuration RAID
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm.conf

# Regenerer le dracut initramfs
sudo dracut --force

# Ajouter le montage automatique dans /etc/fstab
echo '/dev/md0 /mnt/raid xfs defaults 0 2' | sudo tee -a /etc/fstab
```

</TabItem>
</Tabs>

---

## 11. Accelerer la synchronisation

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Vitesse maximale : 100 MB/s
echo 1000000 > /proc/sys/dev/raid/speed_limit_max

# Vitesse minimale : 10 MB/s
echo 100000 > /proc/sys/dev/raid/speed_limit_min
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Vitesse maximale : 100 MB/s
echo 1000000 > /proc/sys/dev/raid/speed_limit_max

# Vitesse minimale : 10 MB/s
echo 100000 > /proc/sys/dev/raid/speed_limit_min
```

</TabItem>
</Tabs>

---

## 12. Verification

| Commande | Description |
|---|---|
| `cat /proc/mdstat` | Etat global de tous les RAID en temps reel |
| `sudo mdadm --detail /dev/md0` | Details complets d'un RAID specifique |
| `sudo mdadm --detail --scan` | Scanner tous les RAID disponibles |
| `lsblk` | Vue arborescente des disques et volumes |
| `df -h /mnt/raid` | Espace utilise sur le volume monte |
| `watch cat /proc/mdstat` | Surveiller la synchronisation en direct |

### Lecture de `mdadm --detail`

```
/dev/md0:
           Version : 1.2
     Creation Time : Mon Mar 20 10:00:00 2026
        Raid Level : raid5
        Array Size : 16760832 (15.99 GiB 17.16 GB)
     Used Dev Size : 8380416 (7.99 GiB 8.58 GB)
      Raid Devices : 3
     Total Devices : 4
       Persistence : Superblock is persistent

             State : clean
    Active Devices : 3
   Working Devices : 4
    Failed Devices : 0
     Spare Devices : 1

    Number   Major   Minor   RaidDevice State
       0       8      16        0      active sync   /dev/sdb
       1       8      32        1      active sync   /dev/sdc
       3       8      48        2      active sync   /dev/sdd
       4       8      64        -      spare         /dev/sde
```

| Champ | Description |
|---|---|
| `State: clean` | RAID sain et operationnel |
| `State: degraded` | Un disque manquant — RAID vulnerable |
| `active sync` | Disque actif et synchronise |
| `spare` | Disque de reserve en attente |
| `faulty` | Disque marque defaillant |
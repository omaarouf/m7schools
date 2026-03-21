---
id: tp-Raid
title: TP — RAID Logiciel avec mdadm
sidebar_label: TP — RAID mdadm
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TP — RAID Logiciel et LVM

6 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 — Installation et Verification (Facile)

**Objectif :** Installer LVM et mdadm, verifier les disques disponibles.

---

**1. Installer LVM sur le systeme.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo apt install lvm2 -y
```

Fedora :
```bash
sudo dnf install lvm2 -y
```

</details>

---

**2. Installer mdadm et activer le service de surveillance.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo apt install mdadm -y
sudo systemctl enable mdmonitor
sudo systemctl start mdmonitor
```

Fedora :
```bash
sudo dnf install mdadm -y
sudo systemctl enable mdmonitor
sudo systemctl start mdmonitor
```

</details>

---

**3. Lister tous les disques et partitions disponibles sur le systeme.**

<details>
<summary>Voir la reponse</summary>

```bash
# Vue arborescente simple
lsblk

# Informations detaillees
sudo fdisk -l

# Espace disque utilise
df -h
```

</details>

---

**4. Que signifient les indicateurs suivants dans `/proc/mdstat` ?**

| Indicateur | Signification ? |
|---|---|
| `[UU]` | ? |
| `[U_]` | ? |
| `(S)` | ? |

<details>
<summary>Voir la reponse</summary>

| Indicateur | Signification |
|---|---|
| `[UU]` | Tous les disques sont sains et actifs |
| `[U_]` | Un disque est en panne — etat degrade |
| `(S)` | Le disque est un spare (reserve inactif) |

</details>

---

**5. Completer le tableau des niveaux RAID.**

| Niveau | Disques min | Pannes tolerees | Espace utile |
|---|---|---|---|
| RAID 0 | ? | ? | ? |
| RAID 1 | ? | ? | ? |
| RAID 5 | ? | ? | ? |
| RAID 6 | ? | ? | ? |

<details>
<summary>Voir la reponse</summary>

| Niveau | Disques min | Pannes tolerees | Espace utile |
|---|---|---|---|
| RAID 0 | 2 | 0 | 100% (N x taille) |
| RAID 1 | 2 | 1 | 50% (1 x taille) |
| RAID 5 | 3 | 1 | (N-1) x taille |
| RAID 6 | 4 | 2 | (N-2) x taille |

</details>

---

**6. Un RAID 5 est cree avec 4 disques de 500 Go chacun. Quelle est la capacite utile ?**

<details>
<summary>Voir la reponse</summary>

Formule RAID 5 : (N-1) x taille = (4-1) x 500 Go = **1500 Go (1,5 To)**.

Un disque equivalent est utilise pour la parite repartie sur tous les disques.

</details>

---

**7. Afficher l'etat en temps reel de tous les arrays RAID actifs.**

<details>
<summary>Voir la reponse</summary>

```bash
cat /proc/mdstat

# Surveillance continue
watch cat /proc/mdstat
```

</details>

---

## TP n°2 — Creation LVM de Base (Facile-Moyen)

**Objectif :** Creer des volumes physiques, groupes de volumes et volumes logiques. Formater, monter et rendre permanent.

**Scenario :** Vous avez 2 disques `/dev/sdb` et `/dev/sdc` de 10 Go chacun. Creer un VG `vgWeb` et un LV `lvWeb` de 15 Go monte sur `/var/www`.

:::info Ordre obligatoire LVM
`pvcreate` → `vgcreate` → `lvcreate` → `mkfs` → `mount`
:::

---

**1. Initialiser les 2 disques comme volumes physiques LVM.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo pvcreate /dev/sdb /dev/sdc

# Verification
sudo pvs
sudo pvdisplay
```

</details>

---

**2. Creer le groupe de volumes `vgWeb` avec les 2 disques.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo vgcreate vgWeb /dev/sdb /dev/sdc

# Verification
sudo vgs
sudo vgdisplay vgWeb
```

</details>

---

**3. Creer le volume logique `lvWeb` de 15 Go.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo lvcreate -L 15G -n lvWeb vgWeb

# Verification
sudo lvs
sudo lvscan
```

Le chemin du LV : `/dev/vgWeb/lvWeb` ou `/dev/mapper/vgWeb-lvWeb`.

</details>

---

**4. Formater le LV et monter sur `/var/www`.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo mkfs.ext4 /dev/vgWeb/lvWeb
sudo mkdir -p /var/www
sudo mount /dev/vgWeb/lvWeb /var/www
df -h /var/www
```

Fedora :
```bash
sudo mkfs.xfs /dev/vgWeb/lvWeb
sudo mkdir -p /var/www
sudo mount /dev/vgWeb/lvWeb /var/www
df -h /var/www
```

</details>

---

**5. Ajouter le montage dans `/etc/fstab` pour qu'il soit automatique au demarrage.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo nano /etc/fstab

# Ajouter :
/dev/vgWeb/lvWeb /var/www ext4 defaults 0 2

# Tester sans redemarrer
sudo mount -a
df -h /var/www
```

</details>

---

**6. Quelle est la difference entre `pvs` et `pvdisplay` ?**

<details>
<summary>Voir la reponse</summary>

| Commande courte | Commande detaillee | Difference |
|---|---|---|
| `sudo pvs` | `sudo pvdisplay` | Resume rapide vs infos completes (UUID, taille PE...) |
| `sudo vgs` | `sudo vgdisplay` | Resume rapide vs infos completes (PE size, total PE...) |
| `sudo lvs` | `sudo lvdisplay` | Resume rapide vs infos completes (chemin, taille, etat...) |
| `sudo lvscan` | — | Liste tous les LV avec leur etat (active/inactive) |

</details>

---

**7. Completer les commandes a trous pour creer un LV `lvApp` de 30 Go dans un VG `vgApp` monte sur `/app`.**

```bash
sudo _____________ /dev/sdb /dev/sdc
sudo _____________ vgApp /dev/sdb /dev/sdc
sudo _____________ -L ___G -n _______ vgApp
sudo _____________ /dev/vgApp/lvApp
sudo mkdir /app
sudo _____________ /dev/vgApp/lvApp /app
```

<details>
<summary>Voir la reponse</summary>

```bash
sudo pvcreate /dev/sdb /dev/sdc
sudo vgcreate vgApp /dev/sdb /dev/sdc
sudo lvcreate -L 30G -n lvApp vgApp
sudo mkfs.ext4 /dev/vgApp/lvApp
sudo mkdir /app
sudo mount /dev/vgApp/lvApp /app
```

</details>

---

## TP n°3 — Creation RAID 1 et RAID 5 (Moyen)

**Objectif :** Creer un RAID 1 et un RAID 5 avec mdadm, formater, monter et rendre les arrays persistants.

---

**1. Creer `/dev/md0` en RAID 1 avec `/dev/sdb` et `/dev/sdc`.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc

# Surveiller la synchronisation
watch cat /proc/mdstat
```

:::warning
Attendre que la synchronisation soit a 100% avant de formater.
:::

</details>

---

**2. Formater `/dev/md0` en ext4 et monter sur `/mnt/raid1`.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo mkfs.ext4 /dev/md0
sudo mkdir -p /mnt/raid1
sudo mount /dev/md0 /mnt/raid1
df -h /mnt/raid1
```

Le RAID 1 affiche la capacite d'**un seul disque** — les donnees sont en miroir.

</details>

---

**3. Rendre le RAID persistant au redemarrage.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
sudo update-initramfs -u
```

Fedora :
```bash
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm.conf
sudo dracut --force
```

:::warning
Sans cette etape, le RAID ne se reassemble PAS au redemarrage — c'est l'etape la plus oubliee !
:::

</details>

---

**4. Creer `/dev/md1` en RAID 5 avec 3 disques actifs et 1 spare.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo mdadm --create /dev/md1 \
  --level=5 \
  --raid-devices=3 \
  /dev/sdb /dev/sdc /dev/sdd \
  --spare-devices=1 /dev/sde

watch cat /proc/mdstat
sudo mdadm --detail /dev/md1
```

</details>

---

**5. Afficher les details du RAID 5 et verifier l'etat de chaque disque.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo mdadm --detail /dev/md1
```

| Champ | Valeur attendue |
|---|---|
| State | clean |
| Active Devices | 3 |
| Spare Devices | 1 |
| Failed Devices | 0 |

</details>

---

**6. Completer les commandes a trous pour creer un RAID 1 monte sur `/mnt/data`.**

```bash
sudo mdadm --create /dev/md0 --level=___ --raid-devices=___ /dev/sdb /dev/sdc
sudo mkfs.ext4 /dev/___
sudo mkdir /mnt/data
sudo mount /dev/md0 ___________
sudo mdadm --detail --scan | sudo tee -a ____________________
sudo update-initramfs -u
cat ___________
```

<details>
<summary>Voir la reponse</summary>

```bash
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc
sudo mkfs.ext4 /dev/md0
sudo mkdir /mnt/data
sudo mount /dev/md0 /mnt/data
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
sudo update-initramfs -u
cat /proc/mdstat
```

</details>

---

**7. Pourquoi faut-il sauvegarder la configuration dans `mdadm.conf` ?**

<details>
<summary>Voir la reponse</summary>

Sans cette sauvegarde, au demarrage le noyau Linux ne sait pas quels disques appartiennent a quel array. Le RAID risque de ne pas etre remonte ou d'etre remonte incorrectement. La commande `mdadm --detail --scan` exporte la configuration dans un format que le systeme peut relire au boot.

</details>

---

## TP n°4 — Extension et Reduction LVM (Moyen-Difficile)

**Objectif :** Etendre un VG avec un nouveau disque, etendre un LV a chaud, reduire un LV en ordre strict, creer des snapshots.

:::danger Ordre de reduction STRICT
`umount` → `e2fsck -f` → `resize2fs` → `lvreduce` → `mount`

Ne jamais inverser — perte de donnees irreversible.
:::

---

**1. Ajouter un nouveau disque `/dev/sdf` au VG `PostgresData`.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo pvcreate /dev/sdf
sudo vgextend PostgresData /dev/sdf

# Verifier
sudo vgs
sudo pvs
```

</details>

---

**2. Etendre `lvData` de 150 Go a 220 Go sans demonter le volume.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo lvextend -L 220G /dev/PostgresData/lvData

# Etendre le systeme de fichiers (sans demonter)
sudo resize2fs /dev/PostgresData/lvData    # ext4
# sudo xfs_growfs /data                   # XFS Fedora

df -h /data
sudo lvs
```

</details>

---

**3. Etendre LV et systeme de fichiers en une seule commande.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo lvextend -L +70G -r /dev/PostgresData/lvData
```

L'option `-r` (`--resizefs`) etend automatiquement le systeme de fichiers apres le LV.

</details>

---

**4. Ecrire les 5 etapes obligatoires pour reduire `lvLogs` de 40 Go a 25 Go.**

<details>
<summary>Voir la reponse</summary>

```bash
# ETAPE 1 — Demonter (OBLIGATOIRE)
sudo umount /logs

# ETAPE 2 — Verifier le FS (OBLIGATOIRE)
sudo e2fsck -f /dev/PostgresLogs/lvLogs

# ETAPE 3 — Reduire le FS D'ABORD
sudo resize2fs /dev/PostgresLogs/lvLogs 25G

# ETAPE 4 — Reduire le LV ENSUITE
sudo lvreduce -L 25G /dev/PostgresLogs/lvLogs

# ETAPE 5 — Remonter
sudo mount /dev/PostgresLogs/lvLogs /logs

df -h /logs
sudo lvs
```

</details>

---

**5. Pourquoi faut-il executer `resize2fs` AVANT `lvreduce` ?**

<details>
<summary>Voir la reponse</summary>

Si on reduit d'abord le LV sans reduire le systeme de fichiers, le FS depasse les nouvelles limites du LV — les donnees de la fin du volume sont **coupees et perdues irreversiblement**. Il faut d'abord reduire le FS pour qu'il tienne dans la nouvelle taille, puis reduire le LV.

</details>

---

**6. Creer un snapshot de 10 Go de `lvData` et le monter pour verification.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo lvcreate --size 10G --snapshot --name snap_data /dev/PostgresData/lvData

sudo lvs
sudo mkdir /mnt/snap
sudo mount /dev/PostgresData/snap_data /mnt/snap
ls /mnt/snap
sudo umount /mnt/snap
```

</details>

---

**7. Restaurer `lvData` depuis le snapshot, puis supprimer le snapshot.**

<details>
<summary>Voir la reponse</summary>

```bash
# Restaurer (merge)
sudo umount /data
sudo lvconvert --merge /dev/PostgresData/snap_data
sudo mount /dev/PostgresData/lvData /data

# Supprimer sans restaurer
sudo lvremove /dev/PostgresData/snap_data
```

</details>

---

## TP n°5 — Simulation de Panne et Reconstruction RAID (Difficile)

**Objectif :** Simuler la panne d'un disque, observer la reconstruction automatique via le spare, remplacer un disque defaillant et etendre un RAID.

---

**1. Creer un fichier test sur le RAID avant de simuler la panne.**

<details>
<summary>Voir la reponse</summary>

```bash
echo "Fichier test RAID - $(date)" | sudo tee /mnt/raid1/test.txt
cat /mnt/raid1/test.txt
```

</details>

---

**2. Simuler la panne de `/dev/sdc` dans le RAID 1 et observer l'etat degrade.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo mdadm --manage /dev/md0 --fail /dev/sdc

cat /proc/mdstat
sudo mdadm --detail /dev/md0
```

Sortie attendue : `[U_]` — `(F)` Faulty — `State: degraded`.

</details>

---

**3. Retirer le disque defaillant et ajouter le remplacant.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo mdadm --manage /dev/md0 --remove /dev/sdc
sudo mdadm --manage /dev/md0 --add /dev/sdc
watch cat /proc/mdstat
```

Pendant la reconstruction, le RAID continue de fonctionner. Ne pas eteindre le serveur.

</details>

---

**4. Simuler la panne d'un disque actif dans le RAID 5 (avec spare) et observer la reconstruction automatique.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo mdadm --manage /dev/md0 --fail /dev/sdc
watch cat /proc/mdstat
```

Le spare prend automatiquement la place du disque defaillant sans intervention humaine.

</details>

---

**5. Reassembler un RAID 1 en mode force avec un seul disque survivant.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo umount /mnt/raid1
sudo mdadm --stop /dev/md0
sudo mdadm --assemble --run /dev/md0 /dev/sdc --force
sudo mount /dev/md0 /mnt/raid1
cat /mnt/raid1/test.txt
```

</details>

---

**6. Etendre un RAID 5 de 3 a 4 disques actifs.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo mdadm --manage /dev/md0 --add /dev/sdf
sudo mdadm --grow /dev/md0 --raid-devices=4
watch cat /proc/mdstat
sudo resize2fs /dev/md0
df -h /mnt/raid5
```

</details>

---

**7. Accelerer la vitesse de reconstruction a 100 MB/s.**

<details>
<summary>Voir la reponse</summary>

```bash
echo 1000000 > /proc/sys/dev/raid/speed_limit_max
echo 100000 > /proc/sys/dev/raid/speed_limit_min
watch cat /proc/mdstat
```

</details>

---

## TP n°6 — LVM sur RAID et Scenario Complet (Tres Difficile)

**Objectif :** Combiner RAID et LVM pour un serveur de production, de la creation a la suppression propre.

**Scenario :** Configurer un serveur PostgreSQL avec RAID 5 sur 3 disques + LVM avec 2 volumes logiques.

| Etape | Action | Resultat |
|---|---|---|
| 1 | Creer RAID 5 | `/dev/md0` |
| 2 | Creer PV sur le RAID | `/dev/md0` comme PV |
| 3 | Creer VG | `vg_raid` |
| 4 | Creer LV donnees (80 Go) | `lv_data` → `/mnt/data` |
| 5 | Creer LV logs (30 Go) | `lv_logs` → `/mnt/logs` |
| 6 | Rendre tout persistant | mdadm.conf + fstab |

---

**1. Creer le RAID 5 et attendre la synchronisation.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb /dev/sdc /dev/sdd
watch cat /proc/mdstat
```

</details>

---

**2. Creer le PV LVM sur le RAID, puis le VG `vg_raid`.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo pvcreate /dev/md0
sudo vgcreate vg_raid /dev/md0
sudo pvs
sudo vgs
```

</details>

---

**3. Creer les 2 volumes logiques.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo lvcreate -L 80G -n lv_data vg_raid
sudo lvcreate -L 30G -n lv_logs vg_raid
sudo lvs
```

</details>

---

**4. Formater et monter les 2 LV.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo mkfs.ext4 /dev/vg_raid/lv_data
sudo mkfs.ext4 /dev/vg_raid/lv_logs
sudo mkdir -p /mnt/data /mnt/logs
sudo mount /dev/vg_raid/lv_data /mnt/data
sudo mount /dev/vg_raid/lv_logs /mnt/logs
df -h
```

</details>

---

**5. Rendre toute la configuration persistante.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
sudo update-initramfs -u
echo '/dev/vg_raid/lv_data /mnt/data ext4 defaults 0 2' | sudo tee -a /etc/fstab
echo '/dev/vg_raid/lv_logs /mnt/logs ext4 defaults 0 2' | sudo tee -a /etc/fstab
sudo mount -a
```

Fedora :
```bash
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm.conf
sudo dracut --force
echo '/dev/vg_raid/lv_data /mnt/data xfs defaults 0 2' | sudo tee -a /etc/fstab
echo '/dev/vg_raid/lv_logs /mnt/logs xfs defaults 0 2' | sudo tee -a /etc/fstab
sudo mount -a
```

</details>

---

**6. Ecrire les commandes de suppression complete dans le bon ordre.**

<details>
<summary>Voir la reponse</summary>

:::danger Ordre de suppression OBLIGATOIRE
`umount` → `lvremove` → `vgremove` → `pvremove` → `mdadm --stop` → `zero-superblock`
:::

```bash
sudo umount /mnt/data /mnt/logs
sudo lvremove /dev/vg_raid/lv_data
sudo lvremove /dev/vg_raid/lv_logs
sudo vgremove vg_raid
sudo pvremove /dev/md0
sudo mdadm --stop /dev/md0
sudo mdadm --zero-superblock /dev/sdb
sudo mdadm --zero-superblock /dev/sdc
sudo mdadm --zero-superblock /dev/sdd
```

</details>

---

**7. Verification finale — ecrire toutes les commandes de controle.**

<details>
<summary>Voir la reponse</summary>

```bash
df -h
sudo lvs
sudo vgs
sudo pvs
cat /proc/mdstat
sudo mdadm --detail /dev/md0
```

</details>

---

:::info Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/linux/quizzRaid)

:::
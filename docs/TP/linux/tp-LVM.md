---
id: tp-LVM
title: TP — LVM Gestion des Volumes Logiques
sidebar_label: TP LVM
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> **Objectif du TP** : Installer LVM, creer une infrastructure de volumes logiques, etendre, reduire, creer un snapshot, puis supprimer proprement.

## Environnement

| Element | Detail |
|---|---|
| Systeme | Ubuntu Server / Fedora Server |
| Disques disponibles | `/dev/sdb` (20G), `/dev/sdc` (20G), `/dev/sdd` (10G) |
| VG a creer | `vgdata` |
| LV a creer | `lvweb` (15G), `lvdb` (10G) |
| Points de montage | `/mnt/web`, `/mnt/db` |

:::warning Avant de commencer
Verifiez que les disques sont bien disponibles avec :
```bash
lsblk
```
Vous devez voir `/dev/sdb`, `/dev/sdc` et `/dev/sdd` non partitionnes.
:::

---

## Partie 1 — Installation de LVM

### Exercice 1.1 : Installer le paquet LVM

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt update
sudo apt install lvm2 -y
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo dnf install lvm2 -y
```

</TabItem>
</Tabs>

### Exercice 1.2 : Verifier l'installation

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Verifier la version de LVM
sudo pvs --version

# Verifier que les commandes sont disponibles
which pvcreate vgcreate lvcreate
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Verifier la version de LVM
sudo pvs --version

# Verifier que les commandes sont disponibles
which pvcreate vgcreate lvcreate
```

</TabItem>
</Tabs>

---

## Partie 2 — Creation de l'infrastructure LVM

:::danger Rappel de l'ordre obligatoire
```
PV  →  VG  →  LV  →  mkfs  →  mount
```
:::

### Exercice 2.1 : Creer les Physical Volumes

Initialisez `/dev/sdb` et `/dev/sdc` comme Physical Volumes.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Initialiser les deux disques
sudo pvcreate /dev/sdb /dev/sdc

# Verifier
sudo pvs
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Initialiser les deux disques
sudo pvcreate /dev/sdb /dev/sdc

# Verifier
sudo pvs
```

</TabItem>
</Tabs>

:::info Resultat attendu
```
PV         VG   Fmt  Attr PSize  PFree
/dev/sdb        lvm2 ---  20.00g 20.00g
/dev/sdc        lvm2 ---  20.00g 20.00g
```
Les deux disques apparaissent comme PV sans VG associe.
:::

### Exercice 2.2 : Creer le Volume Group

Creez le VG `vgdata` en regroupant `/dev/sdb` et `/dev/sdc`.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo vgcreate vgdata /dev/sdb /dev/sdc

# Verifier
sudo vgs
sudo vgdisplay vgdata
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo vgcreate vgdata /dev/sdb /dev/sdc

# Verifier
sudo vgs
sudo vgdisplay vgdata
```

</TabItem>
</Tabs>

:::info Resultat attendu
Le VG `vgdata` doit avoir une taille totale d'environ **40G** (20G + 20G).
:::

### Exercice 2.3 : Creer les volumes logiques

Creez deux LV : `lvweb` de 15G et `lvdb` de 10G.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Creer lvweb (15G)
sudo lvcreate -L 15G -n lvweb vgdata

# Creer lvdb (10G)
sudo lvcreate -L 10G -n lvdb vgdata

# Verifier
sudo lvs
sudo lvscan
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Creer lvweb (15G)
sudo lvcreate -L 15G -n lvweb vgdata

# Creer lvdb (10G)
sudo lvcreate -L 10G -n lvdb vgdata

# Verifier
sudo lvs
sudo lvscan
```

</TabItem>
</Tabs>

### Exercice 2.4 : Formater les volumes logiques

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Formater lvweb en ext4
sudo mkfs.ext4 /dev/vgdata/lvweb

# Formater lvdb en ext4
sudo mkfs.ext4 /dev/vgdata/lvdb
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Formater lvweb en xfs
sudo mkfs.xfs /dev/vgdata/lvweb

# Formater lvdb en xfs
sudo mkfs.xfs /dev/vgdata/lvdb
```

</TabItem>
</Tabs>

### Exercice 2.5 : Monter les volumes

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Creer les points de montage
sudo mkdir -p /mnt/web /mnt/db

# Monter les volumes
sudo mount /dev/vgdata/lvweb /mnt/web
sudo mount /dev/vgdata/lvdb /mnt/db

# Verifier
df -h | grep mnt
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Creer les points de montage
sudo mkdir -p /mnt/web /mnt/db

# Monter les volumes
sudo mount /dev/vgdata/lvweb /mnt/web
sudo mount /dev/vgdata/lvdb /mnt/db

# Verifier
df -h | grep mnt
```

</TabItem>
</Tabs>

### Exercice 2.6 : Rendre les montages permanents

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/fstab
```

Ajoutez ces deux lignes :

```fstab title="/etc/fstab"
/dev/vgdata/lvweb   /mnt/web   ext4   defaults   0 2
/dev/vgdata/lvdb    /mnt/db    ext4   defaults   0 2
```

```bash
# Tester le fstab sans redemarrer
sudo mount -a

# Verifier qu'il n'y a pas d'erreur
echo $?
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/fstab
```

Ajoutez ces deux lignes :

```fstab title="/etc/fstab"
/dev/vgdata/lvweb   /mnt/web   xfs   defaults   0 2
/dev/vgdata/lvdb    /mnt/db    xfs   defaults   0 2
```

```bash
# Tester le fstab sans redemarrer
sudo mount -a

# Verifier qu'il n'y a pas d'erreur
echo $?
```

</TabItem>
</Tabs>

:::info Resultat attendu
La commande `echo $?` doit retourner `0` (pas d'erreur).
:::

---

## Partie 3 — Extension du VG et du LV

Le disque `/dev/sdd` (10G) est disponible. Ajoutez-le au VG et etendez `lvweb` de 5G.

### Exercice 3.1 : Ajouter un nouveau PV et etendre le VG

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Initialiser le nouveau disque
sudo pvcreate /dev/sdd

# Ajouter au VG
sudo vgextend vgdata /dev/sdd

# Verifier la nouvelle taille du VG
sudo vgs
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Initialiser le nouveau disque
sudo pvcreate /dev/sdd

# Ajouter au VG
sudo vgextend vgdata /dev/sdd

# Verifier la nouvelle taille du VG
sudo vgs
```

</TabItem>
</Tabs>

:::info Resultat attendu
Le VG `vgdata` doit maintenant afficher une taille totale d'environ **50G** (40G + 10G).
:::

### Exercice 3.2 : Etendre lvweb de 5G supplementaires

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Etendre le LV
sudo lvextend -L +5G /dev/vgdata/lvweb

# Etendre le systeme de fichiers (sans demonter)
sudo resize2fs /dev/vgdata/lvweb

# Verifier la nouvelle taille
df -h /mnt/web
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Etendre le LV
sudo lvextend -L +5G /dev/vgdata/lvweb

# Etendre le systeme de fichiers (sans demonter)
sudo xfs_growfs /mnt/web

# Verifier la nouvelle taille
df -h /mnt/web
```

</TabItem>
</Tabs>

:::info Resultat attendu
`lvweb` doit maintenant afficher **20G** (15G + 5G).
:::

---

## Partie 4 — Reduction de lvdb

:::danger Ordre obligatoire pour la reduction
```
umount → e2fsck → resize2fs → lvreduce → mount
```
Cette partie s'applique uniquement a **ext4**. Sur Fedora avec XFS, la reduction est impossible.
:::

Reduisez `lvdb` de 10G a 6G.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# 1. Demonter le volume
sudo umount /mnt/db

# 2. Verifier le systeme de fichiers
sudo e2fsck -f /dev/vgdata/lvdb

# 3. Reduire le systeme de fichiers a 6G
sudo resize2fs /dev/vgdata/lvdb 6G

# 4. Reduire le volume logique a 6G
sudo lvreduce -L 6G /dev/vgdata/lvdb

# 5. Remonter
sudo mount /dev/vgdata/lvdb /mnt/db

# 6. Verifier
df -h /mnt/db
sudo lvs
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# XFS ne supporte pas la reduction.
# Sur Fedora, cette partie est uniquement theorique.
# Pour reduire un volume XFS, la procedure est :

# 1. Sauvegarder les donnees
sudo tar -czf /tmp/backup_db.tar.gz /mnt/db/

# 2. Demonter, supprimer et recreer le LV
sudo umount /mnt/db
sudo lvremove /dev/vgdata/lvdb
sudo lvcreate -L 6G -n lvdb vgdata
sudo mkfs.xfs /dev/vgdata/lvdb
sudo mount /dev/vgdata/lvdb /mnt/db

# 3. Restaurer les donnees
sudo tar -xzf /tmp/backup_db.tar.gz -C /
```

</TabItem>
</Tabs>

:::info Resultat attendu
`lvdb` doit maintenant afficher **6G** dans la sortie de `sudo lvs`.
:::

---

## Partie 5 — Snapshot et restauration

### Exercice 5.1 : Creer un fichier test dans lvweb

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Creer un fichier de test
sudo bash -c 'echo "Contenu avant snapshot" > /mnt/web/test.txt'
cat /mnt/web/test.txt
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Creer un fichier de test
sudo bash -c 'echo "Contenu avant snapshot" > /mnt/web/test.txt'
cat /mnt/web/test.txt
```

</TabItem>
</Tabs>

### Exercice 5.2 : Creer un snapshot de lvweb

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo lvcreate --size 5G --snapshot --name snap_web /dev/vgdata/lvweb

# Verifier
sudo lvs
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo lvcreate --size 5G --snapshot --name snap_web /dev/vgdata/lvweb

# Verifier
sudo lvs
```

</TabItem>
</Tabs>

### Exercice 5.3 : Modifier les donnees apres le snapshot

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Modifier le fichier APRES la creation du snapshot
sudo bash -c 'echo "Contenu MODIFIE apres snapshot" > /mnt/web/test.txt'
cat /mnt/web/test.txt
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo bash -c 'echo "Contenu MODIFIE apres snapshot" > /mnt/web/test.txt'
cat /mnt/web/test.txt
```

</TabItem>
</Tabs>

### Exercice 5.4 : Restaurer depuis le snapshot

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Demonter le volume avant restauration
sudo umount /mnt/web

# Restaurer le snapshot
sudo lvconvert --merge /dev/vgdata/snap_web

# Remonter
sudo mount /dev/vgdata/lvweb /mnt/web

# Verifier que le fichier est revenu a l'etat initial
cat /mnt/web/test.txt
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Demonter le volume avant restauration
sudo umount /mnt/web

# Restaurer le snapshot
sudo lvconvert --merge /dev/vgdata/snap_web

# Remonter
sudo mount /dev/vgdata/lvweb /mnt/web

# Verifier que le fichier est revenu a l'etat initial
cat /mnt/web/test.txt
```

</TabItem>
</Tabs>

:::info Resultat attendu
Le fichier `test.txt` doit afficher **"Contenu avant snapshot"** — la modification faite apres le snapshot a ete annulee.
:::

---

## Partie 6 — Suppression propre

:::danger Ordre de suppression obligatoire
```
umount → lvremove → vgremove → pvremove
```
:::

### Exercice 6.1 : Supprimer toute l'infrastructure LVM

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# 1. Demonter les volumes
sudo umount /mnt/web
sudo umount /mnt/db

# 2. Supprimer les entrees dans fstab
sudo nano /etc/fstab
# Supprimer les lignes ajoutees precedemment

# 3. Supprimer les LV
sudo lvremove /dev/vgdata/lvweb
sudo lvremove /dev/vgdata/lvdb

# 4. Supprimer le VG
sudo vgremove vgdata

# 5. Supprimer les PV
sudo pvremove /dev/sdb /dev/sdc /dev/sdd

# 6. Verifier que tout est supprime
sudo pvs
sudo vgs
sudo lvs
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# 1. Demonter les volumes
sudo umount /mnt/web
sudo umount /mnt/db

# 2. Supprimer les entrees dans fstab
sudo nano /etc/fstab
# Supprimer les lignes ajoutees precedemment

# 3. Supprimer les LV
sudo lvremove /dev/vgdata/lvweb
sudo lvremove /dev/vgdata/lvdb

# 4. Supprimer le VG
sudo vgremove vgdata

# 5. Supprimer les PV
sudo pvremove /dev/sdb /dev/sdc /dev/sdd

# 6. Verifier que tout est supprime
sudo pvs
sudo vgs
sudo lvs
```

</TabItem>
</Tabs>

:::info Resultat attendu
Les trois commandes `pvs`, `vgs` et `lvs` ne doivent retourner aucun resultat — l'infrastructure LVM est completement supprimee.
:::

---

## Recapitulatif des operations effectuees

| Partie | Operation | Commandes cles |
|---|---|---|
| 1 | Installation | `apt/dnf install lvm2` |
| 2 | Creation | `pvcreate` → `vgcreate` → `lvcreate` → `mkfs` → `mount` |
| 3 | Extension | `pvcreate` → `vgextend` → `lvextend` → `resize2fs / xfs_growfs` |
| 4 | Reduction | `umount` → `e2fsck` → `resize2fs` → `lvreduce` → `mount` |
| 5 | Snapshot | `lvcreate --snapshot` → `lvconvert --merge` |
| 6 | Suppression | `umount` → `lvremove` → `vgremove` → `pvremove` |

---

## Pour aller plus loin

- [Cours LVM](/idosr/linux/lesson-04) — revoir les notions theoriques
- [Quiz LVM](/quizzes/linux/quizzLVM) — tester vos connaissances
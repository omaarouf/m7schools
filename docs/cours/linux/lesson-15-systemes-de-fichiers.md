---
id: lesson-15
title: Les systèmes de fichiers Linux
sidebar_label: Systèmes de fichiers
---

:::info Objectifs

- Comprendre le rôle et l'organisation d'un système de fichiers Linux.
- Identifier les principaux systèmes de fichiers et leurs usages.
- Créer, monter et démonter un système de fichiers.
- Configurer un montage persistant et vérifier l'espace disque.

:::

## Plan

- **0.** Introduction aux systèmes de fichiers
- **1.** Arborescence Linu---
id: lesson-15
title: Les systèmes de fichiers Linux
sidebar_label: Systèmes de fichiers
---

# Les systèmes de fichiers Linux

:::note

**Source et conventions.** Cette leçon suit le support du Pr. RIDOUANI (*Chapitre 3. Les systèmes de fichiers Linux*). Les encadrés **Complément** signalent ce qui a été ajouté au cours : explications, commandes, précisions ou corrections. Les sorties de commandes montrées (`fdisk -l`, `mkfs.ext4`, `df -T`, `ls`) proviennent d'un TP réel sur une VM avec un disque de test `/dev/sdb` d'environ 2 Go. Les autres commandes sont décrites avec leur comportement attendu.

:::

## Objectifs pédagogiques {#objectifs}

À la fin de cette leçon, vous saurez :

**Intervenir sur le système de fichiers Linux**
- créer et monter plusieurs types de systèmes de fichiers Linux ;
- activer et désactiver le swap.

**Maintenir un système de fichiers Linux**
- corriger les erreurs d'un système de fichiers ;
- manipuler un système de fichiers.

**Créer et configurer les options d'un système de fichiers**
- créer un système de fichiers pour des périphériques tels que les CD-ROM ;
- connaître les caractéristiques de base des systèmes de fichiers cryptés.

## Prérequis {#prerequis}

- Savoir utiliser le terminal Linux (`ls`, `cd`, `cat`, `echo`) et les droits Unix (`chmod`).
- Savoir ce qu'est un disque et une partition.
- Disposer des droits **root** (prompt `#`).
- Pour les travaux pratiques : une **VM Linux avec un second disque vide** (ici `/dev/sdb`, environ 2 Go).

:::danger

`fdisk` (avec `w`), `mkfs`, `mkswap` et `cryptsetup luksFormat` **détruisent les données** du périphérique visé. Vérifiez toujours le nom avec `lsblk` avant d'exécuter ces commandes, et ne travaillez jamais sur le disque système.

:::

## Vue d'ensemble {#vue-densemble}

Un périphérique de stockage neuf suit toujours le même parcours :

```text
Disque brut ──► fdisk ──► mkfs ──► mount ──► utilisation
               (partition) (système    (accrocher à un dossier)
                            de fichiers)

Swap :   fdisk (type 82) ──► mkswap ──► swapon      (pas de point de montage)
```

| Section | Contenu | Objectif visé |
|---|---|---|
| 1 | Types de systèmes de fichiers | Créer et monter plusieurs types de FS |
| 2 | Création de systèmes de fichiers (partitions, `mkfs`, montage) | Créer et monter plusieurs types de FS |
| 3 | Ajustement des paramètres ext[234] (`tune2fs`) | Manipuler un FS |
| 4 | Vérification et réparation (`fsck`) | Corriger les erreurs d'un FS |
| 5 | Configuration de l'espace swap | Activer et désactiver le swap |
| 6 | Systèmes de fichiers cryptés | Connaître les bases des FS cryptés |
| 7 | Gestion des disques optiques | Créer un FS pour CD-ROM |

:::tip

**Complément.** Le **montage** (`mount`, `umount`, `/etc/fstab`) n'a pas de section propre dans le plan du cours. Il est traité en section 2, juste après la création du système de fichiers.

:::

---

## 1. Les types de systèmes de fichiers {#section-1-types}

### 1.1 Définition

Le terme **système de fichiers** (abrégé **FS**, pour *File System*) est ambigu. Il désigne soit :

- **l'organisation hiérarchique des fichiers** au sein d'un système d'exploitation (par exemple l'arborescence Unix organisée à partir de la racine `/`) ;
- **l'organisation des fichiers au sein d'un volume** physique ou logique, qui peut être de différents types (NTFS, FAT, FAT32, ext2, ext3, ext4...).

De façon générale, un système de fichiers est **une façon de stocker les informations et de les organiser dans des fichiers sur des mémoires** (disque dur, CD-ROM, clé USB, disquette).

### 1.2 Un peu d'histoire

| FS | Détail |
|---|---|
| **minix** | Le FS de Minix : le **premier** système de fichiers utilisé sous Linux |
| **ext** | Extension de minix, développé en **avril 1992**. C'est le premier FS à utiliser l'API **VFS** |

### 1.3 Le VFS (Virtual File System)

Le **VFS** est la couche du noyau Linux placée entre les programmes et les systèmes de fichiers réels. Elle offre **une interface unique** (`open`, `read`, `write`, `close`...) quel que soit le FS qui se trouve en dessous.

```text
Programmes (ls, cp, cat, vim...)
        │   appels système : open(), read(), write()
        ▼
┌─────────────────────────────┐
│   VFS  (couche du noyau)    │   ← interface unique
└─────────────────────────────┘
   │      │       │       │        │
 ext4   XFS    NTFS    FAT32   ISO9660 ...   ← pilotes de FS
   │      │       │       │        │
 disque  SSD    disque   clé USB  CD-ROM      ← périphériques
```

- Le **VFS** définit l'interface (l'API).
- Chaque **pilote de FS** (*driver*, souvent un module du noyau) **implémente** cette interface pour son propre format. Il y a un pilote par type de FS.
- Les **programmes** appellent toujours le VFS sans connaître le FS sous-jacent.

C'est pourquoi `cp` fonctionne de la même façon entre ext4 et NTFS : le VFS **redirige** chaque appel vers le bon pilote.

```text
read("/mnt/usb/fichier.txt")   → VFS → pilote FAT32
read("/home/user/fichier.txt") → VFS → pilote ext4
        (même appel, pilote différent)
```

:::note

**À retenir.** Le VFS offre une interface unique aux programmes et redirige chaque appel système vers le pilote du système de fichiers concerné. **ext** (1992) est le premier FS écrit pour fonctionner via le VFS.

:::

### 1.4 Principaux systèmes de fichiers supportés par Linux

| FS | Caractéristiques (cours) |
|---|---|
| **ext2** | Extension de ext. Stable, usage général, peut être **rétréci ou agrandi**. **Pas de journalisation** |
| **ext3** | Amélioration d'ext2. Ajoute la **journalisation** pour une récupération rapide après un crash |
| **ext4** | Amélioration d'ext3 pour supporter de **grandes tailles de fichiers et de FS** |
| **XFS** | Stable, usage général, récupération rapide, peut être **étendu en ligne** |
| **JFS** | Stable, usage général, récupération rapide |

Moyen mnémotechnique : `ext2` → (+ journal) → `ext3` → (+ grands volumes) → `ext4`.

:::tip

**Complément.** Autres FS que l'on rencontre :

| FS | Usage | À retenir |
|---|---|---|
| **Btrfs** | FS moderne | Snapshots, compression |
| **vfat / FAT32** | Clés USB, compatibilité | Pas de droits Unix, fichiers limités à 4 Go |
| **NTFS** | Windows | Accessible sous Linux via `ntfs-3g` |
| **ISO 9660 / UDF** | CD-ROM / DVD | Lecture seule (voir section 7) |
| **tmpfs** | FS en RAM | Contenu perdu à l'arrêt (ex. `/dev/shm`) |
| **swap** | Espace d'échange | Pas un FS à monter (voir section 5) |

XFS peut être **agrandi** (même monté), mais il **ne peut pas être réduit**.

:::

### 1.5 La journalisation

Avant d'écrire les données, un FS journalisé **note l'opération dans un journal** (principalement les changements de métadonnées : création, suppression, déplacement de fichiers). Après une coupure de courant, le système **rejoue le journal** pour terminer ou annuler les opérations en cours. Il n'a donc **pas besoin de parcourir tout le disque** avec `fsck`, ce qui rend la récupération beaucoup plus rapide.

:::warning

Le journal ne garde pas la trace des services ou des programmes exécutés. Il ne garde que les **opérations d'écriture en cours sur le FS**.

:::

### 1.6 Identifier le type de FS

```bash
df -T                    # FS montés avec leur type
lsblk -f                 # périphériques + type de FS
blkid                    # type + UUID
mount                    # FS montés avec leur type
cat /proc/filesystems    # FS supportés par le noyau
```

Résultat observé sur la VM de TP :

```text
Sys. fich.     Type     1K-blocs    Utilisé    Dispo. Uti% Monté sur
/dev/sda1      ext3     20158332    3339720  15794612  18% /
tmpfs          tmpfs      254356        424    253932   1% /dev/shm
```

La racine `/` est un FS **ext3** (avec journal) et `/dev/shm` est un **tmpfs** (en RAM).

---

## 2. Création de systèmes de fichiers {#section-2-creation}

### 2.1 Partitionner avec `fdisk` {#partitionner}

Une **partition** est un découpage logique du disque. Outils : `fdisk`, `cfdisk`, `sfdisk`, `gparted` (graphique).

```bash
fdisk /dev/sda     # mode interactif sur le disque /dev/sda
```

| Touche | Action |
|---|---|
| `m` | Affiche toutes les commandes disponibles |
| `p` | Affiche les partitions déjà créées |
| `n` | Ajoute une partition |
| `d` | Supprime une partition |
| `t` | Change le type de partition |
| `q` | Quitte **sans sauvegarder** |
| `w` | **Écrit** les changements sur la table de partitions |

:::note

Rien n'est modifié sur le disque tant que `w` n'a pas été tapé. En cas d'erreur, `q` annule tout.

:::

**Exemple : créer une partition primaire de 400 Mo sur `/dev/sdb`**

```text
Commande (m pour l'aide) : n
Commande d'action : p
Numéro de partition (1-4) : 1
Premier secteur : [Entrée]
Dernier secteur, +secteurs ou +taille{K,M,G} : +400M
Commande (m pour l'aide) : p          ← vérifier
Commande (m pour l'aide) : w          ← enregistrer
```

Au prompt « Dernier secteur », le `+` est **obligatoire** : `+400M` signifie « 400 Mo à partir du début ». Sans le `+`, `fdisk` lit un **numéro de secteur**.

| Suffixe | Unité |
|---|---|
| `K` | Kilo-octets |
| `M` | Mégaoctets |
| `G` | Gigaoctets |
| *(aucun)* | Nombre de secteurs |

:::tip

**Complément : primaire, étendue, logique (table MBR).** Après `n`, `fdisk` propose `p` (**p**rimary) et `e` (**e**xtended).

| Type | Rôle | Limite |
|---|---|---|
| **Primaire** | Partition normale, peut contenir un FS ou servir au démarrage | **4 maximum** par disque |
| **Étendue** | Simple **conteneur** : on ne la formate pas directement | **1 seule** par disque |
| **Logique** | Partition créée **à l'intérieur** de l'étendue | Numérotées à partir de **5** (`sda5`, `sda6`...) |

`fdisk` ne propose `l` (logique) que s'il existe déjà une étendue. Pour dépasser 4 partitions : 3 primaires + 1 étendue, puis des logiques dans l'étendue.

```text
Disque /dev/sda
├── sda1  primaire
├── sda2  primaire
├── sda3  primaire
└── sda4  étendue (conteneur)
      ├── sda5  logique
      └── sda6  logique
```

Le format **GPT** (standard moderne) n'a pas cette limite : jusqu'à 128 partitions primaires, sans étendue ni logique.

:::

:::tip

**Complément : partitions dynamiques (LVM).** Sous Linux, une partition classique a une taille **fixe**. **LVM** (*Logical Volume Manager*) ajoute une couche souple entre les disques et le FS : on peut redimensionner à chaud, regrouper plusieurs disques et faire des snapshots. Sous Windows, l'équivalent s'appelle les *disques dynamiques*.

```text
Disques/partitions ► PV (Physical Volume)  : on prépare       pvcreate
                   ► VG (Volume Group)     : on regroupe      vgcreate
                   ► LV (Logical Volume)   : on découpe       lvcreate
                                             puis mkfs et mount sur /dev/vg/lv
```

LVM n'est pas au programme de cette leçon : retenez l'opposition « partition fixe » contre « volume souple ».

:::

### 2.2 Formater avec `mkfs` {#formater}

`mkfs` construit un système de fichiers sur une partition, c'est-à-dire qu'elle la **formate**.

```bash
mkfs [-t type-sys-fichiers] [options-sys-fichiers] partition
mkfs -t ext3 /dev/sdb1        # exemple du cours
```

**Commandes de création selon le FS :**

| FS | Commande de création |
|---|---|
| ext2 | `mke2fs` ou `mkfs.ext2` |
| ext3 | `mke2fs -j` ou `mkfs.ext3` |
| reiserfs | `mkreiserfs` |
| XFS | `mkfs.xfs` |
| vfat | `mkfs.vfat` |

`mkfs -t ext3` est un raccourci qui appelle `mkfs.ext3`. Le `-j` de `mke2fs -j` signifie **journal** : il transforme un ext2 en ext3.

:::tip

**Complément.** Le cours ne cite pas ext4 dans ce tableau. La commande est `mkfs.ext4` (ou `mkfs -t ext4`).

:::

**Principales options (ext3) :**

| Option | Description |
|---|---|
| `-V` | Affiche le numéro de **version** de `mkfs` |
| `-v` | Sortie **bavarde** (verbose) |
| `-L étiquette` | Définit le **nom de volume** (label) |
| `-b taille` | Définit la taille de **bloc** (1024, 2048, 4096 octets) |
| `-N nombre` | Définit le nombre d'**inodes** |
| `-m pourcentage` | Pourcentage de blocs **réservés au super-utilisateur** |

:::warning

Ne confondez pas **`-V`** (version) et **`-v`** (verbose).

:::

### 2.3 Lire la sortie de `mkfs` {#sortie-mkfs}

Résultat observé sur la partition `/dev/sdb1` du TP :

```text
[root@localhost modules]# mkfs.ext4 /dev/sdb1
mke2fs 1.41.12 (17-May-2010)
Étiquette de système de fichiers=
Type de système d'exploitation : Linux
Taille de bloc=1024 (log=0)
Taille de fragment=1024 (log=0)
51000 i-noeuds, 203776 blocs
10188 blocs (5.00%) réservés pour le super utilisateur
Premier bloc de données=1
25 groupes de blocs
8192 blocs par groupe, 8192 fragments par groupe
2040 i-noeuds par groupe
Superblocs de secours stockés sur les blocs :
        8193, 24577, 40961, 57345, 73729

Écriture des tables d'i-noeuds : complété
Création du journal (4096 blocs) : complété
Écriture des superblocs et de l'information de comptabilité du système de fichiers : complété

Le système de fichiers sera automatiquement vérifié tous les 26 montages ou
après 180 jours, selon la première éventualité. Utiliser tune2fs -c ou -i
pour écraser la valeur.
```

| Ligne | Signification |
|---|---|
| `Étiquette de système de fichiers=` | Aucun **label** défini (option `-L`) |
| `Taille de bloc=1024` | Blocs de **1 Ko** (option `-b`) |
| `51000 i-noeuds, 203776 blocs` | Nombre d'**inodes** (un par fichier) et de blocs de données |
| `10188 blocs (5.00%) réservés` | Réserve pour **root** (option `-m`) |
| `25 groupes de blocs` | FS découpé en groupes de 8192 blocs et 2040 inodes (25 × 2040 = 51000) |
| `Superblocs de secours` | **Copies du superbloc** (voir 2.5) |
| `Création du journal (4096 blocs)` | Journal d'ext4 créé (4 Mo) |
| `vérifié tous les 26 montages ou après 180 jours` | Vérification automatique, modifiable avec `tune2fs -c` et `-i` |

L'exemple du cours (`mkfs -t ext2 /dev/sdb1` sur 400 Mo) donne 409600 blocs, 102400 inodes, 50 groupes et **20480 blocs réservés** : on retrouve bien 5 % de 409600.

### 2.4 Les blocs réservés {#blocs-reserves}

Une partie du FS (**5 % par défaut**) est réservée au **super-utilisateur**. Ainsi, un utilisateur autre que root ne peut pas remplir tout le système de fichiers. Si c'était le cas :

- root ne pourrait plus se connecter ;
- les services exécutés en tant que root ne pourraient plus écrire de données sur le disque.

L'option **`-m`** de `mkfs.ext3` (ou `tune2fs -m` après coup) règle ce pourcentage.

```bash
mkfs.ext3 -m 1 /dev/sdb1     # réserve 1 % au lieu de 5 %
tune2fs -m 1 /dev/sdb1       # modifier un FS existant
```

:::tip

**Complément.** Sur une partition de **données**, 5 % est souvent trop : on met fréquemment `-m 0` ou `-m 1`. Sur `/` et `/var`, on garde la valeur par défaut.

Cela explique l'écart observé dans `df -T` sur la partition de TP : **Dispo. + Utilisé ≠ Taille**.

```text
197338 (Taille) − 5648 (Utilisé à vide) − 10188 (réserve root) = 181502 (Dispo.)
```

L'espace « Utilisé » à vide correspond aux structures internes du FS, dont le journal de 4096 Ko. La taille affichée par `df` (197338 Ko) est aussi inférieure aux 203776 blocs de la partition, car une partie de l'espace sert aux métadonnées.

:::

### 2.5 Le superbloc {#superbloc}

Le **superbloc** est l'enregistrement qui **décrit les caractéristiques du FS**. Il contient notamment :

- la taille des blocs ;
- la taille et l'emplacement des tables d'inodes ;
- la taille des groupes de blocs ;
- la taille du système de fichiers ;
- l'espace disque disponible.

La **perte du superbloc entraîne la perte des données** : les fichiers sont toujours sur le disque, mais le noyau ne sait plus comment les retrouver. D'où les **copies de sauvegarde** réparties dans les groupes de blocs.

```bash
tune2fs -l /dev/sdb1        # afficher le superbloc
dumpe2fs -h /dev/sdb1       # -h : seulement l'en-tête (superbloc)
```

:::tip

**Complément : où sont les copies.** Le FS est découpé en groupes de 8192 blocs. Les copies sont dans certains groupes (1, 3, 5, 7, 9, 25, 27, 49...), d'où la liste `8193, 24577, 40961...` (exemple du cours : `8193, 24577, 40961, 57345, 73729, 204801, 221185, 401409`). Plus la partition est grande, plus il y a de copies.

Pour réparer avec une copie (FS **démonté**, voir section 4) :

```bash
e2fsck -b 8193 /dev/sdb1
```

:::

### 2.6 Monter un système de fichiers {#montage}

:::tip

**Complément.** Cette partie n'est pas détaillée dans les slides, mais elle est indispensable pour utiliser un FS que l'on vient de créer.

:::

**Pourquoi monter ?** Sous Windows, une partition reçoit une lettre (`C:`, `D:`). Sous Linux, il n'y a **qu'un seul arbre** qui part de `/`. Une partition formatée n'est pas encore dans cet arbre : le **montage** consiste à **accrocher le FS d'un périphérique à un dossier** de l'arbre. Ce dossier s'appelle le **point de montage**. La racine `/` est elle-même un point de montage (la partition `sda1` y est montée au démarrage).

```text
Avant mount :                    Après mount /dev/sdb1 /mnt/data :

/                                /
├── home                         ├── home
├── mnt                          ├── mnt
│   └── data  (dossier vide)     │   └── data  ──► contenu de sdb1
└── ...                          └── ...
```

Écrire dans `/mnt/data` revient alors à écrire **sur la partition `sdb1`**. C'est le VFS qui rend cela possible.

**Commandes :**

```bash
mkdir /mnt/data                  # créer le point de montage
mount /dev/sdb1 /mnt/data        # monter
df -T /mnt/data                  # vérifier : type, taille, point de montage
echo "test" > /mnt/data/f.txt    # écrire sur la partition
ls -l /mnt/data                  # f.txt et lost+found
cd /                             # sortir du dossier avant de démonter
umount /mnt/data                 # démonter (dossier ou périphérique)
```

Résultat observé sur la VM de TP :

```text
[root@localhost modules]# ls -l /mnt/data
total 14
-rw-r--r--. 1 root root     5 11 oct.  14:31 f.txt
drwx------. 2 root root 12288 11 oct.  14:27 lost+found

Sys. fich.     Type     1K-blocs    Utilisé    Dispo. Uti% Monté sur
/dev/sdb1      ext4       197338       5648    181502   4% /mnt/data
```

- `f.txt` fait **5 octets** : `test` (4 caractères) plus le saut de ligne ajouté par `echo`.
- `lost+found` est créé par `mkfs`. `fsck` y place les fichiers récupérés lors d'une réparation. Il est réservé à root.

**Preuve que les données vivent sur la partition, pas dans le dossier :**

```text
[root@localhost /]# umount /mnt/data
[root@localhost /]# ls /mnt/data                      ← vide (dossier d'origine)
[root@localhost /]# mount /dev/sdb1 /mnt/data
[root@localhost /]# ls /mnt/data
f.txt  lost+found                                     ← les données reviennent
```

| Fichiers écrits... | Où ils sont | Après `umount` |
|---|---|---|
| **Après** le `mount` | Sur la partition `sdb1` | Conservés sur `sdb1`, plus visibles dans le dossier |
| **Avant** le `mount` | Dans le dossier d'origine | **Cachés** pendant le montage, visibles de nouveau après `umount` |

**Pourquoi démonter avant de retirer une clé USB ?** Pour des raisons de performance, Linux garde les écritures en **cache mémoire** et les écrit plus tard sur le périphérique. `umount` **force l'écriture du cache**, puis détache proprement le FS. Retirer le périphérique sans démonter peut perdre des données et corrompre le FS.

### 2.7 Montage automatique : `/etc/fstab` {#fstab}

`mount` n'est pas persistant : après un redémarrage, `sdb1` n'est plus monté. Pour le monter à chaque démarrage, on ajoute une ligne dans `/etc/fstab`, de préférence avec l'**UUID** (le nom `/dev/sdb1` peut changer d'un démarrage à l'autre).

```bash
blkid /dev/sdb1                  # récupère l'UUID
```

```text
UUID=<votre-uuid>   /mnt/data   ext4   defaults   0 2
```

| Champ | Exemple | Rôle |
|---|---|---|
| 1 | `UUID=...` | Le périphérique |
| 2 | `/mnt/data` | Le point de montage |
| 3 | `ext4` | Le type de FS |
| 4 | `defaults` | Les options de montage |
| 5 | `0` | Sauvegarde par `dump` (0 = non) |
| 6 | `2` | Ordre de `fsck` au démarrage (1 pour `/`, 2 pour les autres, 0 = pas de vérification) |

**Tester avant de redémarrer :**

```bash
umount /mnt/data
mount -a              # monte tout ce qui est dans fstab
df -T /mnt/data       # sdb1 doit apparaître monté
```

:::danger

Une erreur dans `/etc/fstab` peut empêcher le démarrage. Testez **toujours** avec `mount -a` avant de redémarrer.

:::

---

## 3. Ajustement des paramètres des systèmes de fichiers ext[234] {#section-3-tune2fs}

La commande **`tune2fs`** modifie les paramètres ajustables d'un FS **ext2, ext3 ou ext4** déjà créé, sans le reformater. Les principaux paramètres sont le **label**, le **journal** et les **blocs réservés** pour le super-utilisateur.

| Option | Fonction | Exemple |
|---|---|---|
| `-c N` | Nombre maximal de montages entre deux vérifications du FS. Si N vaut 0 ou -1, le nombre de montages est ignoré par `e2fsck` et par le noyau | `tune2fs -c 30 /dev/sdb1` |
| `-l` | **Affiche** le contenu du superbloc | `tune2fs -l /dev/sdb1` |
| `-m N` | Définit le **pourcentage** de blocs réservés pour le super-utilisateur | `tune2fs -m 1 /dev/sdb1` |
| `-r N` | Définit le **nombre** de blocs réservés pour le super-utilisateur | `tune2fs -r 5000 /dev/sdb1` |
| `-j` | **Ajoute un journal** ext3 au FS | `tune2fs -j /dev/sdb1` |
| `-L label` | Définit le **nom de volume** | `tune2fs -L DONNEES /dev/sdb1` |

:::warning

`-l` (minuscule) **affiche** le superbloc, `-L` (majuscule) **définit** le label. `-m` et `-r` règlent la même réserve, l'un en pourcentage, l'autre en nombre de blocs.

:::

:::tip

**Complément.**

- `tune2fs -j` transforme un **ext2 en ext3** sans perte de données. Dans `/etc/fstab`, il faut alors changer le type (`ext2` devient `ext3`).
- La vérification automatique « 26 montages ou 180 jours » vue dans la sortie de `mkfs` se règle avec **`-c`** (montages) et **`-i`** (intervalle de temps).
- Commandes voisines pour manipuler un FS :

| Commande | Rôle |
|---|---|
| `dumpe2fs -h` | Informations du superbloc |
| `resize2fs` | Redimensionner un FS ext (agrandir possible à chaud sur ext3/ext4, réduire seulement FS démonté) |
| `df` | Espace par système de fichiers |
| `du` | Espace par dossier |

:::

**Vérification attendue sur la partition de TP :**

```bash
tune2fs -L DONNEES /dev/sdb1
tune2fs -m 1 /dev/sdb1
tune2fs -l /dev/sdb1 | head -20      # Filesystem volume name : DONNEES
df -T /mnt/data                      # « Dispo. » augmente : la réserve passe de 5 % à 1 %
```

---

## 4. Vérification et réparation d'un système de fichiers {#section-4-fsck}

Si le système de fichiers est **endommagé ou corrompu** (coupure de courant, arrêt brutal), l'utilitaire **`fsck`** vérifie et corrige le système.

```bash
fsck -t type-de-fichier partition
fsck -t ext4 /dev/sdb1
```

| Option | Fonction |
|---|---|
| `-c` | Vérifie les **blocs défectueux** |
| `-v` | Mode **verbeux** |
| `-f` | **Force** la vérification d'un FS, même s'il semble propre |
| `-p` | Vérifie un FS en **réparant automatiquement**, sans rien demander |
| `-y` | Vérifie un FS en répondant **« yes »** à toutes les questions interactives |

:::note

**`-p` ou `-y` ?** `-p` ne corrige que les problèmes **sans risque** et s'arrête si un problème sérieux apparaît. `-y` répond oui à **tout**, y compris aux corrections risquées. Les deux options ne peuvent pas être combinées.

:::

**Règles importantes :**

- Toujours vérifier un FS **démonté** : réparer un FS monté peut aggraver la corruption.
- `fsck` est un **chapeau** : il appelle l'outil adapté au type (`e2fsck` pour ext2/3/4). XFS utilise `xfs_repair`.
- Sans `-f`, un FS marqué « propre » n'est pas revérifié. Avec un journal, celui-ci est rejoué rapidement au lieu de parcourir tout le disque.
- Si le superbloc est perdu, utiliser une copie : `e2fsck -b 8193 /dev/sdb1`.
- Les fichiers récupérés sont placés dans `lost+found`.

**Procédure :**

```bash
umount /dev/sdb1
fsck -f -v /dev/sdb1
mount /dev/sdb1 /mnt/data
```

Comportement attendu : `e2fsck` déroule **5 phases** de vérification (i-noeuds, répertoires, connectivité, compteurs de références, résumé des groupes), puis affiche un résumé (fichiers et blocs utilisés).

:::tip

**Complément : codes de retour de `fsck`.**

| Code | Signification |
|---|---|
| 0 | Aucune erreur |
| 1 | Erreurs corrigées |
| 2 | Le système doit être redémarré |
| 4 | Erreurs non corrigées |
| 8 | Erreur d'utilisation ou opérationnelle |

On les consulte avec `echo $?` juste après la commande.

:::

---

## 5. Configuration de l'espace swap {#section-5-swap}

### 5.1 Définition et utilité

Le **swap** (espace d'échange) est une zone du disque que le noyau utilise comme **extension de la RAM**. Quand la mémoire physique se remplit, le noyau déplace vers le swap les pages mémoire **inactives** (peu utilisées), ce qui libère de la RAM pour les processus actifs. Les processus continuent d'exister : seules certaines de leurs pages sont déplacées, puis rechargées en RAM quand un processus en a de nouveau besoin.

:::tip

**Complément : à quoi sert le swap.**

- **Éviter le crash** quand la RAM est saturée (sinon l'*OOM killer* tue des processus).
- **Libérer de la RAM** : les pages inactives partent sur disque et la RAM sert plutôt de cache disque.
- **Hibernation** : le contenu de la RAM est écrit dans le swap.

Le disque est beaucoup plus lent que la RAM : un swap très sollicité (*swapping intensif*) ralentit fortement la machine.

:::

### 5.2 Les commandes du cours

| Commande | Rôle | Exemple |
|---|---|---|
| `mkswap` | **Crée** un espace swap sur un périphérique (partition ou fichier) | `mkswap /dev/sdb1` |
| `swapon` | **Active** le swap, et vérifie qu'il a été correctement ajouté | `swapon /dev/sdb1` |
| `swapoff` | **Désactive** le swap | `swapoff /dev/sdb1` |
| `swapon -s` | Affiche le swap utilisé | |
| `free -m` | Mémoire et swap, en Mo | |
| `cat /proc/meminfo` | Détail de la mémoire (lignes `SwapTotal`, `SwapFree`) | |
| `cat /proc/swaps` | Swaps actifs, taille et utilisation par périphérique | |

Le périphérique est habituellement une **partition de disque**, mais peut aussi être **un fichier**.

```text
FS normal :  fdisk → mkfs     → mount
Swap      :  fdisk → mkswap   → swapon      (pas de point de montage)
```

Le swap n'apparaît pas dans `df`, mais dans `free` et `/proc/swaps`. Sur une partition, on met le **type `82`** (Linux swap) avec la touche `t` de `fdisk`. C'est le cas de la partition `sda2` de la VM de TP :

```text
Périphérique Amorce  Début       Fin      Blocs   Id  Système
/dev/sda1   *         2048  40962047   20480000   83  Linux
/dev/sda2         40962048  49154047    4096000   82  Linux swap / Solaris
```

### 5.3 Partition swap

```bash
mkswap /dev/sdb1        # formate la partition en swap
swapon /dev/sdb1        # active
swapon -s               # vérifie
swapoff /dev/sdb1       # désactive
```

:::danger

`mkswap` sur une partition qui contient déjà un FS **écrase ce FS**. Dans l'exemple du cours, `/dev/sdb1` doit donc être une partition vide ou sacrifiable.

:::

### 5.4 Fichier swap

```bash
dd if=/dev/zero of=/swapfile bs=1M count=1024   # crée un fichier de 1 Go
chmod 600 /swapfile     # lecture/écriture réservées au propriétaire (root)
mkswap /swapfile
swapon /swapfile
```

**Pourquoi `chmod 600` ?** Le swap contient des morceaux de la RAM, donc potentiellement des **mots de passe, des clés ou des données privées**. Avec `600` (`rw-------`), seul le propriétaire, **root**, peut lire ce fichier. Un utilisateur normal ne pourrait pas récupérer ces données.

### 5.5 Vérifier et rendre permanent

```bash
swapon -s              # ou : swapon --show (version récente)
free -m
cat /proc/swaps
```

`swapon` n'est pas persistant. Pour activer le swap à chaque démarrage, ajouter dans `/etc/fstab` :

```text
/dev/sda2   none   swap   sw   0 0
/swapfile   none   swap   sw   0 0
```

:::tip

**Complément.**

- **`vm.swappiness`** (0 à 100, 60 par défaut) : plus la valeur est haute, plus le noyau utilise volontiers le swap. À lire avec `cat /proc/sys/vm/swappiness`.
- **Priorité** : `swapon -p <n>` ; les swaps de priorité plus haute sont utilisés en premier.
- `swapoff` échoue s'il n'y a pas assez de RAM libre pour récupérer les pages swappées.
- **Taille** : elle dépend de l'usage. Pour l'hibernation, prévoir au moins la taille de la RAM.

:::

---

## 6. Systèmes de fichiers cryptés {#section-6-cryptes}

### 6.1 Le problème

Les systèmes de fichiers ext[234] **ne garantissent pas la confidentialité** des données enregistrées sur un périphérique. Quelqu'un qui a un accès direct au disque peut tout lire.

### 6.2 TCFS et eCryptfs

La technique **TCFS** (*Transparent Cryptographic File System*) définit une **couche au-dessus des autres systèmes de fichiers** (ext2, ext3, ext4, xfs...) qui chiffre les données lors de leur stockage. Les informations d'un fichier sont chiffrées par cette couche **avant** d'être traduites en blocs de données et écrites sur le média. Cela protège les informations personnelles contre les attaques de personnes ayant un accès direct aux données.

```text
Programme → [couche eCryptfs : chiffre] → ext4 → disque (données illisibles)
```

**eCryptfs** est un système de fichiers cryptés de type TCFS. Il fournit le chiffrement des **données** et des **noms de fichiers**.

### 6.3 La commande

```bash
mount -t ecryptfs /source /destination
```

Dans l'exemple du cours, la source et la destination sont le **même dossier** (`/mnt`) : le dossier est chiffré sur lui-même.

Pendant le montage, `mount` demande de configurer les paramètres suivants :

| Paramètre | Choix possibles | Valeur de l'exemple |
|---|---|---|
| **Type de clé** | `pkcs11-helper`, `openssl`, `tspi`, `passphrase` | `4` : passphrase (phrase de passe saisie ensuite) |
| **Algorithme (cipher)** | `aes`, `blowfish`, `des3_ede`, `twofish`, `cast6`, `cast5` | `1` : aes |
| **Taille de la clé (octets)** | 16, 32, 24 | `16` |
| **Passthrough en clair** | y / n | `y` : les fichiers **non chiffrés** peuvent traverser la couche |
| **Chiffrement du nom de fichier** | y / n | `y` : les **noms** des fichiers sont chiffrés |

Une clé de 16 octets correspond à AES-128, 24 à AES-192, 32 à AES-256.

Lors de la **première utilisation** d'une clé, `mount` affiche un avertissement (*you have never mounted with this key before*) et demande confirmation (`yes`). C'est normal. Lors d'un montage ultérieur, le même avertissement peut signaler une **phrase de passe mal saisie**.

**Test (comportement attendu) :**

```bash
mkdir /mnt/secret
mount -t ecryptfs /mnt/secret /mnt/secret      # mêmes réponses que dans l'exemple du cours
echo "confidentiel" > /mnt/secret/a.txt
cat /mnt/secret/a.txt                          # lisible, car monté
umount /mnt/secret
ls /mnt/secret                                 # noms de fichiers illisibles
```

Pour récupérer les fichiers, remonter avec **la même phrase de passe et les mêmes options**. Le paquet à installer est `ecryptfs-utils`, et le module du noyau se charge avec `modprobe ecryptfs`.

:::warning

**Complément : état actuel d'eCryptfs.** eCryptfs n'est plus activement maintenu et sa suppression du noyau Linux est discutée par les développeurs. Les distributions modernes lui préfèrent **dm-crypt/LUKS** ou **fscrypt**. Le cours reste centré sur eCryptfs : retenez ses paramètres, mais n'en faites pas le choix par défaut pour un nouveau projet.

:::

:::tip

**Complément : deux familles de chiffrement.**

| | **eCryptfs (TCFS)** | **LUKS / dm-crypt** |
|---|---|---|
| Niveau | **Fichiers / dossiers** (couche au-dessus du FS) | **Périphérique** entier (niveau bloc) |
| Noms de fichiers | Chiffrés (option) | Tout est chiffré |
| Commandes | `mount -t ecryptfs` | `cryptsetup luksFormat`, `luksOpen` |

Principe LUKS :

```bash
cryptsetup luksFormat /dev/sdb1        # chiffre le périphérique (détruit les données)
cryptsetup luksOpen /dev/sdb1 secret   # crée /dev/mapper/secret
mkfs.ext4 /dev/mapper/secret           # puis mkfs et mount sur le périphérique mapper
mount /dev/mapper/secret /mnt/secret
```

La configuration au démarrage se fait dans `/etc/crypttab`.

:::

---

## 7. Gestion des disques optiques {#section-7-optiques}

### 7.1 Les systèmes de fichiers des disques optiques

| FS | Détails |
|---|---|
| **ISO 9660** | Système de fichiers standard pour les **CD-ROM** |
| Niveau 1 | Ne prend en charge que les noms de fichiers **8.3** (8 caractères + extension de 3) |
| Niveaux 2 et 3 | Ajoutent la prise en charge de noms de fichiers plus longs (32 caractères selon le cours) |
| **Rock Ridge** (extension) | Compatible avec le standard **POSIX** : noms de fichiers longs de style Unix, **permissions**, **liens symboliques** |
| **Joliet** (extension) | Créée par **Microsoft** pour être utilisée par **Windows** |
| **UDF** (*Universal Disk Format*) | Système de fichiers de nouvelle génération pour les disques optiques, couramment utilisé sur les **DVD-ROM** |

### 7.2 Créer et monter une image ISO

La commande **`mkisofs`** crée un fichier image contenant un système de fichiers ISO 9660, sans graver de disque.

```bash
mkisofs -o image.iso ~/work/lpi/auf/                 # crée l'image
mount -o loop -t iso9660 -o ro image.iso /mnt/       # monte l'image
```

- **`-o loop`** monte un **fichier** comme s'il s'agissait d'un périphérique (périphérique *loop*).
- **`ro`** : lecture seule, normal pour un CD. Les deux `-o` peuvent s'écrire `-o loop,ro`.

**Options de `mkisofs` :**

| Option | Fonction |
|---|---|
| `-R` | Ajoute l'extension **Rock Ridge** : les fichiers **conservent** leurs droits d'accès et leurs propriétaires |
| `-r` | Ajoute Rock Ridge, **change les propriétaires en root** et donne un accès en **lecture seule** à tous les utilisateurs |
| `-J` | Ajoute l'extension **Joliet** |

:::tip

**Complément.**

- `-r` est préféré pour distribuer un disque, car les identifiants d'utilisateurs de votre machine n'ont aucun sens ailleurs. `-r -J` donne un disque lisible sous Linux et sous Windows.
- Sur beaucoup de distributions, `mkisofs` est remplacé par **`genisoimage`**, qui accepte les mêmes options.
- La **gravure** se fait ensuite avec `wodim` ou `cdrecord`.

:::

**Test (comportement attendu) :**

```bash
mkdir /tmp/contenu && echo "bonjour" > /tmp/contenu/un_nom_de_fichier_long.txt
mkisofs -r -J -o /tmp/image.iso /tmp/contenu
mkdir /mnt/iso
mount -o loop,ro -t iso9660 /tmp/image.iso /mnt/iso
ls -l /mnt/iso
touch /mnt/iso/test        # doit échouer : système de fichiers en lecture seule
df -T /mnt/iso             # type iso9660
umount /mnt/iso
```

---

## Erreurs fréquentes et dépannage {#depannage}

### `mkfs` : « la taille rapportée du périphérique est zéro »

```text
mkfs.ext4: La taille rapportée du périphérique est zéro. La partition spécifiée est
invalide ou la table de partitions n'a pas été relue après l'exécution de fdisk [...]
```

**Diagnostic : vérifier la partition avec `fdisk -l`.**

```text
Périphérique Amorce  Début     Fin     Blocs   Id  Système
/dev/sdb1             4096     4096       0+   83  Linux
```

`Début = Fin = 4096` : la partition ne fait qu'**un secteur**. Au prompt « Dernier secteur », la valeur `4096` a été lue comme un numéro de secteur, pas comme une taille.

**Solution :** supprimer et recréer la partition avec une taille (`+400M`).

```bash
fdisk /dev/sdb         # d, n, p, 1, Entrée, +400M, p, w
fdisk -l /dev/sdb      # vérifier que « Fin » est bien plus grand que « Début »
mkfs.ext4 /dev/sdb1
```

**Si la partition est correcte** mais que `mkfs` se plaint encore, le noyau n'a pas relu la table de partitions (disque déjà utilisé pendant la modification). Forcer la relecture avec l'une de ces commandes, ou redémarrer :

```bash
partprobe /dev/sdb
partx -u /dev/sdb
blockdev --rereadpt /dev/sdb
```

### Partition de 200 Mo au lieu de 400 Mo

Résultat observé après correction :

```text
Périphérique Amorce  Début     Fin     Blocs   Id  Système
/dev/sdb1             2048   409600  203776+   83  Linux
```

`409600` a été saisi comme **dernier secteur** : 203776 blocs de 1 Ko, soit environ 200 Mo. Pour 400 Mo, il fallait saisir `+400M`.

### Autres pièges

| Symptôme | Cause | Solution |
|---|---|---|
| `umount` : *device is busy* | Un shell est dans le dossier, ou un programme l'utilise | `cd /` puis relancer `umount` |
| `umount` : commande introuvable | Faute de frappe | Il s'écrit `umount`, sans « n » |
| Fichiers du dossier invisibles après `mount` | Le FS monté **cache** le contenu d'origine | Normal : ils réapparaissent après `umount` |
| Le montage disparaît au redémarrage | `mount` n'est pas persistant | Ajouter une ligne dans `/etc/fstab` |
| Le système ne démarre plus après modification de `fstab` | Ligne erronée | Toujours tester avec `mount -a` avant de redémarrer |
| Données perdues après `mkswap` | `mkswap` a écrasé un FS existant | Vérifier le périphérique avec `lsblk -f` avant |
| `fsck` aggrave la corruption | FS vérifié **monté** | Démonter avant `fsck` |
| `-V` et `-v` confondus | Version et verbose | `-V` affiche la version, `-v` est bavard |
| `tune2fs -l` et `-L` confondus | Affichage et label | `-l` affiche, `-L` définit |

---

## Travaux pratiques : parcours complet {#tp}

Disque de test : `/dev/sdb` (vide). Vérifiez chaque étape avant de passer à la suivante.

| Étape | Commandes | Vérification attendue |
|---|---|---|
| 1. Partitionner | `fdisk /dev/sdb` puis `n`, `p`, `1`, Entrée, `+400M`, `w` | `fdisk -l /dev/sdb` : `sdb1`, Id 83, environ 409600 blocs |
| 2. Formater | `mkfs.ext4 /dev/sdb1` | Sortie avec inodes, 5 % réservés, superblocs de secours, création du journal |
| 3. Monter | `mkdir /mnt/data` puis `mount /dev/sdb1 /mnt/data` | `df -T /mnt/data` : type ext4 monté sur `/mnt/data` |
| 4. Écrire | `echo "test" > /mnt/data/f.txt` | `ls -l /mnt/data` : `f.txt` (5 octets) et `lost+found` |
| 5. Prouver | `cd /`, `umount /mnt/data`, `ls /mnt/data`, `mount /dev/sdb1 /mnt/data`, `ls /mnt/data` | Vide, puis `f.txt` revient |
| 6. Ajuster | `tune2fs -L DONNEES /dev/sdb1` puis `tune2fs -m 1 /dev/sdb1` | `tune2fs -l` : nouveau label et réserve réduite |
| 7. Vérifier | `umount /mnt/data` puis `fsck -f -v /dev/sdb1` | 5 phases puis résumé, sans erreur |
| 8. Persister | `blkid /dev/sdb1`, ajouter la ligne dans `/etc/fstab`, `mount -a` | `df -T /mnt/data` : `sdb1` monté |
| 9. Swap (fichier) | `dd`, `chmod 600`, `mkswap`, `swapon` sur `/swapfile` | `swapon -s`, `free -m` et `/proc/swaps` montrent le swap |
| 10. ISO | `mkisofs -r -J -o ...` puis `mount -o loop,ro` | `df -T` : `iso9660`, écriture refusée |

---

## Résumé : points essentiels à retenir {#resume}

- Un **FS** organise le stockage des fichiers sur un périphérique. Le **VFS** est la couche du noyau qui donne une interface unique et redirige chaque appel vers le **pilote** du FS concerné. **ext** (1992) est le premier FS conçu pour le VFS.
- `ext2` → (+ journal) → `ext3` → (+ grands volumes) → `ext4`. Le **journal** enregistre les écritures en cours et évite un `fsck` complet après une coupure.
- Parcours d'un disque : **`fdisk`** (partitionner, `w` pour enregistrer) → **`mkfs`** (formater) → **`mount`** (accrocher à un dossier).
- MBR : 4 partitions primaires maximum, une étendue permet des partitions logiques (5 et plus). Taille au prompt de `fdisk` : `+400M`.
- `df -T`, `lsblk -f` et `blkid` donnent le type de FS. `/etc/fstab` rend le montage permanent (testez avec `mount -a`).
- **Blocs réservés** : 5 % pour root par défaut, réglés par `-m`. Ils évitent qu'un utilisateur remplisse tout le FS.
- **Superbloc** : décrit le FS, copies de secours dans les groupes de blocs, affiché par `tune2fs -l` ou `dumpe2fs -h`, utilisable avec `e2fsck -b`.
- **`tune2fs`** ajuste un FS ext : `-L` label, `-m`/`-r` réserve, `-j` journal, `-c` nombre de montages, `-l` affichage.
- **`fsck`** vérifie et répare, **FS démonté** : `-f` force, `-p` réparation automatique sûre, `-y` répond oui à tout.
- **Swap** : `mkswap` (créer), `swapon` (activer), `swapoff` (désactiver), `swapon -s` / `free -m` / `/proc/swaps` (afficher). Fichier swap : `chmod 600`.
- **eCryptfs** (TCFS) : couche de chiffrement au-dessus du FS, via `mount -t ecryptfs`, avec chiffrement des données et des noms. **LUKS** chiffre le périphérique entier.
- **CD-ROM** : ISO 9660 + Rock Ridge (Unix) + Joliet (Windows), UDF pour les DVD. `mkisofs` crée l'image, `mount -o loop,ro` la monte.

---

## Questions de révision {#questions}

Le corrigé est à la fin de la leçon.

### Types de FS, VFS

1. Quelle est la différence entre ext2 et ext3 ?
2. Pourquoi un FS journalisé récupère-t-il plus vite après une coupure de courant ? Que enregistre le journal ?
3. Quelle commande affiche le type de FS des partitions montées ?
4. Qu'est-ce que le VFS, et à quoi sert-il ?
5. Pourquoi `cp` fonctionne-t-il de la même façon sur ext4 et sur NTFS ? Qui fait le travail spécifique à chaque FS ?
6. Qu'est-ce qui a changé avec ext en 1992 ?

### Création et montage

7. Quelle touche de `fdisk` enregistre les changements, et laquelle les abandonne ?
8. Quelle est la différence entre `fdisk` et `mkfs` ?
9. Quelle commande crée un FS ext3 avec `mke2fs` ?
10. Combien de partitions primaires maximum en MBR, et comment dépasser cette limite ? Peut-on faire `mkfs` directement sur une partition étendue ?
11. Quel est l'avantage principal de LVM sur une partition classique ?
12. Que signifient `Début = 4096` et `Fin = 4096` pour une partition ? Que fallait-il saisir au « Dernier secteur » pour une partition de 400 Mo ?
13. Qu'est-ce qu'un point de montage ? Que se passe-t-il quand on écrit dans `/mnt/data` après `mount /dev/sdb1 /mnt/data` ?
14. Pourquoi faut-il `umount` avant de retirer une clé USB ?
15. Pourquoi réserve-t-on 5 % des blocs pour root ? Quelle option modifie ce pourcentage ?
16. Où sont stockées les copies du superbloc, et à quoi servent-elles ?

### `tune2fs` et `fsck`

17. Quelle option de `tune2fs` change le label, et laquelle affiche le superbloc ?
18. Quelle commande ajoute un journal à un ext2 ?
19. Pourquoi faut-il démonter le FS avant `fsck` ?
20. Quelle est la différence entre `fsck -p` et `fsck -y` ?

### Swap

21. Quelle commande crée l'espace swap, et laquelle l'active ?
22. Pourquoi `mkswap` sur une partition contenant un FS est-il dangereux ?
23. Cite deux commandes qui affichent l'utilisation du swap.
24. Pourquoi `chmod 600` sur un fichier swap ? Quelle ligne ajouter dans `/etc/fstab` pour l'activer au démarrage ?

### Chiffrement et disques optiques

25. Pourquoi ext4 ne suffit-il pas à protéger la confidentialité, et que fait la couche eCryptfs ?
26. Que signifie une clé de 32 octets, et que chiffre l'option « chiffrement du nom de fichier » ?
27. À quoi servent Rock Ridge et Joliet ?
28. Quelle différence entre `mkisofs -R` et `-r` ? Que fait `-o loop` ?

### Exercices pratiques

29. Sur un disque `/dev/sdc` vide, créez une partition primaire de 300 Mo, formatez-la en ext3 avec le label `ARCHIVES` et 1 % de blocs réservés, montez-la sur `/mnt/archives`, puis rendez le montage permanent.
30. Une partition `/dev/sdb2` formatée en ext2 doit devenir ext3 sans perte de données. Quelle commande utilisez-vous, que faut-il modifier dans `/etc/fstab`, et comment vérifier le résultat ?

---

## Corrigé {#corrige}

**1.** ext3 = ext2 + journalisation.

**2.** Le journal enregistre les **opérations d'écriture en cours** (surtout les métadonnées). Après une coupure, le système **rejoue le journal** au lieu de parcourir tout le disque avec `fsck`.

**3.** `df -T` (aussi `lsblk -f`, `blkid`, `mount`).

**4.** Une couche du noyau, entre les programmes et les FS, qui offre une interface unique (`open`, `read`, `write`...) et redirige chaque appel vers le pilote du FS concerné.

**5.** Parce que `cp` passe par le VFS. C'est le **pilote** du FS (ext4, NTFS...) qui fait le travail spécifique, pas le VFS ni le programme.

**6.** ext est le **premier FS conçu pour utiliser l'API VFS**.

**7.** `w` enregistre (écrit sur la table de partitions), `q` quitte sans sauvegarder.

**8.** `fdisk` **partitionne** le disque (découpage logique). `mkfs` **formate** une partition en y construisant un système de fichiers.

**9.** `mke2fs -j /dev/sdb1` (ou `mkfs.ext3`).

**10.** 4 partitions primaires maximum. Pour dépasser la limite : 3 primaires + 1 étendue, puis des partitions logiques. Non, `mkfs` se fait sur les partitions **logiques**, pas sur l'étendue qui n'est qu'un conteneur.

**11.** LVM permet de **redimensionner** facilement les volumes, de regrouper plusieurs disques et de faire des snapshots, alors qu'une partition classique a une taille fixe.

**12.** La partition ne fait qu'**un secteur** (taille quasi nulle, `Blocs = 0+`). Il fallait saisir **`+400M`**, avec le `+`.

**13.** Le point de montage est le **dossier** où l'on accroche le FS d'un périphérique (la racine `/` en est un aussi). Écrire dans `/mnt/data` écrit **sur la partition `sdb1`** : les données sont conservées après `umount` et redémarrage.

**14.** `umount` force l'écriture des **caches** vers le périphérique avant de le détacher. Sans cela, des données peuvent être perdues ou le FS corrompu.

**15.** Pour qu'un utilisateur normal ne puisse pas remplir tout le FS : root doit pouvoir se connecter et les services root continuer à écrire. L'option **`-m`** (de `mkfs` ou `tune2fs`) modifie le pourcentage.

**16.** Dans certains **groupes de blocs** (8193, 24577, 40961...). Elles servent à réparer un FS dont le superbloc est perdu : `e2fsck -b 8193 /dev/sdb1`.

**17.** `-L` change le label, `-l` affiche le superbloc.

**18.** `tune2fs -j /dev/sdb1`.

**19.** Réparer un FS monté peut aggraver la corruption, car le FS est modifié pendant la vérification.

**20.** `-p` répare automatiquement **uniquement les problèmes sûrs** et s'arrête sinon. `-y` répond « yes » à **toutes** les questions, y compris aux corrections risquées. On ne peut pas les combiner.

**21.** `mkswap` crée, `swapon` active.

**22.** `mkswap` **écrase** le FS et les données de la partition.

**23.** Par exemple `swapon -s` (ou `swapon --show`), `free -m`, `cat /proc/swaps`, `cat /proc/meminfo`.

**24.** Le swap contient des morceaux de RAM (mots de passe, clés, données privées) : `600` réserve la lecture et l'écriture au propriétaire root. Ligne : `/swapfile   none   swap   sw   0 0`.

**25.** ext[234] ne chiffrent pas les données : qui accède au disque les lit. La couche eCryptfs (TCFS) **chiffre les données avant** de les écrire en blocs sur le disque.

**26.** 32 octets = clé de 256 bits (AES-256). L'option chiffre les **noms des fichiers**, pas seulement leur contenu.

**27.** **Rock Ridge** : noms longs Unix, permissions et liens symboliques (POSIX). **Joliet** : extension Microsoft pour la compatibilité Windows.

**28.** `-R` conserve les droits et propriétaires des fichiers. `-r` met les propriétaires à root et donne la lecture seule à tous. `-o loop` monte un **fichier** (l'image) comme un périphérique.

**29.** Exemple de solution :

```bash
fdisk /dev/sdc                                  # n, p, 1, Entrée, +300M, w
mkfs.ext3 -L ARCHIVES -m 1 /dev/sdc1
mkdir /mnt/archives
mount /dev/sdc1 /mnt/archives
blkid /dev/sdc1                                 # récupérer l'UUID
# ajouter dans /etc/fstab :
# UUID=<uuid>   /mnt/archives   ext3   defaults   0 2
mount -a                                        # tester
```

**30.** `tune2fs -j /dev/sdb2` ajoute le journal et transforme l'ext2 en ext3 sans perte de données. Dans `/etc/fstab`, le type du champ 3 passe de `ext2` à `ext3`. Pour vérifier : `blkid /dev/sdb2` ou `lsblk -f` (type), `tune2fs -l /dev/sdb2` (la ligne des fonctionnalités contient `has_journal`), puis `df -T` une fois le FS monté.

---

## Références {#references}

- Pr. RIDOUANI, *Chapitre 3. Les systèmes de fichiers Linux* : support de cours de référence.
- Documentation du noyau Linux, *Overview of the Linux Virtual File System* : https://docs.kernel.org/filesystems/vfs.html
- Projet fscrypt, comparaison dm-crypt/LUKS, fscrypt et eCryptfs (eCryptfs non maintenu) : https://github.com/google/fscrypt
- ArchWiki, *eCryptfs* (avertissement sur la maintenance et alternatives) : https://wiki.archlinux.org/title/ECryptfs
- Pages de manuel (`man`) : `fdisk(8)`, `mkfs(8)`, `mke2fs(8)`, `mount(8)`, `fstab(5)`, `tune2fs(8)`, `dumpe2fs(8)`, `e2fsck(8)`, `fsck(8)`, `mkswap(8)`, `swapon(8)`, `cryptsetup(8)`, `ecryptfs(7)`, `mkisofs(8)` ou `genisoimage(1)`.Sx et hiérarchie FHS
- **2.** Principaux systèmes de fichiers
- **3.** Partitions et création d'un système de fichiers
- **4.** Montage et démontage
- **5.** Montages persistants avec `/etc/fstab`
- **6.** Vérification de l'espace et de l'utilisation des disques
- **7.** Maintenance et dépannage
- **8.** Récapitulatif

---

## 0. Introduction aux systèmes de fichiers

### 0.1 Définition et rôle

### 0.2 Fichiers, répertoires et métadonnées

---

## 1. Arborescence Linux et hiérarchie FHS

### 1.1 La racine `/`

### 1.2 Répertoires importants

---

## 2. Principaux systèmes de fichiers

### 2.1 ext4

### 2.2 XFS et Btrfs

### 2.3 FAT, exFAT et NTFS

### 2.4 Swap

---

## 3. Partitions et création d'un système de fichiers

### 3.1 Identifier les disques et les partitions

### 3.2 Créer une partition

### 3.3 Formater une partition

---

## 4. Montage et démontage

### 4.1 Points de montage

### 4.2 Monter un système de fichiers

### 4.3 Démonter un système de fichiers

---

## 5. Montages persistants avec `/etc/fstab`

### 5.1 UUID et identification des partitions

### 5.2 Structure du fichier `/etc/fstab`

### 5.3 Vérifier la configuration

---

## 6. Vérification de l'espace et de l'utilisation des disques

### 6.1 Consulter les systèmes montés

### 6.2 Mesurer l'espace utilisé

### 6.3 Rechercher les fichiers volumineux

---

## 7. Maintenance et dépannage

### 7.1 Vérifier et réparer un système de fichiers

### 7.2 Diagnostiquer les erreurs de montage

### 7.3 Bonnes pratiques et précautions

---

## 8. Récapitulatif

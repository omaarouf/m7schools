---
id: lesson-13
title: Noyau Linux (Kernel)
sidebar_label: Noyau Linux
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Comprendre et administrer le noyau Linux

Le **noyau Linux** (*Linux kernel*) est le cœur du système d'exploitation. Il fait l'intermédiaire entre les applications et le matériel, et gère les processus, la mémoire, les périphériques, les systèmes de fichiers et le réseau.

## Objectifs

À la fin de cette leçon, vous saurez :

- lire un numéro de version du noyau (ancien et nouveau modèle) ;
- distinguer **version de base**, **version stable** et **patch incrémental** ;
- choisir le bon patch selon la version de départ (tous les cas) ;
- mettre à jour un noyau en 5 étapes sur **Debian** et **Fedora** ;
- modifier dynamiquement les paramètres du noyau (`/proc/sys`, `sysctl`) ;
- manipuler les modules du noyau (`lsmod`, `modprobe`, `modules.dep`...).

## Architecture en bref

```text
+-----------------------------------------+
|   Applications (shell, navigateur...)   |
+-----------------------------------------+
|        Appels système (API du noyau)    |
+-----------------------------------------+
|               NOYAU LINUX               |
|  processus | mémoire | fichiers | réseau|
|      modules (pilotes chargeables)      |
+-----------------------------------------+
|     Matériel (CPU, RAM, disque, NIC)    |
+-----------------------------------------+
```

---

## 1. Les versions du noyau

### Ancien modèle (jusqu'à 2.6) : `A.B.C`

Exemple : `2.6.32` → A = 2, B = 6, C = 32.

| Position | Nom | Rôle |
|---|---|---|
| 1er | **Majeure** | Change très rarement (1.0 en 1994, 2.0 en 1996) |
| 2e | **Mineure** | Avant 2.6 : **pair = stable**, **impair = développement** (2.2, 2.4 stables ; 2.3, 2.5 dev) |
| 3e | **Révision** | Augmente à chaque publication (correctifs, nouveaux pilotes, fonctionnalités) |

:::info
Depuis la **2.6**, la règle pair/impair est **abandonnée** : elle ne veut plus rien dire.
:::

### Nouveau modèle (3.x, 4.x, 5.x, 6.x)

| Écriture | Type | Signification |
|---|---|---|
| `6.6` | **Base** (mainline) | Version principale publiée par Linus |
| `6.6.3` | **Stable** | Base `6.6` + 3 séries de corrections (bugs, sécurité), **sans nouveauté** |

:::tip Reconnaître au nom
`6.6` → base · `6.6.3` → stable · `6.6.2-3` → patch **incrémental** (le tiret veut dire « de 2 vers 3 »).
:::

---

## 2. Les patchs

### Définition

Un **patch** est un fichier texte qui décrit les **différences** entre deux versions de fichiers : quelles lignes supprimer, lesquelles ajouter, et où. On le crée avec `diff` et on l'applique avec `patch`.

```diff
--- a/Makefile
+++ b/Makefile
@@ -1,5 +1,5 @@
 VERSION = 6
 PATCHLEVEL = 6
-SUBLEVEL = 2
+SUBLEVEL = 3
```

- `---` : fichier avant, `+++` : fichier après ;
- `@@ ... @@` : position dans le fichier ;
- `-` ligne supprimée, `+` ligne ajoutée, sans signe : contexte.

### Commandes de base

```bash
bunzip2 patch-x.y.bz2                  # décompresser (ou gunzip pour .gz)
cd /usr/src/linux                      # se placer dans les sources
patch -p1 --dry-run < patch-x.y        # tester sans modifier
patch -p1 < patch-x.y                  # appliquer
patch -R -p1 < patch-x.y               # annuler (R = reverse)
```

- `-p1` retire le 1er niveau de dossier (`a/`, `b/`) dans les chemins ; **pas d'espace** entre `-p` et `1`.
- Un fichier `.rej` apparaît quand le patch ne correspond pas à l'état de l'arbre : mauvaise version de départ.

### Les 3 types de patchs

| Type | Exemple | Part de | Arrive à |
|---|---|---|---|
| **Base** | `patch-6.7` | 6.6 propre | 6.7 |
| **Stable (cumulatif)** | `patch-6.6.3` | 6.6 **base** | 6.6.3 |
| **Incrémental** | `patch-6.6.2-3` | 6.6.2 **exactement** | 6.6.3 |

:::warning Règles d'or
1. Un patch **stable** part toujours de la **base** (jamais d'un autre stable).
2. Un patch **incrémental** `X.y-z` part du stable `X.y` exact.
3. Un patch de **base** part de la base précédente **propre**.
4. **Jamais de saut** entre bases : 6.6 → 6.8 passe par 6.7.
5. Pour **changer de série**, on revient **d'abord à la base** avec `-R`.
:::

### Tous les cas

Notation : `X` = base (6.6), `X.y` = stable (6.6.3).

| # | De → Vers | Exemple | Comment |
|---|---|---|---|
| 1 | Base → stable | 6.6 → 6.6.3 | `patch-6.6.3` (cumulatif) |
| 2 | Base → base suivante | 6.6 → 6.7 | `patch-6.7` |
| 3 | Stable → stable suivante | 6.6.2 → 6.6.3 | `patch-6.6.2-3` (incrémental) |
| 4 | Stable → base (même série) | 6.6.3 → 6.6 | `-R patch-6.6.3` |
| 5 | Stable → stable plus loin | 6.6.2 → 6.6.5 | Chaîner `2-3`, `3-4`, `4-5` ; ou `-R patch-6.6.2` puis `patch-6.6.5` |
| 6 | Stable → stable précédente | 6.6.5 → 6.6.4 | `-R patch-6.6.4-5` |
| 7 | Stable → base suivante | 6.6.3 → 6.7 | `-R patch-6.6.3`, puis `patch-6.7` |
| 8 | Stable → stable de la base suivante | 6.6.3 → 6.7.2 | `-R patch-6.6.3`, `patch-6.7`, puis `patch-6.7.2` |
| 9 | Base → base plus loin | 6.6 → 6.8 | `patch-6.7` puis `patch-6.8` |
| 10 | Base → stable de la base suivante | 6.6 → 6.7.2 | `patch-6.7` puis `patch-6.7.2` |
| 11 | Base → base précédente | 6.7 → 6.6 | `-R patch-6.7` |

```text
6.6 --patch-6.6.3--> 6.6.3 --patch-6.6.3-4--> 6.6.4
 |                     |
 |                     +-- -R patch-6.6.4 --> retour à 6.6
 |
 +--patch-6.7--> 6.7 --patch-6.7.2--> 6.7.2
```

La **base** est le point de passage obligé : on y revient avant de changer de série.

### Exercice de la slide : « Quel correctif s'applique à quelle version ? »

| Cas | Départ | Patch | Applicable ? |
|---|---|---|---|
| 1 | 2.6.17 (base) | stable `2.6.17.10` | **Oui** |
| 2 | 2.6.17.9 (stable) | stable `2.6.17.10` | **Non** (il faut l'incrémental `9-10`, ou `-R` puis le cumulatif) |
| 3 | 2.6.17 (base) | base `2.6.18` | **Oui** |
| 4 | 2.6.17.9 | incrémental `9-10`, puis `10-11` | **Oui** (dans l'ordre) |

---

## 3. Mise à jour d'un noyau

### Pourquoi ?

- Corriger des **bugs** ou une **faille de sécurité**.
- **Ne pas perdre** le temps passé à personnaliser et compiler : on garde l'ancien arbre de sources et la configuration (`.config`).

### Les 5 étapes

| Étape | Action | Commande |
|---|---|---|
| 1 | Obtenir le nouveau code source / les patchs | `cp`, `tar -xzvf`, `gunzip` |
| 2 | Appliquer les patchs sur l'ancien arbre | `patch -p1 < ...` |
| 3 | Reconfigurer à partir de l'ancienne config | `make oldconfig` |
| 4 | Compiler | `make` |
| 5 | Installer | `make modules_install`, `make install` |

### Scénario du TP : 3.17 → 3.18.5

<Tabs groupId="distro">
<TabItem value="debian" label="Debian (GRUB 2)" default>

Configuration de départ : `/boot/config-2.6.32-5-686`.

```bash
su -

# Étape 0 : préparation
cp /home/gi/Bureau/kernel/* /usr/src/
cd /usr/src
dpkg -i patch-*.deb                    # outil patch, si absent
tar -xzvf linux-3.17.tar.gz
gunzip patch-*.gz

# Étape 1 : patchs (3.17 -> 3.18.5)
cd linux-3.17
head Makefile                          # 3.17
patch -p1 < ../patch-3.18              # base -> base suivante
head Makefile                          # 3.18
ls ../
patch -p1 < ../patch-3.18.2            # base -> stable (cumulatif)
patch -p1 < ../patch-3.18.2-3          # incrémental
patch -p1 < ../patch-3.18.3-4          # incrémental
patch -p1 < ../patch-3.18.4-5          # incrémental
head Makefile                          # SUBLEVEL = 5

# Étape 2 : configuration
ls /boot
wc -l /boot/config-2.6.32-5-686
cp /boot/config-2.6.32-5-686 .config
make oldconfig
wc -l .config

# Étape 3 : compilation
make

# Étape 4 : modules
make modules_install
ls /lib/modules                        # doit contenir 3.18.5

# Étape 5 : installation du noyau
ls -l /boot/grub
make install
wc -l /boot/grub/grub.cfg              # avant
update-grub2
wc -l /boot/grub/grub.cfg              # après

# Si kernel panic (initrd introuvable) : on le crée
mkinitramfs -o /boot/initrd.img-3.18.5 /lib/modules/3.18.5/
update-grub2
reboot
```

</TabItem>
<TabItem value="fedora" label="Fedora (GRUB legacy)">

Configuration de départ : `/boot/config-2.6.35.6-45.fc14.i686`.

```bash
su -

# Étape 0 : préparation
rpm -ivh /home/gi/Bureau/packages-gcc/*.rpm    # gcc et dépendances
cp /home/gi/Bureau/kernel/* /usr/src/
cd /usr/src
rpm -ivh patch-*.rpm                           # installe l'outil patch
tar -xzvf linux-3.17.tar.gz
gunzip patch-*.gz

# Étape 1 : patchs
cd linux-3.17
head Makefile                                  # 3.17
patch -p1 < ../patch-3.18
patch -p1 < ../patch-3.18.2
patch -p1 < ../patch-3.18.2-3
patch -p1 < ../patch-3.18.3-4
patch -p1 < ../patch-3.18.4-5
head Makefile                                  # 3.18.5

# Démo : retour arrière puis réapplication
patch -R -p1 < ../patch-3.18.4-5               # retour en 3.18.4
patch -p1 < ../patch-3.18.4-5                  # de nouveau 3.18.5

# Étape 2 : configuration
cp /boot/config-2.6.35.6-45.fc14.i686 .config
make oldconfig
ls -a                                          # .config présent ?

# Étape 3 : compilation
make
ls arch/i386/boot/bzImage                      # noyau compilé

# Étape 4 : modules
uname -r                                       # noyau actuel
make modules_install

# Étape 5 : installation du noyau
cat /boot/grub/menu.lst
make install
nano /boot/grub/menu.lst                       # ex. modifier le timeout
reboot
```

</TabItem>
</Tabs>

Après le redémarrage, choisir 3.18.5 dans GRUB et vérifier :

```bash
uname -r        # 3.18.5
```

### Différences Debian / Fedora

| Point | Debian | Fedora |
|---|---|---|
| Paquets | `dpkg -i *.deb` | `rpm -ivh *.rpm` |
| Chargeur | GRUB 2 : `/boot/grub/grub.cfg` | GRUB legacy : `/boot/grub/menu.lst` |
| Mise à jour du menu | `update-grub2` | `make install` l'ajoute, édition manuelle de `menu.lst` |
| Initramfs | À créer à la main si panic : `mkinitramfs` | Créé par `make install` |

### Les commandes clés expliquées

| Commande | Rôle |
|---|---|
| `head Makefile` | Affiche `VERSION`, `PATCHLEVEL`, `SUBLEVEL` : la version des sources |
| `make oldconfig` | Reprend l'ancien `.config`, ne pose des questions que sur les **nouvelles** options (`y` intégré, `m` module, `n` désactivé) |
| `make modules_install` | Copie les modules `.ko` dans `/lib/modules/version/` et lance `depmod` |
| `make install` | Installe le noyau dans `/boot` (`vmlinuz`, `System.map`, `config`) |
| `update-grub2` | Régénère `grub.cfg` (Debian) |
| `mkinitramfs -o` | Crée l'image initiale (`initrd`) |
| `wc -l fichier` | Compte les lignes : sert à comparer **avant/après** |

:::warning Ordre et noms
- La bonne commande est `make modules_install` (pas `install_modules`), à lancer **avant** `make install`.
- `.config` est un **fichier caché** à la racine des sources : `ls -a`.
- Le dossier garde le nom `linux-3.17` même après les patchs : le contenu est en 3.18.5.
:::

### Méthodes de configuration (`make ...`)

| Méthode | Effet |
|---|---|
| `config` | Toutes les questions en texte (trop long) |
| `menuconfig` | Menus dans le terminal |
| `xconfig` / `gconfig` | Interface graphique (Qt / GTK) |
| `oldconfig` | Questions uniquement sur les nouvelles options |
| `olddefconfig` | Valeurs par défaut, sans question |
| `defconfig` | Config par défaut de l'architecture |
| `localmodconfig` | Ne garde que les modules actuellement chargés |

Obtenir un `.config` de départ :

```bash
cp /boot/config-$(uname -r) .config      # la plus sûre
zcat /proc/config.gz > .config           # si le noyau l'expose
make defconfig                           # sinon
```

---

## 4. Modification dynamique des paramètres du noyau

Le noyau se règle **pendant qu'il tourne**, sans recompiler ni redémarrer. Les réglages sont des **fichiers** dans `/proc/sys`.

| Fichier | Rôle |
|---|---|
| `/proc/sys/fs/file-max` | Nombre maximal de fichiers ouverts simultanément |
| `/proc/sys/kernel/ctrl-alt-del` | À **0** : Ctrl+Alt+Suppr est envoyé à `init` pour relancer proprement |
| `/proc/sys/net/ipv4/icmp_echo_ignore_all` | `1` : bloque les réponses au ping |
| `/proc/sys/net/ipv4/icmp_echo_ignore_broadcasts` | `1` : ignore les pings en diffusion |
| `/proc/sys/net/ipv4/ip_forward` | `1` : relayage entre cartes réseau (**routeur**) |
| `/proc/sys/kernel/hostname` | Nom de la machine |

### Trois façons de modifier

```bash
# 1. Écrire dans le fichier (immédiat, temporaire)
echo 1 > /proc/sys/net/ipv4/ip_forward
echo 0 > /proc/sys/net/ipv4/ip_forward

# 2. sysctl (immédiat, temporaire)
sysctl -w net.ipv4.ip_forward=1

# 3. /etc/sysctl.conf (permanent, lu au démarrage)
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p                                # recharger le fichier maintenant
```

Passage du chemin à la variable : on enlève `/proc/sys/` et on remplace `/` par `.`.

`/proc/sys/net/ipv4/ip_forward` → `net.ipv4.ip_forward`

:::tip Machine routeur
```bash
sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p
cat /proc/sys/net/ipv4/ip_forward        # doit afficher 1
```
`>>` ajoute à la fin du fichier, `>` écraserait tout son contenu.
:::

---

## 5. Les modules du noyau

Le noyau charge et décharge des **modules** (pilotes) à chaud. Ils sont sous `/lib/modules/version/kernel/drivers`.

| But | Commande | Explication |
|---|---|---|
| Modules chargés | `lsmod` | Modules actuellement en mémoire |
| Modules disponibles | `modprobe -l` | Tous ceux présents sur le système |
| Infos | `modinfo msdos` | Détails sur `msdos.ko` |
| Charger (simple) | `insmod module` | **Sans** gestion des dépendances |
| Charger (intelligent) | `modprobe module` | Charge aussi les **dépendances** |
| Décharger (simple) | `rmmod module` | Retire de la mémoire |
| Décharger (intelligent) | `modprobe -r module` | Retire aussi les modules devenus inutiles |

:::note
`modprobe -l` figure dans le cours (noyaux 2.6) ; sur les distributions récentes, l'option a disparu et on liste avec `find /lib/modules/$(uname -r) -name "*.ko*"`.
:::

### Fichiers de configuration

- **`/etc/modules.conf`** : noyau 2.4. **`/etc/modprobe.conf`** : noyau 2.6 et plus.
- Ils associent un module à un périphérique. Exemple : `alias eth0 3c59x` associe la carte `eth0` au pilote `3c59x`.

### `modules.dep`

- Situé dans `/lib/modules/version/`, généré par **`depmod`** (lancé par `make modules_install`).
- Format : `nom_module.ko: dependance1 dependance2`.

```bash
grep msdos /lib/modules/2.6.35.5/modules.dep
# kernel/fs/fat/msdos.ko: kernel/fs/fat/fat.ko
```

Pour charger `msdos`, il faut d'abord `fat` : `modprobe msdos` le fait seul, `insmod msdos.ko` échoue sans `fat` chargé avant.

---

## 6. Aide-mémoire

```text
Versions   : 6.6 = base | 6.6.3 = stable | 6.6.2-3 = incrémental
Patchs     : stable -> part de la base | incrémental -> part du stable exact
Changer de série : -R pour revenir à la base, puis avancer base par base
Mise à jour : sources -> patch -> oldconfig -> make -> modules_install -> install
Paramètres : echo / sysctl -w (temporaire) | /etc/sysctl.conf + sysctl -p (permanent)
Modules    : lsmod, modinfo, modprobe (+ dépendances), insmod, rmmod, depmod
```

## Erreurs fréquentes

- Appliquer un patch **stable** sur un arbre déjà en stable : il échoue (`.rej`).
- Appliquer un **incrémental** depuis une mauvaise version de départ.
- **Sauter** une base (6.6 → 6.8 directement).
- Oublier `cp /boot/config-... .config` avant `make oldconfig` : toutes les questions sont posées.
- Taper `gunzip patch-*.rpm` : un `.rpm` n'est pas un `.gz`.
- Écrire `dkpg`/`.dkpg` au lieu de `dpkg`/`.deb`.
- Croire que `echo > /proc/sys/...` est permanent : il est perdu au redémarrage.
- Oublier `mkinitramfs` sur Debian quand le démarrage tombe en **kernel panic**.

---

[Commencer le QCM : Noyau Linux](/quizzes/linux/quizzKernel)
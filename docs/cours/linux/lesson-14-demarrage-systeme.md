---
id: lesson-14
title: Démarrage du système Linux
sidebar_label: Démarrage du système
---

:::info Objectifs

- Personnaliser le processus de démarrage du système.
- Interroger et modifier le comportement des services système dans différents niveaux d'exécution.
- Configurer la procédure de démarrage des services.

:::

## Plan

- **0.** Le processus de démarrage d'un système Linux
- **1.** Processus init et niveaux d'exécution
- **2.** Gestion des services
- **3.** Gestion des services sous Red Hat
- **4.** Gestion des services sous Debian
- **5.** Upstart
- **6.** systemd
- **7.** Redémarrer et éteindre un système
- **8.** Récapitulatif

---

## 0. Le processus de démarrage d'un système Linux

### 0.1 Mise sous tension et firmware (BIOS ou UEFI)

- Le firmware lance le **POST** (Power-On Self Test) : il teste le matériel de base (RAM, CPU, clavier, disque...).
- **Erreur au POST** : un message s'affiche à l'écran (ou des bips sonores si l'écran n'est pas encore initialisé).
- **Pas d'erreur** : le firmware cherche un **périphérique de démarrage** (disque dur en premier, selon l'ordre de boot) pour charger le **bootloader**.

**Où vit le bootloader ?**

| | BIOS (legacy) | UEFI |
|---|---|---|
| Emplacement | Au **début du disque**, dans le **MBR** (premier secteur de 512 octets) | Dans une **partition séparée** : l'**ESP** (EFI System Partition, FAT32) |
| Format | Code de démarrage du premier étage | Fichier **`.efi`** (ex. `grubx64.efi`) |
| Secure Boot | Non | Oui (vérification de la signature) |

### 0.2 Bootloader (GRUB2)

- Il **trouve le noyau** (kernel) du système d'exploitation.
- Il **charge le noyau en mémoire (RAM)**, avec l'**initramfs**.
- Il lui passe les **paramètres de boot** (ex. `root=/dev/sda2 ro quiet`).
- Il peut afficher un **menu** pour choisir le noyau ou le système.

### 0.3 Noyau (kernel)

- Le noyau **s'exécute** : il se décompresse, puis initialise le CPU, la mémoire, l'ordonnanceur et les pilotes essentiels.
- Il monte l'**initramfs** comme système racine temporaire (voir 0.4).
- Il monte ensuite le **vrai système racine** `/` (`switch_root`).
- Il démarre le **premier processus** en espace utilisateur : **`init`** (PID 1).

### 0.4 initramfs

Mini système de fichiers racine chargé **en RAM**. Il contient les pilotes et outils nécessaires pour accéder au vrai disque :

- pilotes de stockage,
- **LVM**, **RAID**,
- **LUKS** (déchiffrement),
- systèmes de fichiers.

Il détecte et monte la vraie racine indiquée par le paramètre `root=`, puis fait un `switch_root` (ou `pivot_root`) vers elle.

### 0.5 Lancement de init (PID 1)

Le noyau exécute `/sbin/init` (ou la valeur du paramètre `init=`). Il cherche dans l'ordre : `/sbin/init`, `/etc/init`, `/bin/init`, puis `/bin/sh`.

`init` est le **parent de tous les processus**. Il gère :

- les services et daemons,
- le réseau,
- les journaux (logs),
- les connexions des utilisateurs (login),
- le montage des autres systèmes de fichiers et l'atteinte de la cible ou du niveau d'exécution voulu.

### 0.6 Schéma résumé

```text
Power ON → POST (erreur ? → message écran)
        → Firmware cherche le disque de boot
        → Bootloader (MBR en BIOS / .efi sur ESP en UEFI)
        → Kernel chargé en RAM + initramfs
        → Kernel s'exécute → monte la racine /
        → init / systemd (PID 1, parent de tous les processus)
        → services, réseau, journal, login
```

### 0.7 Debian et Red Hat : même principe

L'architecture est identique : firmware → GRUB2 → noyau + initramfs → `switch_root` → init (systemd) → services. Seuls les **outils** et les **chemins** changent.

| Élément | Debian / Ubuntu | Red Hat / RHEL / CentOS / Fedora |
|---|---|---|
| Config GRUB | `/boot/grub/grub.cfg` | `/boot/grub2/grub.cfg` (BIOS) ou `/boot/efi/EFI/redhat/grub.cfg` (UEFI) |
| Régénérer GRUB | `update-grub` | `grub2-mkconfig -o /boot/grub2/grub.cfg` |
| Installer GRUB | `grub-install` | `grub2-install` |
| Réglages GRUB | `/etc/default/grub` | `/etc/default/grub` |
| Fichiers noyau | `vmlinuz-*`, `initrd.img-*` | `vmlinuz-*`, `initramfs-*.img` |
| Outil initramfs | `initramfs-tools` | `dracut` |
| Régénérer l'initramfs | `update-initramfs -u` | `dracut -f` |
| Dossier ESP | `/boot/efi/EFI/debian` ou `ubuntu` | `/boot/efi/EFI/redhat` (ou `centos`, `fedora`) |
| Entrées de boot | `grub.cfg` généré | **BLS** : un fichier par noyau dans `/boot/loader/entries/` |
| Paquets | `apt`, `dpkg` | `dnf`, `rpm` |

:::tip À retenir
Modifier les paramètres du noyau sur Red Hat (BLS) : `grubby --update-kernel=ALL --args="..."`, au lieu d'éditer `grub.cfg` à la main.
:::

### 0.8 Commandes pour observer le démarrage

```bash
dmesg | less                 # messages du noyau au boot
cat /proc/cmdline            # paramètres passés au noyau
ls /boot                     # vmlinuz, initrd, grub/
ls /sys/firmware/efi         # ce dossier existe : boot en UEFI
ps -p 1 -o comm=             # affiche le processus PID 1
systemd-analyze blame        # temps de démarrage par service
journalctl -b                # logs du boot courant
```

### 0.9 Dépannage classique

| Symptôme | Cause probable | Solution |
|---|---|---|
| GRUB absent ou cassé | Bootloader écrasé ou supprimé | Démarrer sur un live USB, puis `grub-install` et `update-grub` |
| Kernel panic « unable to mount root fs » | Mauvais `root=` ou pilote manquant dans l'initramfs | `update-initramfs -u` (Debian) ou `dracut -f` (Red Hat) |
| Shell `(initramfs)` | Disque ou UUID introuvable | Vérifier `/etc/fstab` et `blkid` |

**Mode secours** : ajouter `systemd.unit=rescue.target` (ou `emergency.target`) à la ligne du noyau dans GRUB. Sur Red Hat, `rd.break` permet de réinitialiser le mot de passe root.

:::caution SELinux
SELinux est activé par défaut sur Red Hat. Après une restauration ou un déplacement de fichiers, `touch /.autorelabel` force le relabel au prochain démarrage. Debian utilise plutôt AppArmor.
:::

---

## 1. Processus init et niveaux d'exécution

### 1.1 Le processus init

- Premier processus utilisateur créé par le noyau lors du démarrage, **PID = 1**.
- Il consulte le fichier **`/etc/inittab`** pour décider quel niveau d'exécution démarrer.
- Il lance ensuite les scripts du répertoire `/etc/rc.d/rcN.d/` correspondant à ce niveau.

Extrait typique de `/etc/inittab` (Red Hat) :

```text
id:5:initdefault:
si::sysinit:/etc/rc.d/rc.sysinit
l0:0:wait:/etc/rc.d/rc 0
l1:1:wait:/etc/rc.d/rc 1
l2:2:wait:/etc/rc.d/rc 2
l3:3:wait:/etc/rc.d/rc 3
l4:4:wait:/etc/rc.d/rc 4
l5:5:wait:/etc/rc.d/rc 5
l6:6:wait:/etc/rc.d/rc 6
```

Format d'une ligne : `id:niveaux:action:processus`.

- `id:5:initdefault:` définit le **niveau d'exécution par défaut** (ici 5).
- `si::sysinit:...` définit le script d'initialisation du système.
- `lN:N:wait:/etc/rc.d/rc N` lance le script `rc` pour le niveau N.

### 1.2 Les niveaux d'exécution (runlevels)

| Niveau | Red Hat et dérivés |
|---|---|
| 0 | Arrêt (halt) |
| 1 | Mode mono-utilisateur ou maintenance |
| 2 | Multi-utilisateurs, console, **sans** support réseau |
| 3 | Multi-utilisateurs **avec** support réseau (mode texte) |
| 4 | Inutilisé |
| 5 | X11 : multi-utilisateurs avec **interface graphique** |
| 6 | Redémarrage |

:::note Debian
Sur Debian et ses dérivés, les niveaux **2 à 5** sont tous en mode multi-utilisateurs (identiques).
:::

### 1.3 Répertoires des niveaux d'exécution

Au démarrage (en appuyant sur la touche Échap ou une touche dédiée pour voir la version « verbeuse »), on aperçoit les services chargés : ce sont les programmes du niveau d'exécution courant, pris dans le répertoire de ce niveau.

| Niveau | Répertoire |
|---|---|
| 0 | `/etc/rc.d/rc0.d/` |
| 1 | `/etc/rc.d/rc1.d/` |
| 2 | `/etc/rc.d/rc2.d/` |
| 3 | `/etc/rc.d/rc3.d/` |
| 4 | `/etc/rc.d/rc4.d/` |
| 5 | `/etc/rc.d/rc5.d/` (par défaut en mode graphique) |
| 6 | `/etc/rc.d/rc6.d/` |

```bash
ls /etc/rc.d/            # Red Hat
ls /etc/rc.d/rc5.d/      # scripts du niveau 5 (Red Hat)
ls /etc/rc5.d/           # Debian : les rcN.d sont directement sous /etc
```

### 1.4 Scripts S et K

Dans ces répertoires, les noms commencent par **S** ou **K**, suivi d'un **numéro**.

| Préfixe | Signification | Action |
|---|---|---|
| **S** | **S**tartup (démarrage) | Le service est **démarré** |
| **K** | **K**ill (arrêt) | Le service est **arrêté** |

- Le **chiffre** indique l'**ordre d'exécution** (plus petit = plus tôt).
- Exemple : `S12syslog` est le 12e programme exécuté au démarrage.

### 1.5 Voir et changer le niveau d'exécution

| Besoin | Commande |
|---|---|
| Voir le niveau courant | `runlevel` ou `who -r` |
| Changer de niveau | `init N` ou `telinit N` |

```bash
init 1      # passe en mode maintenance
init 3      # passe en mode texte multi-utilisateurs
init 6      # redémarre le système
init 0      # arrête le système
telinit 1   # équivalent de init 1
runlevel    # affiche par exemple : N 5
```

Dans `N 5` : **N** signifie « pas de niveau précédent » et **5** est le niveau actuel.

### 1.6 Scripts utilisés par init pour contrôler les runlevels

#### Étape sysinit

Juste après le chargement du noyau, `init` exécute le script indiqué par la ligne **`si::sysinit:`** de `inittab`. Il s'exécute **une seule fois**, avant les scripts du runlevel.

| Distribution | Ligne dans inittab |
|---|---|
| Red Hat / Fedora | `si::sysinit:/etc/rc.d/rc.sysinit` |
| Debian | `si::sysinit:/etc/init.d/rcS` |

**Rôle de ce script (identique sur les deux) :**

- Configurer les paramètres du noyau présents dans `/etc/sysctl.conf`.
- Configurer l'**horloge** du système.
- Charger les **tables de caractères du clavier**.
- Activer les partitions d'échange (**SWAP**).
- Définir le **nom d'hôte**.
- Contrôler (fsck) et monter le système de fichiers **racine en lecture-écriture** (il était en lecture seule jusque-là).
- Contrôler et monter **les autres systèmes de fichiers**.

:::info Pourquoi sysinit passe avant le runlevel
Les services du runlevel (réseau, httpd...) ont besoin d'un système prêt : racine montée en lecture-écriture, swap actif, nom d'hôte défini. `rc.sysinit` prépare donc tout cela en premier.
:::

#### Le script rc

Le script **`rc`** exécute les scripts du répertoire `/etc/rc.d/rcN.d/`, où **N** correspond au niveau d'exécution. Il lance d'abord les scripts **K**, puis les scripts **S**, dans l'ordre des numéros.

#### Le script rc.local

- Exécuté par `init` **en dernier**, au démarrage et lors d'un changement de niveau d'exécution (`/etc/rc.d/rc.local`). Il est en pratique lié dans le niveau sous la forme `S99local`.
- **Usage** : lancer une application ou une commande personnalisée au démarrage, quand elle n'a **pas de script de service** (ex. une application développée par vous).
- **Limite** : `rc.local` ne gère que le **démarrage**. Pour arrêter l'application, il faut le faire manuellement :

```bash
ps aux | grep monapp
kill <PID>
```

- Pour un service installé par paquet (httpd, sshd...), **pas besoin de `rc.local`** : un script de service existe déjà dans `/etc/init.d/` et gère le démon.

### 1.7 Ordre de démarrage et d'arrêt

Les services ont des dépendances : l'arrêt se fait **à l'inverse** du démarrage.

```text
Démarrage :  1. Réseau (service 1)  →  2. DNS (service 2)
Arrêt     :  1. DNS (service 2)     →  2. Réseau (service 1)
```

Ce sont les **numéros** des scripts qui assurent cet ordre :

```text
S10network   → démarre en premier
S20named     → démarre ensuite (DNS)

K80named     → arrêté en premier
K90network   → arrêté en dernier
```

### 1.8 Séquence complète SysV

```text
Noyau → init (PID 1) → lit /etc/inittab
      → détecte le runlevel par défaut (id:5:initdefault:)
      → sysinit (rc.sysinit / rcS) : sysctl, horloge, clavier, swap, hostname, fsck + montages
      → rc N : exécute /etc/rc.d/rcN.d/ (K puis S)
      → rc.local (scripts personnalisés)
      → login (console ou interface graphique)
```

:::tip Phrase de révision
`init` lit `inittab`, détecte le runlevel, exécute `rc.sysinit` (préparation du système), exécute `rc N` (scripts K puis S de `rcN.d`), finit par `rc.local`, puis le login apparaît.
:::

---

## 2. Gestion des services

### 2.1 Principe : liens symboliques vers /etc/init.d

- Les **vrais scripts** sont stockés dans **`/etc/init.d/`** (un script par service : httpd, sshd, apache2...).
- Les fichiers des répertoires `/etc/rcN.d/` sont des **liens symboliques** vers ces scripts.
- Ces scripts contiennent les procédures pour **démarrer**, **arrêter** ou **déterminer l'état** de chaque service.
- Un même script peut être lié dans plusieurs niveaux, avec des préfixes S ou K différents.

```text
/etc/rc3.d/S85httpd  →  /etc/init.d/httpd
/etc/rc0.d/K15httpd  →  /etc/init.d/httpd
```

### 2.2 Comment rc appelle les scripts

| Préfixe | Argument passé | Effet |
|---|---|---|
| **K**nn | `stop` | arrête le service |
| **S**nn | `start` | démarre le service |

- Le **numéro nn** détermine l'ordre d'exécution.
- Les scripts **K** sont exécutés **avant** les scripts **S**.
- Exemples : `K15httpd` est exécuté avant `K20nfs` ; `S08iptables` est exécuté avant `S55sshd` (le pare-feu est prêt avant SSH).

### 2.3 Arguments des scripts de /etc/init.d

| Argument | Action |
|---|---|
| `start` | démarrer le service |
| `stop` | arrêter le service |
| `restart` | arrêter puis redémarrer le service |
| `reload` | envoyer **SIGHUP** au processus : le service relit ses fichiers de configuration **sans s'arrêter** |
| `status` | indiquer si le service est en cours d'exécution |

### 2.4 Démarrer ou arrêter un service (effet immédiat)

**Red Hat** (commande `service` ou script direct) :

```bash
service httpd status
service httpd start
service httpd stop
service httpd restart
service httpd reload

/etc/init.d/httpd start       # même effet
```

**Debian** (commande `invoke-rc.d` ou script direct) :

```bash
invoke-rc.d apache2 status
invoke-rc.d apache2 start
invoke-rc.d apache2 stop
invoke-rc.d apache2 restart
invoke-rc.d apache2 reload

/etc/init.d/apache2 start     # même effet
```

:::warning Effet immédiat uniquement
Ces commandes agissent **maintenant**, mais ne changent **pas** le démarrage automatique au prochain boot.
:::

### 2.5 Rendre le démarrage permanent

Il suffit d'**ajouter ou de supprimer un lien** dans le répertoire du niveau (`rcN.d`) vers le script adéquat, pour lancer ou arrêter le service quand le système entre dans ce niveau d'exécution.

Des outils (ligne de commande ou interface graphique) le font à votre place :

| Famille | Outil |
|---|---|
| Red Hat et dérivés | `chkconfig` |
| Debian et dérivés | `update-rc.d` |

---

## 3. Gestion des services sous Red Hat

### 3.1 La commande chkconfig

Syntaxe :

```text
chkconfig [--options] [service]
chkconfig [--level niveaux] service on|off
```

```bash
chkconfig --list | grep httpd        # voir l'état par niveau
chkconfig httpd on                   # activer (niveaux 2, 3, 4, 5 par défaut)
chkconfig httpd off                  # désactiver
chkconfig --level 35 httpd on        # activer seulement aux niveaux 3 et 5
```

`chkconfig` **crée ou supprime les liens symboliques** S et K dans les répertoires `rcN.d`.

### 3.2 L'en-tête du script de service

```bash
head -20 /etc/init.d/httpd
```

Extrait typique :

```bash
# chkconfig: 35 85 15
# description: Apache HTTP Server
### BEGIN INIT INFO
# Provides: httpd
# Required-Start: $local_fs $remote_fs $network
# Required-Stop: $local_fs $remote_fs $network
### END INIT INFO
```

La ligne `# chkconfig: 35 85 15` signifie :

| Valeur | Sens |
|---|---|
| `35` | niveaux d'exécution par défaut |
| `85` | priorité de **démarrage** (donne `S85httpd`) |
| `15` | priorité d'**arrêt** (donne `K15httpd`) |

La ligne `Required-Start:` (bloc LSB) indique les **services nécessaires** qui doivent démarrer avant celui-ci.

### 3.3 Outils graphique et texte

| Outil | Mode |
|---|---|
| `system-config-services` (ou `serviceconf`) | graphique |
| `ntsysv --level 34` | mode texte, **clavier uniquement** (pas de souris) |

:::caution Attention aux noms
Les commandes s'écrivent **`chkconfig`** (pas `checkconfig`), **`ntsysv`** (pas `ntssysv`), et le service Apache sous Red Hat s'appelle **`httpd`** (pas `http`).
:::

---

## 4. Gestion des services sous Debian

### 4.1 La commande update-rc.d

```bash
update-rc.d apache2 defaults         # activer : S aux niveaux 2 3 4 5, K aux niveaux 0 1 6
update-rc.d apache2 enable           # réactiver (liens par défaut)
update-rc.d apache2 enable 2         # activer au niveau 2 seulement
update-rc.d apache2 disable          # désactiver (crée des liens K)
update-rc.d apache2 remove           # supprimer les liens du démarrage automatique
update-rc.d -f apache2 remove        # idem, en forçant si le script existe encore
```

| Option | Effet |
|---|---|
| `defaults` | **ré-active** le démarrage automatique (liens par défaut) |
| `enable` | active le service (tous les niveaux par défaut, ou un niveau précis) |
| `disable` | désactive le service sans supprimer les liens |
| `remove` | **supprime** le démarrage automatique |

### 4.2 Vérifier

```bash
ls /etc/rc?.d | grep apache2         # liens présents dans les niveaux
ls -l /etc/rc2.d/ | grep apache2     # voir la cible du lien
```

Le script de service reste `/etc/init.d/apache2`.

:::caution Attention aux noms
Le service s'appelle **`apache2`** (pas `apche2`). Le comportement exact de `enable` sans niveau (2 3 4 5 ou 2 3 4) peut varier selon la version : vérifiez avec `ls /etc/rc?.d`.
:::

---

## 5. Upstart

Plusieurs distributions Linux ont remplacé le système classique SysV init, basé sur les niveaux d'exécution, par **Upstart** (anciennes versions d'**Ubuntu** et de **Fedora**).

- Système de gestion de services fonctionnant avec des **événements**.
- Il **supervise** les services pendant que le système fonctionne (SysV lance les scripts puis ne s'en occupe plus).
- Il démarre ou arrête des services en réponse à des événements, par exemple **l'ajout d'un périphérique**.
- Pour la **compatibilité**, il émule les niveaux d'exécution traditionnels.
- Il remplace `/etc/inittab` et les répertoires `rcN.d` par des fichiers de configuration placés dans **`/etc/init/`** (anciennement **`/etc/event.d/`**).

| | SysV | Upstart |
|---|---|---|
| Principe | Niveaux d'exécution, séquentiel | Événements |
| Configuration | `/etc/inittab` + `/etc/rcN.d/` | `/etc/init/*.conf` |
| Supervision des services | Non | Oui |

Exemple de fichier de tâche `/etc/init/monapp.conf` :

```text
description "Mon application"
start on runlevel [2345]
stop on runlevel [!2345]
respawn
exec /usr/local/bin/monapp
```

```bash
initctl list            # lister les tâches et leur état
start monapp            # démarrer
stop monapp             # arrêter
status monapp           # état
```

:::note Obsolète
Upstart est aujourd'hui abandonné : Fedora est passée à systemd depuis la version 15, Ubuntu depuis la 15.04, et Red Hat depuis RHEL 7. Il reste dans le cours pour comprendre l'évolution.
:::

---

## 6. systemd

### 6.1 Présentation

**systemd** est une alternative au démon init de System V, **conçue spécifiquement pour le noyau Linux**. Ses objectifs :

- une meilleure **gestion des dépendances** entre services,
- le **chargement en parallèle** des services au démarrage (boot plus rapide),
- la **réduction des appels aux scripts shell**.

```text
SysV init (runlevels, inittab, scripts S/K)
   → Upstart (événements, /etc/init)
      → systemd (unités, targets, parallèle)    ← standard actuel
```

### 6.2 Le démarrage est-il le même ?

**Oui, jusqu'au noyau** : firmware (POST) → GRUB → noyau + initramfs → `switch_root`.

La différence commence au **PID 1** : `/sbin/init` est maintenant un lien vers `/lib/systemd/systemd` (ou `/usr/lib/systemd/systemd`).

```text
SysV    : noyau → init → inittab → rc.sysinit → rc N → rc.local
systemd : noyau → systemd (PID 1) → unités → target par défaut
```

### 6.3 Ce que systemd remplace

| SysV | systemd | Rôle |
|---|---|---|
| `/etc/inittab` (`id:5:initdefault:`) | **default target** (lien `/etc/systemd/system/default.target`) | Choisir le mode de démarrage par défaut |
| runlevels 0 à 6 | **targets** (`.target`) | Groupes d'états du système |
| `rc.sysinit` / `rcS` | `sysinit.target` + unités (`systemd-hostnamed`, `systemd-fsck`, `*.mount`, `*.swap`...) | Préparer le système (hostname, fsck, montages, swap) |
| `/etc/rc.d/rcN.d/` (liens S et K) | `/etc/systemd/system/<target>.wants/` | Liste de ce qui démarre dans un target |
| `/etc/init.d/` (scripts shell) | fichiers **unités** `.service` | Définir comment démarrer et arrêter un service |
| numéros S85 / K15 | **dépendances** : `After=`, `Before=`, `Requires=`, `Wants=` | Ordre de démarrage |
| `rc.local` | `rc-local.service` (lit `/etc/rc.local` s'il existe) ou un service personnalisé | Commande personnalisée au boot |
| `service`, `chkconfig`, `update-rc.d` | **`systemctl`** | Gérer les services |
| `init N`, `telinit N`, `runlevel` | `systemctl isolate`, `systemctl get-default` | Changer et voir le niveau |
| logs dans `/var/log/*` (syslog) | **journald** + `journalctl` | Journaux |

### 6.4 Les runlevels deviennent des targets

| Runlevel | Target | Alias |
|---|---|---|
| 0 | `poweroff.target` | `runlevel0.target` |
| 1 | `rescue.target` | `runlevel1.target` |
| 2, 3, 4 | `multi-user.target` | `runlevel3.target` |
| 5 | `graphical.target` | `runlevel5.target` |
| 6 | `reboot.target` | `runlevel6.target` |

Les anciennes commandes (`init 6`, `runlevel`, `telinit`) fonctionnent encore par compatibilité.

### 6.5 Les unités (units)

Dans systemd, **tout est une unité**, décrite par un fichier texte.

| Type d'unité | Extension | Exemple |
|---|---|---|
| Service (démon) | `.service` | `httpd.service`, `sshd.service` |
| Groupe d'unités (≈ runlevel) | `.target` | `multi-user.target` |
| Point de montage | `.mount` | `home.mount` |
| Swap | `.swap` | `dev-sda2.swap` |
| Socket | `.socket` | `sshd.socket` |
| Minuterie (≈ cron) | `.timer` | `fstrim.timer` |

### 6.6 Déroulement du démarrage

1. systemd démarre en **PID 1**.
2. Il lit le **target par défaut** (`default.target`, lien vers `graphical.target` ou `multi-user.target`).
3. Il calcule les **dépendances** de ce target.
4. Il lance les unités **en parallèle** quand elles ne dépendent pas l'une de l'autre (différence majeure avec SysV, séquentiel).
5. Il atteint le target : le système est prêt (login).

```text
sysinit.target → basic.target → multi-user.target → graphical.target
```

### 6.7 Exemple de fichier unité

`/usr/lib/systemd/system/httpd.service` (équivalent moderne de `/etc/init.d/httpd`) :

```ini
[Unit]
Description=The Apache HTTP Server
After=network.target

[Service]
ExecStart=/usr/sbin/httpd -DFOREGROUND
ExecReload=/usr/sbin/httpd -k graceful
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

| Section | Rôle |
|---|---|
| `[Unit]` | Description et **dépendances / ordre** (`After=network.target` remplace « S20 après S10network ») |
| `[Service]` | Commandes de démarrage, de rechargement et d'arrêt ; `Restart=` redémarre un service qui plante |
| `[Install]` | `WantedBy=multi-user.target` : `systemctl enable` crée un lien dans `multi-user.target.wants/` (comme un lien S dans `rc3.d`) |

### 6.8 Où sont les fichiers

| Chemin | Contenu | Priorité |
|---|---|---|
| `/usr/lib/systemd/system/` (ou `/lib/systemd/system/`) | Unités installées par les paquets | basse |
| `/run/systemd/system/` | Unités temporaires (runtime) | moyenne |
| `/etc/systemd/system/` | Unités de l'administrateur + liens créés par `enable` | **haute** |

:::warning Règle
On ne modifie **jamais** `/usr/lib/systemd/system/`. On copie ou on crée l'unité dans `/etc/systemd/system/`, puis on exécute `systemctl daemon-reload`.
:::

### 6.9 La commande systemctl

Gérer et visualiser l'état d'un service :

```bash
systemctl status <unit>
systemctl start <unit>
systemctl stop <unit>
systemctl restart <unit>
systemctl reload <unit>
systemctl enable <unit>         # démarrage automatique au boot
systemctl disable <unit>
systemctl enable --now httpd    # active au boot ET démarre tout de suite
```

Targets et inventaire :

```bash
systemctl get-default                       # target par défaut (≈ runlevel)
systemctl set-default multi-user.target     # change le target par défaut (≈ inittab)
systemctl isolate multi-user.target         # change de target maintenant (≈ init 3)
systemctl list-units                        # unités actives
systemctl list-unit-files --type=service    # services installés et leur état (≈ chkconfig --list)
systemctl mask <unit>                       # empêche totalement le démarrage d'une unité
systemctl unmask <unit>
systemctl daemon-reload                     # relire les fichiers unités après modification
```

Journaux et analyse :

```bash
journalctl -b                   # logs du boot courant
journalctl -u ssh               # logs d'une unité
systemd-analyze                 # durée totale du boot
systemd-analyze blame           # temps de démarrage par service
```

### 6.10 Équivalences SysV et systemd

| SysV | systemd |
|---|---|
| `service httpd start` | `systemctl start httpd` |
| `service httpd status` | `systemctl status httpd` |
| `chkconfig httpd on` | `systemctl enable httpd` |
| `chkconfig httpd off` | `systemctl disable httpd` |
| `chkconfig --list` | `systemctl list-unit-files --type=service` |
| `runlevel` | `systemctl get-default` |
| `init 3` | `systemctl isolate multi-user.target` |
| `id:3:initdefault:` dans inittab | `systemctl set-default multi-user.target` |

### 6.11 Pourquoi systemd a remplacé SysV

| SysV | systemd |
|---|---|
| Démarrage **séquentiel** (lent) | Démarrage **parallèle** (rapide) |
| Ordre par **numéros** (S10, S20) | Ordre par **dépendances** déclarées |
| Scripts shell longs, différents selon les distributions | Fichiers **déclaratifs** simples et uniformes |
| Pas de supervision | Redémarre un service qui plante (`Restart=`) |
| Logs séparés | Journal centralisé |

---

## 7. Redémarrer et éteindre un système

### 7.1 halt et poweroff

| Commande | Effet |
|---|---|
| `halt` | Arrête toutes les activités du système et du CPU, mais la machine **peut rester allumée** (ventilateurs qui tournent, écran figé sur « System halted ») : il faut appuyer sur le bouton power |
| `poweroff` | Fait la même chose, **puis envoie un signal ACPI** pour couper l'alimentation |

### 7.2 Commandes équivalentes

| Action | systemd | shutdown | Commande directe | init (SysV) |
|---|---|---|---|---|
| **Redémarrer** | `systemctl reboot` | `shutdown -r now` | `reboot` | `init 6` |
| **Arrêter** (halt) | `systemctl halt` | `shutdown -h now` | `halt` | `init 0` |
| **Éteindre** | `systemctl poweroff` | `shutdown -P now` | `poweroff` | `init 0` |

### 7.3 La commande shutdown

```bash
shutdown -r now          # redémarrer immédiatement
shutdown -r +10          # redémarrer dans 10 minutes
shutdown -h 23:00        # arrêter à 23:00
shutdown -c              # annuler un arrêt programmé
```

:::note Précisions
- `shutdown -r` sans heure attend **1 minute** par défaut : utilisez `now` pour un effet immédiat.
- Sur la plupart des systèmes actuels, `shutdown -h now` **coupe aussi l'alimentation** (comme `poweroff`). `-P` force l'extinction, `-H` force le simple halt.
- Sur un système moderne, `init 0` éteint la machine.
:::

---

## 8. Récapitulatif

### 8.1 Les trois systèmes d'init

| | SysV | Upstart | systemd |
|---|---|---|---|
| Principe | Niveaux d'exécution, scripts S et K | Événements | Unités, targets, dépendances |
| Configuration | `/etc/inittab`, `/etc/rcN.d/` | `/etc/init/*.conf` | `/etc/systemd/system/`, `/usr/lib/systemd/system/` |
| Scripts de service | `/etc/init.d/` | `/etc/init/` | fichiers `.service` |
| Démarrage | Séquentiel | Événementiel | **Parallèle** |
| Supervision | Non | Oui | Oui |
| Outil de gestion | `service`, `chkconfig`, `update-rc.d` | `initctl`, `start`, `stop` | `systemctl` |
| Voir le niveau | `runlevel`, `who -r` | `runlevel` (émulé) | `systemctl get-default` |

### 8.2 À retenir

:::tip Points clés

- Le boot est **identique jusqu'au noyau** : POST, firmware (BIOS ou UEFI), GRUB, noyau + initramfs. Tout change ensuite au PID 1.
- **SysV** : `init` lit `inittab`, lance `rc.sysinit`, puis `rc N` (scripts **K** puis **S** de `rcN.d`), puis `rc.local`.
- Les scripts sont dans `/etc/init.d/`. `rcN.d` ne contient que des **liens symboliques** S (start) et K (stop) avec un numéro d'ordre.
- `service` et `invoke-rc.d` agissent **maintenant**. `chkconfig` (Red Hat) et `update-rc.d` (Debian) agissent sur le **prochain démarrage**.
- **Upstart** : événements, `/etc/init`. Aujourd'hui obsolète.
- **systemd** : `inittab` devient le **default target**, les runlevels deviennent des **targets**, les scripts deviennent des **unités `.service`**, les numéros S et K deviennent des **dépendances**, et `service`/`chkconfig` deviennent **`systemctl`**.
- `halt` arrête le système sans couper l'alimentation, `poweroff` l'éteint (ACPI), `reboot` redémarre.

:::
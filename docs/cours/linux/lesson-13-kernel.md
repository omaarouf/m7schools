---
id: lesson-13
title: Noyau Linux (Kernel)
sidebar_label: Noyau Linux
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Comprendre et administrer le noyau Linux

Le **noyau Linux** (*Linux kernel*) est le cœur du système d'exploitation. Il fait l'intermédiaire entre les applications et le matériel, et gère notamment les processus, la mémoire, les périphériques, les systèmes de fichiers et les communications réseau.

## Objectifs

À la fin de cette leçon, vous saurez :

- identifier la version du noyau et les informations système ;
- consulter les messages du noyau et les modules chargés ;
- comprendre le rôle des modules et les manipuler prudemment ;
- vérifier et mettre à jour les paquets du noyau selon la distribution ;
- diagnostiquer un problème sans modifier directement le noyau en production.

## Architecture en bref

```text
Applications et services
          |
Appels système
          |
Noyau Linux
  | processus, mémoire, pilotes, fichiers, réseau
          |
Matériel
```

Le noyau fonctionne en espace privilégié. Les applications s'exécutent généralement en espace utilisateur et demandent au noyau des services via des appels système. Une erreur dans un module ou un pilote peut donc affecter tout le système.

## Identifier le noyau actif

```bash
# Version du noyau actif
uname -r

# Informations système complètes
uname -a

# Informations détaillées sur le système
cat /etc/os-release

# Paramètres visibles exposés par le noyau
cat /proc/version
```

`uname -r` affiche la version du noyau actuellement démarré. Installer un nouveau paquet de noyau ne signifie pas nécessairement que le système l'utilise déjà : il faut généralement redémarrer puis vérifier de nouveau la version.

## Consulter les messages du noyau

```bash
# Messages du noyau disponibles dans le tampon circulaire
dmesg

# Messages du noyau depuis le démarrage courant
sudo journalctl -k

# Suivre les messages du noyau en temps réel
sudo journalctl -k -f
```

Utilisez ces commandes pour examiner les erreurs de pilotes, de périphériques ou de détection matérielle. La disponibilité des messages peut dépendre des permissions et de la configuration du journal système.

## Modules du noyau

Les modules ajoutent des fonctionnalités au noyau, par exemple des pilotes ou la prise en charge de certains systèmes de fichiers. Ils peuvent être chargés et déchargés sans reconstruire le noyau.

```bash
# Lister les modules chargés
lsmod

# Afficher les informations sur un module
modinfo nom_du_module

# Charger un module (opération privilégiée)
sudo modprobe nom_du_module

# Décharger un module (opération privilégiée)
sudo modprobe -r nom_du_module
```

Remplacez `nom_du_module` par le nom réel du module requis. Ne déchargez pas un pilote actif sans savoir quels périphériques ou services en dépendent.

:::warning Prudence avec les modules

Charger ou décharger un module modifie le comportement du système. Testez toute modification dans une machine virtuelle ou un environnement de test et gardez un accès de récupération disponible.

:::

## Paramètres du noyau avec `sysctl`

`sysctl` permet de consulter ou de modifier certains paramètres du noyau pendant l'exécution :

```bash
# Consulter un paramètre réseau
sysctl net.ipv4.ip_forward

# Afficher les paramètres disponibles
sysctl -a
```

Une modification à chaud, par exemple `sudo sysctl -w cle=valeur`, prend effet immédiatement mais n'est généralement pas persistante après redémarrage. Les paramètres persistants se configurent selon les pratiques de la distribution, souvent dans `/etc/sysctl.d/`. Ne modifiez un paramètre qu'après avoir compris son impact.

## Mettre à jour le noyau

Utilisez le gestionnaire de paquets de votre distribution et ses dépôts configurés. Évitez de télécharger et d'installer manuellement un noyau dont la provenance n'est pas vérifiée.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Actualiser l'index des paquets
sudo apt update

# Mettre à jour les paquets installés, y compris les mises à jour du noyau fournies
sudo apt upgrade

# Consulter les versions de noyau installées
dpkg -l 'linux-image*'
```

</TabItem>
<TabItem value="fedora" label="Fedora">

```bash
# Mettre à jour les paquets depuis les dépôts configurés
sudo dnf upgrade

# Consulter les versions de noyau installées
rpm -q kernel-core
```

</TabItem>
</Tabs>

Avant une mise à jour sur un système important, vérifiez les notes de version, l'espace disque disponible dans `/boot` et la disponibilité d'une méthode de récupération. Une mise à jour peut nécessiter un redémarrage pour activer le nouveau noyau.

Après le redémarrage :

```bash
uname -r
```

## À retenir

- `uname -r` indique le noyau actuellement démarré.
- `lsmod`, `modinfo` et `modprobe` servent à examiner et gérer les modules.
- `journalctl -k` aide à diagnostiquer les événements du noyau.
- Gérez les mises à jour du noyau avec les dépôts officiels de la distribution.
- Testez les changements sensibles et prévoyez une procédure de récupération.

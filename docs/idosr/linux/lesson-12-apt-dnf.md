---
id: lesson-12

title:  Gestionnaire de packages

---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Leçon : Gestionnaire de packages

---

## 1. Présentation

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

`apt` est le gestionnaire de packages des distributions basées sur Debian. Il résout les dépendances automatiquement et télécharge les packages depuis les dépôts configurés dans `/etc/apt/sources.list`.

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

`dnf` est le gestionnaire de packages des distributions Red Hat depuis RHEL 8. Il remplace `yum` dont il est entièrement compatible.

</TabItem>
</Tabs>

---

## 2. Mise à jour

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
apt update                    # Rafraîchit l'index des packages disponibles
apt upgrade -y                # Met à jour tous les packages installés
apt full-upgrade -y           # Met à jour en supprimant les packages conflictuels si nécessaire
apt update && apt upgrade -y  # Les deux en une seule commande
```

:::info `update` vs `upgrade`
`apt update` ne modifie rien sur le système, il synchronise uniquement la liste des versions disponibles. `apt upgrade` applique les mises à jour.
:::

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
dnf check-update              # Liste les mises à jour disponibles sans les appliquer
dnf update -y                 # Met à jour tous les packages
dnf update nginx -y           # Met à jour un seul package
```

</TabItem>
</Tabs>

---

## 3. Installer et supprimer

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
apt install nginx             # Installer un package
apt install nginx apache2     # Installer plusieurs packages d'un coup
apt remove nginx              # Supprimer un package (garde les fichiers de config)
apt purge nginx               # Supprimer un package et ses fichiers de configuration
apt autoremove                # Supprimer les dépendances devenues orphelines
apt install --reinstall nginx # Réinstaller un package sans le supprimer
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
dnf install nginx -y          # Installer un package
dnf install nginx httpd -y    # Installer plusieurs packages
dnf remove nginx              # Supprimer un package et ses dépendances orphelines
dnf reinstall nginx           # Réinstaller un package
dnf autoremove                # Supprimer les dépendances devenues orphelines
```

</TabItem>
</Tabs>

---

## 4. Rechercher et inspecter

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
apt search nginx              # Rechercher un package par nom ou description
apt show nginx                # Détails : version, dépendances, description
apt list --installed          # Lister tous les packages installés
apt list --upgradable         # Lister les packages avec une mise à jour disponible
dpkg -l nginx                 # Vérifier si un package est installé et sa version
dpkg -L nginx                 # Lister tous les fichiers installés par un package
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
dnf search nginx              # Rechercher un package par nom ou description
dnf info nginx                # Détails : version, dépôt, description
dnf list installed            # Lister tous les packages installés
dnf list available            # Lister les packages disponibles dans les dépôts
dnf provides /usr/sbin/nginx  # Trouver quel package fournit un fichier
rpm -ql nginx                 # Lister les fichiers installés par un package
```

</TabItem>
</Tabs>

---

## 5. Nettoyage

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
apt clean                     # Supprime le cache des packages téléchargés (.deb)
apt autoclean                 # Supprime uniquement les anciennes versions du cache
apt autoremove                # Supprime les dépendances inutilisées
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
dnf clean all                 # Supprime le cache des métadonnées et des packages
dnf makecache                 # Reconstruit le cache des dépôts
```

</TabItem>
</Tabs>

---

## 6. Dépôts

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
cat /etc/apt/sources.list             # Dépôts principaux
ls /etc/apt/sources.list.d/           # Dépôts tiers
add-apt-repository ppa:user/repo      # Ajouter un PPA (Ubuntu)
apt update                            # Toujours rafraîchir après ajout d'un dépôt
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
dnf repolist                          # Liste les dépôts activés
dnf repolist all                      # Liste tous les dépôts, activés et désactivés
dnf config-manager --enable epel      # Activer un dépôt
dnf config-manager --disable epel     # Désactiver un dépôt
dnf install epel-release              # Installer le dépôt EPEL
ls /etc/yum.repos.d/                  # Fichiers de configuration des dépôts
```

</TabItem>
</Tabs>

---

## 7. Historique et rollback

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
cat /var/log/apt/history.log          # Historique des transactions apt
grep "install\|remove" /var/log/dpkg.log  # Voir les installations et suppressions
```

:::info Rollback sur Ubuntu/Debian
`apt` ne dispose pas de rollback natif. Pour revenir en arrière, il faut réinstaller manuellement la version souhaitée avec `apt install nginx=1.x.x`.
:::

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
dnf history                   # Liste toutes les transactions passées
dnf history info 5            # Détails de la transaction n°5
dnf history undo last         # Annuler la dernière transaction
dnf history undo 5            # Annuler une transaction spécifique
```

:::tip Rollback
`dnf history undo` est très utile pour revenir en arrière après une mise à jour qui a cassé quelque chose.
:::

</TabItem>
</Tabs>

---

## 8. Tableau de référence

| Action | Ubuntu / Debian | Fedora / Red Hat |
|--------|----------------|-----------------|
| Mettre à jour l'index | `apt update` | `dnf check-update` |
| Mettre à jour les packages | `apt upgrade -y` | `dnf update -y` |
| Installer | `apt install nginx` | `dnf install nginx -y` |
| Supprimer | `apt remove nginx` | `dnf remove nginx` |
| Supprimer + config | `apt purge nginx` | `dnf remove nginx` |
| Réinstaller | `apt install --reinstall nginx` | `dnf reinstall nginx` |
| Rechercher | `apt search nginx` | `dnf search nginx` |
| Inspecter | `apt show nginx` | `dnf info nginx` |
| Fichiers d'un package | `dpkg -L nginx` | `rpm -ql nginx` |
| Nettoyer le cache | `apt clean` | `dnf clean all` |
| Supprimer orphelins | `apt autoremove` | `dnf autoremove` |
| Historique | `/var/log/apt/history.log` | `dnf history` |
| Rollback | Manuel | `dnf history undo last` |
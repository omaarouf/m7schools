---
id: active-directory-cmd
title: Commandes Active Directory CMD (DS)
sidebar_label: Commandes AD CMD (DS)
---

## Introduction

Les commandes **DS** (Directory Services) permettent de gerer Active Directory depuis l'invite de commandes (`cmd.exe`). Elles sont disponibles sur tout serveur Windows avec les outils d'administration AD installes.

:::tip
Toujours utiliser le **Distinguished Name (DN) complet** pour identifier les objets AD, entre guillemets.
:::

---

## 1. Commandes DS de base

### `dsadd user` - Creer un utilisateur

```cmd
dsadd user "CN=Ali,OU=Users,DC=ofppt,DC=local" -samid ali -upn ali@ofppt.local -pwd Passw0rd -mustchpwd no
```

| Attribut | Description |
|---|---|
| `-samid` | Nom d'ouverture de session |
| `-upn` | Nom principal d'utilisateur |
| `-pwd` | Mot de passe |
| `-mustchpwd yes/no` | Forcer le changement de mot de passe |

---

### `dsmod user` - Modifier un utilisateur existant

```cmd
dsmod user "CN=Ali,OU=Users,DC=ofppt,DC=local" -disabled no
```

| Attribut | Description |
|---|---|
| `-pwd` | Changer le mot de passe |
| `-mustchpwd yes/no` | Obliger le changement au prochain logon |
| `-disabled yes/no` | Activer ou desactiver le compte |
| `-memberof` | Ajouter a un groupe |

---

### `dsadd group` - Creer un groupe AD

```cmd
dsadd group "CN=sport_Activity,CN=Users,DC=ofppt,DC=local" -secgrp yes -scope g
```

| Attribut | Description |
|---|---|
| `-secgrp yes/no` | Groupe de securite ou de distribution |
| `-scope l/g/u` | Portee : local / global / universel |

---

### `dsmod group` - Modifier un groupe existant

```cmd
dsmod group "CN=sport_Activity,CN=Users,DC=ofppt,DC=local" -addmbr "CN=Ali,OU=Users,DC=ofppt,DC=local"
```

| Attribut | Description |
|---|---|
| `-addmbr` | Ajouter un membre |
| `-rmmbr` | Retirer un membre |

---

### `dsget group` - Afficher les informations d'un groupe

```cmd
dsget group "CN=Personnel_IT,CN=Users,DC=ofppt,DC=local" -members
```

| Attribut | Description |
|---|---|
| `-members` | Lister les membres |
| `-samid` | Nom du groupe |

---

### `dsadd ou` - Creer une Unite d'Organisation

```cmd
dsadd ou "OU=NTIC,DC=ofppt,DC=local"
```

---

### `dsquery user` - Rechercher des utilisateurs

```cmd
dsquery user -name "TA*"
```

| Attribut | Description |
|---|---|
| `-name` | Rechercher par nom |
| `-samid` | Rechercher par identifiant |
| `-disabled yes/no` | Filtrer les comptes desactives |

---

## 2. DSMOVE - Deplacer et Renommer des Objets

| Parametre | Description | Exemple |
|---|---|---|
| `-newparent` | Deplace l'objet vers une autre OU | Voir ci-dessous |
| `-newname` | Renomme l'objet (change le CN) | Voir ci-dessous |
| `-newparent` + `-newname` | Deplace ET renomme en meme temps | Voir ci-dessous |

### Deplacer un objet vers une autre OU

```cmd
dsmove "CN=Ali,OU=Direction,DC=ofppt,DC=local" -newparent "OU=NTIC,DC=ofppt,DC=local"
```

### Renommer un objet

```cmd
dsmove "CN=Ali,OU=NTIC,DC=ofppt,DC=local" -newname "Ali HAMDI"
```

### Deplacer ET renommer en meme temps

```cmd
dsmove "CN=Ali,OU=Direction,DC=ofppt,DC=local" -newparent "OU=NTIC,DC=ofppt,DC=local" -newname "Ali HAMDI"
```

---

## 3. DSGET + DSMOD - Pipeline

Le pipeline `|` permet de combiner `dsget` et `dsmod` pour automatiser les operations de groupe.

### Recuperer les membres d'un groupe

```cmd
dsget group "CN=Personnel_IT,CN=Users,DC=ofppt,DC=local" -members
```

### Ajouter les membres d'un groupe a un autre (pipeline)

```cmd
dsget group "CN=Personnel_IT,CN=Users,DC=ofppt,DC=local" -members | dsmod group "CN=sport_Activity,CN=Users,DC=ofppt,DC=local" -addmbr
```

---

## 4. CSVDE - Export et Import (Format CSV)

### Exporter des utilisateurs vers un fichier CSV

```cmd
csvde -f "C:\Export_Users.csv" -d "OU=Users,DC=ofppt,DC=local" -p subtree -r "(objectClass=user)"
```

### Importer depuis un fichier CSV

```cmd
csvde -i -f users.csv
```

### Parametres CSVDE

| Parametre | Description |
|---|---|
| `-i` | Mode importation |
| `-f` | Fichier CSV a utiliser |
| `-d` | Racine de recherche (DN) |
| `-r` | Filtre LDAP |
| `-p` | Profondeur : `base`, `onelevel`, `subtree` |
| `-l` | Liste des attributs a exporter/importer |
| `-o` | Exclure certains attributs |
| `-k` | Ignorer les erreurs (objets existants) |
| `-j` | Dossier de journalisation des logs |
| `-v` | Mode verbeux |
| `-t` | Port LDAP (defaut : 389) |

---

## 5. LDIFDE - Export et Import (Format LDIF)

### Exporter vers un fichier LDIF

```cmd
ldifde -f "C:\Export.ldf" -d "DC=ofppt,DC=local"
```

### Importer depuis un fichier LDIF

```cmd
ldifde -i -f "C:\Import.ldf" -k -v
```

### Parametres LDIFDE

| Parametre | Description |
|---|---|
| `-i` | Mode importation |
| `-f` | Fichier LDIF |
| `-d` | Racine de recherche (DN) |
| `-r` | Filtre LDAP |
| `-p` | Profondeur : `base`, `onelevel`, `subtree` |
| `-l` | Liste d'attributs a exporter |
| `-o` | Exclure certains attributs |
| `-k` | Ignorer les erreurs non bloquantes |
| `-v` | Mode verbeux |
| `-a user "password"` | Authentification |

---

## 6. Codes userAccountControl

| Code | Description |
|---|---|
| `512` | Compte actif et normal (`NORMAL_ACCOUNT`) |
| `514` | Compte desactive (`ACCOUNTDISABLE`) |
| `544` | Compte desactive avec option home directory |
| `66048` | Compte machine de domaine actif |

---

## 7. Exemples Pratiques

### Deplacer et renommer un utilisateur

```cmd
dsmove "CN=Ali,OU=NTIC,DC=ofppt,DC=local" -newname "Ali HAMDI"
```

### Ajouter tous les membres d'un groupe a un autre

```cmd
dsget group "CN=Personnel_IT,CN=Users,DC=ofppt,DC=local" -members | dsmod group "CN=sport_Activity,CN=Users,DC=ofppt,DC=local" -addmbr
```

### Exporter tous les utilisateurs en CSV

```cmd
csvde -f "C:\Export_Users.csv" -d "OU=Users,DC=ofppt,DC=local" -p subtree -r "(objectClass=user)"
```

### Importer des utilisateurs depuis un fichier LDIF

```cmd
ldifde -i -f "C:\Import.ldf" -k -v
```

### Exporter avec filtrage d'attributs

```cmd
csvde -f "C:\Users_Filtered.csv" -l "cn,sAMAccountName,mail,displayName" -d "DC=ofppt,DC=local" -p subtree
```

---

## Bonnes Pratiques

- Toujours utiliser le **Distinguished Name (DN) complet** entre guillemets pour identifier les objets AD.
- Le pipeline `|` permet de chainer `dsget` et `dsmod` pour automatiser les operations de groupe.
- `csvde` et `ldifde` sont ideals pour les migrations de masse ou les sauvegardes.
- Utiliser `-k` pour ignorer les erreurs mineures lors d'un import.
- Les attributs `-samid` et `-upn` sont essentiels pour l'authentification des utilisateurs.
- La portee des groupes : `l` (local de domaine), `g` (global), `u` (universel).
- Utiliser `dsquery` pour rechercher des objets avant de les modifier ou les deplacer.

---
*Continuer avec la lecon suivante dans la barre laterale.*

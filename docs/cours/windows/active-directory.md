---
id: active-directory
title: Active Directory (AD DS)
sidebar_label: Active Directory
---

## Introduction

Active Directory Domain Services (AD DS) est le service d'annuaire de Microsoft. Il centralise la gestion des utilisateurs, groupes, ordinateurs et politiques dans un environnement Windows Server. Ce cours couvre la gestion des objets AD avec PowerShell.

---

## 1. Installation AD DS avec PowerShell

### Installer le role AD DS

```powershell
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools
```

| Parametre | Statut | Description |
|---|---|---|
| `-IncludeManagementTools` | Optionnel | Inclut les outils de gestion (RSAT) |
| `-Restart` | Optionnel | Redémarre le serveur apres installation |

---

### Configurer l adresse IP avant la promotion

Avant de promouvoir un serveur en controleur de domaine, il faut lui attribuer une adresse IP statique.

```powershell title="Etape 1 - Identifier l interface reseau"
Get-NetAdapter
```

Exemple de sortie :

```
Name        InterfaceDescription                   ifIndex Status   MacAddress          LinkSpeed
----        --------------------                   ------- ------   ----------          ---------
Ethernet0   Intel(R) 82574L Gigabit Network Conn...     14 Up       00-0C-29-66-97-3A    1 Gbps
```

```powershell title="Etape 2 - Configurer l IP statique"
New-NetIPAddress -InterfaceIndex 14 -IPAddress 192.168.100.201 -PrefixLength 24 -DefaultGateway 192.168.100.2
```

```powershell title="Etape 3 - Configurer les serveurs DNS"
Set-DnsClientServerAddress -InterfaceIndex 14 -ServerAddresses 127.0.0.1, 8.8.8.8
```

```powershell title="Etape 4 - Verifier la configuration DNS"
Get-DnsClientServerAddress -InterfaceIndex 14
```

| Parametre | Description |
|---|---|
| `-InterfaceIndex` | Numero de l interface (obtenu via `Get-NetAdapter`) |
| `-IPAddress` | Adresse IP statique a attribuer |
| `-PrefixLength` | Longueur du masque (`24` = /24 = 255.255.255.0) |
| `-DefaultGateway` | Passerelle par defaut |
| `-ServerAddresses` | Serveurs DNS (`127.0.0.1` = lui-meme apres promotion, `8.8.8.8` = DNS public) |

:::tip
Pour un futur controleur de domaine, configurer `127.0.0.1` comme DNS principal (il devient son propre DNS apres promotion) et `8.8.8.8` comme DNS secondaire.
:::

---

### Promouvoir en Controleur de Domaine

#### Nouvelle foret

La methode recommandee est de stocker le mot de passe DSRM dans une variable avant d executer la commande :

```powershell title="Methode recommandee (avec variable $pass)"
$pass = ConvertTo-SecureString "idsr-202" -AsPlainText -Force

Install-ADDSForest `
    -DomainName "ofppt.local" `
    -DomainNetbiosName "OFPPT" `
    -InstallDns `
    -ForestMode Win2016 `
    -DomainMode Win2016 `
    -SafeModeAdministratorPassword $pass
```

```powershell title="Version minimale (parametres obligatoires uniquement)"
Install-ADDSForest -DomainName "ofppt.local"
```

:::info Version minimale
La version minimale fonctionne : Windows demandera le mot de passe DSRM de facon interactive et appliquera automatiquement le niveau fonctionnel maximal disponible sur votre systeme.
:::

#### Detail des parametres

| Parametre | Statut | Comportement si omis |
|---|---|---|
| `-DomainName` | 🔴 Obligatoire | La commande refuse de se lancer |
| `-SafeModeAdministratorPassword` | 🟡 Requis (Interactif) | PowerShell demande le mot de passe DSRM a la saisie |
| `-DomainNetbiosName` | 🟢 Facultatif | Windows prend la premiere partie du DNS (ex: `OFPPT` pour `ofppt.local`) |
| `-InstallDns` | 🟢 Facultatif | DNS installe automatiquement lors d une nouvelle foret |
| `-ForestMode` / `-DomainMode` | 🟢 Facultatif | Windows applique le niveau fonctionnel maximal disponible |

:::warning ConvertTo-SecureString
`ConvertTo-SecureString "motdepasse" -AsPlainText -Force` convertit un texte en clair en objet `SecureString`. Le parametre `-Force` est obligatoire quand on utilise `-AsPlainText`. En production, eviter les mots de passe en clair dans les scripts.
:::

---

## 2. Gestion des Utilisateurs

### `New-ADUser` - Creer un utilisateur

```powershell
$Password = ConvertTo-SecureString "TempPass123!" -AsPlainText -Force

New-ADUser `
    -Name "John Doe" `
    -SamAccountName "jdoe" `
    -UserPrincipalName "jdoe@contoso.com" `
    -GivenName "John" `
    -Surname "Doe" `
    -DisplayName "Doe, John" `
    -EmailAddress "jdoe@contoso.com" `
    -Title "Developer" `
    -Department "IT" `
    -Path "OU=IT,DC=contoso,DC=com" `
    -AccountPassword $Password `
    -Enabled $true `
    -ChangePasswordAtLogon $true
```

| Parametre | Statut | Description |
|---|---|---|
| `-Name` | Obligatoire | Nom d'affichage |
| `-SamAccountName` | Obligatoire | Nom d'ouverture de session |
| `-UserPrincipalName` | Recommandé | UPN (user@domain.com) |
| `-GivenName` | Optionnel | Prenom |
| `-Surname` | Optionnel | Nom de famille |
| `-DisplayName` | Optionnel | Nom complet affiché |
| `-EmailAddress` | Optionnel | Adresse email |
| `-Title` | Optionnel | Titre/Poste |
| `-Department` | Optionnel | Département |
| `-Path` | Optionnel | Chemin OU de creation |
| `-AccountPassword` | Optionnel | Mot de passe (SecureString) |
| `-Enabled` | Optionnel | Activer le compte |
| `-ChangePasswordAtLogon` | Optionnel | Forcer changement au 1er logon |
| `-PasswordNeverExpires` | Optionnel | Mot de passe n'expire jamais |

---

### `Set-ADUser` - Modifier un utilisateur

```powershell
Set-ADUser -Identity "jdoe" `
    -Title "Senior Dev" `
    -Department "Development" `
    -Manager "CN=Boss,OU=IT,DC=contoso,DC=com"
```

| Parametre | Statut | Description |
|---|---|---|
| `-Identity` | Obligatoire | SamAccountName, DN, GUID ou SID |
| `-Title` | Optionnel | Titre/Poste |
| `-Department` | Optionnel | Département |
| `-Manager` | Optionnel | Responsable (DN) |
| `-Description` | Optionnel | Description/Notes |
| `-EmailAddress` | Optionnel | Adresse email |
| `-Clear` | Optionnel | Effacer un attribut : `-Clear @("Title")` |

---

### `Get-ADUser` - Recuperer des utilisateurs

| Parametre | Statut | Description | Exemple |
|---|---|---|---|
| `-Identity` | Optionnel | Utilisateur specifique (SamAccountName, DN, GUID, SID) | `"jdoe"` |
| `-Filter` | Optionnel | Filtre LDAP ou PowerShell | `{Department -eq "IT"}` |
| `-SearchBase` | Optionnel | OU ou commencer la recherche | `"OU=IT,DC=domain,DC=com"` |
| `-SearchScope` | Optionnel | Profondeur de recherche : `Base`, `OneLevel`, `Subtree` | `OneLevel` |
| `-Properties` | Optionnel | Attributs a retourner (`*` = tous) | `@("Title","Department","Manager")` |

```powershell
# Utilisateur specifique avec tous ses attributs
Get-ADUser -Identity "jdoe" -Properties *

# Tous les utilisateurs d'un departement
Get-ADUser -Filter {Department -eq "IT"} -SearchBase "OU=Users,DC=contoso,DC=com"

# Utilisateurs inactifs depuis 90 jours
Get-ADUser -Filter {LastLogonDate -lt (Get-Date).AddDays(-90)}
```

**Operateurs de filtre disponibles :**

| Type | Operateur | Exemple |
|---|---|---|
| Egal | `-eq` | `{Department -eq "IT"}` |
| Pas egal | `-ne` | `{Status -ne "Inactive"}` |
| Plus petit | `-lt` | `{LastLogonDate -lt (Get-Date).AddDays(-90)}` |
| Plus grand | `-gt` | `{LogonCount -gt 0}` |
| Wildcard | `-like` | `{Name -like "John*"}` |
| Regex | `-match` | `{mail -match "[0-9]+"}` |

---

### Gestion des comptes

```powershell
# Desactiver un compte
Disable-ADAccount -Identity "jdoe"

# Activer un compte
Enable-ADAccount -Identity "jdoe"

# Deverrouiller un compte bloque
Unlock-ADAccount -Identity "jdoe"

# Deverrouiller tous les comptes bloques d'une OU
Get-ADUser -Filter {LockedOut -eq $true} -SearchBase "OU=Users,DC=contoso,DC=com" | Unlock-ADAccount
```

---

### `Set-ADAccountPassword` - Changer le mot de passe

```powershell
$NewPassword = ConvertTo-SecureString "NewPass123!" -AsPlainText -Force

# Methode 1 : par SamAccountName
Set-ADAccountPassword -Identity "jdoe" -NewPassword $NewPassword -Reset

# Methode 2 : via pipeline
Get-ADUser -Identity "jdoe" | Set-ADAccountPassword -NewPassword $NewPassword -Reset
```

---

## 3. Gestion des Groupes

### `New-ADGroup` - Creer un groupe

```powershell
New-ADGroup `
    -Name "IT-Team" `
    -GroupScope Global `
    -GroupCategory Security `
    -Path "OU=Groups,DC=contoso,DC=com" `
    -Description "Equipe IT" `
    -ManagedBy "CN=Manager,OU=Users,DC=contoso,DC=com"
```

| Parametre | Statut | Description |
|---|---|---|
| `-Name` | Obligatoire | Nom du groupe |
| `-GroupScope` | Obligatoire | `Global`, `DomainLocal` ou `Universal` |
| `-GroupCategory` | Obligatoire | `Security` ou `Distribution` |
| `-Path` | Optionnel | Chemin OU |
| `-Description` | Optionnel | Description |
| `-ManagedBy` | Optionnel | Responsable (DN) |

---

### `Add-ADGroupMember` - Ajouter des membres

```powershell
# Ajouter un utilisateur
Add-ADGroupMember -Identity "IT-Team" -Members "jdoe"

# Ajouter plusieurs utilisateurs
Add-ADGroupMember -Identity "IT-Team" -Members "jdoe","jsmith","abrown"

# Via pipeline : ajouter tout le departement IT
Get-ADUser -Filter {Department -eq "IT"} | Add-ADGroupMember -Identity "IT-Team"
```

---

## 4. Deplacer des Objets

### `Move-ADObject` - Deplacer vers une autre OU

```powershell
# Deplacer un utilisateur
Move-ADObject `
    -Identity "CN=jdoe,OU=Users,DC=contoso,DC=com" `
    -TargetPath "OU=IT,DC=contoso,DC=com"

# Deplacer plusieurs utilisateurs via pipeline
Get-ADUser -Filter {Department -eq "Stagiaire"} | Move-ADObject -TargetPath "OU=Inactifs,DC=contoso,DC=com"
```

---

## Resume

| Operation | Commande |
|---|---|
| Installer AD DS | `Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools` |
| Nouvelle foret | `Install-ADDSForest -DomainName contoso.com -InstallDns` |
| Creer utilisateur | `New-ADUser -Name "..." -SamAccountName "..." -Enabled $true` |
| Modifier utilisateur | `Set-ADUser -Identity "..." -Title "..."` |
| Chercher utilisateurs | `Get-ADUser -Filter {Department -eq "IT"}` |
| Desactiver compte | `Disable-ADAccount -Identity "..."` |
| Deverrouiller compte | `Unlock-ADAccount -Identity "..."` |
| Changer mot de passe | `Set-ADAccountPassword -Identity "..." -NewPassword $pwd -Reset` |
| Creer groupe | `New-ADGroup -Name "..." -GroupScope Global -GroupCategory Security` |
| Ajouter au groupe | `Add-ADGroupMember -Identity "Groupe" -Members "user"` |
| Deplacer objet | `Move-ADObject -Identity "DN" -TargetPath "OU=..."` |

---
:::info Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/windows/quiz-active-directory)

:::

:::info TP disponible

Pratiquez sur machine virtuelle :
[Faire les TP →](/TP/windows/tp-active-directory)

:::

*Continuer avec la lecon suivante dans la barre laterale.*

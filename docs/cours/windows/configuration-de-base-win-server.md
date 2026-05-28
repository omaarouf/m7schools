---
id: configuration-de-base-win-server
title: Configuration de Base Win Server
sidebar_label: Configuration de Base Win Server
---

## Introduction

Ce module couvre l'administration d'un serveur **Windows Server 2019/2022** en ligne de commande PowerShell - configuration reseau, gestion des roles, installation et promotion en Controleur de Domaine (AD DS).

---

## 1. Operations de Base sur le Serveur

### Redemarrer le serveur

```powershell
Restart-Computer
```

### Arreter le serveur

```powershell
Stop-Computer
```

### Renommer l'ordinateur

```powershell
Rename-Computer -NewName "TRI-DC" -Restart
```

> Le parametre `-Restart` redémarre automatiquement pour appliquer le nouveau nom.

### Verifier les fonctionnalites installees

```powershell
Get-WindowsFeature | Where-Object { $_.Installed -eq $true }
```

---

## 2. Configuration du Reseau

### Lister les interfaces reseau

```powershell
Get-NetIPInterface
```

### Configurer l'adresse IP statique

```powershell
New-NetIPAddress `
    -InterfaceAlias "Ethernet0" `
    -IPAddress 192.168.1.10 `
    -PrefixLength 24 `
    -DefaultGateway 192.168.1.1
```

Ou avec l'index de l'interface :

```powershell
New-NetIPAddress `
    -InterfaceIndex 12 `
    -IPAddress 172.16.0.200 `
    -PrefixLength 24 `
    -DefaultGateway 172.16.0.1
```

### Configurer les serveurs DNS

```powershell
Set-DnsClientServerAddress `
    -InterfaceAlias "Ethernet0" `
    -ServerAddresses 192.168.1.10

# Avec un DNS secondaire
Set-DnsClientServerAddress `
    -InterfaceIndex 12 `
    -ServerAddresses 172.16.0.10, 172.16.0.11
```

### Joindre le serveur a un Domaine

```powershell
Add-Computer -DomainName Adatum.com -Restart
```

---

## 3. Gestion de l'Interface Graphique (Core / Full)

### Convertir une installation minimale (Core) en installation complete (Full)

```powershell
Get-WindowsFeature -Name *GUI* | Install-WindowsFeature -IncludeAllSubFeature -IncludeManagementTools -Restart
```

### Convertir une installation complete (Full) en installation minimale (Core)

```powershell
Get-WindowsFeature -Name *GUI* | Remove-WindowsFeature -Restart
```

Ou avec `Uninstall-WindowsFeature` :

```powershell
Get-WindowsFeature -Name *GUI* | Uninstall-WindowsFeature -Restart
```

---

## 4. Installation et Configuration d'Active Directory (AD DS)

### Etape 1 - Installer le role AD DS

```powershell
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools
```

Ou avec toutes les sous-fonctionnalites :

```powershell
Install-WindowsFeature -Name AD-Domain-Services -IncludeAllSubFeature -IncludeManagementTools
```

### Etape 2 - Promouvoir le serveur en Controleur de Domaine

Quatre scenarios possibles selon la situation :

---

#### Scenario A - Nouvelle Foret (nouveau domaine from scratch)

```powershell
Install-ADDSForest -DomainName ofppt.ma -InstallDns
```

Exemple avec domaine Adatum :

```powershell
Install-ADDSForest -DomainName adatum.com -InstallDns
```

---

#### Scenario B - Ajouter un Controleur a un domaine existant

```powershell
Install-ADDSDomainController -DomainName Adatum.com -InstallDns
```

---

#### Scenario C - Ajouter un nouveau domaine enfant

```powershell
Install-ADDSDomain `
    -NewDomainName khenifra.adatum.com `
    -ParentDomainName adatum.com `
    -DomainType ChildDomain `
    -InstallDns
```

---

#### Scenario D - Ajouter une nouvelle arborescence (Tree)

```powershell
Install-ADDSDomain `
    -NewDomainName contoso.com `
    -ParentDomainName adatum.com `
    -DomainType TreeDomain `
    -InstallDns
```

---

| Scenario | Cmdlet | Parametre cle |
|---|---|---|
| Nouvelle foret | `Install-ADDSForest` | `-DomainName` |
| Controleur supplementaire | `Install-ADDSDomainController` | `-DomainName` |
| Domaine enfant | `Install-ADDSDomain` | `-DomainType ChildDomain` |
| Nouvelle arborescence | `Install-ADDSDomain` | `-DomainType TreeDomain` |

---

## 5. Gestion des Unites d'Organisation (OU)

### Supprimer une OU protegee

Par defaut, les OUs sont protegees contre la suppression accidentelle. Il faut d'abord desactiver cette protection :

```powershell
# Etape 1 : Desactiver la protection
Set-ADOrganizationalUnit `
    -Identity "OU=windows_ou,DC=ofppt,DC=local" `
    -ProtectedFromAccidentalDeletion $false

# Etape 2 : Supprimer l'OU
Remove-ADOrganizationalUnit `
    -Identity "OU=windows_ou,DC=ofppt,DC=local" `
    -Confirm:$false
```

> `-Confirm:$false` supprime la demande de confirmation interactive.

---

## Resume

| Operation | Commande |
|---|---|
| Redemarrer | `Restart-Computer` |
| Arreter | `Stop-Computer` |
| Renommer | `Rename-Computer -NewName "NOM" -Restart` |
| Lister interfaces | `Get-NetIPInterface` |
| Configurer IP | `New-NetIPAddress -InterfaceAlias "Ethernet0" -IPAddress ... -PrefixLength 24 -DefaultGateway ...` |
| Configurer DNS | `Set-DnsClientServerAddress -InterfaceAlias "Ethernet0" -ServerAddresses ...` |
| Rejoindre domaine | `Add-Computer -DomainName domaine.com -Restart` |
| Installer AD DS | `Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools` |
| Nouvelle foret | `Install-ADDSForest -DomainName domaine.com -InstallDns` |
| Fonctionnalites installees | `Get-WindowsFeature \| Where-Object { $_.Installed -eq $true }` |
| Supprimer OU protegee | `Set-ADOrganizationalUnit ... -ProtectedFromAccidentalDeletion $false` puis `Remove-ADOrganizationalUnit` |

---
:::info TP disponible

Pratiquez sur machine virtuelle :
[Faire les TP →](/TP/windows/tp-configuration-de-base)

:::

*Continuer avec la lecon suivante dans la barre laterale.*

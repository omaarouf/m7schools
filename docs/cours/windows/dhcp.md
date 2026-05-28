---
id: dhcp
title: DHCP
sidebar_label: DHCP
---

## Introduction

Ce cours couvre l'installation et la configuration du role **DHCP** sur Windows Server avec PowerShell. Le DHCP attribue automatiquement les adresses IP aux clients du reseau.

---

## 1. Installer le role DHCP

```powershell
Install-WindowsFeature -Name DHCP -IncludeManagementTools
```

## 2. Autoriser le serveur DHCP dans Active Directory

```powershell
Add-DhcpServerInDC -DnsName "srv-dhcp.contoso.com" -IPAddress 192.168.1.10
```

### Étape suivante (Optionnelle)
Une fois cette commande exécutée sur votre contrôleur de domaine, vous pouvez vérifier que le serveur est bien network-approuvé avec la commande :
```powershell

Get-DhcpServerInDC
```
---

## 3. Etendues IPv4

### Commandes principales

| Commande | Attributs principaux | Obligatoire |
|---|---|---|
| `Add-DhcpServerv4Scope` | `-Name`, `-StartRange`, `-EndRange`, `-SubnetMask`, `-State`, `-LeaseDuration`, `-Delay` | `-Name`, `-StartRange`, `-EndRange`, `-SubnetMask` |
| `Get-DhcpServerv4Scope` | `-ScopeId`, `-ComputerName` | `-ScopeId` |
| `Remove-DhcpServerv4Scope` | `-ScopeId`, `-Force` | `-ScopeId` |
| `Set-DhcpServerv4Scope` | `-ScopeId`, `-Name`, `-LeaseDuration`, `-Delay`, `-State`, `-Description` | `-ScopeId` |
| `Set-DhcpServerv4OptionValue` | `-ScopeId`, `-Router`, `-DnsServer`, `-DnsDomain`, `-OptionId`, `-Value` | `-ScopeId` |
| `Add-DhcpServerv4Reservation` | `-ScopeId`, `-IPAddress`, `-ClientId`, `-Description` | `-ScopeId`, `-IPAddress`, `-ClientId` |
| `Remove-DhcpServerv4Reservation` | `-ScopeId`, `-IPAddress` | `-ScopeId`, `-IPAddress` |
| `Get-DhcpServerv4Lease` | `-ScopeId` | `-ScopeId` |
| `Get-DhcpServerv4ScopeStatistics` | `-ScopeId` | `-ScopeId` |
| `Add-DhcpServerv4ExclusionRange` | `-ScopeId`, `-StartRange`, `-EndRange` | `-ScopeId`, `-StartRange`, `-EndRange` |

### Details des attributs - Add-DhcpServerv4Scope

| Parametre | Statut | Description |
|---|---|---|
| `-Name` | Obligatoire | Nom descriptif (ex: `Reseau Administratif`) |
| `-StartRange` | Obligatoire | Premiere adresse IP de la plage (ex: `192.168.1.100`) |
| `-EndRange` | Obligatoire | Derniere adresse IP de la plage (ex: `192.168.1.200`) |
| `-SubnetMask` | Obligatoire | Masque reseau (ex: `255.255.255.0`) |
| `-State` | Optionnel | `Active` ou `Inactive` |
| `-LeaseDuration` | Optionnel | Duree du bail — 8h : `0.08:00:00` / 1 jour : `1.00:00:00` / 30 min : `0.00:30:00` |
| `-Delay` | Optionnel | Temps de reponse en ms (0 = serveur principal, 300 = serveur backup) |
| `-ScopeId` | - | Adresse reseau (Network ID) de l'etendue DHCP |

### Creer une etendue

```powershell
Add-DhcpServerv4Scope `
    -Name "Reseau Principal" `
    -StartRange 192.168.1.100 `
    -EndRange 192.168.1.200 `
    -SubnetMask 255.255.255.0 `
    -State Active `
    -LeaseDuration 1.00:00:00 `    #  1 jour
    -Delay 0 `
    -Description "Etendue principale du reseau LAN"
```

### Modifier un scope existant

```powershell
Set-DhcpServerv4Scope -ScopeId 192.168.1.0 -Name "LAN1" -LeaseDuration 1.00:00:00 -Delay 0
```

### Configurer les options (passerelle, DNS)

**Version avec parametres nommés :**

```powershell
Set-DhcpServerv4OptionValue `
    -ScopeId 192.168.1.0 `
    -Router 192.168.1.1 `
    -DnsServer 192.168.1.10, 8.8.8.8 `
    -DnsDomain "example.com"
```

**Version avec numéros d'option :**

```powershell
# Option 003 - Routeur (passerelle par defaut)
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -OptionId 3 -Value "192.168.1.1"

# Option 006 - Serveurs DNS
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -OptionId 6 -Value "192.168.1.10", "8.8.8.8"

# Option 015 - Nom de domaine DNS
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -OptionId 15 -Value "example.com"
```

### Ajouter une exclusion

```powershell
Add-DhcpServerv4ExclusionRange `
    -ScopeId 192.168.117.0 `
    -StartRange 192.168.117.120 `
    -EndRange 192.168.117.130
```

### Creer une reservation (IP fixe par adresse MAC)

```powershell
Add-DhcpServerv4Reservation `
    -ScopeId 192.168.1.0 `
    -IPAddress 192.168.1.50 `
    -ClientId "AA-BB-CC-DD-EE-FF" `
    -Description "Imprimante Etage 3"
```

### Supprimer une reservation

```powershell
Remove-DhcpServerv4Reservation `
    -ScopeId 192.168.1.0 `
    -IPAddress 192.168.1.50
```

### Consulter les etendues et baux

```powershell
# Lister les etendues
Get-DhcpServerv4Scope

# Lister les baux actifs
Get-DhcpServerv4Lease -ScopeId 192.168.1.0 | Format-Table

# Voir les options configurees
Get-DhcpServerv4OptionValue -ScopeId 192.168.1.0

# Voir l'etat de saturation (IPs libres vs occupees) de l'etendue
Get-DhcpServerv4ScopeStatistics -ScopeId 192.168.10.0
```

### Supprimer une etendue

```powershell
Remove-DhcpServerv4Scope -ScopeId 192.168.1.0 -Force
```

### Delai de reponse DHCP (serveur principal / backup)

```powershell
# Serveur DHCP 1 - principal
Set-DhcpServerv4Scope -ScopeId 192.168.117.0 -Delay 0

# Serveur DHCP 2 - backup
Set-DhcpServerv4Scope -ScopeId 192.168.117.0 -Delay 300
```

### Options DHCPv4 avec -OptionId

| OptionId | Description | Valeur exemple |
|---|---|---|
| `1` | Subnet Mask | `255.255.255.0` |
| `3` | Router (Default Gateway) | `192.168.1.254` |
| `6` | DNS Servers | `192.168.1.10, 8.8.8.8` |
| `15` | DNS Domain Name | `hassania.local` |

```powershell
# Option 1 - Subnet Mask
Set-DhcpServerv4OptionValue `
    -OptionId 1 `
    -Value 255.255.255.0 `
    -ScopeId 192.168.1.0 `
    -ComputerName Serv-DC1.hassania.local

# Option 3 - Router (Default Gateway)
Set-DhcpServerv4OptionValue `
    -OptionId 3 `
    -Value 192.168.1.254 `
    -ScopeId 192.168.1.0 `
    -ComputerName Serv-DC1.hassania.local

# Option 6 - DNS Servers
Set-DhcpServerv4OptionValue `
    -OptionId 6 `
    -Value 192.168.1.10, 8.8.8.8 `
    -ScopeId 192.168.1.0 `
    -ComputerName Serv-DC1.hassania.local

# Option 15 - DNS Domain Name
Set-DhcpServerv4OptionValue `
    -OptionId 15 `
    -Value "hassania.local" `
    -ScopeId 192.168.1.0 `
    -ComputerName Serv-DC1.hassania.local
```

---

## 4. Etendues IPv6

### Commandes principales

| Commande | Attributs principaux | Obligatoire |
|---|---|---|
| `Add-DhcpServerv6Scope` | `-Name`, `-StartRange`, `-EndRange`, `-PrefixLength`, `-State`, `-LeaseDuration`, `-Delay` | `-Name`, `-StartRange`, `-EndRange`, `-PrefixLength` |
| `Remove-DhcpServerv6Scope` | `-ScopeId`, `-Force` | `-ScopeId` |
| `Get-DhcpServerv6Lease` | `-ScopeId` | `-ScopeId` |
| `Add-DhcpServerv6Reservation` | `-ScopeId`, `-ClientId`, `-IPAddress`, `-Description` | `-ScopeId`, `-ClientId`, `-IPAddress` |
| `Remove-DhcpServerv6Reservation` | `-ScopeId`, `-ClientId` | `-ScopeId`, `-ClientId` |
| `Set-DhcpServerv6OptionValue` | `-ScopeId`, `-DnsServer`, `-DnsDomain`, `-DnsSuffix` | `-ScopeId` |

### Details des attributs - Add-DhcpServerv6Scope

| Parametre | Statut | Description |
|---|---|---|
| `-Name` | Obligatoire | Nom de l'etendue (ex: `Reseau IPv6 Entreprise`) |
| `-StartRange` | Obligatoire | Premiere adresse IPv6 (ex: `2001:db8::1`) |
| `-EndRange` | Obligatoire | Derniere adresse IPv6 (ex: `2001:db8::ffff`) |
| `-PrefixLength` | Obligatoire | Longueur du prefixe IPv6 (ex: `64`) |
| `-State` | Optionnel | `Active` ou `Inactive` |

### Creer une etendue IPv6

```powershell
Add-DhcpServerv6Scope `
    -Name "Reseau IPv6" `
    -StartRange 2001:db8::1 `
    -EndRange 2001:db8::ffff `
    -PrefixLength 64 `
    -State Active
```

### Ajouter une reservation IPv6

```powershell
Add-DhcpServerv6Reservation `
    -ScopeId 2001:db8::/64 `
    -ClientId "00:03:00:01:AA:BB:CC:DD:EE:FF" `
    -IPAddress 2001:db8::100 `
    -Description "Serveur Web"
```

### Supprimer une reservation IPv6

```powershell
Remove-DhcpServerv6Reservation `
    -ScopeId 2001:db8::/64 `
    -ClientId "00:03:00:01:AA:BB:CC:DD:EE:FF"
```

### Consulter etendues et baux IPv6

```powershell
Get-DhcpServerv6Scope
Get-DhcpServerv6Lease -ScopeId 2001:db8::/64 | Format-Table
```

### Configurer les options DHCPv6

```powershell
Set-DhcpServerv6OptionValue `
    -ScopeId 2001:db8:: `
    -DnsServer 2001:db8::53, 2001:db8::54 `
    -DnsDomain "example.local" `
    -DnsSuffix "local"
```

| Parametre | Statut | Description |
|---|---|---|
| `-ScopeId` | Obligatoire | Adresse reseau du scope IPv6 (ex: `2001:db8::`) |
| `-DnsServer` | Optionnel | Adresse(s) du/des serveur(s) DNS |
| `-DnsDomain` | Optionnel | Nom de domaine DNS |
| `-DnsSuffix` | Optionnel | Suffixe DNS par defaut pour les clients |

### Supprimer une etendue IPv6

```powershell
Remove-DhcpServerv6Scope -ScopeId 2001:db8::/64 -Force
```

---

## 5. Agents de Relais DHCP

Un agent de relais transfere les requetes DHCP des clients vers le serveur DHCP lorsqu'ils sont sur des sous-reseaux differents.

### Commandes principales

| Commande | Explication |
|---|---|
| `Add-DhcpServerv4RelayAgent` | Ajoute un agent de relais IPv4 |
| `Get-DhcpServerv4RelayAgent` | Affiche les agents de relais IPv4 |
| `Remove-DhcpServerv4RelayAgent` | Supprime un agent de relais IPv4 |
| `Add-DhcpServerv6RelayAgent` | Ajoute un agent de relais IPv6 |
| `Get-DhcpServerv6RelayAgent` | Affiche les agents de relais IPv6 |
| `Remove-DhcpServerv6RelayAgent` | Supprime un agent de relais IPv6 |

### Agents de relais IPv4

```powershell
# Ajouter un agent de relais IPv4
Add-DhcpServerv4RelayAgent -IPAddress 192.168.117.1 -Server 192.168.1.1

# Afficher tous les agents de relais IPv4
Get-DhcpServerv4RelayAgent | Format-Table

# Supprimer un agent de relais IPv4
Remove-DhcpServerv4RelayAgent -IPAddress 192.168.2.1
```

### Agents de relais IPv6

```powershell
# Ajouter un agent de relais IPv6
Add-DhcpServerv6RelayAgent `
    -IPAddress 2001:db8:2::1 `
    -Name "Agent Relais IPv6 Site B"

# Afficher tous les agents de relais IPv6
Get-DhcpServerv6RelayAgent | Format-Table

# Supprimer un agent de relais IPv6
Remove-DhcpServerv6RelayAgent -IPAddress 2001:db8:2::1
```

---

## Resume

| Operation | Commande |
|---|---|
| Installer DHCP | `Install-WindowsFeature -Name DHCP -IncludeManagementTools` |
| Autoriser DHCP dans AD | `Add-DhcpServerInDC -DnsName srv.contoso.com -IPAddress ...` |
| Creer etendue IPv4 | `Add-DhcpServerv4Scope -Name "..." -StartRange ... -EndRange ... -SubnetMask ...` |
| Modifier etendue | `Set-DhcpServerv4Scope -ScopeId ... -Name "..." -LeaseDuration ...` |
| Options etendue | `Set-DhcpServerv4OptionValue -ScopeId ... -Router ... -DnsServer ...` |
| Exclusion | `Add-DhcpServerv4ExclusionRange -ScopeId ... -StartRange ... -EndRange ...` |
| Reservation MAC | `Add-DhcpServerv4Reservation -ScopeId ... -IPAddress ... -ClientId "MAC"` |
| Supprimer reservation | `Remove-DhcpServerv4Reservation -ScopeId ... -IPAddress ...` |
| Lister baux actifs | `Get-DhcpServerv4Lease -ScopeId ... \| Format-Table` |
| Supprimer etendue | `Remove-DhcpServerv4Scope -ScopeId ... -Force` |
| Delai principal | `Set-DhcpServerv4Scope -ScopeId ... -Delay 0` |
| Delai backup | `Set-DhcpServerv4Scope -ScopeId ... -Delay 300` |
| Relais IPv4 | `Add-DhcpServerv4RelayAgent -IPAddress ... -Server ...` |

---
:::info Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/windows/quiz-dhcp)

:::

:::info TP disponible

Pratiquez sur machine virtuelle :
[Faire les TP →](/TP/windows/tp-dhcp)

:::

*Continuer avec la lecon suivante dans la barre laterale.*

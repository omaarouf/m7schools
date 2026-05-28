---
id: dns
title: DNS
sidebar_label: DNS
---

## Introduction

Ce cours couvre l'installation et la configuration du role **DNS** sur Windows Server avec PowerShell. Le DNS resout les noms de domaine en adresses IP et gere les zones de recherche directe et inversee.

---

## 1. Installer le role DNS

```powershell
Install-WindowsFeature -Name DNS -IncludeManagementTools
```

---

## 2. Zones de recherche directe

### Creer une zone principale

```powershell
Add-DnsServerPrimaryZone `
    -Name "contoso.com" `
    -ReplicationScope Domain `
    -DynamicUpdate Secure
```

| Parametre | Statut | Description |
|---|---|---|
| `-Name` | Obligatoire | Nom de la zone |
| `-ReplicationScope` | Recommande | `Domain`, `Forest`, `Legacy` ou `Custom` |
| `-DynamicUpdate` | Recommande | `Secure`, `NonsecureAndSecure` ou `None` |
| `-ZoneFile` | Optionnel | Nom du fichier de zone |

### Creer une zone secondaire

```powershell
Add-DnsServerSecondaryZone `
    -Name "contoso.com" `
    -MasterServers 192.168.1.10 `
    -ZoneFile "contoso.com.dns"
```

```powershell
Add-DnsServerSecondaryZone `
    -Name "ofppt.local" `
    -MasterServers 192.168.10.20 `
    -ZoneFile "ofppt.local.dns"
```

---

## 3. Enregistrements DNS

### Enregistrement A (IPv4)

```powershell
Add-DnsServerResourceRecordA `
    -Name "www" `
    -ZoneName "contoso.com" `
    -IPv4Address 192.168.1.100 `
    -CreatePtr `
    -TimeToLive 01:00:00
```

```powershell
Add-DnsServerResourceRecordA `
    -Name "filesrv" `
    -ZoneName "ofppt.local" `
    -IPv4Address 192.168.10.50 `
    -CreatePtr
```

| Parametre | Statut | Description |
|---|---|---|
| `-Name` | Obligatoire | Nom de l'hote |
| `-ZoneName` | Obligatoire | Zone DNS cible |
| `-IPv4Address` | Obligatoire | Adresse IPv4 |
| `-CreatePtr` | Optionnel | Creer automatiquement l'enregistrement PTR |
| `-TimeToLive` | Optionnel | Duree de vie (TTL) |

### Enregistrement CNAME (alias)

```powershell
Add-DnsServerResourceRecordCName `
    -ZoneName "ofppt.local" `
    -Name "ftp" `
    -HostNameAlias "filesrv.ofppt.local"
```

| Parametre | Statut | Description |
|---|---|---|
| `-ZoneName` | Obligatoire | Zone DNS cible |
| `-Name` | Obligatoire | Nom de l'alias |
| `-HostNameAlias` | Obligatoire | Nom FQDN de la cible |

### Enregistrement AAAA (IPv6)

```powershell
Add-DnsServerResourceRecordAAAA `
    -Name "www" `
    -ZoneName "contoso.com" `
    -IPv6Address "2001:db8::100" `
    -CreatePtr
```

### Enregistrement MX (messagerie)

```powershell
Add-DnsServerResourceRecordMX `
    -ZoneName "detic.ma" `
    -Name "." `
    -MailExchange "mail.detic.ma" `
    -Priority 10
```

| Parametre | Statut | Description |
|---|---|---|
| `-ZoneName` | Obligatoire | Zone DNS cible |
| `-Name` | Obligatoire | `"."` pour la zone racine |
| `-MailExchange` | Obligatoire | FQDN du serveur mail |
| `-Priority` | Obligatoire | Priorite (valeur basse = priorite haute) |

### Enregistrement NS (serveur de noms)

```powershell
Add-DnsServerResourceRecord `
    -ZoneName "detic.ma" `
    -Name "." `
    -NS `
    -NameServer "ns1.detic.ma"
```

| Parametre | Statut | Description |
|---|---|---|
| `-ZoneName` | Obligatoire | Zone DNS cible |
| `-Name` | Obligatoire | `"."` pour la zone racine |
| `-NS` | Obligatoire | Type d'enregistrement NS |
| `-NameServer` | Obligatoire | FQDN du serveur de noms autoritaire |

### Enregistrement SOA (Start of Authority)

```powershell
# Afficher le SOA d'une zone
Get-DnsServerResourceRecord -ZoneName "detic.ma" -RRType SOA

# Modifier les parametres SOA
Set-DnsServerPrimaryZone `
    -Name "detic.ma" `
    -ResponsiblePerson "admin.detic.ma" `
    -RefreshInterval 00:15:00 `
    -RetryDelay 00:10:00 `
    -ExpireInterval 1.00:00:00 `
    -MinimumTimeToLive 00:01:00
```

| Champ SOA | Description |
|---|---|
| `ResponsiblePerson` | Email de l'administrateur (@ remplace par .) |
| `RefreshInterval` | Frequence de synchronisation du secondaire |
| `RetryDelay` | Delai avant nouvelle tentative si echec |
| `ExpireInterval` | Duree apres laquelle le secondaire cesse de repondre |
| `MinimumTimeToLive` | TTL minimum pour les enregistrements negatifs |

### Consulter les enregistrements

```powershell
# Tous les enregistrements d'une zone
Get-DnsServerResourceRecord -ZoneName "contoso.com"

# Enregistrement specifique
Get-DnsServerResourceRecord -ZoneName "contoso.com" -Name "www" -RRType A
```

### Supprimer un enregistrement

```powershell
Remove-DnsServerResourceRecord -ZoneName "contoso.com" -Name "www" -RRType A -Force
```

---

## 4. Zones inversees (PTR)

### Creer une zone inversee IPv4

```powershell
Add-DnsServerPrimaryZone `
    -NetworkId "192.168.1.0/24" `
    -ReplicationScope Domain `
    -DynamicUpdate Secure
```

```powershell
Add-DnsServerPrimaryZone `
    -NetworkId "192.168.10.0/24" `
    -ReplicationScope Domain `
    -DynamicUpdate Secure
```

### Creer une zone inversee IPv6

```powershell
Add-DnsServerPrimaryZone `
    -NetworkId "2001:db8::/64" `
    -ReplicationScope Domain
```

### Ajouter un enregistrement PTR

```powershell
Add-DnsServerResourceRecordPtr `
    -Name "100" `
    -ZoneName "1.168.192.in-addr.arpa" `
    -PtrDomainName "server.contoso.com"
```

```powershell
Add-DnsServerResourceRecordPtr `
    -Name "50" `
    -ZoneName "10.168.192.in-addr.arpa" `
    -PtrDomainName "filesrv.ofppt.local"
```

> **50** correspond au dernier octet de l'adresse IP (192.168.10.**50**)

### Consulter les zones inversees

```powershell
Get-DnsServerZone -Name "1.168.192.in-addr.arpa"
```

---

## Resume

| Operation | Commande |
|---|---|
| Installer DNS | `Install-WindowsFeature -Name DNS -IncludeManagementTools` |
| Zone principale | `Add-DnsServerPrimaryZone -Name "contoso.com" -ReplicationScope Domain` |
| Zone secondaire | `Add-DnsServerSecondaryZone -Name "..." -MasterServers ...` |
| Enregistrement A | `Add-DnsServerResourceRecordA -Name "www" -ZoneName "..." -IPv4Address ...` |
| Enregistrement CNAME | `Add-DnsServerResourceRecordCName -ZoneName "..." -Name "ftp" -HostNameAlias "..."` |
| Enregistrement AAAA | `Add-DnsServerResourceRecordAAAA -Name "..." -ZoneName "..." -IPv6Address ...` |
| Enregistrement MX | `Add-DnsServerResourceRecordMX -ZoneName "..." -Name "." -MailExchange "..." -Priority 10` |
| Enregistrement NS | `Add-DnsServerResourceRecord -ZoneName "..." -Name "." -NS -NameServer "..."` |
| Consulter SOA | `Get-DnsServerResourceRecord -ZoneName "..." -RRType SOA` |
| Zone inversee | `Add-DnsServerPrimaryZone -NetworkId "192.168.1.0/24" -ReplicationScope Domain` |
| Enregistrement PTR | `Add-DnsServerResourceRecordPtr -Name "50" -ZoneName "10.168.192.in-addr.arpa" -PtrDomainName ...` |

---
:::info Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/windows/quiz-dns)

:::

:::info TP disponible

Pratiquez sur machine virtuelle :
[Faire les TP →](/TP/windows/tp-dns)

:::

*Continuer avec la lecon suivante dans la barre laterale.*

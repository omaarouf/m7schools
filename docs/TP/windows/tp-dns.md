---
id: tp-dns
title: DNS Windows Server
---

# TP - DNS Windows Server

7 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Installation et Zones (Facile)

**Objectif :** Installer le role DNS et creer les zones de base.

---

**1. Installer le role DNS avec les outils de gestion.**

<details>
<summary>Voir la reponse</summary>

```powershell
Install-WindowsFeature -Name DNS -IncludeManagementTools
```

</details>

---

**2. Verifier que le service DNS est actif.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Service -Name "DNS"
```

</details>

---

**3. Creer une zone principale pour le domaine `ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerPrimaryZone `
    -Name "ofppt.local" `
    -ReplicationScope Domain `
    -DynamicUpdate Secure
```

</details>

---

**4. Lister toutes les zones DNS configurees sur le serveur.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DnsServerZone
```

</details>

---

**5. Afficher les details de la zone `ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DnsServerZone -Name "ofppt.local"
```

</details>

---

**6. Creer une zone secondaire pour `ofppt.local` pointant vers le serveur maitre `192.168.10.20`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerSecondaryZone `
    -Name "ofppt.local" `
    -MasterServers 192.168.10.20 `
    -ZoneFile "ofppt.local.dns"
```

</details>

---

**7. Supprimer la zone secondaire creee.**

<details>
<summary>Voir la reponse</summary>

```powershell
Remove-DnsServerZone -Name "ofppt.local" -Force
```

</details>

---

## TP n°2 - Enregistrements A, CNAME, AAAA (Facile-Moyen)

**Objectif :** Creer et gerer les enregistrements DNS courants.

**Contexte :** Zone `ofppt.local` existante.

| Hote | Nom | IP |
|---|---|---|
| Serveur web | `www` | `192.168.10.2` |
| Serveur fichiers | `filesrv` | `192.168.10.50` |
| Alias FTP | `ftp` | pointe vers `filesrv.ofppt.local` |

---

**1. Creer l enregistrement A pour `www.ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerResourceRecordA `
    -Name "www" `
    -ZoneName "ofppt.local" `
    -IPv4Address 192.168.10.2 `
    -CreatePtr
```

</details>

---

**2. Creer l enregistrement A pour `filesrv.ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerResourceRecordA `
    -Name "filesrv" `
    -ZoneName "ofppt.local" `
    -IPv4Address 192.168.10.50 `
    -CreatePtr
```

</details>

---

**3. Creer un alias CNAME `ftp` pointant vers `filesrv.ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerResourceRecordCName `
    -ZoneName "ofppt.local" `
    -Name "ftp" `
    -HostNameAlias "filesrv.ofppt.local"
```

</details>

---

**4. Creer un enregistrement AAAA pour `www` avec l IPv6 `2001:db8::2`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerResourceRecordAAAA `
    -Name "www" `
    -ZoneName "ofppt.local" `
    -IPv6Address "2001:db8::2"
```

</details>

---

**5. Afficher tous les enregistrements de la zone `ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DnsServerResourceRecord -ZoneName "ofppt.local"
```

</details>

---

**6. Afficher uniquement les enregistrements A de la zone.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DnsServerResourceRecord -ZoneName "ofppt.local" -RRType A
```

</details>

---

**7. Supprimer l enregistrement A de `www`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Remove-DnsServerResourceRecord -ZoneName "ofppt.local" -Name "www" -RRType A -Force
```

</details>

---

## TP n°3 - Enregistrements MX, NS et SOA (Moyen)

**Objectif :** Configurer les enregistrements de messagerie, noms de serveur et SOA.

**Contexte :** Zone `detic.ma`.

---

**1. Creer la zone principale `detic.ma`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerPrimaryZone `
    -Name "detic.ma" `
    -ReplicationScope Domain `
    -DynamicUpdate Secure
```

</details>

---

**2. Creer l enregistrement A pour le serveur mail `mail.detic.ma` a `192.168.1.20`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerResourceRecordA `
    -Name "mail" `
    -ZoneName "detic.ma" `
    -IPv4Address 192.168.1.20
```

</details>

---

**3. Creer l enregistrement MX pour `detic.ma` avec priorite 10.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerResourceRecordMX `
    -ZoneName "detic.ma" `
    -Name "." `
    -MailExchange "mail.detic.ma" `
    -Priority 10
```

</details>

---

**4. Creer l enregistrement NS pour `ns1.detic.ma`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerResourceRecord `
    -ZoneName "detic.ma" `
    -Name "." `
    -NS `
    -NameServer "ns1.detic.ma"
```

</details>

---

**5. Afficher l enregistrement SOA de la zone `detic.ma`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DnsServerResourceRecord -ZoneName "detic.ma" -RRType SOA
```

</details>

---

**6. Modifier les parametres SOA : responsable `admin.detic.ma`, refresh 15 min, retry 10 min.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-DnsServerPrimaryZone `
    -Name "detic.ma" `
    -ResponsiblePerson "admin.detic.ma" `
    -RefreshInterval 00:15:00 `
    -RetryDelay 00:10:00 `
    -ExpireInterval 1.00:00:00 `
    -MinimumTimeToLive 00:01:00
```

</details>

---

**7. Verifier tous les enregistrements de la zone `detic.ma`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DnsServerResourceRecord -ZoneName "detic.ma" | Format-Table -AutoSize
```

</details>

---

## TP n°4 - Zones Inversees et PTR (Moyen)

**Objectif :** Creer les zones inversees et les enregistrements PTR.

---

**1. Creer la zone inversee pour le reseau `192.168.10.0/24`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerPrimaryZone `
    -NetworkId "192.168.10.0/24" `
    -ReplicationScope Domain `
    -DynamicUpdate Secure
```

</details>

---

**2. Creer un enregistrement PTR pour `filesrv.ofppt.local` a l IP `192.168.10.50`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerResourceRecordPtr `
    -Name "50" `
    -ZoneName "10.168.192.in-addr.arpa" `
    -PtrDomainName "filesrv.ofppt.local"
```

> `50` correspond au dernier octet de l adresse IP (192.168.10.**50**)

</details>

---

**3. Creer un enregistrement PTR pour `www.ofppt.local` a l IP `192.168.10.2`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerResourceRecordPtr `
    -Name "2" `
    -ZoneName "10.168.192.in-addr.arpa" `
    -PtrDomainName "www.ofppt.local"
```

</details>

---

**4. Afficher tous les enregistrements PTR de la zone inversee.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DnsServerResourceRecord -ZoneName "10.168.192.in-addr.arpa" -RRType PTR
```

</details>

---

**5. Creer la zone inversee IPv6 pour le prefixe `2001:db8::/64`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerPrimaryZone `
    -NetworkId "2001:db8::/64" `
    -ReplicationScope Domain
```

</details>

---

**6. Verifier la zone inversee IPv4 creee.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DnsServerZone -Name "10.168.192.in-addr.arpa"
```

</details>

---

**7. Expliquer la difference entre un enregistrement A et un enregistrement PTR.**

<details>
<summary>Voir la reponse</summary>

| Enregistrement | Direction | Zone |
|---|---|---|
| `A` | Nom → IP (resolution directe) | Zone directe (`ofppt.local`) |
| `PTR` | IP → Nom (resolution inverse) | Zone inversee (`10.168.192.in-addr.arpa`) |

La resolution inverse permet de retrouver le nom d un hote a partir de son adresse IP. Elle est utilisee pour les diagnostics reseau, les logs de securite et la verification de l identite des serveurs.

</details>

---

## TP n°5 - Scenario Reel Complet (Difficile)

**Objectif :** Deployer un serveur DNS complet pour l entreprise `OFPPT`.

**Contexte :**

| Hote | Nom DNS | IP |
|---|---|---|
| Serveur DNS | `ns1.ofppt.local` | `192.168.10.1` |
| Serveur Web | `www.ofppt.local` | `192.168.10.2` |
| Serveur Mail | `mail.ofppt.local` | `192.168.10.5` |
| Serveur Fichiers | `filesrv.ofppt.local` | `192.168.10.50` |
| Alias FTP | `ftp.ofppt.local` | alias de `filesrv` |

---

**1. Creer la zone principale `ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerPrimaryZone `
    -Name "ofppt.local" `
    -ReplicationScope Domain `
    -DynamicUpdate Secure
```

</details>

---

**2. Creer tous les enregistrements A.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerResourceRecordA -Name "ns1"     -ZoneName "ofppt.local" -IPv4Address 192.168.10.1  -CreatePtr
Add-DnsServerResourceRecordA -Name "www"     -ZoneName "ofppt.local" -IPv4Address 192.168.10.2  -CreatePtr
Add-DnsServerResourceRecordA -Name "mail"    -ZoneName "ofppt.local" -IPv4Address 192.168.10.5  -CreatePtr
Add-DnsServerResourceRecordA -Name "filesrv" -ZoneName "ofppt.local" -IPv4Address 192.168.10.50 -CreatePtr
```

</details>

---

**3. Creer les enregistrements MX, CNAME et NS.**

<details>
<summary>Voir la reponse</summary>

```powershell
# MX
Add-DnsServerResourceRecordMX -ZoneName "ofppt.local" -Name "." -MailExchange "mail.ofppt.local" -Priority 10

# CNAME
Add-DnsServerResourceRecordCName -ZoneName "ofppt.local" -Name "ftp" -HostNameAlias "filesrv.ofppt.local"

# NS
Add-DnsServerResourceRecord -ZoneName "ofppt.local" -Name "." -NS -NameServer "ns1.ofppt.local"
```

</details>

---

**4. Creer la zone inversee et les enregistrements PTR.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DnsServerPrimaryZone -NetworkId "192.168.10.0/24" -ReplicationScope Domain -DynamicUpdate Secure

Add-DnsServerResourceRecordPtr -Name "1"  -ZoneName "10.168.192.in-addr.arpa" -PtrDomainName "ns1.ofppt.local"
Add-DnsServerResourceRecordPtr -Name "2"  -ZoneName "10.168.192.in-addr.arpa" -PtrDomainName "www.ofppt.local"
Add-DnsServerResourceRecordPtr -Name "5"  -ZoneName "10.168.192.in-addr.arpa" -PtrDomainName "mail.ofppt.local"
Add-DnsServerResourceRecordPtr -Name "50" -ZoneName "10.168.192.in-addr.arpa" -PtrDomainName "filesrv.ofppt.local"
```

</details>

---

**5. Modifier le SOA : responsable `admin.ofppt.local`, refresh 15 min.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-DnsServerPrimaryZone `
    -Name "ofppt.local" `
    -ResponsiblePerson "admin.ofppt.local" `
    -RefreshInterval 00:15:00 `
    -RetryDelay 00:10:00
```

</details>

---

**6. Verifier l ensemble des enregistrements.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Zone directe
Get-DnsServerResourceRecord -ZoneName "ofppt.local" | Format-Table -AutoSize

# Zone inversee
Get-DnsServerResourceRecord -ZoneName "10.168.192.in-addr.arpa" -RRType PTR
```

</details>

---

**7. Tester la resolution directe et inverse depuis PowerShell.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Resolution directe
Resolve-DnsName -Name "www.ofppt.local"
Resolve-DnsName -Name "mail.ofppt.local"
Resolve-DnsName -Name "ftp.ofppt.local"

# Resolution inverse
Resolve-DnsName -Name "192.168.10.50"
Resolve-DnsName -Name "192.168.10.2"

# MX
Resolve-DnsName -Name "ofppt.local" -Type MX
```

</details>

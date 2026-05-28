---
id: tp-dhcp
title: DHCP Windows Server
---

# TP - DHCP Windows Server

6 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Installation et Autorisation (Facile)

**Objectif :** Installer le role DHCP et l autoriser dans Active Directory.

---

**1. Installer le role DHCP avec les outils de gestion.**

<details>
<summary>Voir la reponse</summary>

```powershell
Install-WindowsFeature -Name DHCP -IncludeManagementTools
```

</details>

---

**2. Verifier que le role DHCP est bien installe.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-WindowsFeature -Name DHCP
```

</details>

---

**3. Autoriser le serveur DHCP dans Active Directory.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DhcpServerInDC -DnsName "srv-dhcp.ofppt.local" -IPAddress 192.168.1.10
```

</details>

---

**4. Verifier que le serveur est bien autorise.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DhcpServerInDC
```

</details>

---

**5. Verifier que le service DHCP est en cours d execution.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Service -Name "DHCPServer"
```

</details>

---

## TP n°2 - Etendues IPv4 (Facile-Moyen)

**Objectif :** Creer et configurer une etendue DHCP IPv4.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Reseau | `192.168.1.0/24` |
| Plage | `192.168.1.100` a `192.168.1.200` |
| Passerelle | `192.168.1.1` |
| DNS | `192.168.1.10`, `8.8.8.8` |
| Domaine DNS | `ofppt.local` |
| Duree du bail | 1 jour |

---

**1. Creer l etendue DHCP IPv4.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DhcpServerv4Scope `
    -Name "LAN Principal" `
    -StartRange 192.168.1.100 `
    -EndRange 192.168.1.200 `
    -SubnetMask 255.255.255.0 `
    -State Active `
    -LeaseDuration 1.00:00:00
```

</details>

---

**2. Configurer les options DHCP (passerelle, DNS, domaine).**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-DhcpServerv4OptionValue `
    -ScopeId 192.168.1.0 `
    -Router 192.168.1.1 `
    -DnsServer 192.168.1.10, 8.8.8.8 `
    -DnsDomain "ofppt.local"
```

</details>

---

**3. Exclure la plage `192.168.1.1` a `192.168.1.99` (adresses des equipements fixes).**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DhcpServerv4ExclusionRange `
    -ScopeId 192.168.1.0 `
    -StartRange 192.168.1.1 `
    -EndRange 192.168.1.99
```

</details>

---

**4. Verifier la configuration de l etendue.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DhcpServerv4Scope
Get-DhcpServerv4OptionValue -ScopeId 192.168.1.0
```

</details>

---

**5. Creer une reservation IP pour une imprimante avec l adresse MAC `AA-BB-CC-DD-EE-FF` a l IP `192.168.1.150`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DhcpServerv4Reservation `
    -ScopeId 192.168.1.0 `
    -IPAddress 192.168.1.150 `
    -ClientId "AA-BB-CC-DD-EE-FF" `
    -Description "Imprimante Salle Serveurs"
```

</details>

---

**6. Lister tous les baux actifs de l etendue.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DhcpServerv4Lease -ScopeId 192.168.1.0 | Format-Table
```

</details>

---

**7. Modifier la duree du bail a 8 heures et renommer l etendue en `LAN-Bureau`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-DhcpServerv4Scope -ScopeId 192.168.1.0 -Name "LAN-Bureau" -LeaseDuration 0.08:00:00
```

</details>

---

## TP n°3 - Options avec OptionId et Delai (Moyen)

**Objectif :** Configurer les options avancees avec OptionId et le delai de reponse.

**Contexte :** Deux serveurs DHCP pour la meme etendue `192.168.117.0/24`.

---

**1. Configurer l Option 3 (passerelle) via OptionId sur le serveur `Serv-DC1.hassania.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-DhcpServerv4OptionValue `
    -OptionId 3 `
    -Value 192.168.117.1 `
    -ScopeId 192.168.117.0 `
    -ComputerName Serv-DC1.hassania.local
```

</details>

---

**2. Configurer l Option 6 (DNS) avec deux serveurs.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-DhcpServerv4OptionValue `
    -OptionId 6 `
    -Value 192.168.117.10, 8.8.8.8 `
    -ScopeId 192.168.117.0 `
    -ComputerName Serv-DC1.hassania.local
```

</details>

---

**3. Configurer l Option 15 (nom de domaine DNS).**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-DhcpServerv4OptionValue `
    -OptionId 15 `
    -Value "hassania.local" `
    -ScopeId 192.168.117.0 `
    -ComputerName Serv-DC1.hassania.local
```

</details>

---

**4. Configurer le serveur principal avec un delai de 0 ms.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-DhcpServerv4Scope -ScopeId 192.168.117.0 -Delay 0
```

</details>

---

**5. Configurer le serveur backup avec un delai de 300 ms.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Sur le serveur backup
Set-DhcpServerv4Scope -ScopeId 192.168.117.0 -Delay 300
```

</details>

---

**6. Expliquer le role du parametre `-Delay`.**

<details>
<summary>Voir la reponse</summary>

Le parametre `-Delay` definit le temps d attente avant que le serveur reponde a une requete DHCP DISCOVER.

| Valeur | Role |
|---|---|
| `0` | Repond immediatement - serveur **principal** |
| `300` | Attend 300 ms avant de repondre - serveur **backup** |

Si le serveur principal est disponible, il repond en premier. Le serveur backup sert de secours si le principal ne repond pas dans le delai.

</details>

---

**7. Supprimer la reservation de l imprimante, puis supprimer l etendue entiere.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Supprimer la reservation
Remove-DhcpServerv4Reservation -ScopeId 192.168.117.0 -IPAddress 192.168.117.150

# Supprimer l etendue
Remove-DhcpServerv4Scope -ScopeId 192.168.117.0 -Force
```

</details>

---

## TP n°4 - Agents de Relais DHCP (Moyen-Difficile)

**Objectif :** Configurer un agent de relais pour distribuer des adresses DHCP sur plusieurs sous-reseaux.

**Contexte :**
- Serveur DHCP : `192.168.1.1` (sous-reseau A)
- Sous-reseau B : `192.168.2.0/24`, routeur `192.168.2.1`

---

**1. Ajouter un agent de relais DHCP IPv4 sur le routeur du sous-reseau B.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DhcpServerv4RelayAgent -IPAddress 192.168.2.1 -Server 192.168.1.1
```

</details>

---

**2. Verifier que l agent de relais est configure.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DhcpServerv4RelayAgent | Format-Table
```

</details>

---

**3. Creer une deuxieme etendue pour le sous-reseau B.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DhcpServerv4Scope `
    -Name "Sous-reseau B" `
    -StartRange 192.168.2.100 `
    -EndRange 192.168.2.200 `
    -SubnetMask 255.255.255.0 `
    -State Active

Set-DhcpServerv4OptionValue `
    -ScopeId 192.168.2.0 `
    -Router 192.168.2.1 `
    -DnsServer 192.168.1.10 `
    -DnsDomain "ofppt.local"
```

</details>

---

**4. Supprimer l agent de relais.**

<details>
<summary>Voir la reponse</summary>

```powershell
Remove-DhcpServerv4RelayAgent -IPAddress 192.168.2.1
```

</details>

---

## TP n°5 - Scenario Reel Complet (Difficile)

**Objectif :** Deployer un serveur DHCP complet pour l entreprise `OFPPT` avec deux etendues.

**Contexte :**

| Etendue | Reseau | Plage | Passerelle | Duree |
|---|---|---|---|---|
| Etendue-LAN1 | `192.168.10.0/24` | `.100` a `.200` | `192.168.10.1` | 1 jour |
| Etendue-LAN2 | `192.168.20.0/24` | `.50` a `.150` | `192.168.20.1` | 8h |

DNS pour les deux : `192.168.10.10`, `8.8.8.8`
Domaine DNS : `ofppt.local`

---

**1. Creer les deux etendues.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DhcpServerv4Scope `
    -Name "Etendue-LAN1" `
    -StartRange 192.168.10.100 `
    -EndRange 192.168.10.200 `
    -SubnetMask 255.255.255.0 `
    -State Active `
    -LeaseDuration 1.00:00:00

Add-DhcpServerv4Scope `
    -Name "Etendue-LAN2" `
    -StartRange 192.168.20.50 `
    -EndRange 192.168.20.150 `
    -SubnetMask 255.255.255.0 `
    -State Active `
    -LeaseDuration 0.08:00:00
```

</details>

---

**2. Configurer les options pour chaque etendue.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-DhcpServerv4OptionValue -ScopeId 192.168.10.0 -Router 192.168.10.1 -DnsServer 192.168.10.10, 8.8.8.8 -DnsDomain "ofppt.local"
Set-DhcpServerv4OptionValue -ScopeId 192.168.20.0 -Router 192.168.20.1 -DnsServer 192.168.10.10, 8.8.8.8 -DnsDomain "ofppt.local"
```

</details>

---

**3. Creer deux reservations : une imprimante et un serveur.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Imprimante sur LAN1
Add-DhcpServerv4Reservation -ScopeId 192.168.10.0 -IPAddress 192.168.10.50 -ClientId "11-22-33-44-55-66" -Description "Imprimante LAN1"

# Serveur sur LAN2
Add-DhcpServerv4Reservation -ScopeId 192.168.20.0 -IPAddress 192.168.20.50 -ClientId "AA-BB-CC-11-22-33" -Description "Serveur Impression"
```

</details>

---

**4. Lister toutes les etendues et leurs options.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DhcpServerv4Scope
Get-DhcpServerv4OptionValue -ScopeId 192.168.10.0
Get-DhcpServerv4OptionValue -ScopeId 192.168.20.0
```

</details>

---

**5. Exporter la configuration DHCP complete.**

<details>
<summary>Voir la reponse</summary>

```powershell
Export-DhcpServer -File "C:\Backup-DHCP.xml" -Leases
```

</details>

---

**6. Verifier les baux actifs sur les deux etendues.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DhcpServerv4Lease -ScopeId 192.168.10.0 | Format-Table
Get-DhcpServerv4Lease -ScopeId 192.168.20.0 | Format-Table
```

</details>

---

**7. Desactiver temporairement l etendue LAN2 puis la supprimer.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Desactiver
Set-DhcpServerv4Scope -ScopeId 192.168.20.0 -State Inactive

# Supprimer
Remove-DhcpServerv4Scope -ScopeId 192.168.20.0 -Force
```

</details>

---
id: tp-configuration-de-base
title: Configuration de Base Win Server
---

# TP - Configuration de Base Windows Server

6 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Configuration Reseau (Facile)

**Objectif :** Configurer l adresse IP, le masque, la passerelle et le DNS du serveur.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Adresse IP | `192.168.1.10` |
| Masque | `255.255.255.0` |
| Passerelle | `192.168.1.1` |
| DNS Principal | `192.168.1.10` |
| DNS Secondaire | `8.8.8.8` |

---

**1. Afficher les interfaces reseau disponibles sur le serveur.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-NetIPInterface
```

</details>

---

**2. Attribuer l adresse IP statique a l interface `Ethernet0`.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-NetIPAddress `
    -InterfaceAlias "Ethernet0" `
    -IPAddress 192.168.1.10 `
    -PrefixLength 24 `
    -DefaultGateway 192.168.1.1
```

</details>

---

**3. Configurer les serveurs DNS.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-DnsClientServerAddress `
    -InterfaceAlias "Ethernet0" `
    -ServerAddresses 192.168.1.10, 8.8.8.8
```

</details>

---

**4. Verifier la configuration IP appliquee.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-NetIPAddress -InterfaceAlias "Ethernet0"
Get-DnsClientServerAddress -InterfaceAlias "Ethernet0"
```

</details>

---

**5. Tester la connectivite vers la passerelle.**

<details>
<summary>Voir la reponse</summary>

```powershell
Test-Connection -ComputerName 192.168.1.1 -Count 3
```

</details>

---

**6. Renommer le serveur en `SRV-AD01`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Rename-Computer -NewName "SRV-AD01" -Restart
```

</details>

---

**7. Apres redemarrage, verifier le nom du serveur.**

<details>
<summary>Voir la reponse</summary>

```powershell
$env:COMPUTERNAME
# ou
hostname
```

</details>

---

## TP n°2 - Jonction au Domaine (Moyen)

**Objectif :** Joindre un serveur membre a un domaine Active Directory existant.

**Contexte :** Domaine `ofppt.local`, Controleur de domaine `SRV-DC01` a `192.168.1.10`.

---

**1. Verifier que le serveur peut resoudre le domaine `ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Resolve-DnsName -Name "ofppt.local"
```

</details>

---

**2. Joindre le serveur au domaine `ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-Computer `
    -DomainName "ofppt.local" `
    -Credential (Get-Credential "OFPPT\Administrator") `
    -Restart
```

</details>

---

**3. Apres redemarrage, verifier que le serveur est bien membre du domaine.**

<details>
<summary>Voir la reponse</summary>

```powershell
(Get-WmiObject Win32_ComputerSystem).Domain
# ou
Get-ADComputer -Identity $env:COMPUTERNAME
```

</details>

---

**4. Placer ce serveur dans l OU `Ordinateurs` du domaine.**

<details>
<summary>Voir la reponse</summary>

```powershell
Move-ADObject `
    -Identity "CN=SRV-AD01,CN=Computers,DC=ofppt,DC=local" `
    -TargetPath "OU=Ordinateurs,DC=ofppt,DC=local"
```

</details>

---

**5. Quitter le domaine et revenir en groupe de travail `WORKGROUP`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Remove-Computer `
    -WorkgroupName "WORKGROUP" `
    -Credential (Get-Credential "OFPPT\Administrator") `
    -Restart -Force
```

</details>

---

## TP n°3 - Installation de Roles (Moyen)

**Objectif :** Installer et verifier des roles Windows Server avec PowerShell.

---

**1. Lister tous les roles disponibles sur le serveur.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-WindowsFeature | Where-Object {$_.InstallState -eq "Available"} | Select-Object Name, DisplayName
```

</details>

---

**2. Lister tous les roles deja installes.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-WindowsFeature | Where-Object {$_.InstallState -eq "Installed"} | Select-Object Name, DisplayName
```

</details>

---

**3. Installer le role DHCP avec les outils de gestion.**

<details>
<summary>Voir la reponse</summary>

```powershell
Install-WindowsFeature -Name DHCP -IncludeManagementTools
```

</details>

---

**4. Installer le role DNS avec les outils de gestion.**

<details>
<summary>Voir la reponse</summary>

```powershell
Install-WindowsFeature -Name DNS -IncludeManagementTools
```

</details>

---

**5. Installer le role IIS (serveur web).**

<details>
<summary>Voir la reponse</summary>

```powershell
Install-WindowsFeature -Name Web-Server -IncludeManagementTools
```

</details>

---

**6. Desinstaller le role IIS.**

<details>
<summary>Voir la reponse</summary>

```powershell
Uninstall-WindowsFeature -Name Web-Server -Remove
```

</details>

---

**7. Installer AD DS et promouvoir en controleur de domaine pour une nouvelle foret `ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools

Install-ADDSForest `
    -DomainName "ofppt.local" `
    -DomainNetbiosName "OFPPT" `
    -ForestMode 2022 `
    -DomainMode 2022 `
    -InstallDns `
    -SafeModeAdministratorPassword (ConvertTo-SecureString "Pass123!" -AsPlainText -Force)
```

</details>

---

## TP n°4 - Scenario Reel : Deploiement d un Serveur (Difficile)

**Objectif :** Configurer un serveur Windows Server de A a Z pour rejoindre un domaine existant.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Nom du serveur | `SRV-DHCP01` |
| IP | `192.168.10.5` |
| Masque | `255.255.255.0` |
| Passerelle | `192.168.10.1` |
| DNS | `192.168.10.10` |
| Domaine | `ofppt.local` |
| Role a installer | DHCP |

---

**1. Configurer l adresse IP statique.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-NetIPAddress `
    -InterfaceAlias "Ethernet0" `
    -IPAddress 192.168.10.5 `
    -PrefixLength 24 `
    -DefaultGateway 192.168.10.1

Set-DnsClientServerAddress `
    -InterfaceAlias "Ethernet0" `
    -ServerAddresses 192.168.10.10
```

</details>

---

**2. Renommer le serveur en `SRV-DHCP01` et redemarrer.**

<details>
<summary>Voir la reponse</summary>

```powershell
Rename-Computer -NewName "SRV-DHCP01" -Restart
```

</details>

---

**3. Joindre le serveur au domaine `ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-Computer `
    -DomainName "ofppt.local" `
    -Credential (Get-Credential "OFPPT\Administrator") `
    -Restart
```

</details>

---

**4. Installer le role DHCP.**

<details>
<summary>Voir la reponse</summary>

```powershell
Install-WindowsFeature -Name DHCP -IncludeManagementTools
```

</details>

---

**5. Autoriser le serveur DHCP dans Active Directory.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-DhcpServerInDC -DnsName "SRV-DHCP01.ofppt.local" -IPAddress 192.168.10.5
```

</details>

---

**6. Verifier que le serveur DHCP est bien autorise dans AD.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-DhcpServerInDC
```

</details>

---

**7. Verifier l etat global du serveur : nom, domaine, IP, roles installes.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Nom et domaine
Write-Host "Nom : $env:COMPUTERNAME"
Write-Host "Domaine : $((Get-WmiObject Win32_ComputerSystem).Domain)"

# Configuration IP
Get-NetIPAddress -InterfaceAlias "Ethernet0" | Select-Object IPAddress, PrefixLength

# Roles installes
Get-WindowsFeature | Where-Object {$_.InstallState -eq "Installed"} | Select-Object Name
```

</details>

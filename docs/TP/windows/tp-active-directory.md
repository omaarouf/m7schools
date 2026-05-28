---
id: tp-active-directory
title: Active Directory
---

# TP - Active Directory

7 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Installation AD DS (Facile)

**Objectif :** Installer le role Active Directory Domain Services et promouvoir le serveur en controleur de domaine.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Nom du domaine | `ofppt.local` |
| NetBIOS | `OFPPT` |
| Niveau fonctionnel | 2022 |
| IP du serveur | `192.168.1.10` |

---

**1. Verifier si le role AD DS est deja installe.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-WindowsFeature -Name AD-Domain-Services
```

Le statut `Installed` indique que le role est deja present.

</details>

---

**2. Installer le role AD DS avec les outils de gestion.**

<details>
<summary>Voir la reponse</summary>

```powershell
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools
```

</details>

---

**3. Promouvoir le serveur en controleur de domaine pour une nouvelle foret `ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
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

**4. Verifier que le domaine est correctement configure apres redemarrage.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ADDomain
Get-ADForest
```

</details>

---

**5. Creer trois unites d'organisation : `Utilisateurs`, `Groupes`, `Ordinateurs`.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-ADOrganizationalUnit -Name "Utilisateurs" -Path "DC=ofppt,DC=local"
New-ADOrganizationalUnit -Name "Groupes"      -Path "DC=ofppt,DC=local"
New-ADOrganizationalUnit -Name "Ordinateurs"  -Path "DC=ofppt,DC=local"
```

</details>

---

**6. Lister toutes les OU du domaine.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ADOrganizationalUnit -Filter * | Select-Object Name, DistinguishedName
```

</details>

---

**7. Verifier que le service AD DS est actif.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Service -Name "NTDS"
Get-Service -Name "DNS"
```

Les deux services doivent etre en etat `Running`.

</details>

---

## TP n°2 - Commandes DS en CMD (Facile-Moyen)

**Objectif :** Creer et gerer des objets AD avec les commandes DS depuis l invite de commandes.

**Contexte :** Domaine `ofppt.local`, OU `NTIC` deja creee.

---

**1. Creer l unite d'organisation `NTIC` dans le domaine.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsadd ou "OU=NTIC,DC=ofppt,DC=local"
```

</details>

---

**2. Creer l utilisateur `ali` dans l OU `NTIC` avec le mot de passe `Passw0rd`, sans forcer le changement.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsadd user "CN=ali,OU=NTIC,DC=ofppt,DC=local" -samid ali -upn ali@ofppt.local -pwd Passw0rd -mustchpwd no
```

</details>

---

**3. Creer un groupe de securite global `Equipe_NTIC` dans l OU `NTIC`.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsadd group "CN=Equipe_NTIC,OU=NTIC,DC=ofppt,DC=local" -secgrp yes -scope g
```

</details>

---

**4. Ajouter l utilisateur `ali` au groupe `Equipe_NTIC`.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsmod group "CN=Equipe_NTIC,OU=NTIC,DC=ofppt,DC=local" -addmbr "CN=ali,OU=NTIC,DC=ofppt,DC=local"
```

</details>

---

**5. Afficher les membres du groupe `Equipe_NTIC`.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsget group "CN=Equipe_NTIC,OU=NTIC,DC=ofppt,DC=local" -members
```

</details>

---

**6. Desactiver le compte de l utilisateur `ali`.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsmod user "CN=ali,OU=NTIC,DC=ofppt,DC=local" -disabled yes
```

</details>

---

**7. Rechercher tous les utilisateurs dont le nom commence par `a`.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsquery user -name "a*"
```

</details>

---

## TP n°3 - DSMOVE, CSVDE et LDIFDE (Moyen)

**Objectif :** Deplacer des objets AD et realiser des exports/imports en masse.

---

**1. Creer une OU `Direction` et y deplacer l utilisateur `ali` depuis l OU `NTIC`.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsadd ou "OU=Direction,DC=ofppt,DC=local"
dsmove "CN=ali,OU=NTIC,DC=ofppt,DC=local" -newparent "OU=Direction,DC=ofppt,DC=local"
```

</details>

---

**2. Renommer l utilisateur `ali` en `Ali Benali` sans changer d OU.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsmove "CN=ali,OU=Direction,DC=ofppt,DC=local" -newname "Ali Benali"
```

</details>

---

**3. Deplacer ET renommer en une seule commande : ramener `Ali Benali` dans `NTIC` et le renommer `ali`.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsmove "CN=Ali Benali,OU=Direction,DC=ofppt,DC=local" -newparent "OU=NTIC,DC=ofppt,DC=local" -newname "ali"
```

</details>

---

**4. Exporter tous les utilisateurs de l OU `NTIC` dans un fichier CSV.**

<details>
<summary>Voir la reponse</summary>

```cmd
csvde -f "C:\Export_NTIC.csv" -d "OU=NTIC,DC=ofppt,DC=local" -p subtree -r "(objectClass=user)"
```

</details>

---

**5. Exporter uniquement les attributs `cn`, `sAMAccountName` et `mail` de tous les utilisateurs du domaine.**

<details>
<summary>Voir la reponse</summary>

```cmd
csvde -f "C:\Export_Filtre.csv" -l "cn,sAMAccountName,mail" -d "DC=ofppt,DC=local" -p subtree -r "(objectClass=user)"
```

</details>

---

**6. Expliquer la difference entre CSVDE et LDIFDE.**

<details>
<summary>Voir la reponse</summary>

| Critere | CSVDE | LDIFDE |
|---|---|---|
| Format | CSV (tableur) | LDIF (LDAP Data Interchange Format) |
| Modification | Import uniquement (pas de modification) | Import ET modification (`changetype: modify`) |
| Lisibilite | Facile pour un tableur | Lisible mais plus verbeux |
| Cas d usage | Creation en masse simple | Migrations complexes, modifications d attributs |

</details>

---

**7. Exporter le domaine entier au format LDIF.**

<details>
<summary>Voir la reponse</summary>

```cmd
ldifde -f "C:\Export_Domaine.ldf" -d "DC=ofppt,DC=local"
```

</details>

---

## TP n°4 - Gestion des Utilisateurs avec PowerShell (Moyen)

**Objectif :** Creer, modifier et rechercher des utilisateurs AD avec PowerShell.

**Contexte :**
| Utilisateur | SamAccount | Departement | Titre |
|---|---|---|---|
| Karim Alami | `kalami` | IT | Technicien |
| Sara Idrissi | `sidrissi` | RH | Responsable RH |
| Omar Benali | `obenali` | IT | Developpeur |

---

**1. Creer les trois utilisateurs dans l OU `OU=Utilisateurs,DC=ofppt,DC=local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
$Password = ConvertTo-SecureString "TempPass123!" -AsPlainText -Force

New-ADUser -Name "Karim Alami"  -SamAccountName "kalami"  -UserPrincipalName "kalami@ofppt.local"  -Department "IT" -Title "Technicien"    -Path "OU=Utilisateurs,DC=ofppt,DC=local" -AccountPassword $Password -Enabled $true -ChangePasswordAtLogon $true
New-ADUser -Name "Sara Idrissi" -SamAccountName "sidrissi" -UserPrincipalName "sidrissi@ofppt.local" -Department "RH" -Title "Responsable RH" -Path "OU=Utilisateurs,DC=ofppt,DC=local" -AccountPassword $Password -Enabled $true -ChangePasswordAtLogon $true
New-ADUser -Name "Omar Benali"  -SamAccountName "obenali"  -UserPrincipalName "obenali@ofppt.local"  -Department "IT" -Title "Developpeur"    -Path "OU=Utilisateurs,DC=ofppt,DC=local" -AccountPassword $Password -Enabled $true -ChangePasswordAtLogon $true
```

</details>

---

**2. Afficher tous les utilisateurs du departement IT.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ADUser -Filter {Department -eq "IT"} -SearchBase "OU=Utilisateurs,DC=ofppt,DC=local" -Properties Department, Title
```

</details>

---

**3. Modifier le titre de `kalami` en `Senior Technicien` et son departement en `Infrastructure`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-ADUser -Identity "kalami" -Title "Senior Technicien" -Department "Infrastructure"
```

</details>

---

**4. Reinitialiser le mot de passe de `sidrissi` sans forcer le changement.**

<details>
<summary>Voir la reponse</summary>

```powershell
$NewPwd = ConvertTo-SecureString "NewPass456!" -AsPlainText -Force
Set-ADAccountPassword -Identity "sidrissi" -NewPassword $NewPwd -Reset
Set-ADUser -Identity "sidrissi" -ChangePasswordAtLogon $false
```

</details>

---

**5. Desactiver le compte `obenali`, puis le reactivier.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Desactiver
Disable-ADAccount -Identity "obenali"

# Verifier
Get-ADUser -Identity "obenali" -Properties Enabled | Select-Object Name, Enabled

# Reactivier
Enable-ADAccount -Identity "obenali"
```

</details>

---

**6. Afficher tous les utilisateurs inactifs depuis 30 jours.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ADUser -Filter {LastLogonDate -lt (Get-Date).AddDays(-30)} -Properties LastLogonDate | Select-Object Name, LastLogonDate
```

</details>

---

**7. Deverrouiller tous les comptes bloques dans l OU `Utilisateurs`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ADUser -Filter {LockedOut -eq $true} -SearchBase "OU=Utilisateurs,DC=ofppt,DC=local" | Unlock-ADAccount
```

</details>

---

## TP n°5 - Gestion des Groupes et Membres (Moyen)

**Objectif :** Creer des groupes AD et gerer les membres avec PowerShell.

---

**1. Creer deux groupes de securite globaux : `GRP-IT` et `GRP-RH` dans l OU `Groupes`.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-ADGroup -Name "GRP-IT" -GroupScope Global -GroupCategory Security -Path "OU=Groupes,DC=ofppt,DC=local" -Description "Equipe IT"
New-ADGroup -Name "GRP-RH" -GroupScope Global -GroupCategory Security -Path "OU=Groupes,DC=ofppt,DC=local" -Description "Equipe RH"
```

</details>

---

**2. Ajouter `kalami` et `obenali` dans `GRP-IT`, et `sidrissi` dans `GRP-RH`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-ADGroupMember -Identity "GRP-IT" -Members "kalami", "obenali"
Add-ADGroupMember -Identity "GRP-RH" -Members "sidrissi"
```

</details>

---

**3. Verifier les membres de chaque groupe.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ADGroupMember -Identity "GRP-IT"  | Select-Object Name, SamAccountName
Get-ADGroupMember -Identity "GRP-RH"  | Select-Object Name, SamAccountName
```

</details>

---

**4. Ajouter tous les utilisateurs du departement IT au groupe `GRP-IT` via pipeline.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ADUser -Filter {Department -eq "IT"} | Add-ADGroupMember -Identity "GRP-IT"
```

</details>

---

**5. Deplacer tous les utilisateurs du departement RH vers l OU `OU=RH,DC=ofppt,DC=local` (creer l OU si besoin).**

<details>
<summary>Voir la reponse</summary>

```powershell
# Creer l OU si elle n existe pas
New-ADOrganizationalUnit -Name "RH" -Path "DC=ofppt,DC=local"

# Deplacer les utilisateurs
Get-ADUser -Filter {Department -eq "RH"} | Move-ADObject -TargetPath "OU=RH,DC=ofppt,DC=local"
```

</details>

---

**6. Creer un groupe universel `GRP-TOUT` et y ajouter les groupes `GRP-IT` et `GRP-RH` (imbrication).**

<details>
<summary>Voir la reponse</summary>

```powershell
New-ADGroup -Name "GRP-TOUT" -GroupScope Universal -GroupCategory Security -Path "OU=Groupes,DC=ofppt,DC=local"
Add-ADGroupMember -Identity "GRP-TOUT" -Members "GRP-IT", "GRP-RH"
```

</details>

---

**7. Lister tous les groupes dont `kalami` est membre.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ADUser -Identity "kalami" -Properties MemberOf | Select-Object -ExpandProperty MemberOf
```

</details>

---

## TP n°6 - Scenario Examen : Entreprise DETIC (Moyen-Difficile)

**Objectif :** Configurer une structure AD complete pour l entreprise `DETIC`.

**Contexte :**

| Element | Valeur |
|---|---|
| Domaine | `detic.ma` |
| OU principale | `DETIC` |
| Sous-OU | `Informatique`, `Commercial`, `Direction` |
| Groupe IT | `GRP-Info` (global, securite) |
| Groupe COM | `GRP-Com` (global, securite) |

Utilisateurs a creer :

| Nom | SamAccount | OU | Groupe |
|---|---|---|---|
| Youssef Alami | `yalami` | Informatique | GRP-Info |
| Fatima Zahra | `fzahra` | Commercial | GRP-Com |
| Hassan Bennis | `hbennis` | Direction | - |

---

**1. Creer la structure OU complete.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-ADOrganizationalUnit -Name "DETIC"         -Path "DC=detic,DC=ma"
New-ADOrganizationalUnit -Name "Informatique"  -Path "OU=DETIC,DC=detic,DC=ma"
New-ADOrganizationalUnit -Name "Commercial"    -Path "OU=DETIC,DC=detic,DC=ma"
New-ADOrganizationalUnit -Name "Direction"     -Path "OU=DETIC,DC=detic,DC=ma"
```

</details>

---

**2. Creer les deux groupes de securite dans l OU `DETIC`.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-ADGroup -Name "GRP-Info" -GroupScope Global -GroupCategory Security -Path "OU=DETIC,DC=detic,DC=ma"
New-ADGroup -Name "GRP-Com"  -GroupScope Global -GroupCategory Security -Path "OU=DETIC,DC=detic,DC=ma"
```

</details>

---

**3. Creer les trois utilisateurs dans leurs OU respectives.**

<details>
<summary>Voir la reponse</summary>

```powershell
$pwd = ConvertTo-SecureString "Detic2024!" -AsPlainText -Force

New-ADUser -Name "Youssef Alami"  -SamAccountName "yalami"  -UserPrincipalName "yalami@detic.ma"  -Path "OU=Informatique,OU=DETIC,DC=detic,DC=ma" -AccountPassword $pwd -Enabled $true
New-ADUser -Name "Fatima Zahra"   -SamAccountName "fzahra"  -UserPrincipalName "fzahra@detic.ma"  -Path "OU=Commercial,OU=DETIC,DC=detic,DC=ma"  -AccountPassword $pwd -Enabled $true
New-ADUser -Name "Hassan Bennis"  -SamAccountName "hbennis" -UserPrincipalName "hbennis@detic.ma" -Path "OU=Direction,OU=DETIC,DC=detic,DC=ma"   -AccountPassword $pwd -Enabled $true
```

</details>

---

**4. Ajouter les utilisateurs dans leurs groupes respectifs.**

<details>
<summary>Voir la reponse</summary>

```powershell
Add-ADGroupMember -Identity "GRP-Info" -Members "yalami"
Add-ADGroupMember -Identity "GRP-Com"  -Members "fzahra"
```

</details>

---

**5. Ajouter via CMD : creer un utilisateur `mboulal` dans `Informatique` et l ajouter a `GRP-Info`.**

<details>
<summary>Voir la reponse</summary>

```cmd
dsadd user "CN=mboulal,OU=Informatique,OU=DETIC,DC=detic,DC=ma" -samid mboulal -upn mboulal@detic.ma -pwd Detic2024! -mustchpwd no
dsmod group "CN=GRP-Info,OU=DETIC,DC=detic,DC=ma" -addmbr "CN=mboulal,OU=Informatique,OU=DETIC,DC=detic,DC=ma"
```

</details>

---

**6. Exporter tous les utilisateurs de l OU `DETIC` en CSV.**

<details>
<summary>Voir la reponse</summary>

```cmd
csvde -f "C:\DETIC_Users.csv" -d "OU=DETIC,DC=detic,DC=ma" -p subtree -r "(objectClass=user)" -l "cn,sAMAccountName,mail,department"
```

</details>

---

**7. Verifier la structure complete de l OU `DETIC`.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Lister toutes les OU sous DETIC
Get-ADOrganizationalUnit -Filter * -SearchBase "OU=DETIC,DC=detic,DC=ma" | Select-Object Name, DistinguishedName

# Lister tous les utilisateurs de DETIC
Get-ADUser -Filter * -SearchBase "OU=DETIC,DC=detic,DC=ma" | Select-Object Name, SamAccountName

# Verifier les membres des groupes
Get-ADGroupMember -Identity "GRP-Info" | Select-Object Name
Get-ADGroupMember -Identity "GRP-Com"  | Select-Object Name
```

</details>

---

## TP n°7 - Scenario Reel Complet (Difficile)

**Objectif :** Deployer une structure AD complete avec plusieurs departements, politiques et gestion avancee.

**Contexte :** Tu es administrateur systeme de l entreprise `OFPPT`. Tu dois configurer le domaine `ofppt.local` a partir de zero.

**Structure requise :**

```
DC=ofppt,DC=local
├── OU=OFPPT
│   ├── OU=IT
│   ├── OU=RH
│   ├── OU=Stagiaires
│   └── OU=Inactifs
```

**Utilisateurs :**

| Nom | SamAccount | OU | Groupe | Poste |
|---|---|---|---|---|
| Ahmed Karimi | `akarimi` | IT | GRP-IT | Admin Systeme |
| Nadia Fassi | `nfassi` | IT | GRP-IT | Developpeur |
| Laila Tahiri | `ltahiri` | RH | GRP-RH | Responsable RH |
| Khalid Mouti | `kmouti` | Stagiaires | GRP-Stagiaires | Stagiaire |

---

**1. Creer toute la structure OU.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-ADOrganizationalUnit -Name "OFPPT"      -Path "DC=ofppt,DC=local"
New-ADOrganizationalUnit -Name "IT"         -Path "OU=OFPPT,DC=ofppt,DC=local"
New-ADOrganizationalUnit -Name "RH"         -Path "OU=OFPPT,DC=ofppt,DC=local"
New-ADOrganizationalUnit -Name "Stagiaires" -Path "OU=OFPPT,DC=ofppt,DC=local"
New-ADOrganizationalUnit -Name "Inactifs"   -Path "OU=OFPPT,DC=ofppt,DC=local"
```

</details>

---

**2. Creer les groupes de securite.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-ADGroup -Name "GRP-IT"         -GroupScope Global -GroupCategory Security -Path "OU=OFPPT,DC=ofppt,DC=local"
New-ADGroup -Name "GRP-RH"         -GroupScope Global -GroupCategory Security -Path "OU=OFPPT,DC=ofppt,DC=local"
New-ADGroup -Name "GRP-Stagiaires" -GroupScope Global -GroupCategory Security -Path "OU=OFPPT,DC=ofppt,DC=local"
```

</details>

---

**3. Creer tous les utilisateurs avec leurs parametres.**

<details>
<summary>Voir la reponse</summary>

```powershell
$pwd = ConvertTo-SecureString "Ofppt2024!" -AsPlainText -Force

New-ADUser -Name "Ahmed Karimi" -SamAccountName "akarimi" -UserPrincipalName "akarimi@ofppt.local" -Title "Admin Systeme"   -Department "IT"        -Path "OU=IT,OU=OFPPT,DC=ofppt,DC=local"         -AccountPassword $pwd -Enabled $true -ChangePasswordAtLogon $true
New-ADUser -Name "Nadia Fassi"  -SamAccountName "nfassi"  -UserPrincipalName "nfassi@ofppt.local"  -Title "Developpeur"     -Department "IT"        -Path "OU=IT,OU=OFPPT,DC=ofppt,DC=local"         -AccountPassword $pwd -Enabled $true -ChangePasswordAtLogon $true
New-ADUser -Name "Laila Tahiri" -SamAccountName "ltahiri" -UserPrincipalName "ltahiri@ofppt.local" -Title "Responsable RH"  -Department "RH"        -Path "OU=RH,OU=OFPPT,DC=ofppt,DC=local"         -AccountPassword $pwd -Enabled $true -ChangePasswordAtLogon $true
New-ADUser -Name "Khalid Mouti" -SamAccountName "kmouti"  -UserPrincipalName "kmouti@ofppt.local"  -Title "Stagiaire"       -Department "Stagiaires"-Path "OU=Stagiaires,OU=OFPPT,DC=ofppt,DC=local"  -AccountPassword $pwd -Enabled $true -ChangePasswordAtLogon $true
```

</details>

---

**4. Ajouter chaque utilisateur dans son groupe, via pipeline pour les utilisateurs IT.**

<details>
<summary>Voir la reponse</summary>

```powershell
# IT via pipeline
Get-ADUser -Filter {Department -eq "IT"} -SearchBase "OU=OFPPT,DC=ofppt,DC=local" | Add-ADGroupMember -Identity "GRP-IT"

# RH et Stagiaires
Add-ADGroupMember -Identity "GRP-RH"         -Members "ltahiri"
Add-ADGroupMember -Identity "GRP-Stagiaires" -Members "kmouti"
```

</details>

---

**5. Simuler la fin du stage : deplacer `kmouti` vers l OU `Inactifs` et desactiver son compte.**

<details>
<summary>Voir la reponse</summary>

```powershell
Move-ADObject `
    -Identity "CN=Khalid Mouti,OU=Stagiaires,OU=OFPPT,DC=ofppt,DC=local" `
    -TargetPath "OU=Inactifs,OU=OFPPT,DC=ofppt,DC=local"

Disable-ADAccount -Identity "kmouti"
```

</details>

---

**6. Exporter la liste complete des utilisateurs actifs en CSV avec leurs attributs principaux.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ADUser -Filter {Enabled -eq $true} -SearchBase "OU=OFPPT,DC=ofppt,DC=local" -Properties Department, Title, EmailAddress |
    Select-Object Name, SamAccountName, Department, Title, EmailAddress |
    Export-Csv "C:\OFPPT_Users_Actifs.csv" -NoTypeInformation -Encoding UTF8
```

</details>

---

**7. Verifier la structure finale : lister les utilisateurs par OU et leurs groupes.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Utilisateurs par OU
foreach ($ou in @("IT","RH","Stagiaires","Inactifs")) {
    Write-Host "--- OU : $ou ---"
    Get-ADUser -Filter * -SearchBase "OU=$ou,OU=OFPPT,DC=ofppt,DC=local" | Select-Object Name, Enabled
}

# Membres des groupes
foreach ($grp in @("GRP-IT","GRP-RH","GRP-Stagiaires")) {
    Write-Host "--- Groupe : $grp ---"
    Get-ADGroupMember -Identity $grp | Select-Object Name
}
```

</details>

---

:::info Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/quiz-windows)

:::

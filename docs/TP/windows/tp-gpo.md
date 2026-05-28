---
id: tp-gpo
title: Group Policy (GPO)
---

# TP - Group Policy (GPO)

6 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Creation et Liaison de GPO (Facile)

**Objectif :** Creer des GPO et les lier a des OU.

---

**1. Installer la console GPMC.**

<details>
<summary>Voir la reponse</summary>

```powershell
Install-WindowsFeature -Name GPMC -IncludeManagementTools
```

</details>

---

**2. Lister toutes les GPO existantes dans le domaine.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-GPO -All | Select-Object DisplayName, GpoStatus
```

</details>

---

**3. Creer une GPO nommee `GPO-IT-Securite` pour l OU IT.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-GPO `
    -Name "GPO-IT-Securite" `
    -Domain "ofppt.local" `
    -Comment "Politique de securite pour les utilisateurs IT"
```

</details>

---

**4. Lier cette GPO a l OU `OU=IT,DC=ofppt,DC=local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-GPLink `
    -Name "GPO-IT-Securite" `
    -Target "OU=IT,DC=ofppt,DC=local" `
    -LinkEnabled Yes
```

</details>

---

**5. Creer et lier une GPO `GPO-Domaine-Global` au domaine entier.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-GPO -Name "GPO-Domaine-Global" -Domain "ofppt.local"
New-GPLink -Name "GPO-Domaine-Global" -Target "DC=ofppt,DC=local" -LinkEnabled Yes
```

</details>

---

**6. Desactiver le lien de `GPO-IT-Securite` sans la supprimer.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-GPLink -Name "GPO-IT-Securite" -Target "OU=IT,DC=ofppt,DC=local" -LinkEnabled No
```

</details>

---

**7. Supprimer la GPO `GPO-Domaine-Global`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Remove-GPO -Name "GPO-Domaine-Global"
```

</details>

---

## TP n°2 - Politiques de Mot de Passe et Verrouillage (Moyen)

**Objectif :** Configurer les politiques de compte du domaine.

**Contexte :** Domaine `ofppt.local`.

| Parametre | Valeur |
|---|---|
| Longueur minimale | 10 caracteres |
| Historique | 12 mots de passe |
| Duree max | 60 jours |
| Duree min | 2 jours |
| Complexite | Activee |
| Seuil de verrouillage | 3 tentatives |
| Duree de verrouillage | 15 minutes |

---

**1. Configurer la politique de mot de passe du domaine.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-ADDefaultDomainPasswordPolicy `
    -Identity "ofppt.local" `
    -MinPasswordLength 10 `
    -PasswordHistoryCount 12 `
    -MaxPasswordAge 60.00:00:00 `
    -MinPasswordAge 2.00:00:00 `
    -ComplexityEnabled $true
```

</details>

---

**2. Configurer la politique de verrouillage.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-ADDefaultDomainPasswordPolicy `
    -Identity "ofppt.local" `
    -LockoutThreshold 3 `
    -LockoutDuration 00:15:00 `
    -LockoutObservationWindow 00:15:00
```

</details>

---

**3. Verifier la politique de mot de passe appliquee.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ADDefaultDomainPasswordPolicy -Identity "ofppt.local"
```

</details>

---

**4. Expliquer la difference entre `LockoutDuration` et `LockoutObservationWindow`.**

<details>
<summary>Voir la reponse</summary>

| Parametre | Role |
|---|---|
| `LockoutDuration` | Duree pendant laquelle le compte reste verrouille. `00:00:00` = verrouillage permanent (deverrouillage manuel par admin) |
| `LockoutObservationWindow` | Periode pendant laquelle les echecs sont comptabilises. Si 3 echecs en 15 min, le compte est bloque |

Exemple : avec Threshold=3, Window=15 min, Duration=15 min : si un utilisateur echoue 3 fois en moins de 15 minutes, son compte est bloque 15 minutes.

</details>

---

## TP n°3 - Configurations via Registre GPO (Moyen)

**Objectif :** Appliquer des restrictions et personnalisations via `Set-GPRegistryValue`.

---

**1. Creer une GPO `GPO-Restrictions-Bureau` et la lier a `OU=IT,DC=ofppt,DC=local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-GPO -Name "GPO-Restrictions-Bureau" -Domain "ofppt.local"
New-GPLink -Name "GPO-Restrictions-Bureau" -Target "OU=IT,DC=ofppt,DC=local" -LinkEnabled Yes
```

</details>

---

**2. Masquer le Panneau de configuration pour les utilisateurs de l OU IT.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-GPRegistryValue `
    -Name "GPO-Restrictions-Bureau" `
    -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" `
    -ValueName "NoControlPanel" `
    -Type DWord `
    -Value 1
```

</details>

---

**3. Definir un fond d ecran obligatoire `C:\Windows\Web\Wallpaper\ofppt.jpg`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-GPRegistryValue `
    -Name "GPO-Restrictions-Bureau" `
    -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\System" `
    -ValueName "Wallpaper" `
    -Type String `
    -Value "C:\Windows\Web\Wallpaper\ofppt.jpg"

Set-GPRegistryValue `
    -Name "GPO-Restrictions-Bureau" `
    -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\System" `
    -ValueName "WallpaperStyle" `
    -Type String `
    -Value "2"
```

</details>

---

**4. Masquer le Poste de Travail (`Ce PC`) du bureau.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-GPRegistryValue `
    -Name "GPO-Restrictions-Bureau" `
    -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\NonEnum" `
    -ValueName "{20D04FE0-3AEA-1069-A2D8-08002B30309D}" `
    -Type DWord `
    -Value 1
```

</details>

---

**5. Lire la valeur `NoControlPanel` pour verifier qu elle est bien configuree.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-GPRegistryValue `
    -Name "GPO-Restrictions-Bureau" `
    -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" `
    -ValueName "NoControlPanel"
```

</details>

---

## TP n°4 - Filtrage et Heritage (Moyen-Difficile)

**Objectif :** Filtrer les GPO par groupe et gerer l heritage.

---

**1. Retirer `Utilisateurs Authentifies` du filtrage de securite de `GPO-IT-Securite`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-GPPermission `
    -Name "GPO-IT-Securite" `
    -PermissionLevel GpoRead `
    -TargetName "Authenticated Users" `
    -TargetType Group
```

</details>

---

**2. Appliquer la GPO uniquement au groupe `GRP-IT`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-GPPermission `
    -Name "GPO-IT-Securite" `
    -PermissionLevel GpoApply `
    -TargetName "GRP-IT" `
    -TargetType Group
```

</details>

---

**3. Bloquer l heritage GPO sur l OU `OU=Stagiaires,DC=ofppt,DC=local`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-GPInheritance `
    -Target "OU=Stagiaires,DC=ofppt,DC=local" `
    -IsBlocked Yes
```

</details>

---

**4. Forcer l application d une GPO (Enforced) pour qu elle s applique meme aux OU bloquees.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-GPLink `
    -Name "GPO-Domaine-Global" `
    -Target "DC=ofppt,DC=local" `
    -Enforced Yes
```

</details>

---

**5. Consulter l heritage GPO de l OU `IT`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-GPInheritance -Target "OU=IT,DC=ofppt,DC=local"
```

</details>

---

**6. Expliquer la priorite GPO (du moins prioritaire au plus prioritaire).**

<details>
<summary>Voir la reponse</summary>

L ordre d application (le dernier applique gagne) :

| Ordre | Niveau |
|---|---|
| 1 (premier, moins prioritaire) | Local |
| 2 | Site |
| 3 | Domaine |
| 4 (dernier, plus prioritaire) | OU (la plus proche de l objet) |

- `Enforced` : force l application de la GPO meme si une OU enfant a `Block Inheritance`
- `Block Inheritance` : ignore les GPO des niveaux superieurs (sauf celles marquees `Enforced`)

</details>

---

## TP n°5 - Diagnostic et Sauvegarde (Facile)

**Objectif :** Verifier les GPO appliquees et sauvegarder la configuration.

---

**1. Forcer l application immediate des GPO sur l ordinateur.**

<details>
<summary>Voir la reponse</summary>

```cmd
gpupdate /force
```

</details>

---

**2. Afficher les GPO appliquees a l utilisateur courant en console.**

<details>
<summary>Voir la reponse</summary>

```cmd
gpresult /r
```

</details>

---

**3. Generer un rapport HTML complet des GPO appliquees.**

<details>
<summary>Voir la reponse</summary>

```cmd
gpresult /H C:\rapport-gpo.html
```

Ouvrir le rapport :
```powershell
Start-Process "C:\rapport-gpo.html"
```

</details>

---

**4. Afficher les GPO appliquees sur un poste distant `PC-BUREAU01`.**

<details>
<summary>Voir la reponse</summary>

```cmd
gpresult /s PC-BUREAU01 /r
```

</details>

---

**5. Sauvegarder toutes les GPO du domaine.**

<details>
<summary>Voir la reponse</summary>

```powershell
Backup-GPO -All -Path "C:\Backup-GPO"
```

</details>

---

**6. Sauvegarder uniquement la GPO `GPO-IT-Securite`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Backup-GPO -Name "GPO-IT-Securite" -Path "C:\Backup-GPO"
```

</details>

---

**7. Restaurer la GPO `GPO-IT-Securite` depuis la sauvegarde.**

<details>
<summary>Voir la reponse</summary>

```powershell
Restore-GPO -Name "GPO-IT-Securite" -Path "C:\Backup-GPO"
```

</details>

---

## TP n°6 - Scenario Reel Complet (Difficile)

**Objectif :** Deployer une strategie GPO complete pour l entreprise `OFPPT`.

**Contexte :**
- Domaine `ofppt.local`
- OU : `IT`, `RH`, `Stagiaires`
- Groupes : `GRP-IT`, `GRP-RH`

**Exigences :**
1. GPO globale pour le domaine : politique de mot de passe (min 8 car, complexite, verrouillage 5 tentatives)
2. GPO IT : masquer panneau de config, fond d ecran force
3. GPO RH : aucune restriction specifique
4. GPO Stagiaires : bloquer l heritage, appliquer des restrictions

---

**1. Configurer la politique de mot de passe et de verrouillage du domaine.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-ADDefaultDomainPasswordPolicy -Identity "ofppt.local" -MinPasswordLength 8 -ComplexityEnabled $true -LockoutThreshold 5 -LockoutDuration 00:30:00 -LockoutObservationWindow 00:30:00
```

</details>

---

**2. Creer et lier `GPO-IT` a l OU IT, appliquer uniquement a `GRP-IT`.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-GPO -Name "GPO-IT" -Domain "ofppt.local"
New-GPLink -Name "GPO-IT" -Target "OU=IT,DC=ofppt,DC=local" -LinkEnabled Yes

# Retirer Authenticated Users et ajouter GRP-IT
Set-GPPermission -Name "GPO-IT" -PermissionLevel GpoRead   -TargetName "Authenticated Users" -TargetType Group
Set-GPPermission -Name "GPO-IT" -PermissionLevel GpoApply  -TargetName "GRP-IT" -TargetType Group
```

</details>

---

**3. Appliquer les restrictions bureau a `GPO-IT`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-GPRegistryValue -Name "GPO-IT" -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -ValueName "NoControlPanel" -Type DWord -Value 1

Set-GPRegistryValue -Name "GPO-IT" -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\System" -ValueName "Wallpaper" -Type String -Value "C:\Windows\Web\Wallpaper\ofppt.jpg"
```

</details>

---

**4. Creer `GPO-Stagiaires`, la lier avec Enforced, bloquer l heritage sur l OU Stagiaires.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-GPO -Name "GPO-Stagiaires" -Domain "ofppt.local"
New-GPLink -Name "GPO-Stagiaires" -Target "OU=Stagiaires,DC=ofppt,DC=local" -LinkEnabled Yes -Enforced Yes

Set-GPInheritance -Target "OU=Stagiaires,DC=ofppt,DC=local" -IsBlocked Yes
```

</details>

---

**5. Sauvegarder toutes les GPO creees.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-Item -Path "C:\Backup-GPO-OFPPT" -ItemType Directory -Force
Backup-GPO -All -Path "C:\Backup-GPO-OFPPT"
```

</details>

---

**6. Forcer l application des GPO et generer un rapport.**

<details>
<summary>Voir la reponse</summary>

```cmd
gpupdate /force
gpresult /H C:\rapport-gpo-ofppt.html
```

</details>

---

**7. Verifier les GPO appliquees a l OU IT et afficher l heritage.**

<details>
<summary>Voir la reponse</summary>

```powershell
# Heritage de l OU IT
Get-GPInheritance -Target "OU=IT,DC=ofppt,DC=local"

# Rapport PowerShell
Get-GPResultantSetOfPolicy -ReportType Html -Path "C:\rapport-rsop.html"
```

</details>

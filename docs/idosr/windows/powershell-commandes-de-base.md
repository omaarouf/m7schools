---
id: powershell-commandes-de-base
title: Commandes de Base PowerShell
sidebar_label: Commandes de Base PowerShell
---

## Introduction a PowerShell

PowerShell est un shell en ligne de commande et un langage de script developpe par Microsoft. Contrairement a l'ancien `cmd.exe`, PowerShell est oriente **objet** : chaque commande retourne des objets .NET, pas du texte brut. Cela le rend extremement puissant pour l'administration systeme Windows.

Structure d'une commande PowerShell (appele **cmdlet**) :

```powershell
Verbe-Nom [-Parametre Valeur] [Pipeline]

# Exemples :
Get-Process
Get-Service -Name "wuauserv"
Get-ChildItem -Path C:\ -Recurse
```

Les cmdlets suivent toujours la convention **Verbe-Nom**. Les verbes les plus courants :

| Verbe | Action |
|---|---|
| `Get` | Recuperer/afficher une information |
| `Set` | Modifier une valeur ou propriete |
| `New` | Creer un nouvel objet |
| `Remove` | Supprimer un objet |
| `Start` | Demarrer un service, processus |
| `Stop` | Arreter un service, processus |
| `Copy` | Copier un fichier ou objet |
| `Move` | Deplacer un fichier ou objet |
| `Test` | Tester une condition (retourne True/False) |
| `Write` | Ecrire/afficher dans la console |

Raccourcis clavier utiles dans la console PowerShell :

| Raccourci | Action |
|---|---|
| `Tab` | Autocompletion des commandes et chemins |
| `Ctrl + C` | Interrompre la commande en cours |
| `Fleche haut/bas` | Naviguer dans l'historique |
| `F7` | Afficher l'historique des commandes |
| `Ctrl + L` | Effacer l'ecran |

---

## 1. Commandes d'aide et decouverte

### `Get-Help` - Afficher l'aide d'une commande

```powershell
# Aide generale sur une commande
Get-Help Get-Process

# Aide detaillee avec exemples
Get-Help Get-Process -Detailed

# Mettre a jour la documentation locale
Update-Help
```

### `Get-Command` - Chercher des commandes disponibles

```powershell
# Lister toutes les commandes disponibles
Get-Command

# Chercher les commandes contenant "Service"
Get-Command *Service*

# Lister toutes les commandes avec le verbe "Get"
Get-Command -Verb Get

# Lister toutes les commandes du module "NetAdapter"
Get-Command -Module NetAdapter
```

### `Get-Member` - Inspecter les proprietes d'un objet

```powershell
# Voir toutes les proprietes et methodes d'un objet
Get-Process | Get-Member

# Voir uniquement les proprietes
Get-Service | Get-Member -MemberType Property
```

---

## 2. Navigation dans le systeme de fichiers

### `Get-Location` / `Set-Location` - Repertoire courant

```powershell
# Afficher le repertoire courant (equivalent de pwd)
Get-Location
# Alias court :
pwd

# Changer de repertoire (equivalent de cd)
Set-Location C:\Windows
# Alias court :
cd C:\Users\Administrateur

# Remonter d'un niveau
cd ..

# Aller a la racine
cd C:\

# Aller au repertoire personnel de l'utilisateur courant
cd $HOME
```

### `Get-ChildItem` - Lister le contenu d'un dossier

```powershell
# Lister le repertoire courant (equivalent de ls ou dir)
Get-ChildItem
# Alias courts :
ls
dir

# Lister un chemin specifique
Get-ChildItem -Path C:\Windows

# Afficher les fichiers caches et systeme
Get-ChildItem -Path C:\ -Force

# Filtrer par extension
Get-ChildItem -Path C:\Scripts -Filter *.ps1


# Lister uniquement les dossiers
Get-ChildItem -Path C:\ -Directory

# Lister uniquement les fichiers
Get-ChildItem -Path C:\ -File
```

---

## 3. Gestion des fichiers et dossiers

### Creer des fichiers et dossiers

```powershell
# Creer un nouveau dossier
New-Item -Path "C:\MonDossier" -ItemType Directory
# Alias court :
mkdir C:\MonDossier

# Creer un nouveau fichier vide
New-Item -Path "C:\MonDossier\fichier.txt" -ItemType File

# Creer un fichier avec du contenu
New-Item -Path "C:\MonDossier\notes.txt" -ItemType File -Value "Bonjour PowerShell"
```

### Copier, deplacer et supprimer

```powershell
# Copier un fichier
Copy-Item -Path "C:\source\fichier.txt" -Destination "C:\destination\"
# Alias :
cp C:\source\fichier.txt C:\destination\



# Deplacer un fichier
Move-Item -Path "C:\source\fichier.txt" -Destination "C:\destination\"
# Alias :
mv C:\source\fichier.txt C:\destination\

# Renommer un fichier
Rename-Item -Path "C:\MonDossier\ancien.txt" -NewName "nouveau.txt"

# Supprimer un fichier
Remove-Item -Path "C:\MonDossier\fichier.txt"
# Alias :
rm C:\MonDossier\fichier.txt

# Supprimer un dossier et tout son contenu
Remove-Item -Path "C:\MonDossier" -Recurse -Force
```

### Lire et ecrire dans des fichiers

```powershell
# Lire le contenu d'un fichier
Get-Content -Path "C:\MonDossier\fichier.txt"
# Alias :
cat C:\MonDossier\fichier.txt

# Lire les 20 dernieres lignes
Get-Content -Path "C:\logs\app.log" -Tail 20

# Ecrire dans un fichier (ecrase le contenu existant)
Set-Content -Path "C:\MonDossier\fichier.txt" -Value "Nouveau contenu"

# Ajouter du contenu a la fin du fichier
Add-Content -Path "C:\MonDossier\fichier.txt" -Value "Ligne ajoutee"

# Ecrire la sortie d'une commande dans un fichier
Get-Process > C:\MonDossier\processus.txt

# Ajouter la sortie a un fichier existant
Get-Service >> C:\MonDossier\services.txt
```

---

## 4. Filtrage et Manipulation des Objets

### `Select-Object` - Selectionner des proprietes

```powershell
# Afficher uniquement le nom et le statut des services
Get-Service | Select-Object Name, Status

# Selectionner les 5 premiers resultats
Get-Process | Select-Object -First 5

# Selectionner les 3 derniers resultats
Get-Process | Select-Object -Last 3

```

### `Where-Object` - Filtrer selon une condition

```powershell
# Filtrer les services arretes
Get-Service | Where-Object { $_.Status -eq "Stopped" }
# Alias court :
Get-Service | ? { $_.Status -eq "Stopped" }

# Filtrer les utilisateurs actives
Get-LocalUser | Where-Object { $_.Enabled -eq $true }

# Combinaison de conditions
Get-Service | Where-Object { $_.Status -eq "Running" -and $_.StartType -eq "Automatic" }
```


### `Format-Table` et `Format-List` - Afficher les resultats

```powershell
# Afficher en tableau avec colonnes auto
Get-Service | Format-Table

# Afficher en tableau avec colonnes choisies
Get-Process | Format-Table Name, CPU, WorkingSet -AutoSize

# Afficher en liste (une propriete par ligne)
Get-Service -Name "wuauserv" | Format-List *

# Afficher en liste avec proprietes choisies
Get-Process -Name "explorer" | Format-List Name, CPU, Id, StartTime
```

---

## 5. Variables

En PowerShell, toutes les variables commencent par le signe `$`.

```powershell
# Declarer une variable
$nom = "Administrateur"
$age = 30
$estActif = $true

# Afficher une variable
Write-Host "Nom : $nom"
Write-Output $age

```

---

## 5. Operateurs

### Operateurs de comparaison

| Operateur | Signification | Exemple |
|---|---|---|
| `-eq` | Egal a | `$a -eq 5` |
| `-ne` | Different de | `$a -ne 5` |
| `-gt` | Superieur a | `$a -gt 3` |
| `-lt` | Inferieur a | `$a -lt 10` |
| `-ge` | Superieur ou egal | `$a -ge 5` |
| `-le` | Inferieur ou egal | `$a -le 5` |
| `-like` | Correspondance avec jokers | `$s -like "SRV*"` |
| `-notlike` | Non-correspondance avec jokers | `$s -notlike "*test*"` |
| `-contains` | Tableau contient valeur | `$tab -contains "val"` |

### Operateurs logiques

```powershell
-and   # ET logique
-or    # OU logique
-not   # NON logique (aussi : !)

# Exemples
($age -gt 18) -and ($estActif -eq $true)
($role -eq "Admin") -or ($role -eq "Operateur")
-not ($estBloque)
```

---

## 6. Structures de controle

### Condition `if / elseif / else`

```powershell
$score = 75

if ($score -ge 90) {
    Write-Host "Mention Tres Bien"
} elseif ($score -ge 70) {
    Write-Host "Mention Bien"
} elseif ($score -ge 50) {
    Write-Host "Admis"
} else {
    Write-Host "Echec"
}
```

### Boucle `for`

```powershell
for ($i = 1; $i -le 5; $i++) {
    Write-Host "Iteration numero $i"
}
```

### Boucle `foreach`

```powershell
$serveurs = @("SRV-DC01", "SRV-WEB01", "SRV-FILE01")

foreach ($serveur in $serveurs) {
    Write-Host "Traitement de : $serveur"
}
```

### Boucle `while`

```powershell
$compteur = 0

while ($compteur -lt 5) {
    Write-Host "Compteur : $compteur"
    $compteur++
}
```

---

## 7. Le Pipeline `|`

Le pipeline est l'une des fonctionnalites les plus puissantes de PowerShell. Il permet de passer la **sortie** d'une commande comme **entree** d'une autre.


Commandes de filtrage et tri essentielles :

| Commande | Role |
|---|---|
| `Where-Object` | Filtrer selon une condition (`?` en alias) |
| `Select-Object` | Selectionner des proprietes specifiques |
| `Sort-Object` | Trier les resultats |
| `Measure-Object` | Calculer des statistiques (count, sum, min, max) |
| `Group-Object` | Regrouper les resultats |
| `Format-Table` | Afficher en tableau |
| `Format-List` | Afficher en liste |
| `Out-File` | Rediriger vers un fichier |
| `Export-Csv` | Exporter en CSV |

---

## 8. Gestion des services et processus

```powershell
# Lister tous les services
Get-Service

# Voir un service specifique
Get-Service -Name "wuauserv"

# Demarrer un service
Start-Service -Name "wuauserv"

# Arreter un service
Stop-Service -Name "wuauserv"

# Redemarrer un service
Restart-Service -Name "Spooler"

# Lister tous les processus
Get-Process

# Trouver un processus par nom
Get-Process -Name "chrome"

# Tuer un processus
Stop-Process -Name "notepad" -Force
Stop-Process -Id 1234 -Force
```

---

## 9. Gestion des utilisateurs et groupes locaux

```powershell
# Lister les utilisateurs locaux
Get-LocalUser

# Creer un nouvel utilisateur local
$mdp = ConvertTo-SecureString "MotDePasse123!" -AsPlainText -Force
New-LocalUser -Name "jdupont" -Password $mdp -FullName "Jean Dupont" -Description "Stagiaire"

# Activer / desactiver un compte
Enable-LocalUser -Name "jdupont"
Disable-LocalUser -Name "jdupont"

# Supprimer un utilisateur
Remove-LocalUser -Name "jdupont"

# Lister les groupes locaux
Get-LocalGroup

# Ajouter un utilisateur a un groupe
Add-LocalGroupMember -Group "Administrateurs" -Member "jdupont"

# Voir les membres d'un groupe
Get-LocalGroupMember -Group "Administrateurs"
```

---

## 10. Creer des Scripts PowerShell

Un script PowerShell est un fichier texte avec l'extension `.ps1` contenant une suite de commandes PowerShell.

### Structure d'un script

```powershell
# ============================================================
# Script : MonPremierScript.ps1
# Description : Exemple de structure de script PowerShell
# Auteur : Administrateur
# Date : 2024
# ============================================================

# --- Parametres en entete ---
param(
    [string]$NomServeur = "localhost",
    [int]$Port = 80
)

# --- Variables globales ---
$LogFile = "C:\Logs\script.log"
$Date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# --- Corps du script ---
Write-Host "Debut du script : $Date"
Write-Host "Serveur cible : $NomServeur"
```

### Executer un script

```powershell
# Executer un script depuis la console
.\MonScript.ps1

# Executer avec des parametres
.\MonScript.ps1 -NomServeur "SRV-WEB01" -Port 8080

# Executer depuis un chemin absolu
C:\Scripts\MonScript.ps1

# Executer en tant qu'administrateur
Start-Process powershell -ArgumentList "-File C:\Scripts\MonScript.ps1" -Verb RunAs
```

---


## 11. Exemple  - Deplacer les fichiers .txt vers un dossier Documents

Ce script selectionne tous les fichiers `.txt` dans un dossier source et les deplace automatiquement vers un dossier `Documents`.

```powershell
# ============================================================
# Script : Deplacer-Txt.ps1
# Description : Selectionner les fichiers .txt et les deplacer
#               vers le dossier Documents
# ============================================================

param(
    [string]$DossierSource      = "C:\Utilisateurs\Bureau",
    [string]$DossierDestination = "C:\Utilisateurs\Documents"
)

# Creer le dossier destination s'il n'existe pas
if (-not (Test-Path $DossierDestination)) {
    New-Item -Path $DossierDestination -ItemType Directory | Out-Null
    Write-Host "Dossier cree : $DossierDestination"
}

# Selectionner tous les fichiers .txt dans le dossier source
$FichiersTxt = Get-ChildItem -Path $DossierSource -Filter *.txt -File

# Verifier s'il y a des fichiers a deplacer
if ($FichiersTxt.Count -eq 0) {
    Write-Host "Aucun fichier .txt trouve dans : $DossierSource"
    exit
}

Write-Host "$($FichiersTxt.Count) fichier(s) .txt trouve(s)"

# Deplacer chaque fichier
foreach ($Fichier in $FichiersTxt) {
    $Destination = Join-Path $DossierDestination $Fichier.Name

    # Si un fichier du meme nom existe deja dans la destination
    if (Test-Path $Destination) {
        Write-Host "[IGNORE]  $($Fichier.Name) - existe deja dans Documents" -ForegroundColor Yellow
    } else {
        Move-Item -Path $Fichier.FullName -Destination $Destination
        Write-Host "[DEPLACE] $($Fichier.Name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Termine. Fichiers disponibles dans : $DossierDestination"
```

Executer ce script :

```powershell
# Avec les chemins par defaut
.\Deplacer-Txt.ps1

# Avec des chemins personnalises
.\Deplacer-Txt.ps1 -DossierSource "D:\Telechargements" -DossierDestination "D:\Documents"
```


*Continuer avec la lecon suivante dans la barre laterale.*

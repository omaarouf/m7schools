---
id: tp-powershell
title: PowerShell - Commandes de Base
---

# TP - PowerShell Commandes de Base

7 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Navigation et Aide (Facile)

**Objectif :** Utiliser les commandes d aide et naviguer dans le systeme de fichiers.

---

**1. Afficher l aide complete de la commande `Get-Process`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Help Get-Process -Full
```

</details>

---

**2. Trouver toutes les commandes qui contiennent le mot `Service`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Command -Name "*Service*"
```

</details>

---

**3. Afficher le contenu du dossier `C:\Windows\System32` et compter le nombre de fichiers.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ChildItem "C:\Windows\System32" | Measure-Object
```

</details>

---

**4. Afficher uniquement les fichiers `.exe` dans `C:\Windows\System32`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ChildItem "C:\Windows\System32" -Filter "*.exe"
```

</details>

---

**5. Creer le dossier `C:\TP-PowerShell`, y creer un fichier `test.txt` avec le contenu `Bonjour PowerShell`.**

<details>
<summary>Voir la reponse</summary>

```powershell
New-Item -Path "C:\TP-PowerShell" -ItemType Directory
New-Item -Path "C:\TP-PowerShell\test.txt" -ItemType File
Set-Content -Path "C:\TP-PowerShell\test.txt" -Value "Bonjour PowerShell"
```

</details>

---

**6. Lire le contenu du fichier `test.txt`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Content "C:\TP-PowerShell\test.txt"
```

</details>

---

**7. Copier `test.txt` en `test-backup.txt` puis supprimer l original.**

<details>
<summary>Voir la reponse</summary>

```powershell
Copy-Item "C:\TP-PowerShell\test.txt" "C:\TP-PowerShell\test-backup.txt"
Remove-Item "C:\TP-PowerShell\test.txt"
```

</details>

---

## TP n°2 - Filtrage des Objets (Facile-Moyen)

**Objectif :** Utiliser `Where-Object`, `Select-Object`, `Sort-Object` et `Measure-Object`.

---

**1. Afficher uniquement le nom et l etat des services en cours d execution.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Service | Where-Object {$_.Status -eq "Running"} | Select-Object Name, Status
```

</details>

---

**2. Lister les 5 processus qui consomment le plus de memoire (WorkingSet).**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 Name, WorkingSet
```

</details>

---

**3. Compter le nombre de services arretes.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Service | Where-Object {$_.Status -eq "Stopped"} | Measure-Object
```

</details>

---

**4. Afficher les fichiers `.log` dans `C:\Windows\Logs` tries par taille decroissante.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-ChildItem "C:\Windows\Logs" -Recurse -Filter "*.log" | Sort-Object Length -Descending | Select-Object Name, Length
```

</details>

---

**5. Grouper les services par etat (Running / Stopped) et afficher le nombre dans chaque groupe.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Service | Group-Object Status | Select-Object Name, Count
```

</details>

---

**6. Afficher les processus dont le nom commence par `s` avec leur ID et leur utilisation CPU.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Process | Where-Object {$_.Name -like "s*"} | Select-Object Name, Id, CPU
```

</details>

---

**7. Afficher le total de la memoire utilisee par tous les processus en Mo.**

<details>
<summary>Voir la reponse</summary>

```powershell
$total = (Get-Process | Measure-Object WorkingSet -Sum).Sum / 1MB
Write-Host "Memoire totale utilisee : $([Math]::Round($total, 2)) Mo"
```

</details>

---

## TP n°3 - Variables et Structures de Controle (Moyen)

**Objectif :** Utiliser les variables, les conditions et les boucles PowerShell.

---

**1. Creer une variable `$nom` avec votre prenom et afficher `Bonjour <prenom> !`.**

<details>
<summary>Voir la reponse</summary>

```powershell
$nom = "Karim"
Write-Host "Bonjour $nom !"
```

</details>

---

**2. Verifier si le dossier `C:\Temp` existe. Afficher un message selon le resultat.**

<details>
<summary>Voir la reponse</summary>

```powershell
if (Test-Path "C:\Temp") {
    Write-Host "Le dossier C:\Temp existe."
} else {
    Write-Host "Le dossier C:\Temp n'existe pas."
}
```

</details>

---

**3. Utiliser une boucle `for` pour afficher les nombres de 1 a 5.**

<details>
<summary>Voir la reponse</summary>

```powershell
for ($i = 1; $i -le 5; $i++) {
    Write-Host $i
}
```

</details>

---

**4. Utiliser `foreach` pour afficher le nom de chaque service en cours d execution.**

<details>
<summary>Voir la reponse</summary>

```powershell
$services = Get-Service | Where-Object {$_.Status -eq "Running"}
foreach ($svc in $services) {
    Write-Host $svc.Name
}
```

</details>

---

**5. Utiliser `while` pour demander a l utilisateur d entrer un nombre jusqu a ce qu il entre `0`.**

<details>
<summary>Voir la reponse</summary>

```powershell
$nb = -1
while ($nb -ne 0) {
    $nb = Read-Host "Entrez un nombre (0 pour quitter)"
    Write-Host "Vous avez entre : $nb"
}
Write-Host "Fin du programme."
```

</details>

---

**6. Creer un tableau de 5 villes marocaines et afficher chacune avec son numero.**

<details>
<summary>Voir la reponse</summary>

```powershell
$villes = @("Casablanca", "Rabat", "Marrakech", "Fes", "Agadir")
for ($i = 0; $i -lt $villes.Count; $i++) {
    Write-Host "$($i+1). $($villes[$i])"
}
```

</details>

---

**7. Utiliser un operateur de comparaison pour verifier si un nombre est pair ou impair.**

<details>
<summary>Voir la reponse</summary>

```powershell
$nombre = 7
if ($nombre % 2 -eq 0) {
    Write-Host "$nombre est pair."
} else {
    Write-Host "$nombre est impair."
}
```

</details>

---

## TP n°4 - Gestion des Services et Processus (Moyen)

**Objectif :** Gerer les services et processus Windows avec PowerShell.

---

**1. Afficher l etat du service `Spooler` (service d impression).**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Service -Name "Spooler"
```

</details>

---

**2. Arreter puis redemarrer le service `Spooler`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Stop-Service -Name "Spooler"
Start-Service -Name "Spooler"
# Ou en une seule commande :
Restart-Service -Name "Spooler"
```

</details>

---

**3. Configurer le service `Spooler` pour demarrer automatiquement.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-Service -Name "Spooler" -StartupType Automatic
```

</details>

---

**4. Afficher tous les processus `svchost` avec leur ID et leur consommation memoire.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Process -Name "svchost" | Select-Object Id, Name, WorkingSet | Sort-Object WorkingSet -Descending
```

</details>

---

**5. Afficher le processus qui utilise le plus de CPU.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 1 Name, Id, CPU
```

</details>

---

**6. Lister tous les services desactives (StartType = Disabled).**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Service | Where-Object {$_.StartType -eq "Disabled"} | Select-Object Name, Status, StartType
```

</details>

---

**7. Exporter la liste de tous les services dans un fichier CSV `C:\services.csv`.**

<details>
<summary>Voir la reponse</summary>

```powershell
Get-Service | Select-Object Name, Status, StartType | Export-Csv "C:\services.csv" -NoTypeInformation -Encoding UTF8
```

</details>

---

## TP n°5 - Scripts PowerShell (Moyen-Difficile)

**Objectif :** Ecrire et executer des scripts PowerShell.

---

**1. Ecrire un script qui affiche la date et l heure actuelles.**

<details>
<summary>Voir la reponse</summary>

```powershell
# C:\TP-PowerShell\date.ps1
Write-Host "Date et heure : $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')"
```

Execution :
```powershell
.\date.ps1
```

</details>

---

**2. Autoriser l execution de scripts locaux non signes.**

<details>
<summary>Voir la reponse</summary>

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

</details>

---

**3. Ecrire un script qui cree automatiquement les dossiers `Documents`, `Images`, `Videos` dans `C:\Partage`.**

<details>
<summary>Voir la reponse</summary>

```powershell
# C:\TP-PowerShell\creer-dossiers.ps1
$dossiers = @("Documents", "Images", "Videos")
foreach ($d in $dossiers) {
    New-Item -Path "C:\Partage\$d" -ItemType Directory -Force
    Write-Host "Dossier cree : C:\Partage\$d"
}
```

</details>

---

**4. Ecrire un script qui liste tous les fichiers `.txt` du bureau et les deplace dans `C:\Temp\TXT`.**

<details>
<summary>Voir la reponse</summary>

```powershell
# C:\TP-PowerShell\deplacer-txt.ps1
$source = [Environment]::GetFolderPath("Desktop")
$dest   = "C:\Temp\TXT"

New-Item -Path $dest -ItemType Directory -Force | Out-Null

$fichiers = Get-ChildItem -Path $source -Filter "*.txt"
foreach ($f in $fichiers) {
    Move-Item -Path $f.FullName -Destination $dest
    Write-Host "Deplace : $($f.Name)"
}
Write-Host "$($fichiers.Count) fichier(s) deplace(s)."
```

</details>

---

**5. Ecrire un script qui verifie si un service est arrete et le redemarre automatiquement.**

<details>
<summary>Voir la reponse</summary>

```powershell
# C:\TP-PowerShell\check-service.ps1
param([string]$ServiceName = "Spooler")

$svc = Get-Service -Name $ServiceName
if ($svc.Status -eq "Stopped") {
    Write-Host "$ServiceName est arrete. Demarrage en cours..."
    Start-Service -Name $ServiceName
    Write-Host "$ServiceName demarre."
} else {
    Write-Host "$ServiceName est deja en cours d'execution."
}
```

</details>

---

**6. Ecrire un script qui genere un rapport HTML de tous les services en cours d execution.**

<details>
<summary>Voir la reponse</summary>

```powershell
# C:\TP-PowerShell\rapport-services.ps1
Get-Service | Where-Object {$_.Status -eq "Running"} |
    Select-Object Name, Status, StartType |
    ConvertTo-Html -Title "Services Actifs" -PreContent "<h1>Services en cours d'execution</h1>" |
    Out-File "C:\rapport-services.html"
Write-Host "Rapport genere : C:\rapport-services.html"
```

</details>

---

**7. Scenario : script de nettoyage qui supprime les fichiers de plus de 30 jours dans `C:\Temp`.**

<details>
<summary>Voir la reponse</summary>

```powershell
# C:\TP-PowerShell\nettoyage.ps1
$dossier  = "C:\Temp"
$limite   = (Get-Date).AddDays(-30)
$fichiers = Get-ChildItem -Path $dossier -Recurse -File | Where-Object {$_.LastWriteTime -lt $limite}

foreach ($f in $fichiers) {
    Remove-Item -Path $f.FullName -Force
    Write-Host "Supprime : $($f.FullName)"
}
Write-Host "$($fichiers.Count) fichier(s) supprime(s)."
```

</details>

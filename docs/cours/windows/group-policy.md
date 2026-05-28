---
id: group-policy
title: Group Policy (GPO)
sidebar_label: Group Policy (GPO)
---

## Introduction

Les **Strategies de Groupe (GPO - Group Policy Objects)** permettent de centraliser la gestion des configurations des utilisateurs et des ordinateurs dans un domaine Active Directory. Une GPO peut s'appliquer a un site, un domaine ou une OU.

### Priorite et Heritage des GPO

| Ordre d'application | Niveau | Remarque |
|---|---|---|
| 1 (premier) | Local | Peut etre ecrase par tous les autres |
| 2 | Site | |
| 3 | Domaine | Default Domain Policy ici |
| 4 (dernier) | OU | La plus proche de l'objet gagne |

- Les GPO appliquees **en dernier** ont la priorite.
- `Enforced` : empeche une OU enfant de bloquer l'heritage.
- `Block Inheritance` : ignore les GPO des niveaux superieurs (sauf Enforced).

---

## 1. Outils de Gestion GPO

### Installer la console GPMC

```powershell
Install-WindowsFeature -Name GPMC -IncludeManagementTools
```

### Outils principaux

| Outil | Description |
|---|---|
| `gpmc.msc` | Console de gestion des strategies de groupe |
| `gpedit.msc` | Editeur de strategie de groupe locale |
| `gpupdate` | Force l'application immediate des GPO |
| `gpresult` | Affiche les GPO appliquees a un utilisateur/ordinateur |

---

## 2. Creer et Lier une GPO

### Commandes principales

| Commande | Attributs principaux | Obligatoire |
|---|---|---|
| `New-GPO` | `-Name`, `-Domain`, `-Comment` | `-Name` |
| `New-GPLink` | `-Name`, `-Target`, `-LinkEnabled`, `-Order` | `-Name`, `-Target` |
| `Get-GPO` | `-Name`, `-All` | `-Name` ou `-All` |
| `Remove-GPO` | `-Name` | `-Name` |
| `Remove-GPLink` | `-Name`, `-Target` | `-Name`, `-Target` |
| `Set-GPLink` | `-Name`, `-Target`, `-LinkEnabled`, `-Enforced` | `-Name`, `-Target` |

### Creer une GPO

```powershell
New-GPO `
    -Name "GPO-Securite-IT" `
    -Domain "contoso.com" `
    -Comment "Politique de securite pour l'OU IT"
```

### Lier une GPO a une OU

```powershell
New-GPLink `
    -Name "GPO-Securite-IT" `
    -Target "OU=IT,DC=contoso,DC=com" `
    -LinkEnabled Yes
```

### Lier une GPO au domaine entier

```powershell
New-GPLink `
    -Name "GPO-Securite-IT" `
    -Target "DC=contoso,DC=com"
```

### Desactiver / Forcer un lien GPO

```powershell
# Desactiver le lien
Set-GPLink -Name "GPO-Securite-IT" -Target "OU=IT,DC=contoso,DC=com" -LinkEnabled No

# Forcer l'application (Enforced)
Set-GPLink -Name "GPO-Securite-IT" -Target "OU=IT,DC=contoso,DC=com" -Enforced Yes
```

### Consulter les GPO

```powershell
# Lister toutes les GPO du domaine
Get-GPO -All

# Afficher une GPO specifique
Get-GPO -Name "GPO-Securite-IT"
```

### Supprimer une GPO

```powershell
Remove-GPO -Name "GPO-Securite-IT"
```

### Blocage de l'heritage

```powershell
Set-GPInheritance `
    -Target "OU=IT,DC=contoso,DC=com" `
    -IsBlocked Yes
```



## 3. Diagnostic et Troubleshooting

### gpupdate - Forcer l'application

```cmd
# Mettre a jour toutes les GPO
gpupdate /force

# Mettre a jour seulement les GPO utilisateur
gpupdate /target:user /force

# Mettre a jour seulement les GPO ordinateur
gpupdate /target:computer /force
```

### gpresult - Verifier les GPO appliquees

```cmd
# Rapport HTML complet
gpresult /H C:\rapport-gpo.html

# Affichage console pour l'utilisateur courant
gpresult /r

# GPO appliquees sur un ordinateur distant
gpresult /s PC-BUREAU01 /r
```


### Consulter les GPO liees a une OU

```powershell
Get-GPInheritance -Target "OU=IT,DC=contoso,DC=com"
```

---



:::info Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/windows/quiz-gpo)

:::

:::info TP disponible

Pratiquez sur machine virtuelle :
[Faire les TP →](/TP/windows/tp-gpo)

:::

*Continuer avec la lecon suivante dans la barre laterale.*

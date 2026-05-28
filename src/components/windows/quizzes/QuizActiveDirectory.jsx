import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "`New-ADUser` cree un compte utilisateur dans Active Directory ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `New-ADUser` est la commande PowerShell pour creer un nouvel utilisateur dans Active Directory.",
  },
  {
    id: 2, type: "vf",
    question: "Le parametre `-SamAccountName` est optionnel lors de la creation d'un utilisateur AD ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `-SamAccountName` est obligatoire car il definit le nom de connexion Windows (ex: `jdoe`). Sans lui, l'authentification est impossible.",
  },
  {
    id: 3, type: "vf",
    question: "`Disable-ADAccount` supprime definitivement le compte utilisateur ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `Disable-ADAccount` desactive le compte (l'utilisateur ne peut plus se connecter) mais ne le supprime pas. `Remove-ADUser` supprime un compte.",
  },
  {
    id: 4, type: "vf",
    question: "`Get-ADUser -Filter *` retourne tous les utilisateurs du domaine ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le filtre `*` correspond a 'tous'. On peut aussi utiliser `{Name -like '*'}` pour le meme resultat.",
  },
  {
    id: 5, type: "vf",
    question: "`Unlock-ADAccount` reinitialise le mot de passe d'un compte bloque ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `Unlock-ADAccount` deverrouille un compte bloque suite a des echecs de connexion, mais ne change pas le mot de passe. `Set-ADAccountPassword` change le mot de passe.",
  },
  {
    id: 6, type: "vf",
    question: "`dsadd` est une commande de l'invite de commandes (CMD) pour creer des objets AD ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `dsadd user`, `dsadd group`, `dsadd ou` sont des commandes DS (Directory Services) disponibles dans CMD.",
  },
  {
    id: 7, type: "vf",
    question: "`dsmove` avec `-newparent` deplace un objet AD vers une autre OU ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `dsmove 'DN' -newparent 'OU=...'` deplace l'objet. On peut aussi utiliser `-newname` pour renommer, et les deux parametres en meme temps.",
  },
  {
    id: 8, type: "vf",
    question: "`csvde -i` lance le mode exportation vers un fichier CSV ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `-i` active le mode **importation** (import). Pour exporter, on utilise simplement `csvde -f fichier.csv` sans le `-i`.",
  },
  {
    id: 9, type: "vf",
    question: "`Add-ADGroupMember` peut ajouter plusieurs utilisateurs en une seule commande ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `-Members 'user1','user2','user3'` accepte une liste de comptes. On peut aussi utiliser le pipeline : `Get-ADUser ... | Add-ADGroupMember`.",
  },
  {
    id: 10, type: "vf",
    question: "Le DN (Distinguished Name) d'un utilisateur `ali` dans l'OU `NTIC` du domaine `ofppt.local` est `CN=ali,OU=NTIC,DC=ofppt,DC=local` ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le DN complet combine le CN (nom de l'objet), l'OU et les composants DC du domaine.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quel parametre de `New-ADUser` place l'utilisateur dans une OU specifique ?",
    options: ["-OU", "-Path", "-Location", "-Container"],
    correct: 1,
    explanation: "`-Path 'OU=IT,DC=contoso,DC=com'` definit l'OU de destination lors de la creation de l'utilisateur.",
  },
  {
    id: 12, type: "qcm",
    question: "Comment creer un groupe de securite a portee globale avec PowerShell ?",
    options: [
      "New-ADGroup -Name 'GRP' -Type Security -Scope Global",
      "New-ADGroup -Name 'GRP' -GroupScope Global -GroupCategory Security",
      "New-ADGroup -Name 'GRP' -GroupType Global",
      "Add-ADGroup -Name 'GRP' -Scope Global -Security",
    ],
    correct: 1,
    explanation: "Les parametres corrects sont `-GroupScope Global` pour la portee et `-GroupCategory Security` pour le type.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande deverrouille tous les comptes bloques d'une OU ?",
    options: [
      "Get-ADUser -Filter {LockedOut -eq $true} | Unlock-ADAccount",
      "Unlock-ADAccount -All",
      "Get-ADUser -LockedOut | Unlock",
      "Set-ADUser -LockedOut $false",
    ],
    correct: 0,
    explanation: "`Get-ADUser -Filter {LockedOut -eq $true}` trouve les comptes bloques, puis le pipeline passe chaque objet a `Unlock-ADAccount`.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle portee de groupe DS (`dsadd`) correspond a 'global' ?",
    options: ["-scope l", "-scope g", "-scope u", "-scope d"],
    correct: 1,
    explanation: "Pour `dsadd group`, la portee global se specifie avec `-scope g`. `l` = local de domaine, `u` = universel.",
  },
  {
    id: 15, type: "qcm",
    question: "Comment deplacer tous les utilisateurs du departement 'Stagiaire' vers l'OU Inactifs ?",
    options: [
      "Set-ADUser -Filter {Department -eq 'Stagiaire'} -Path 'OU=Inactifs'",
      "Get-ADUser -Filter {Department -eq 'Stagiaire'} | Move-ADObject -TargetPath 'OU=Inactifs,DC=...'",
      "Move-ADUser -Department 'Stagiaire' -Target 'OU=Inactifs'",
      "Get-ADUser -Department 'Stagiaire' | Set-ADUser -Path 'OU=Inactifs'",
    ],
    correct: 1,
    explanation: "`Get-ADUser` avec un filtre retourne les utilisateurs, puis `Move-ADObject -TargetPath` les deplace via le pipeline.",
  },
  {
    id: 16, type: "qcm",
    question: "Quel code `userAccountControl` correspond a un compte actif normal ?",
    options: ["514", "512", "544", "66048"],
    correct: 1,
    explanation: "Le code `512` correspond a `NORMAL_ACCOUNT` (compte actif et normal). `514` = compte desactive (`ACCOUNTDISABLE`).",
  },
  {
    id: 17, type: "qcm",
    question: "Comment exporter uniquement les attributs `cn`, `mail` et `sAMAccountName` de tous les utilisateurs avec CSVDE ?",
    options: [
      "csvde -f export.csv -filter cn,mail,sAMAccountName",
      "csvde -f export.csv -l 'cn,mail,sAMAccountName' -r '(objectClass=user)'",
      "csvde -f export.csv -attr cn,mail,sAMAccountName",
      "csvde -f export.csv -select cn,mail",
    ],
    correct: 1,
    explanation: "Le parametre `-l` de CSVDE specifie la liste des attributs a exporter. `-r` definit le filtre LDAP.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande installe Active Directory Domain Services avec les outils RSAT ?",
    options: [
      "Install-WindowsFeature AD-Domain-Services",
      "Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools",
      "Add-WindowsFeature -Name ADDS -IncludeTools",
      "Install-Feature -Name AD-DS -Tools",
    ],
    correct: 1,
    explanation: "`Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools` installe le role AD DS et les outils RSAT (cmdlets AD).",
  },
  {
    id: 19, type: "qcm",
    question: "Lors de la promotion d'un serveur en controleur de domaine d'une nouvelle foret, quel parametre definit le mot de passe de recuperation DSRM ?",
    options: ["-RecoveryPassword", "-DsrmPassword", "-SafeModeAdministratorPassword", "-ForestPassword"],
    correct: 2,
    explanation: "`-SafeModeAdministratorPassword` definit le mot de passe du mode de restauration des services d'annuaire (DSRM), utilise en cas de reparation du DC.",
  },
  {
    id: 20, type: "qcm",
    question: "Comment lister tous les groupes dont un utilisateur `kalami` est membre ?",
    options: [
      "Get-ADUser kalami -Properties Groups",
      "Get-ADUser -Identity kalami -Properties MemberOf | Select-Object -ExpandProperty MemberOf",
      "Get-ADGroupMember -Identity kalami",
      "Get-ADUser kalami | Get-ADGroup",
    ],
    correct: 1,
    explanation: "`-Properties MemberOf` charge la propriete MemberOf, puis `Select-Object -ExpandProperty MemberOf` affiche la liste des DN des groupes.",
  },
];

export default function QuizActiveDirectory() {
  return <QuizEngine questions={questions} title="Active Directory" />;
}

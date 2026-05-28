import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "GPO signifie Group Policy Object et permet de centraliser la gestion des configurations dans un domaine AD ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Les GPO permettent de configurer de facon centralisee les parametres des utilisateurs et des ordinateurs dans un environnement Active Directory.",
  },
  {
    id: 2, type: "vf",
    question: "`New-GPLink` cree une nouvelle GPO dans le domaine ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `New-GPLink` **lie** une GPO existante a une OU, un domaine ou un site. `New-GPO` est la commande qui cree une nouvelle GPO.",
  },
  {
    id: 3, type: "vf",
    question: "Une GPO liee au domaine s'applique a tous les utilisateurs et ordinateurs du domaine ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Une GPO liee au domaine s'applique par defaut a tous les objets du domaine, sauf si un filtrage de securite ou un blocage d'heritage est configure.",
  },
  {
    id: 4, type: "vf",
    question: "La GPO d'une OU enfant a une priorite plus haute que la GPO du domaine parent ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. L'ordre d'application est Local < Site < Domaine < OU. La derniere GPO appliquee (la plus proche de l'objet) gagne en cas de conflit.",
  },
  {
    id: 5, type: "vf",
    question: "`Enforced` sur une GPO empeche les OU enfants de remplacer ses parametres meme avec Block Inheritance ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `Enforced` (anciennement 'No Override') force l'application de la GPO. Elle s'impose meme aux OU qui ont activé `Block Inheritance`.",
  },
  {
    id: 6, type: "vf",
    question: "`gpupdate /force` s'applique uniquement aux GPO utilisateur et pas aux GPO ordinateur ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `gpupdate /force` applique toutes les GPO (utilisateur ET ordinateur). `/target:user` limite aux GPO utilisateur, `/target:computer` aux GPO ordinateur.",
  },
  {
    id: 7, type: "vf",
    question: "`gpresult /H rapport.html` genere un rapport HTML des GPO appliquees a l'utilisateur et l'ordinateur courants ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le rapport HTML est plus complet que `gpresult /r` et inclut les details de toutes les GPO appliquees.",
  },
  {
    id: 8, type: "vf",
    question: "`Set-GPPermission` avec `-PermissionLevel GpoApply` permet a un groupe d'appliquer la GPO ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `GpoApply` donne le droit 'Appliquer la strategie de groupe', necessaire pour que la GPO soit appliquee a ce groupe.",
  },
  {
    id: 9, type: "vf",
    question: "`Backup-GPO -All` sauvegarde toutes les GPO du domaine dans un fichier zip ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `Backup-GPO -All -Path 'C:\\Backup'` sauvegarde les GPO dans un **dossier**, en creant un sous-dossier par GPO avec ses fichiers de configuration.",
  },
  {
    id: 10, type: "vf",
    question: "`Block Inheritance` sur une OU empeche les GPO Enforced des niveaux superieurs de s'appliquer ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `Block Inheritance` bloque les GPO normales des niveaux superieurs, mais les GPO marquees `Enforced` s'appliquent quand meme.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Dans quel ordre les GPO sont-elles appliquees (du moins prioritaire au plus prioritaire) ?",
    options: [
      "Domaine > Foret > Site > OU",
      "OU > Domaine > Site > Local",
      "Local > Site > Domaine > OU",
      "Site > Domaine > Local > OU",
    ],
    correct: 2,
    explanation: "L'ordre LSDOU : Local, Site, Domaine, OU. La derniere appliquee (OU) a la priorite la plus haute en cas de conflit.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle commande installe la console de gestion des GPO (GPMC) ?",
    options: [
      "Install-Feature -Name GPMC",
      "Install-WindowsFeature -Name GPMC -IncludeManagementTools",
      "Add-WindowsFeature GPMC",
      "Enable-GPManagementConsole",
    ],
    correct: 1,
    explanation: "`Install-WindowsFeature -Name GPMC -IncludeManagementTools` installe la GPMC (Group Policy Management Console).",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande liste toutes les GPO du domaine ?",
    options: [
      "Get-GPO -All | Select-Object DisplayName",
      "List-GPO -Domain contoso.com",
      "Show-GPO -All",
      "Get-GroupPolicy -All",
    ],
    correct: 0,
    explanation: "`Get-GPO -All` liste toutes les GPO du domaine avec leurs proprietes.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle cle de registre faut-il modifier pour masquer le Panneau de configuration via GPO ?",
    options: [
      "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System - NoControlPanel",
      "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer - NoControlPanel",
      "HKLM\\Software\\Microsoft\\Windows\\Policies - HideControlPanel",
      "HKCU\\System\\CurrentControlSet\\Policies - DisableControlPanel",
    ],
    correct: 1,
    explanation: "La cle `NoControlPanel = 1` dans `HKCU\\...\\Policies\\Explorer` masque le Panneau de configuration pour l'utilisateur.",
  },
  {
    id: 15, type: "qcm",
    question: "Comment forcer une GPO a s'appliquer meme aux OU ayant Block Inheritance ?",
    options: [
      "Set-GPLink -Name 'GPO' -Target 'DC=...' -Mandatory Yes",
      "Set-GPLink -Name 'GPO' -Target 'DC=...' -Enforced Yes",
      "Set-GPO -Name 'GPO' -Override Yes",
      "New-GPLink -Name 'GPO' -Target 'DC=...' -Force",
    ],
    correct: 1,
    explanation: "`Set-GPLink -Enforced Yes` marque le lien GPO comme 'Impose', ce qui lui permet de s'appliquer meme si l'OU a Block Inheritance.",
  },
  {
    id: 16, type: "qcm",
    question: "Quel outil graphique permet de voir le jeu de strategie resultant (RSoP) applique a un utilisateur ?",
    options: ["gpmc.msc", "gpedit.msc", "rsop.msc", "gpresult.msc"],
    correct: 2,
    explanation: "`rsop.msc` (Resultant Set of Policy) affiche graphiquement toutes les GPO appliquees a l'utilisateur et l'ordinateur courants.",
  },
  {
    id: 17, type: "qcm",
    question: "Comment afficher les GPO appliquees sur un ordinateur distant `PC-001` ?",
    options: [
      "gpresult /r /computer PC-001",
      "gpresult /s PC-001 /r",
      "Get-GPResult -Computer PC-001",
      "gpresult /target PC-001",
    ],
    correct: 1,
    explanation: "`gpresult /s PC-001 /r` affiche le jeu de strategies resultant pour l'ordinateur distant `PC-001`.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande bloque l'heritage GPO sur l'OU `OU=Stagiaires,DC=ofppt,DC=local` ?",
    options: [
      "Set-GPInheritance -Target 'OU=Stagiaires,DC=ofppt,DC=local' -IsBlocked Yes",
      "Block-GPInheritance -OU 'Stagiaires'",
      "Set-GPLink -Inheritance Block -Target 'OU=Stagiaires'",
      "New-GPO -Name 'BlockInheritance' -Target 'OU=Stagiaires'",
    ],
    correct: 0,
    explanation: "`Set-GPInheritance -Target 'OU=...' -IsBlocked Yes` active le blocage de l'heritage sur l'OU specifiee.",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande restaure la GPO `GPO-IT` depuis une sauvegarde dans `C:\\Backup-GPO` ?",
    options: [
      "Import-GPO -Name 'GPO-IT' -Path 'C:\\Backup-GPO'",
      "Restore-GPO -Name 'GPO-IT' -Path 'C:\\Backup-GPO'",
      "Set-GPO -Restore 'C:\\Backup-GPO\\GPO-IT'",
      "Get-GPO -Name 'GPO-IT' -Restore -From 'C:\\Backup-GPO'",
    ],
    correct: 1,
    explanation: "`Restore-GPO -Name 'GPO-IT' -Path 'C:\\Backup-GPO'` restaure la GPO depuis la sauvegarde.",
  },
  {
    id: 20, type: "qcm",
    question: "Dans le filtrage de securite, quel niveau de permission permet a un groupe d'appliquer une GPO ?",
    options: ["GpoRead", "GpoEdit", "GpoApply", "GpoExecute"],
    correct: 2,
    explanation: "`GpoApply` est le niveau de permission qui permet l'application de la GPO. `GpoRead` permet seulement de lire la GPO sans l'appliquer.",
  },
];

export default function QuizGpo() {
  return <QuizEngine questions={questions} title="Group Policy (GPO)" />;
}

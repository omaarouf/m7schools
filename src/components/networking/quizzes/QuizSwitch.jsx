import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "La commande `enable secret` chiffre le mot de passe avec MD5, contrairement a `enable password` qui le stocke en clair.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `enable secret` utilise le chiffrement MD5 (type 5). `enable password` stocke le mot de passe en texte clair dans la configuration. Toujours preferer `enable secret`.",
  },
  {
    id: 2, type: "vf",
    question: "Sur un switch Cisco, les interfaces sont actives par defaut et ne necessitent pas de commande `no shutdown`.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Les ports d'un switch sont actifs par defaut. C'est l'inverse pour les interfaces d'un routeur qui sont desactivees par defaut et necessitent `no shutdown`.",
  },
  {
    id: 3, type: "vf",
    question: "La commande `service password-encryption` protege les mots de passe avec un chiffrement de niveau military-grade.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `service password-encryption` utilise un chiffrement faible de type 7 (facilement reversible). Il protege contre la lecture directe du fichier mais n'est pas suffisant seul. Toujours combiner avec `enable secret`.",
  },
  {
    id: 4, type: "vf",
    question: "L'interface de management d'un switch Layer 2 est configuree sur le VLAN 1 par defaut via une interface SVI (Switch Virtual Interface).",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Un switch L2 utilise `interface vlan 1` pour la gestion a distance. Il faut aussi configurer `ip default-gateway` pour que le trafic de management puisse sortir du reseau local.",
  },
  {
    id: 5, type: "vf",
    question: "La running-config est sauvegardee automatiquement en NVRAM lors de chaque modification.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. La running-config est stockee en RAM et est perdue au redemarrage si elle n'est pas sauvegardee. Il faut executer `copy running-config startup-config` (ou `wr`) pour la persister en NVRAM.",
  },
  {
    id: 6, type: "vf",
    question: "SSH est preferable a Telnet car il chiffre la session de management.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Telnet transmet les donnees (y compris les mots de passe) en clair. SSH chiffre toute la session. La commande `transport input ssh` desactive Telnet sur les lignes VTY.",
  },
  {
    id: 7, type: "vf",
    question: "La commande `Ctrl+Z` remonte d'un seul niveau dans les modes de configuration IOS.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `Ctrl+Z` (equivalent de `end`) retourne directement au mode EXEC privilegie depuis n'importe quel sous-mode. C'est `exit` qui remonte d'un seul niveau.",
  },
  {
    id: 8, type: "vf",
    question: "La commande `show ip interface brief` affiche l'adresse IP et l'etat de toutes les interfaces du switch.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `show ip interface brief` affiche un resume de toutes les interfaces : nom, IP, etat physique (up/down) et etat protocole.",
  },
  {
    id: 9, type: "vf",
    question: "Pour generer les cles RSA necessaires a SSH, la commande `crypto key generate rsa modulus 2048` necessite qu'un nom de domaine soit configure au prealable.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. IOS utilise le nom de domaine (`ip domain-name`) pour generer le nom des cles RSA. Sans nom de domaine, la commande `crypto key generate rsa` echoue.",
  },
  {
    id: 10, type: "vf",
    question: "Sur un switch, `line vty 0 15` configure 16 sessions VTY simultanees.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `line vty 0 15` configure les lignes VTY de 0 a 15 inclus, soit 16 sessions de management simultanees. Sur un routeur, `line vty 0 4` (5 sessions) est souvent suffisant.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande permet de configurer le nom du switch en 'SW-CORE-01' ?",
    options: [
      "name SW-CORE-01",
      "hostname SW-CORE-01",
      "set hostname SW-CORE-01",
      "device-name SW-CORE-01",
    ],
    correct: 1,
    explanation: "`hostname SW-CORE-01` configure le nom d'hote en mode de configuration globale. Ce nom apparait dans l'invite de commande : `SW-CORE-01(config)#`.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle commande configure l'adresse IP de management 192.168.1.10/24 sur un switch Layer 2 ?",
    options: [
      "ip address 192.168.1.10 255.255.255.0 (en mode global)",
      "interface gigabitethernet 0/0 puis ip address 192.168.1.10 255.255.255.0",
      "interface vlan 1 puis ip address 192.168.1.10 255.255.255.0 puis no shutdown",
      "management ip 192.168.1.10 255.255.255.0",
    ],
    correct: 2,
    explanation: "Il faut configurer l'interface SVI VLAN 1 : `interface vlan 1`, puis `ip address 192.168.1.10 255.255.255.0`, puis `no shutdown`. Un switch L2 n'a pas d'interfaces physiques routables.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande permet de sauvegarder la configuration courante pour qu'elle survive a un redemarrage ?",
    options: [
      "save running-config",
      "copy running-config startup-config",
      "write memory startup",
      "backup configuration",
    ],
    correct: 1,
    explanation: "`copy running-config startup-config` copie la RAM vers la NVRAM. La version courte `wr` fait la meme chose. La startup-config est chargee au demarrage.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle commande configure la passerelle par defaut sur un switch Layer 2 ?",
    options: [
      "ip route 0.0.0.0 0.0.0.0 192.168.1.1",
      "default-gateway 192.168.1.1",
      "ip default-gateway 192.168.1.1",
      "gateway 192.168.1.1",
    ],
    correct: 2,
    explanation: "`ip default-gateway 192.168.1.1` est la commande specifique aux switches Layer 2 pour definir la passerelle de management. `ip route` est pour les routeurs (Layer 3).",
  },
  {
    id: 15, type: "qcm",
    question: "Pour forcer les sessions de management a utiliser uniquement SSH (et bloquer Telnet), quelle commande utiliser sur les lignes VTY ?",
    options: [
      "transport input telnet",
      "transport input ssh",
      "transport input none",
      "transport input all",
    ],
    correct: 1,
    explanation: "`transport input ssh` autorise uniquement SSH sur les lignes VTY. `transport input all` autorise tout (Telnet inclus), ce qui est deconseille en production.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle commande affiche les sessions SSH actives sur un switch Cisco ?",
    options: [
      "show ip ssh",
      "show users",
      "show ssh",
      "show vty sessions",
    ],
    correct: 2,
    explanation: "`show ssh` affiche les sessions SSH actives. `show users` affiche toutes les sessions actives (console + VTY). `show ip ssh` affiche la version SSH et les parametres.",
  },
  {
    id: 17, type: "qcm",
    question: "Que fait la commande `banner motd # Acces autorise uniquement #` ?",
    options: [
      "Configure un mot de passe MOTD",
      "Affiche un message avant la demande de login",
      "Cree un utilisateur avec le message comme description",
      "Configure un message dans les logs syslog",
    ],
    correct: 1,
    explanation: "`banner motd` configure le Message Of The Day qui s'affiche avant la demande de login. Le caractere `#` est le delimiteur (peut etre remplace par tout caractere non present dans le message). Il a une valeur juridique.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande configure un timeout de 5 minutes (300 secondes) sur la console ?",
    options: [
      "timeout 300",
      "exec-timeout 300",
      "exec-timeout 5 0",
      "idle-timeout 5",
    ],
    correct: 2,
    explanation: "`exec-timeout 5 0` configure un timeout de 5 minutes et 0 secondes. La syntaxe est `exec-timeout [minutes] [secondes]`. `exec-timeout 0 0` desactive le timeout (deconseille).",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande affiche la version IOS, la quantite de RAM et la duree de fonctionnement du switch ?",
    options: [
      "show running-config",
      "show interfaces",
      "show version",
      "show flash",
    ],
    correct: 2,
    explanation: "`show version` affiche la version IOS, le type de processeur, la memoire RAM, la memoire Flash, l'uptime, et les licences. C'est la commande de diagnostic de base.",
  },
  {
    id: 20, type: "qcm",
    question: "Dans quel mode faut-il etre pour executer `copy running-config startup-config` ?",
    options: [
      "Mode EXEC utilisateur (Switch>)",
      "Mode de configuration globale (Switch(config)#)",
      "Mode EXEC privilegie (Switch#)",
      "Mode interface (Switch(config-if)#)",
    ],
    correct: 2,
    explanation: "`copy running-config startup-config` s'execute en mode EXEC privilegie (invite `Switch#`). Les commandes `copy`, `show`, `ping` et `debug` s'executent depuis ce mode.",
  },
];

export default function QuizSwitch() {
  return <QuizEngine questions={questions} title="Configuration de Base - Switch" courseLink="/cours/networking/configuration-de-base/switch" />;
}

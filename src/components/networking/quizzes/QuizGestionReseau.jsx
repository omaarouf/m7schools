import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "CDP (Cisco Discovery Protocol) est un standard IEEE ouvert compatible avec tous les constructeurs.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. CDP est PROPRIETAIRE CISCO - il ne fonctionne qu'entre equipements Cisco. Le standard IEEE ouvert equivalent est LLDP (IEEE 802.1AB), compatible avec tous les constructeurs.",
  },
  {
    id: 2, type: "vf",
    question: "CDP envoie des informations sur le modele, la version IOS et les adresses IP des equipements, ce qui peut etre exploite par des attaquants.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. CDP expose des informations sensibles. Il faut desactiver CDP sur toutes les interfaces connectees a des reseaux non fiables (Internet, partenaires) avec `no cdp enable` en mode interface.",
  },
  {
    id: 3, type: "vf",
    question: "NTP permet de synchroniser automatiquement l'heure de tous les equipements du reseau.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. NTP (Network Time Protocol) synchronise les horloges de tous les equipements via un serveur de reference. Une heure correcte est indispensable pour les logs syslog, les certificats SSL et l'audit de securite.",
  },
  {
    id: 4, type: "vf",
    question: "La commande `clock set` configure l'heure de maniere permanente et ne necessite pas de NTP.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `clock set` configure l'heure manuellement, mais elle derive avec le temps et n'est pas synchronisee. NTP maintient automatiquement l'heure precise sur le long terme. `clock set` est utile pour une configuration rapide en lab.",
  },
  {
    id: 5, type: "vf",
    question: "Un serveur NTP de stratum 1 est directement synchronise sur une source primaire comme GPS ou une horloge atomique.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Stratum 1 = source de reference directe (GPS, horloge atomique). Stratum 2 = synchronise sur un stratum 1. Stratum 3 = synchronise sur un stratum 2, etc. Plus le stratum est bas, plus la source est precise.",
  },
  {
    id: 6, type: "vf",
    question: "La commande `copy running-config tftp:` sauvegarde la configuration active sur un serveur TFTP.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `copy running-config tftp:` initie une copie de la running-config vers un serveur TFTP. Le routeur demande l'adresse IP du serveur et le nom du fichier. TFTP est utilise pour la sauvegarde et la restauration des configurations et images IOS.",
  },
  {
    id: 7, type: "vf",
    question: "LLDP est active par defaut sur les switches Cisco comme CDP.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. CDP est active par defaut sur les equipements Cisco. LLDP est DESACTIVE par defaut et doit etre active manuellement avec `lldp run` (global) et `lldp transmit` / `lldp receive` (par interface).",
  },
  {
    id: 8, type: "vf",
    question: "Dans la sortie de `show ntp associations`, le symbole `*` indique le serveur NTP selectionne comme reference principale.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `*` = serveur NTP selectionne (reference principale). `~` = serveur configure en unicast. `reach` = 377 (en octal) indique une synchronisation correcte avec le serveur.",
  },
  {
    id: 9, type: "vf",
    question: "La commande `boot system` permet de configurer l'ordre des images IOS a charger au demarrage.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `boot system flash0:image.bin` configure l'image principale. En ajoutant plusieurs commandes `boot system`, on cree une sequence de fallback : si l'image principale est corrompue, le switch tente les suivantes.",
  },
  {
    id: 10, type: "vf",
    question: "La commande `show cdp neighbors detail` affiche uniquement les noms des equipements voisins sans autres informations.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `show cdp neighbors detail` affiche beaucoup plus que `show cdp neighbors` : modele, version IOS, TOUTES les adresses IP, capacites, etc. `show cdp neighbors` (sans detail) n'affiche que le nom, l'interface locale, la capacite et la plateforme.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande desactive CDP globalement sur un switch Cisco ?",
    options: [
      "no cdp",
      "no cdp run",
      "cdp disable",
      "no cdp enable",
    ],
    correct: 1,
    explanation: "`no cdp run` desactive CDP globalement sur l'equipement. `no cdp enable` desactive CDP uniquement sur une interface specifique (en mode interface). `cdp run` le reactivate globalement.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle commande configure le switch pour se synchroniser avec le serveur NTP 192.168.1.1 en le designant comme prefere ?",
    options: [
      "ntp server 192.168.1.1",
      "ntp server 192.168.1.1 prefer",
      "clock ntp 192.168.1.1 primary",
      "ntp primary 192.168.1.1",
    ],
    correct: 1,
    explanation: "`ntp server 192.168.1.1 prefer` configure le serveur NTP et le marque comme prefere. Si plusieurs serveurs NTP sont configures, celui avec `prefer` est utilise en priorite pour la synchronisation.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande configure l'heure manuellement au 15 mars 2026, 09:30:00 ?",
    options: [
      "clock set 09:30:00 15/03/2026",
      "clock set 09:30:00 15 March 2026",
      "set clock 09:30:00 March 15 2026",
      "time 09:30:00 2026-03-15",
    ],
    correct: 1,
    explanation: "Format `clock set` : `HH:MM:SS DD MONTH YYYY`. Exemple : `clock set 09:30:00 15 March 2026`. Le mois s'ecrit en anglais. Cette commande s'execute en mode EXEC privilegie.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle est la principale difference entre CDP et LLDP ?",
    options: [
      "CDP supporte IPv6, LLDP uniquement IPv4",
      "CDP est proprietaire Cisco, LLDP est le standard IEEE 802.1AB ouvert",
      "LLDP ne peut pas decouvrir les telephones IP",
      "CDP fonctionne sur tous les constructeurs, LLDP uniquement Cisco",
    ],
    correct: 1,
    explanation: "CDP = proprietaire Cisco, fonctionne uniquement entre equipements Cisco. LLDP = standard IEEE 802.1AB, compatible avec Cisco, HP, Juniper, etc. En environnement multi-constructeurs, utiliser LLDP.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande sauvegarde la running-config sur un serveur TFTP a l'adresse 10.0.0.100 ?",
    options: [
      "backup running-config 10.0.0.100",
      "copy running-config tftp: (puis saisir l'IP et le nom de fichier)",
      "tftp put running-config 10.0.0.100",
      "copy tftp: running-config 10.0.0.100",
    ],
    correct: 1,
    explanation: "`copy running-config tftp:` : le routeur demande interactivement l'adresse IP du serveur TFTP et le nom du fichier de destination. En sens inverse, `copy tftp: running-config` restaure depuis TFTP.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle commande verifie l'etat de la synchronisation NTP sur un switch Cisco ?",
    options: [
      "show ntp",
      "show ntp status",
      "show clock ntp",
      "show ip ntp",
    ],
    correct: 1,
    explanation: "`show ntp status` indique si le switch est synchronise avec un serveur NTP, le stratum, la precision et le temps de reference. `show ntp associations` liste tous les serveurs NTP configures et leur etat de synchronisation.",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle commande active LLDP globalement sur un switch Cisco ?",
    options: [
      "lldp enable",
      "lldp run",
      "enable lldp",
      "ip lldp",
    ],
    correct: 1,
    explanation: "`lldp run` active LLDP globalement. Ensuite, par interface : `lldp transmit` (envoi) et `lldp receive` (reception). `no lldp transmit` desactive l'envoi sans desactiver la reception (utile pour les ports securises).",
  },
  {
    id: 18, type: "qcm",
    question: "Comment configurer le switch pour qu'il utilise le fuseau horaire CET (UTC+1) ?",
    options: [
      "clock timezone UTC+1",
      "clock timezone CET 1",
      "set timezone CET +1",
      "ntp timezone CET 1",
    ],
    correct: 1,
    explanation: "`clock timezone CET 1` configure le fuseau horaire : `CET` = nom, `1` = decalage en heures par rapport a UTC. Pour l'heure d'ete : `clock summer-time CEST recurring last Sun Mar 2:00 last Sun Oct 3:00`.",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande affiche le contenu du systeme de fichiers flash sur un switch Cisco ?",
    options: [
      "show flash",
      "dir flash0:",
      "ls flash:",
      "show file flash0:",
    ],
    correct: 1,
    explanation: "`dir flash0:` affiche le contenu de la memoire flash (images IOS, fichiers de configuration). `show flash0:` fonctionne aussi. `show file systems` liste tous les systemes de fichiers disponibles (flash, nvram, usb...).",
  },
  {
    id: 20, type: "qcm",
    question: "Quelle commande configure une image de boot de secours en cas de corruption de l'image principale ?",
    options: [
      "boot backup flash0:image-backup.bin",
      "boot system flash0:image-principale.bin puis boot system flash0:image-backup.bin",
      "fallback boot flash0:image-backup.bin",
      "boot secondary flash0:image-backup.bin",
    ],
    correct: 1,
    explanation: "Deux commandes `boot system` dans l'ordre de priorite : `boot system flash0:image-principale.bin` (premiere tentative) puis `boot system flash0:image-backup.bin` (secours). Le switch tente les images dans l'ordre de configuration.",
  },
];

export default function QuizGestionReseau() {
  return <QuizEngine questions={questions} title="Gestion du Réseau" courseLink="/cours/networking/gestion-monitoring/gestion-reseau" />;
}

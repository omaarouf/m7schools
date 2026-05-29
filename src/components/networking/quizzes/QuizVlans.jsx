import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "VTP permet de synchroniser automatiquement la base de donnees VLAN entre plusieurs switches d'un meme domaine.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. VTP (VLAN Trunking Protocol) propage les informations VLAN du serveur VTP vers les clients du meme domaine. Un switch en mode `client` ne peut pas creer de VLANs localement.",
  },
  {
    id: 2, type: "vf",
    question: "Un port en mode access peut transporter le trafic de plusieurs VLANs simultanement.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Un port access appartient a un seul VLAN. Pour transporter plusieurs VLANs, il faut un port trunk utilisant l'encapsulation 802.1Q (ou ISL).",
  },
  {
    id: 3, type: "vf",
    question: "Supprimer un VLAN avec `no vlan 10` desassigne automatiquement les ports qui lui appartenaient.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `no vlan 10` supprime le VLAN de la base de donnees mais les ports restent assignes au VLAN supprime, perdant toute connectivite. Il faut reassigner les ports avant de supprimer un VLAN.",
  },
  {
    id: 4, type: "vf",
    question: "Le VLAN natif d'un trunk est transmis sans tag 802.1Q par defaut.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le VLAN natif (VLAN 1 par defaut) est transporte sans etiquette 802.1Q sur un trunk. Il est recommande de le changer (`switchport trunk native vlan 99`) pour des raisons de securite.",
  },
  {
    id: 5, type: "vf",
    question: "DTP (Dynamic Trunking Protocol) permet de negocier automatiquement le mode trunk entre deux switches, meme si la securite n'est pas optimale.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. DTP negocie automatiquement le trunk mais peut etre exploite pour des attaques VLAN hopping. En production, desactiver DTP avec `switchport nonegotiate` sur les ports d'extremite.",
  },
  {
    id: 6, type: "vf",
    question: "La methode Router-on-a-Stick utilise plusieurs interfaces physiques du routeur, une par VLAN.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Router-on-a-Stick utilise UNE seule interface physique avec des sous-interfaces logiques (ex: Gi0/0.10, Gi0/0.20). Chaque sous-interface est associee a un VLAN via `encapsulation dot1q`.",
  },
  {
    id: 7, type: "vf",
    question: "Un switch Layer 3 peut faire du routage inter-VLAN en materiel, ce qui est plus performant que Router-on-a-Stick.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le routage sur switch L3 (via SVI - Switch Virtual Interface) est effectue en materiel (hardware switching), ce qui est beaucoup plus rapide que Router-on-a-Stick qui cree un goulot d'etranglement sur l'interface du routeur.",
  },
  {
    id: 8, type: "vf",
    question: "La commande `show vlan brief` affiche les interfaces trunk et leurs VLANs autorises.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `show vlan brief` affiche les VLANs et leurs ports ACCESS assignes. Pour voir les interfaces trunk, utiliser `show interfaces trunk`.",
  },
  {
    id: 9, type: "vf",
    question: "Sur un port avec VLAN voix, deux VLANs coexistent : un VLAN pour les donnees et un VLAN pour la voix.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Un port connecte a un telephone IP peut avoir `switchport access vlan X` (donnees PC) et `switchport voice vlan Y` (trafic voix). Les trames voix sont taguees avec le VLAN voix.",
  },
  {
    id: 10, type: "vf",
    question: "En mode VTP transparent, le switch ignore les mises a jour VTP recues mais les transmet aux autres switches.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. En mode transparent, le switch gere ses propres VLANs localement sans participer a VTP, mais relaie les messages VTP vers les autres switches du domaine.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle sequence de commandes cree le VLAN 20 avec le nom 'ADMINISTRATION' ?",
    options: [
      "vlan 20 name ADMINISTRATION (en mode global)",
      "vlan 20 puis name ADMINISTRATION (en mode vlan-config)",
      "create vlan 20 ADMINISTRATION",
      "switchport vlan 20 name ADMINISTRATION",
    ],
    correct: 1,
    explanation: "Il faut deux commandes : `vlan 20` (entre dans le mode vlan-config) puis `name ADMINISTRATION`. La commande `vlan X name Y` en une seule ligne n'existe pas en IOS standard.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle commande assigne le port Fa0/5 au VLAN 10 en mode access ?",
    options: [
      "switchport access vlan 10 (seule)",
      "switchport mode access puis switchport access vlan 10",
      "vlan 10 access interface fa0/5",
      "port access vlan 10",
    ],
    correct: 1,
    explanation: "La sequence correcte : `switchport mode access` (force le port en mode access) puis `switchport access vlan 10` (assigne le VLAN). L'ordre est important - certains IOS rejettent `switchport access vlan` sans le mode access explicite.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande configure un port trunk en autorisant uniquement les VLANs 10, 20 et 30 ?",
    options: [
      "switchport mode trunk puis switchport trunk allowed vlan 10,20,30",
      "switchport trunk vlan 10 20 30",
      "switchport trunk allowed 10,20,30",
      "trunk vlans 10,20,30",
    ],
    correct: 0,
    explanation: "`switchport mode trunk` configure le mode trunk, puis `switchport trunk allowed vlan 10,20,30` restreint les VLANs autorises sur ce trunk. Sans cette restriction, tous les VLANs sont autorises.",
  },
  {
    id: 14, type: "qcm",
    question: "Dans la methode Router-on-a-Stick, quelle commande associe la sous-interface Gi0/0.10 au VLAN 10 ?",
    options: [
      "vlan 10",
      "switchport access vlan 10",
      "encapsulation dot1q 10",
      "dot1q vlan 10",
    ],
    correct: 2,
    explanation: "`encapsulation dot1q 10` associe la sous-interface au VLAN 10. Le routeur tagguera/detagguera automatiquement les trames 802.1Q pour ce VLAN. La sous-interface doit ensuite avoir une IP avec `ip address`.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande active le routage IP sur un switch Layer 3 pour le routage inter-VLAN ?",
    options: [
      "routing enable",
      "ip routing",
      "l3 routing",
      "ip inter-vlan routing",
    ],
    correct: 1,
    explanation: "`ip routing` active le routage IP en materiel sur un switch Layer 3. Sans cette commande, les SVI (interface vlan X) sont accessibles mais ne routent pas le trafic entre VLANs.",
  },
  {
    id: 16, type: "qcm",
    question: "Quel mode VTP empeche un switch de modifier la base VLAN du domaine mais lui permet de gerer ses propres VLANs localement ?",
    options: [
      "Mode server",
      "Mode client",
      "Mode transparent",
      "Mode off",
    ],
    correct: 2,
    explanation: "Le mode `transparent` permet au switch de gerer ses propres VLANs sans participer a VTP. Il ne modifie pas la base du domaine et relaie simplement les messages VTP. Ideal pour les switches avec des VLANs specifiques.",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle commande ajoute le VLAN 40 a la liste des VLANs autorises sur un trunk existant sans supprimer les autres ?",
    options: [
      "switchport trunk allowed vlan 40",
      "switchport trunk allowed vlan add 40",
      "switchport trunk add vlan 40",
      "add trunk vlan 40",
    ],
    correct: 1,
    explanation: "`switchport trunk allowed vlan add 40` ajoute le VLAN 40 a la liste existante. `switchport trunk allowed vlan 40` (sans `add`) REMPLACE toute la liste par le seul VLAN 40 - attention a ne pas perdre les VLANs existants.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande desactive DTP (la negociation automatique du trunk) sur un port ?",
    options: [
      "no dtp",
      "switchport nonegotiate",
      "dtp disable",
      "switchport mode nodtp",
    ],
    correct: 1,
    explanation: "`switchport nonegotiate` desactive DTP sur le port. A utiliser apres avoir force le mode avec `switchport mode trunk` ou `switchport mode access`. Recommande en production pour eviter les attaques VLAN hopping.",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande affiche les interfaces en mode trunk et les VLANs qu'elles transportent ?",
    options: [
      "show vlan brief",
      "show interfaces trunk",
      "show trunk interfaces",
      "show vtp status",
    ],
    correct: 1,
    explanation: "`show interfaces trunk` affiche toutes les interfaces trunk, les VLANs autorises, les VLANs actifs et les VLANs en forwarding. `show vlan brief` montre les ports access, pas les trunks.",
  },
  {
    id: 20, type: "qcm",
    question: "Quelle est la priorite de selection des routes VTP : un switch client avec une revision plus elevee peut-il ecraser la base VLAN du serveur ?",
    options: [
      "Non, le serveur VTP a toujours priorite",
      "Oui, VTP se base sur le numero de revision le plus eleve, peu importe le mode",
      "Non, seul le mode server peut modifier la base",
      "Oui, mais seulement si les domaines VTP sont identiques",
    ],
    correct: 1,
    explanation: "DANGER VTP : un switch client avec un numero de revision superieur PEUT ecraser la base VLAN du serveur. C'est pourquoi il faut toujours reinitialiser le compteur de revision (changer le domaine VTP puis le remettre) avant d'ajouter un nouveau switch.",
  },
];

export default function QuizVlans() {
  return <QuizEngine questions={questions} title="Configuration des VLANs" courseLink="/cours/networking/switching/vlans" />;
}

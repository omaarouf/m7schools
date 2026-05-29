import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "LACP (IEEE 802.3ad) est un protocole de negociation EtherChannel proprietaire Cisco.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. LACP est le standard IEEE 802.3ad, ouvert et compatible avec tous les constructeurs. PAgP (Port Aggregation Protocol) est le protocole proprietaire Cisco.",
  },
  {
    id: 2, type: "vf",
    question: "Un EtherChannel peut regrouper entre 2 et 8 interfaces physiques en un seul lien logique.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. EtherChannel supporte de 2 a 8 liens physiques. Avec 8 liens de 1 Gbps, le Port-Channel logique offre jusqu'a 8 Gbps de bande passante agregee.",
  },
  {
    id: 3, type: "vf",
    question: "STP traite un EtherChannel (Port-Channel) comme plusieurs liens physiques separees, pouvant en bloquer certains.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. STP voit le Port-Channel comme un SEUL lien logique. Cela signifie qu'il n'y a pas de blocage STP sur les liens membres. L'EtherChannel combine redondance et bande passante sans STP ne bloquant les liens.",
  },
  {
    id: 4, type: "vf",
    question: "Deux switches en mode PAgP `auto` - `auto` peuvent former un EtherChannel.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `auto` - `auto` ne forment PAS d'EtherChannel car aucun des deux ne prend l'initiative. Pour fonctionner avec PAgP : `desirable-desirable` ou `desirable-auto`. Avec LACP : `active-active` ou `active-passive`.",
  },
  {
    id: 5, type: "vf",
    question: "Tous les ports d'un EtherChannel doivent avoir la meme vitesse, le meme mode duplex et la meme configuration VLAN.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Des incoherences de configuration (vitesse, duplex, VLAN, trunk/access) entre les ports membres empechent la formation de l'EtherChannel. IOS signale l'erreur et les ports restent en mode individuel.",
  },
  {
    id: 6, type: "vf",
    question: "Le mode `on` (statique) negocie automatiquement l'EtherChannel avec LACP ou PAgP.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Le mode `on` force la creation de l'EtherChannel SANS protocole de negociation. Les deux cotes doivent etre en mode `on`. C'est deconseille en production car il n'y a pas de detection d'erreurs.",
  },
  {
    id: 7, type: "vf",
    question: "La configuration d'un Port-Channel (trunk, VLAN) s'applique automatiquement a tous les ports membres.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Configurer l'interface `port-channel 1` propage automatiquement la configuration (trunk, VLANs autorises, native VLAN) sur tous les ports membres. Il ne faut pas configurer les ports physiques individuellement.",
  },
  {
    id: 8, type: "vf",
    question: "La commande `show etherchannel summary` affiche les flags : `P` signifie que le port est en mode Passif (passive).",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Dans `show etherchannel summary`, `P` signifie 'bundled in Port-channel' (port correctement integre dans le groupe). `D` = port down, `I` = stand-alone (independant), `U` = in use.",
  },
  {
    id: 9, type: "vf",
    question: "LACP en mode `passive` - `passive` forme un EtherChannel.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `passive` - `passive` ne forme PAS d'EtherChannel car les deux attendent que l'autre prenne l'initiative. Pour LACP : `active-active` ou `active-passive` fonctionnent. `passive-passive` ne fonctionne pas.",
  },
  {
    id: 10, type: "vf",
    question: "Un EtherChannel assure la redondance : si un lien physique tombe, le trafic bascule automatiquement sur les liens restants.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. C'est l'un des avantages cles de l'EtherChannel : si un des liens membres tombe, le trafic est redistribue automatiquement sur les liens restants, sans interruption visible.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande configure les ports Fa0/1 et Fa0/2 en EtherChannel LACP mode actif (groupe 1) ?",
    options: [
      "interface range fa0/1 - 2 / channel-group 1 mode active",
      "interface range fa0/1 - 2 / lacp group 1 active",
      "etherchannel 1 lacp active fa0/1 fa0/2",
      "interface range fa0/1 - 2 / port-channel 1 active",
    ],
    correct: 0,
    explanation: "`interface range fa0/1 - 2` selectionne les ports, puis `channel-group 1 mode active` les ajoute au groupe 1 en mode LACP actif. Le groupe 1 correspond a `port-channel 1`.",
  },
  {
    id: 12, type: "qcm",
    question: "Quel protocole EtherChannel est recommande pour un environnement multi-constructeurs ?",
    options: [
      "PAgP mode desirable",
      "PAgP mode auto",
      "LACP mode active",
      "Mode statique (on)",
    ],
    correct: 2,
    explanation: "LACP (IEEE 802.3ad) est le standard ouvert compatible avec tous les constructeurs (Cisco, HP, Juniper...). PAgP est proprietaire Cisco. LACP mode `active` prend l'initiative de la negociation.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande configure le Port-Channel 1 en mode trunk en autorisant les VLANs 10, 20, 30 ?",
    options: [
      "interface fa0/1 / switchport mode trunk / switchport trunk allowed vlan 10,20,30",
      "interface port-channel 1 / switchport mode trunk / switchport trunk allowed vlan 10,20,30",
      "port-channel 1 trunk vlans 10,20,30",
      "channel-group 1 / trunk vlan 10,20,30",
    ],
    correct: 1,
    explanation: "Configurer l'interface `port-channel 1` : `switchport mode trunk` puis `switchport trunk allowed vlan 10,20,30`. Cette configuration se propage automatiquement aux interfaces physiques membres.",
  },
  {
    id: 14, type: "qcm",
    question: "Dans `show etherchannel summary`, que signifie `SU` affiché sur le Port-Channel ?",
    options: [
      "Suspended et Unavailable",
      "Switched (L2) et in Use (fonctionnel)",
      "Static et Up",
      "Server et Used",
    ],
    correct: 1,
    explanation: "`S` = Switched (Layer 2) et `U` = in Use (le groupe est fonctionnel). Si le Port-Channel affiche `SD` ou `RD`, le groupe est en probleme. `R` signifie Layer 3 (routed).",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle combinaison de modes PAgP forme un EtherChannel ?",
    options: [
      "auto - auto",
      "desirable - desirable",
      "passive - passive",
      "auto - passive",
    ],
    correct: 1,
    explanation: "Avec PAgP : `desirable-desirable` OU `desirable-auto`. `auto-auto` ne fonctionne pas. Avec LACP : `active-active` ou `active-passive`. La regle : au moins un cote doit prendre l'initiative.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle commande affiche les voisins LACP detectes sur le switch ?",
    options: [
      "show etherchannel summary",
      "show lacp neighbor",
      "show channel group",
      "show lacp interfaces",
    ],
    correct: 1,
    explanation: "`show lacp neighbor` affiche les voisins LACP avec leurs identifiants, capacites et etat. `show pagp neighbor` fait l'equivalent pour PAgP. `show etherchannel summary` donne la vue globale des groupes.",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle est la difference principale entre PAgP `desirable` et LACP `active` ?",
    options: [
      "Aucune difference - les deux sont des modes actifs equivalents",
      "PAgP `desirable` ne supporte que 4 liens, LACP `active` supporte 8",
      "PAgP `desirable` est Cisco proprietaire, LACP `active` est un standard IEEE",
      "LACP `active` necessite plus de bande passante pour la negociation",
    ],
    correct: 2,
    explanation: "La difference cle : PAgP est un protocole proprietaire Cisco (ne fonctionne qu'entre equipements Cisco), tandis que LACP est un standard IEEE 802.3ad compatible avec tous les constructeurs. Les deux sont des modes 'actifs' qui initient la negociation.",
  },
  {
    id: 18, type: "qcm",
    question: "Combien de liens physiques maximum peut contenir un EtherChannel sur un switch Cisco ?",
    options: ["4", "6", "8", "16"],
    correct: 2,
    explanation: "Un EtherChannel Cisco supporte de 2 a 8 liens physiques. Par exemple, 8 liens de 1 Gbps forment un Port-Channel de 8 Gbps. LACP peut negocier jusqu'a 16 liens (8 actifs + 8 en standby).",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande affiche les details complets du groupe EtherChannel 1 ?",
    options: [
      "show etherchannel 1",
      "show etherchannel 1 detail",
      "show port-channel 1 detail",
      "show channel-group 1",
    ],
    correct: 1,
    explanation: "`show etherchannel 1 detail` affiche tous les details du groupe 1 : protocole, ports membres, etat, statistiques. `show etherchannel summary` donne la vue condensee de tous les groupes.",
  },
  {
    id: 20, type: "qcm",
    question: "Si un port d'un EtherChannel affiche le flag `I` dans `show etherchannel summary`, que signifie-t-il ?",
    options: [
      "Le port est Inactive (inactif physiquement)",
      "Le port est stand-alone (ne fait pas partie du bundle)",
      "Le port est en mode Initiating la negociation",
      "Le port est en mode Internal (non visible de l'exterieur)",
    ],
    correct: 1,
    explanation: "`I` = stand-alone : le port ne fait pas partie du bundle EtherChannel. Cela peut indiquer une incoherence de configuration entre les ports (vitesse, duplex, VLAN differents) qui empeche la formation du groupe.",
  },
];

export default function QuizEtherChannel() {
  return <QuizEngine questions={questions} title="EtherChannel" courseLink="/cours/networking/switching/etherchannel" />;
}

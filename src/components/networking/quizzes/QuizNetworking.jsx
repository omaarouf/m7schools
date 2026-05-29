import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "Un VLAN permet de segmenter logiquement un reseau sans avoir besoin de routeur supplementaire sur le meme switch ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Les VLANs creent des domaines de broadcast separes au niveau logique. Toutefois, pour communiquer entre VLANs, un routeur ou un switch de couche 3 est necessaire.",
  },
  {
    id: 2, type: "vf",
    question: "Un port trunk transporte le trafic d'un seul VLAN entre les switches ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Un port trunk transporte le trafic de plusieurs VLANs simultanement en utilisant l'encapsulation 802.1Q (ou ISL). Un port access, lui, n'appartient qu'a un seul VLAN.",
  },
  {
    id: 3, type: "vf",
    question: "STP (Spanning Tree Protocol) empeche les boucles de commutation en bloquant certains ports ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. STP desactive logiquement les ports redondants pour creer une topologie sans boucle. Si un lien principal tombe, STP reactive les ports bloques.",
  },
  {
    id: 4, type: "vf",
    question: "OSPF est un protocole de routage a vecteur de distance comme RIP ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. OSPF est un protocole a etat de lien (Link-State). Il construit une carte complete de la topologie reseau via les LSA. RIP est un protocole a vecteur de distance.",
  },
  {
    id: 5, type: "vf",
    question: "Une ACL standard filtre uniquement sur l'adresse IP source ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Les ACL standard (numerotees 1-99 et 1300-1999) filtrent uniquement sur l'adresse IP source. Les ACL etendues filtrent sur source, destination, protocole et port.",
  },
  {
    id: 6, type: "vf",
    question: "NAT Overload (PAT) permet a plusieurs clients d'utiliser une seule adresse IP publique en differenciант les sessions par les numeros de port ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. PAT (Port Address Translation) mappe plusieurs adresses privees sur une seule adresse publique en utilisant des numeros de port differents pour chaque session.",
  },
  {
    id: 7, type: "vf",
    question: "HSRP (Hot Standby Router Protocol) est un protocole standard IEEE ouvert ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. HSRP est proprietaire Cisco. Le standard IEEE ouvert equivalent est VRRP (Virtual Router Redundancy Protocol). GLBP est aussi proprietaire Cisco.",
  },
  {
    id: 8, type: "vf",
    question: "EtherChannel permet d'agreger plusieurs liens physiques en un seul lien logique pour augmenter la bande passante ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. EtherChannel (IEEE 802.3ad / LACP) regroupe jusqu'a 8 liens physiques en un seul lien logique, multipliant la bande passante et assurant la redondance.",
  },
  {
    id: 9, type: "vf",
    question: "EIGRP est un protocole de routage proprietaire Cisco ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. EIGRP (Enhanced Interior Gateway Routing Protocol) est un protocole hybride proprietaire Cisco. Cisco a publie une version limitee en RFC 7868, mais l'implementation complete reste Cisco.",
  },
  {
    id: 10, type: "vf",
    question: "La commande `show ip route` affiche uniquement les routes configurees manuellement (routes statiques) ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `show ip route` affiche toutes les routes : statiques (S), directement connectees (C), RIP (R), OSPF (O), EIGRP (D), BGP (B), etc.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande Cisco cree le VLAN 10 et lui donne le nom 'RH' ?",
    options: [
      "vlan 10 name RH",
      "switchport vlan 10 name RH",
      "vlan 10 / name RH (en mode vlan-config)",
      "create vlan 10 RH",
    ],
    correct: 2,
    explanation: "En mode de configuration globale : `vlan 10` entre dans le mode vlan-config, puis `name RH` lui attribue un nom. La commande `vlan 10 name RH` en une ligne n'existe pas en IOS.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle commande configure un port en mode trunk sur un switch Cisco ?",
    options: [
      "switchport mode trunk",
      "switchport trunk enable",
      "interface trunk on",
      "switchport access trunk",
    ],
    correct: 0,
    explanation: "`switchport mode trunk` configure le port en mode trunk IEEE 802.1Q. A utiliser en mode interface : `interface Gi0/1` puis `switchport mode trunk`.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle est la distance administrative d'OSPF sur un routeur Cisco ?",
    options: ["90", "100", "110", "120"],
    correct: 2,
    explanation: "Distance administrative OSPF = 110. Pour comparaison : EIGRP = 90, RIP = 120, statique = 1, directement connecte = 0.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle commande configure une route statique par defaut sur un routeur Cisco ?",
    options: [
      "ip route default 0.0.0.0 [next-hop]",
      "ip route 0.0.0.0 0.0.0.0 [next-hop]",
      "ip default-route 0.0.0.0 [next-hop]",
      "route default [next-hop]",
    ],
    correct: 1,
    explanation: "`ip route 0.0.0.0 0.0.0.0 [next-hop]` configure la route par defaut. Le masque `0.0.0.0` signifie 'toutes les destinations'.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande applique une ACL nommee 'BLOCK_HTTP' en entree sur une interface ?",
    options: [
      "ip access-group BLOCK_HTTP in",
      "ip access-list BLOCK_HTTP in",
      "apply access-list BLOCK_HTTP inbound",
      "ip acl BLOCK_HTTP input",
    ],
    correct: 0,
    explanation: "`ip access-group NOM in` applique une ACL en entree sur l'interface. `in` = trafic entrant, `out` = trafic sortant.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle commande active NAT Overload (PAT) sur l'interface de sortie ?",
    options: [
      "ip nat outside overload",
      "ip nat inside source list 1 interface Gi0/0 overload",
      "ip nat overload enable",
      "nat pat interface Gi0/0",
    ],
    correct: 1,
    explanation: "`ip nat inside source list 1 interface Gi0/0 overload` : traduit les adresses de la liste ACL 1 vers l'IP de Gi0/0 avec PAT (mot-cle `overload`).",
  },
  {
    id: 17, type: "qcm",
    question: "Quel protocole EtherChannel est proprietaire Cisco ?",
    options: ["LACP", "PAgP", "802.3ad", "LLDP"],
    correct: 1,
    explanation: "PAgP (Port Aggregation Protocol) est proprietaire Cisco. LACP (802.3ad) est le standard IEEE ouvert. Les deux permettent de negocier un EtherChannel automatiquement.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande configure Port-Security pour autoriser maximum 2 adresses MAC et bloquer en cas de violation ?",
    options: [
      "switchport port-security maximum 2 / switchport port-security violation shutdown",
      "port-security max 2 action shutdown",
      "switchport security limit 2 violation drop",
      "ip port-security maximum 2",
    ],
    correct: 0,
    explanation: "Deux commandes en mode interface : `switchport port-security maximum 2` definit la limite, `switchport port-security violation shutdown` desactive le port en cas de violation.",
  },
  {
    id: 19, type: "qcm",
    question: "Dans OSPF, quelle commande annonce le reseau 192.168.1.0/24 dans la zone 0 ?",
    options: [
      "network 192.168.1.0 255.255.255.0 area 0",
      "network 192.168.1.0 0.0.0.255 area 0",
      "ospf network 192.168.1.0/24 area 0",
      "advertise 192.168.1.0 255.255.255.0 area 0",
    ],
    correct: 1,
    explanation: "OSPF utilise le masque inverse (wildcard) : `network 192.168.1.0 0.0.0.255 area 0`. Le masque inverse est le complement du masque normal (255.255.255.255 - masque normal).",
  },
  {
    id: 20, type: "qcm",
    question: "Quelle commande affiche le switch elu Root Bridge dans la topologie STP ?",
    options: [
      "show stp root",
      "show spanning-tree",
      "show spanning-tree root",
      "show bridge root",
    ],
    correct: 1,
    explanation: "`show spanning-tree` affiche l'etat STP complet : le Root Bridge, les ports root/designated/blocked, et la priorite de chaque switch. `show spanning-tree root` donne aussi l'info mais de facon reduite.",
  },
];

export default function QuizNetworking() {
  return <QuizEngine questions={questions} title="Conception Reseau" courseLink="/cours/networking/intro" />;
}

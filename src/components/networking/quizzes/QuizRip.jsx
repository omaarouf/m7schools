import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "RIP est un protocole de routage a vecteur de distance qui utilise le nombre de sauts comme metrique.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. RIP (Routing Information Protocol) mesure le cout en nombre de sauts (hops). Un saut = un routeur traverse. La limite est 15 sauts ; 16 signifie 'inaccessible'.",
  },
  {
    id: 2, type: "vf",
    question: "RIPv2 envoie ses mises a jour en broadcast, tout comme RIPv1.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. RIPv2 utilise le multicast 224.0.0.9 pour envoyer ses mises a jour, tandis que RIPv1 utilise le broadcast. Le multicast est plus efficace car seuls les routeurs RIP ecoutent sur cette adresse.",
  },
  {
    id: 3, type: "vf",
    question: "RIP envoie des mises a jour de routage toutes les 30 secondes, meme si la topologie n'a pas change.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. RIP est un protocole a mises a jour periodiques : il envoie toute sa table de routage toutes les 30 secondes, independamment des changements. OSPF et EIGRP n'envoient des mises a jour que lors d'evenements.",
  },
  {
    id: 4, type: "vf",
    question: "La commande `no auto-summary` est optionnelle dans RIPv2 et n'affecte pas les reseaux VLSM.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `no auto-summary` est INDISPENSABLE avec RIPv2 pour eviter la summarisation automatique au niveau des frontieres de classes. Sans elle, des reseaux VLSM discontinus peuvent etre annonces incorrectement.",
  },
  {
    id: 5, type: "vf",
    question: "RIPng est la version IPv6 de RIP et se configure sous le mode `router rip`, comme RIPv2.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. RIPng se configure differemment : le processus est cree avec `ipv6 router rip NOM`, puis active directement sur chaque interface avec `ipv6 rip NOM enable`. Il n'y a pas de commande `network` sous RIPng.",
  },
  {
    id: 6, type: "vf",
    question: "Une interface passive RIP recoit les mises a jour RIP mais n'en envoie pas.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `passive-interface` empeche l'envoi de mises a jour RIP sur l'interface (LAN) tout en permettant la reception. Cela reduit le trafic inutile et empeche les hotes du LAN de recevoir des tables de routage.",
  },
  {
    id: 7, type: "vf",
    question: "RIPv1 supporte le VLSM (Variable Length Subnet Masking) et peut annonces des sous-reseaux de tailles differentes.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. RIPv1 est un protocole classful - il n'inclut pas le masque dans ses mises a jour et ne supporte pas le VLSM. RIPv2 est classless et supporte le VLSM grace a l'inclusion du masque dans les mises a jour.",
  },
  {
    id: 8, type: "vf",
    question: "La distance administrative de RIP est 120 sur un routeur Cisco.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. DA de RIP = 120. Pour comparaison : directement connecte = 0, statique = 1, EIGRP = 90, OSPF = 110, RIP = 120. Une route OSPF (DA=110) est preferee a une route RIP (DA=120) vers le meme reseau.",
  },
  {
    id: 9, type: "vf",
    question: "`default-information originate` dans RIPv2 permet d'annoncer la route par defaut aux voisins RIP.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `default-information originate` distribue la route par defaut (0.0.0.0/0) dans les mises a jour RIP vers les voisins. Les routeurs RIP voisins l'installeront comme leur passerelle de dernier recours.",
  },
  {
    id: 10, type: "vf",
    question: "RIP convient parfaitement aux reseaux d'entreprise de grande taille avec plus de 20 routeurs.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. RIP est limite a 15 sauts - un reseau de plus de 15 routeurs en serie est impossible avec RIP. Il est adapte aux petits reseaux uniquement. Pour les grandes entreprises : OSPF ou EIGRP.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle sequence de commandes active RIPv2 et annonce les reseaux 192.168.1.0 et 10.0.0.0 ?",
    options: [
      "router rip / version 2 / no auto-summary / network 192.168.1.0 / network 10.0.0.0",
      "ip rip version 2 / network 192.168.1.0 / network 10.0.0.0",
      "router rip 2 / network 192.168.1.0 / network 10.0.0.0",
      "rip version 2 / advertise 192.168.1.0 / advertise 10.0.0.0",
    ],
    correct: 0,
    explanation: "La sequence correcte : `router rip` (entre en mode config RIP), `version 2` (active RIPv2), `no auto-summary` (indispensable pour VLSM), puis `network X` pour chaque reseau. Les reseaux sont en notation classful.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle est la metrique maximale utilisable dans RIP avant qu'un reseau soit considere inaccessible ?",
    options: ["10", "15", "16", "255"],
    correct: 1,
    explanation: "La metrique maximale de RIP est 15 sauts. Un reseau a 16 sauts (ou plus) est considere comme inaccessible (infinite metric). C'est la limite de scalabilite de RIP.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande empeche l'interface Gi0/0 d'envoyer des mises a jour RIP vers le LAN ?",
    options: [
      "no rip on interface gi0/0",
      "router rip / passive-interface gigabitethernet 0/0",
      "interface gi0/0 / rip passive",
      "router rip / no network gi0/0",
    ],
    correct: 1,
    explanation: "Sous le mode `router rip`, la commande `passive-interface gigabitethernet 0/0` arrete l'envoi des mises a jour RIP sur cette interface. L'interface reste incluse dans les annonces RIP, mais n'envoie plus de mises a jour.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle est la frequence d'envoi des mises a jour RIP par defaut ?",
    options: [
      "Toutes les 10 secondes",
      "Toutes les 30 secondes",
      "Toutes les 90 secondes",
      "A chaque changement de topologie uniquement",
    ],
    correct: 1,
    explanation: "RIP envoie ses mises a jour toutes les 30 secondes. C'est une mise a jour periodique complete (toute la table de routage). Ce comportement est inefficace sur les grands reseaux - OSPF et EIGRP n'envoient que des mises a jour incrementales.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande affiche les routes apprises via RIP dans la table de routage ?",
    options: [
      "show ip rip database",
      "show ip protocols",
      "show ip route rip",
      "debug ip rip",
    ],
    correct: 2,
    explanation: "`show ip route rip` filtre la table de routage pour n'afficher que les routes apprises via RIP (code `R`). `show ip rip database` montre la base de donnees RIP. `show ip protocols` montre les parametres du protocole.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle adresse multicast RIPv2 utilise pour envoyer ses mises a jour ?",
    options: [
      "224.0.0.5",
      "224.0.0.6",
      "224.0.0.9",
      "224.0.0.10",
    ],
    correct: 2,
    explanation: "RIPv2 utilise 224.0.0.9 pour ses mises a jour multicast. 224.0.0.5 et 224.0.0.6 sont utilises par OSPF (tous les routeurs / DR-BDR). 224.0.0.10 est utilise par EIGRP.",
  },
  {
    id: 17, type: "qcm",
    question: "Comment activer RIPng sur l'interface Gi0/0 avec le processus nomme 'RIP_V6' ?",
    options: [
      "router rip / ipv6 network 2001:db8:1::/64",
      "interface gi0/0 / ipv6 rip RIP_V6 enable",
      "ipv6 router rip / network ipv6",
      "interface gi0/0 / rip ipv6 enable RIP_V6",
    ],
    correct: 1,
    explanation: "Pour RIPng, apres avoir cree le processus avec `ipv6 router rip RIP_V6`, il faut activer RIPng sur chaque interface : `interface gigabitethernet 0/0` puis `ipv6 rip RIP_V6 enable`. RIPng se configure par interface, pas avec `network`.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande permet de voir les mises a jour RIP en temps reel pour le diagnostic ?",
    options: [
      "show ip rip updates",
      "debug ip rip",
      "monitor ip rip",
      "show ip rip detail",
    ],
    correct: 1,
    explanation: "`debug ip rip` affiche les mises a jour RIP en temps reel. ATTENTION : cette commande genere beaucoup de messages. Toujours desactiver avec `no debug ip rip` ou `undebug all` apres utilisation.",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle est la principale difference entre RIPv1 et RIPv2 en termes de support des sous-reseaux ?",
    options: [
      "RIPv1 supporte VLSM, RIPv2 non",
      "Les deux supportent VLSM de la meme facon",
      "RIPv1 est classful (pas de masque dans les mises a jour), RIPv2 est classless (masque inclus)",
      "RIPv2 supporte uniquement les masques /24",
    ],
    correct: 2,
    explanation: "RIPv1 est classful : il n'inclut pas le masque de sous-reseau dans ses mises a jour, donc il ne supporte pas VLSM. RIPv2 est classless : il inclut le masque, supportant VLSM et CIDR. C'est pourquoi RIPv1 est obsolete.",
  },
  {
    id: 20, type: "qcm",
    question: "Quelle commande affiche les parametres RIP actifs : version, interfaces actives, voisins ?",
    options: [
      "show rip status",
      "show ip rip database",
      "show ip protocols",
      "show ip rip neighbors",
    ],
    correct: 2,
    explanation: "`show ip protocols` affiche tous les parametres du protocole de routage actif : version RIP, intervalles, interfaces actives, interfaces passives, voisins et routes redistribuees. C'est la commande de reference pour diagnostiquer la configuration RIP.",
  },
];

export default function QuizRip() {
  return <QuizEngine questions={questions} title="RIP & RIPng" courseLink="/cours/networking/routing/rip" />;
}

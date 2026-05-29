import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "EIGRP est un protocole de routage hybride qui combine les avantages des protocoles a vecteur de distance et a etat de lien.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. EIGRP (Enhanced Interior Gateway Routing Protocol) est dit 'hybride' : il envoie des mises a jour declenchees par evenements (comme les protocoles a etat de lien) mais calcule des routes via une table de voisinage et de topologie (comme les vecteurs de distance avances).",
  },
  {
    id: 2, type: "vf",
    question: "La distance administrative d'EIGRP pour les routes internes est 90.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. DA EIGRP interne = 90. DA EIGRP externe (routes redistribuees) = 170. EIGRP est prefere a OSPF (DA=110) et RIP (DA=120) pour les routes internes.",
  },
  {
    id: 3, type: "vf",
    question: "Le numero AS EIGRP est uniquement un identifiant local et n'a pas besoin d'etre identique entre les routeurs voisins.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Le numero AS EIGRP DOIT etre identique sur tous les routeurs qui doivent echanger des routes. Des routeurs avec des numeros AS differents ne forment pas de relation de voisinage.",
  },
  {
    id: 4, type: "vf",
    question: "EIGRP utilise l'algorithme DUAL pour calculer les routes et garantir des chemins sans boucle.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. DUAL (Diffusing Update ALgorithm) est l'algorithme de calcul de routes d'EIGRP. Il garantit l'absence de boucles de routage et permet une convergence tres rapide en utilisant les successeurs feasibles pre-calcules.",
  },
  {
    id: 5, type: "vf",
    question: "Un 'successeur feasible' dans EIGRP est le meilleur chemin actif vers une destination, installe dans la table de routage.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Le 'successeur' (pas feasible) est le meilleur chemin installe dans la table de routage. Le 'successeur feasible' est un chemin de SECOURS pre-calcule dans la table de topologie. Si le successeur tombe, le basculement est instantane.",
  },
  {
    id: 6, type: "vf",
    question: "La commande `no auto-summary` est necessaire dans EIGRP pour eviter la summarisation automatique et supporter VLSM.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Comme RIPv2, EIGRP fait de la summarisation automatique par defaut au niveau des frontieres de classes. `no auto-summary` desactive ce comportement pour supporter correctement le VLSM et les reseaux discontinus.",
  },
  {
    id: 7, type: "vf",
    question: "EIGRP utilise le multicast 224.0.0.10 pour communiquer avec ses voisins.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. EIGRP utilise l'adresse multicast 224.0.0.10 (All EIGRP Routers). Pour comparaison : OSPF utilise 224.0.0.5/6, RIPv2 utilise 224.0.0.9.",
  },
  {
    id: 8, type: "vf",
    question: "EIGRP maintient trois tables distinctes : table de voisinage, table de topologie et table de routage.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Les trois tables EIGRP : 1) Neighbor Table (voisins adjacents), 2) Topology Table (toutes les routes connues avec metriques - inclut successeurs feasibles), 3) Routing Table (uniquement les meilleurs chemins - successeurs).",
  },
  {
    id: 9, type: "vf",
    question: "EIGRP est uniquement proprietaire Cisco et ne peut pas fonctionner entre equipements de constructeurs differents.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX (partiellement). EIGRP etait proprietaire Cisco, mais Cisco l'a ouvert partiellement en publiant la RFC 7868 en 2016. Cependant, l'implementation complete avec toutes les fonctionnalites avancees reste specifique a Cisco.",
  },
  {
    id: 10, type: "vf",
    question: "La FD (Feasible Distance) est la metrique totale vers une destination vue par le routeur voisin.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. FD (Feasible Distance) = metrique totale depuis LE ROUTEUR LOCAL vers la destination. AD (Advertised Distance) = metrique annoncee par le VOISIN vers la destination. FD = metrique du lien local + AD du voisin.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle sequence active EIGRP AS 100 et annonce les reseaux 192.168.1.0/24 et 10.0.0.0/30 ?",
    options: [
      "router eigrp 100 / no auto-summary / network 192.168.1.0 0.0.0.255 / network 10.0.0.0 0.0.0.3",
      "eigrp 100 / network 192.168.1.0 / network 10.0.0.0",
      "router eigrp / as 100 / network 192.168.1.0/24",
      "ip eigrp 100 / advertise 192.168.1.0 10.0.0.0",
    ],
    correct: 0,
    explanation: "`router eigrp 100` (AS 100), `no auto-summary` (indispensable), `network 192.168.1.0 0.0.0.255` et `network 10.0.0.0 0.0.0.3` (avec masques wildcard). EIGRP utilise les wildcards comme OSPF.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle metrique EIGRP utilise par defaut pour calculer la meilleure route ?",
    options: [
      "Nombre de sauts uniquement",
      "Bande passante uniquement",
      "Bande passante et delai",
      "Cout base sur la bande passante (comme OSPF)",
    ],
    correct: 2,
    explanation: "EIGRP utilise par defaut : bande passante (BW) du lien le plus lent + delai cumulatif (Delay) de tous les liens. La metrique est calculee avec la formule EIGRP K-values (K1 et K3 par defaut). La charge (K2) et la fiabilite (K5) sont desactivees.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande affiche la table de topologie EIGRP avec tous les successeurs et successeurs feasibles ?",
    options: [
      "show ip eigrp neighbors",
      "show ip route eigrp",
      "show ip eigrp topology",
      "show ip eigrp database",
    ],
    correct: 2,
    explanation: "`show ip eigrp topology` affiche la table de topologie complete : successeurs (installes en routing table) et successeurs feasibles (backup). `show ip eigrp topology all-links` inclut aussi les routes qui ne remplissent pas la condition de feasibilite.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle distance administrative s'applique aux routes EIGRP redistribuees depuis un autre protocole ?",
    options: ["90", "110", "150", "170"],
    correct: 3,
    explanation: "Routes EIGRP internes = DA 90. Routes EIGRP externes (redistribuees depuis OSPF, RIP, statiques...) = DA 170. Cette distinction permet de preferer les routes EIGRP natives aux routes redistribuees.",
  },
  {
    id: 15, type: "qcm",
    question: "Comment configurer toutes les interfaces comme passives dans EIGRP, sauf Serial 0/0/0 ?",
    options: [
      "router eigrp 10 / passive-interface all / no passive-interface serial 0/0/0",
      "router eigrp 10 / passive-interface default / no passive-interface serial 0/0/0",
      "router eigrp 10 / passive-interface all except serial 0/0/0",
      "interface all / eigrp passive / interface serial 0/0/0 / no eigrp passive",
    ],
    correct: 1,
    explanation: "`passive-interface default` rend TOUTES les interfaces passives, puis `no passive-interface serial 0/0/0` reactive EIGRP uniquement sur les liens inter-routeurs. C'est plus efficace que de lister toutes les interfaces LAN individuellement.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle commande affiche les voisins EIGRP avec leur adresse IP, interface et temps de Hold ?",
    options: [
      "show ip eigrp topology",
      "show ip eigrp neighbors",
      "show ip route eigrp",
      "show ip protocols",
    ],
    correct: 1,
    explanation: "`show ip eigrp neighbors` affiche les voisins avec : adresse IP, interface locale, Hold time (temps avant timeout), Uptime, SRTT (ping moyen) et Q Cnt (0 = normal). Un Q Cnt non nul peut indiquer un probleme de lien.",
  },
  {
    id: 17, type: "qcm",
    question: "Comment forcer le Router-ID EIGRP manuellement a 3.3.3.3 ?",
    options: [
      "router eigrp 10 / router-id 3.3.3.3",
      "router eigrp 10 / eigrp router-id 3.3.3.3",
      "ip eigrp router-id 3.3.3.3 (en mode global)",
      "interface loopback 0 / ip address 3.3.3.3 255.255.255.255 (seul moyen)",
    ],
    correct: 1,
    explanation: "`eigrp router-id 3.3.3.3` sous `router eigrp X` configure manuellement le Router-ID. Sans cette commande, EIGRP utilise l'adresse loopback la plus haute ou l'IP d'interface active la plus haute.",
  },
  {
    id: 18, type: "qcm",
    question: "Pour annoncer la route par defaut via EIGRP, quelle commande utiliser sous `router eigrp` ?",
    options: [
      "default-information originate",
      "redistribute static",
      "network 0.0.0.0 0.0.0.0",
      "distribute-list default out",
    ],
    correct: 1,
    explanation: "`redistribute static` sous `router eigrp X` redistribue les routes statiques dans EIGRP, y compris la route par defaut `0.0.0.0/0`. Contrairement a OSPF qui utilise `default-information originate`, EIGRP utilise `redistribute static`.",
  },
  {
    id: 19, type: "qcm",
    question: "Que signifie un Q Cnt different de 0 dans la sortie de `show ip eigrp neighbors` ?",
    options: [
      "Le routeur voisin a beaucoup de routes EIGRP",
      "Des paquets EIGRP sont en attente de transmission vers ce voisin - peut indiquer un probleme",
      "Le voisin est en cours de synchronisation",
      "Le voisin a ete configure avec plus de reseaux",
    ],
    correct: 1,
    explanation: "Q Cnt (Queue Count) represente le nombre de paquets EIGRP en attente. 0 = normal. Un Q Cnt non nul persistant peut indiquer un probleme de bande passante ou de connectivite avec ce voisin.",
  },
  {
    id: 20, type: "qcm",
    question: "Quelle est la principale difference entre EIGRP et OSPF en termes de convergence ?",
    options: [
      "OSPF converge plus rapidement car il utilise Dijkstra",
      "Les deux convergent a la meme vitesse",
      "EIGRP converge plus rapidement grace aux successeurs feasibles pre-calcules (pas de recalcul SPF)",
      "EIGRP est plus lent car il envoie des mises a jour a tous les voisins",
    ],
    correct: 2,
    explanation: "EIGRP converge tres rapidement grace aux successeurs feasibles : si le meilleur chemin tombe, le routeur bascule instantanement sur le successeur feasible pre-calcule, sans recalcul. OSPF doit recalculer l'algorithme SPF a chaque changement.",
  },
];

export default function QuizEigrp() {
  return <QuizEngine questions={questions} title="EIGRP" courseLink="/cours/networking/routing/eigrp" />;
}

import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "OSPF est un protocole de routage a etat de lien qui calcule le chemin le plus court via l'algorithme Dijkstra (SPF).",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. OSPF (Open Shortest Path First) maintient une carte complete de la topologie (LSDB) et utilise l'algorithme SPF (Dijkstra) pour calculer le plus court chemin vers chaque destination.",
  },
  {
    id: 2, type: "vf",
    question: "La distance administrative d'OSPF est 110 sur un routeur Cisco.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. DA d'OSPF = 110. Pour comparaison : directement connecte = 0, statique = 1, EIGRP = 90, OSPF = 110, RIP = 120. EIGRP est prefere a OSPF si les deux annoncent le meme reseau.",
  },
  {
    id: 3, type: "vf",
    question: "Dans OSPF, le masque utilise dans la commande `network` est le masque normal (ex: 255.255.255.0).",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. OSPF utilise le masque INVERSE (wildcard) dans la commande `network`. Pour /24 : wildcard = 0.0.0.255. Le wildcard est le complement du masque normal (255.255.255.255 - masque normal).",
  },
  {
    id: 4, type: "vf",
    question: "Le Router-ID OSPF est toujours l'adresse IP la plus haute parmi toutes les interfaces actives.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. L'ordre de selection du Router-ID : 1) ID configure manuellement (`router-id`), 2) IP loopback la plus haute, 3) IP d'interface active la plus haute. La configuration manuelle est toujours prioritaire.",
  },
  {
    id: 5, type: "vf",
    question: "Les intervalles Hello et Dead OSPF doivent etre identiques sur les deux routeurs d'une liaison pour etablir la relation de voisinage.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Si les intervalles Hello ou Dead sont differents entre deux routeurs, la relation de voisinage ne s'etablit pas. Par defaut : Hello = 10 sec, Dead = 40 sec sur Ethernet.",
  },
  {
    id: 6, type: "vf",
    question: "Un voisin OSPF en etat FULL signifie que les deux routeurs ont synchronise leur LSDB et que le routage est operationnel.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. L'etat FULL est l'etat final souhaite : les deux routeurs ont echange et synchronise toute leur base de donnees LSDB (Link-State Database). Le routage est pleinement fonctionnel dans cet etat.",
  },
  {
    id: 7, type: "vf",
    question: "La bande passante de reference par defaut dans OSPF est 10 Gbps.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. La bande passante de reference par defaut est 100 Mbps. Cela signifie que FastEthernet (100 Mbps) et GigabitEthernet (1000 Mbps) ont le meme cout OSPF de 1. Il faut la changer a 1000 Mbps pour differencier les interfaces.",
  },
  {
    id: 8, type: "vf",
    question: "OSPFv3 garde le format d'adresse IPv4 pour le Router-ID meme dans un environnement purement IPv6.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. OSPFv3 maintient le format IPv4 (ex: 1.1.1.1) pour le Router-ID, meme sur des reseaux purement IPv6. C'est pourquoi il faut configurer une interface loopback avec une adresse IPv6 ou configurer le Router-ID manuellement.",
  },
  {
    id: 9, type: "vf",
    question: "OSPF envoie des mises a jour de routage toutes les 30 secondes, comme RIP.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. OSPF envoie des mises a jour DECLENCHEES PAR EVENEMENT - uniquement quand la topologie change. Il n'y a pas de mises a jour periodiques (contrairement a RIP). Cela reduit considerablement le trafic de routage.",
  },
  {
    id: 10, type: "vf",
    question: "La commande `ip ospf 1 area 0` sur une interface est une methode alternative pour inclure cette interface dans OSPF zone 0.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Il existe deux methodes : 1) `network X.X.X.X wildcard area 0` sous `router ospf`, 2) `ip ospf 1 area 0` directement sur l'interface. La methode par interface est plus precise et plus moderne.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle sequence active OSPF avec le processus 1, configure le Router-ID et annonce le reseau 192.168.1.0/24 dans la zone 0 ?",
    options: [
      "router ospf 1 / router-id 1.1.1.1 / network 192.168.1.0 255.255.255.0 area 0",
      "router ospf 1 / router-id 1.1.1.1 / network 192.168.1.0 0.0.0.255 area 0",
      "ospf 1 / id 1.1.1.1 / advertise 192.168.1.0/24 area 0",
      "router ospf 1 / id 1.1.1.1 / network 192.168.1.0 area 0",
    ],
    correct: 1,
    explanation: "OSPF utilise le masque WILDCARD (inverse) : `0.0.0.255` pour /24. La sequence : `router ospf 1` (processus 1), `router-id 1.1.1.1` (ID unique), `network 192.168.1.0 0.0.0.255 area 0` (annonce avec wildcard).",
  },
  {
    id: 12, type: "qcm",
    question: "Quel est le masque wildcard pour un reseau /30 (255.255.255.252) ?",
    options: ["0.0.0.255", "0.0.0.3", "0.0.0.4", "255.255.255.252"],
    correct: 1,
    explanation: "Wildcard /30 = 255.255.255.255 - 255.255.255.252 = 0.0.0.3. Pour /24 : 0.0.0.255. Pour /16 : 0.0.255.255. Pour /32 (host) : 0.0.0.0. Le wildcard est le complement du masque.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande change la bande passante de reference OSPF a 1000 Mbps pour differencier GigabitEthernet ?",
    options: [
      "ip ospf bandwidth 1000 (sur l'interface)",
      "router ospf 1 / auto-cost reference-bandwidth 1000",
      "ospf reference-bandwidth 1000",
      "router ospf 1 / bandwidth reference 1000",
    ],
    correct: 1,
    explanation: "`auto-cost reference-bandwidth 1000` sous `router ospf` change la reference a 1000 Mbps. Cela donne : FastEthernet (100) = cout 10, GigabitEthernet (1000) = cout 1. Appliquer sur TOUS les routeurs du domaine OSPF.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle est l'adresse multicast que les routeurs OSPF utilisent pour communiquer avec tous les routeurs OSPF ?",
    options: ["224.0.0.5", "224.0.0.6", "224.0.0.9", "224.0.0.10"],
    correct: 0,
    explanation: "224.0.0.5 est l'adresse multicast pour tous les routeurs OSPF (All SPF Routers). 224.0.0.6 est reserve aux DR/BDR (Designated Router/Backup DR). 224.0.0.9 = RIPv2. 224.0.0.10 = EIGRP.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande affiche la liste des voisins OSPF etablis sur le routeur ?",
    options: [
      "show ip ospf topology",
      "show ip ospf neighbors",
      "show ip route ospf",
      "show ip ospf database",
    ],
    correct: 1,
    explanation: "`show ip ospf neighbors` affiche tous les voisins OSPF avec leur etat (FULL, 2-WAY, etc.), leur adresse IP, l'interface locale et le temps restant avant timeout. C'est la premiere commande de diagnostic OSPF.",
  },
  {
    id: 16, type: "qcm",
    question: "Pour configurer le Router-ID OSPF manuellement a 2.2.2.2, quelle commande utiliser ?",
    options: [
      "ip ospf router-id 2.2.2.2 (sous router ospf)",
      "router-id 2.2.2.2 (sous router ospf)",
      "ospf router-id 2.2.2.2 (en mode global)",
      "interface loopback 0 / ip address 2.2.2.2",
    ],
    correct: 1,
    explanation: "`router-id 2.2.2.2` sous `router ospf X` configure manuellement le Router-ID. C'est la methode recommandee car elle est explicite et ne change pas si une interface disparait. Apres changement, un `clear ip ospf process` peut etre necessaire.",
  },
  {
    id: 17, type: "qcm",
    question: "Un voisin OSPF en etat `Active` signifie que...",
    options: [
      "La relation de voisinage est pleinement etablie",
      "Le routeur n'a recu aucun Hello du voisin (DOWN indique absence totale)",
      "Le Hello est recu mais pas encore bidirectionnel",
      "L'echange de la LSDB est en cours",
    ],
    correct: 1,
    explanation: "Dans OSPF, l'etat `DOWN` signifie aucun Hello recu. `INIT` = Hello recu mais pas encore bidirectionnel. `2-WAY` = bidirectionnel. `FULL` = synchronisation complete. Il n'existe pas d'etat 'Active' dans OSPF (contrairement a BGP).",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande annonce la route par defaut via OSPF a tous les voisins ?",
    options: [
      "default-information originate (sous router ospf)",
      "network 0.0.0.0 0.0.0.0 area 0",
      "ip ospf default-route originate",
      "redistribute default-route",
    ],
    correct: 0,
    explanation: "`default-information originate` sous `router ospf` distribue la route par defaut (0.0.0.0/0) vers tous les voisins OSPF. La route par defaut doit exister dans la table de routage (via `ip route 0.0.0.0 0.0.0.0`).",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande configure les intervalles Hello=5sec et Dead=20sec sur l'interface Gi0/0 ?",
    options: [
      "ip ospf hello-interval 5 / ip ospf dead-interval 20 (en mode interface)",
      "router ospf 1 / timers hello 5 dead 20",
      "interface gi0/0 / ospf timers 5 20",
      "ip ospf intervals 5 20 (en mode interface)",
    ],
    correct: 0,
    explanation: "Deux commandes separees en mode interface : `ip ospf hello-interval 5` et `ip ospf dead-interval 20`. Ces valeurs doivent etre identiques sur les deux routeurs de la liaison, sinon la voisinage ne s'etablit pas.",
  },
  {
    id: 20, type: "qcm",
    question: "Quelle commande affiche la base de donnees LSDB (Link-State Database) d'OSPF ?",
    options: [
      "show ip ospf neighbors",
      "show ip ospf database",
      "show ip route ospf",
      "show ip ospf topology",
    ],
    correct: 1,
    explanation: "`show ip ospf database` affiche la LSDB complete avec tous les LSA (Link-State Advertisement) recus. C'est la carte topologique que chaque routeur OSPF maintient. `show ip route ospf` montre uniquement les routes installees.",
  },
];

export default function QuizOspf() {
  return <QuizEngine questions={questions} title="OSPF & OSPFv3" courseLink="/cours/networking/routing/ospf" />;
}

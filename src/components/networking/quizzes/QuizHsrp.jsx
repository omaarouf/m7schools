import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "HSRP (Hot Standby Router Protocol) est un standard IEEE ouvert compatible avec tous les constructeurs.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. HSRP est PROPRIETAIRE CISCO. Le standard IEEE ouvert equivalent est VRRP (Virtual Router Redundancy Protocol - RFC 5798). GLBP (Gateway Load Balancing Protocol) est aussi proprietaire Cisco.",
  },
  {
    id: 2, type: "vf",
    question: "Dans un groupe HSRP, l'adresse IP virtuelle est la passerelle par defaut que les hotes du reseau utilisent.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Les hotes configurent l'IP virtuelle HSRP comme passerelle par defaut. Si le routeur Active tombe, le routeur Standby prend le role et l'IP virtuelle reste accessible - les hotes ne voient aucune interruption.",
  },
  {
    id: 3, type: "vf",
    question: "Le routeur avec la priorite HSRP la plus basse devient le routeur Active.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. C'est le routeur avec la priorite la PLUS HAUTE qui devient Active. La priorite par defaut est 100. Le routeur qui configure `standby X priority 110` aura une priorite plus elevee et deviendra Active.",
  },
  {
    id: 4, type: "vf",
    question: "Sans la commande `standby preempt`, un routeur dont la priorite est plus haute ne reprend pas automatiquement le role Active apres etre revenu en ligne.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Sans `preempt`, le routeur Active reste Active meme si un routeur de plus haute priorite revient. `standby X preempt` permet au routeur de reprendre le role Active automatiquement quand il revient en ligne.",
  },
  {
    id: 5, type: "vf",
    question: "HSRP v2 supporte IPv6 et les groupes de 0 a 4095, contrairement a HSRP v1 qui est limite a 255 groupes.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. HSRP v1 : groupes 0-255, multicast 224.0.0.2. HSRP v2 : groupes 0-4095, multicast 224.0.0.102, support IPv6, adresse MAC virtuelle differente. Utiliser `standby version 2` pour activer HSRPv2.",
  },
  {
    id: 6, type: "vf",
    question: "Le timer Hello HSRP par defaut est de 10 secondes et le timer Hold de 30 secondes.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Les timers HSRP par defaut : Hello = 3 secondes, Hold = 10 secondes. Ces valeurs sont configurables avec `standby X timers [hello] [hold]`. Les timers doivent etre identiques sur tous les routeurs du meme groupe.",
  },
  {
    id: 7, type: "vf",
    question: "Chaque routeur HSRP a sa propre adresse IP physique EN PLUS de l'adresse IP virtuelle partagee.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Exemple : R1 a l'IP physique 192.168.1.2, R2 a 192.168.1.3, et tous deux partagent l'IP virtuelle 192.168.1.1. Les hotes utilisent 192.168.1.1 comme passerelle. Les IPs physiques servent pour l'administration.",
  },
  {
    id: 8, type: "vf",
    question: "L'etat HSRP 'Speak' signifie que le routeur est en train de transmettre le trafic de l'IP virtuelle.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. L'etat 'Speak' signifie que le routeur PARTICIPE A L'ELECTION HSRP (envoie des Hello pour se declarer candidat). L'etat 'Active' signifie que le routeur transmet effectivement le trafic pour l'IP virtuelle.",
  },
  {
    id: 9, type: "vf",
    question: "La commande `show standby brief` affiche une vue condensee de tous les groupes HSRP avec leur etat.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `show standby brief` affiche un tableau compact : interface, groupe, priorite, P (preempt), etat (Active/Standby), IP du routeur Active, IP du routeur Standby et IP virtuelle.",
  },
  {
    id: 10, type: "vf",
    question: "Il est recommande de configurer un delai de preemption (`preempt delay`) pour laisser les protocoles de routage converger avant que le routeur reprenne le role Active.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `standby 1 preempt delay minimum 30` attend 30 secondes avant de reprendre le role Active. Sans delai, le routeur pourrait reprendre le role Active avant que OSPF/EIGRP ne convergent, causant une perte de trafic.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle sequence configure R1 comme routeur Active HSRP avec l'IP virtuelle 192.168.1.1, priorite 110 et preemption ?",
    options: [
      "interface gi0/0 / standby 1 ip 192.168.1.1 / standby 1 priority 110 / standby 1 preempt",
      "hsrp group 1 / virtual-ip 192.168.1.1 / priority 110 / preempt",
      "standby gi0/0 1 ip 192.168.1.1 priority 110",
      "interface gi0/0 / standby virtual 192.168.1.1 / standby priority 110",
    ],
    correct: 0,
    explanation: "Trois commandes en mode interface : `standby 1 ip 192.168.1.1` (groupe 1, IP virtuelle), `standby 1 priority 110` (priorite 110 > 100 par defaut = Active), `standby 1 preempt` (reprend Active si priorite superieure). Numero de groupe = 1.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle est la priorite HSRP par defaut sur un routeur Cisco ?",
    options: ["0", "50", "100", "110"],
    correct: 2,
    explanation: "La priorite HSRP par defaut est 100. Pour qu'un routeur devienne Active, sa priorite doit etre superieure aux autres. Configurer 110 ou plus sur le routeur souhaite comme Active, garder 100 ou moins sur le Standby.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande affiche l'etat HSRP detaille de toutes les interfaces ?",
    options: [
      "show hsrp",
      "show standby",
      "show hsrp status",
      "show ip hsrp",
    ],
    correct: 1,
    explanation: "`show standby` affiche l'etat HSRP complet : groupe, IP virtuelle, priorite, preemption, etat, timers et routeur Active/Standby. `show standby brief` donne une vue condensee sous forme de tableau.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle commande active HSRP version 2 sur l'interface Gi0/0 pour le groupe 1 ?",
    options: [
      "standby 1 version 2",
      "standby version 2 (en mode interface)",
      "hsrp version 2 (en mode global)",
      "ip hsrp version 2",
    ],
    correct: 1,
    explanation: "`standby version 2` en mode interface active HSRP v2 (sans numero de groupe - s'applique a tous les groupes de l'interface). Puis configurer les autres parametres : `standby 1 ip X.X.X.X`, `standby 1 priority X`, `standby 1 preempt`.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle adresse multicast HSRP v1 utilise pour ses messages Hello ?",
    options: ["224.0.0.5", "224.0.0.9", "224.0.0.2", "224.0.0.102"],
    correct: 2,
    explanation: "HSRP v1 utilise 224.0.0.2 (All Routers multicast). HSRP v2 utilise 224.0.0.102. Pour comparaison : OSPF = 224.0.0.5/6, RIPv2 = 224.0.0.9, EIGRP = 224.0.0.10.",
  },
  {
    id: 16, type: "qcm",
    question: "Comment configurer un delai de preemption de 30 secondes pour le groupe HSRP 1 ?",
    options: [
      "standby 1 preempt 30",
      "standby 1 preempt delay minimum 30",
      "standby 1 preempt timer 30",
      "standby 1 preempt delay 30",
    ],
    correct: 1,
    explanation: "`standby 1 preempt delay minimum 30` : le mot-cle `minimum` definit un delai minimum avant de prendre le role Active. Cela laisse le temps aux protocoles de routage (OSPF, EIGRP) de converger apres le retour du routeur.",
  },
  {
    id: 17, type: "qcm",
    question: "Dans la colonne 'P' de `show standby brief`, que signifie la lettre P ?",
    options: [
      "Le routeur est Passif (Passive)",
      "La preemption est configuree sur ce routeur",
      "Ce routeur est le routeur Principal",
      "Le protocole HSRP est actif (Protocol enabled)",
    ],
    correct: 1,
    explanation: "Dans `show standby brief`, `P` dans la colonne P indique que la preemption est configuree (`standby X preempt`). Un routeur sans `P` ne reprendra pas automatiquement le role Active meme si sa priorite est plus haute.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle est la difference entre l'adresse MAC virtuelle HSRP v1 et v2 ?",
    options: [
      "HSRP v1 : 0000.0c07.acXX, HSRP v2 : 0000.0c9f.fXXX",
      "Les deux utilisent la meme adresse MAC virtuelle",
      "HSRP v1 : 0000.0c9f.fXXX, HSRP v2 : 0000.0c07.acXX",
      "HSRP v2 utilise l'adresse MAC physique du routeur Active",
    ],
    correct: 0,
    explanation: "HSRP v1 : adresse MAC virtuelle 0000.0c07.acXX (XX = numero de groupe en hexa). HSRP v2 : 0000.0c9f.fXXX (XXX = numero de groupe etendu). Cette difference est importante pour les equipements qui apprennent l'adresse MAC de la passerelle.",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande modifie les timers HSRP a Hello=2sec, Hold=6sec pour le groupe 1 ?",
    options: [
      "standby 1 timers hello 2 hold 6",
      "standby 1 timers 2 6",
      "hsrp timers 2 6",
      "standby 1 hello 2 hold 6",
    ],
    correct: 1,
    explanation: "`standby 1 timers 2 6` : le premier chiffre est Hello (2 sec), le second est Hold (6 sec). Les timers doivent etre identiques sur TOUS les routeurs du meme groupe HSRP pour que les relations fonctionnent.",
  },
  {
    id: 20, type: "qcm",
    question: "Un routeur en etat HSRP 'Listen' signifie qu'il...",
    options: [
      "Transmet activement le trafic de l'IP virtuelle",
      "Surveille l'Active et est pret a prendre le relais (Standby)",
      "Recoit les Hello mais n'est ni Active ni Standby",
      "Participe a l'election en envoyant des Hello",
    ],
    correct: 2,
    explanation: "L'etat 'Listen' : le routeur recoit les Hello HSRP mais n'est pas encore selectionne comme Active ou Standby. C'est un etat intermediaire. 'Speak' = participe a l'election. 'Standby' = backup pret. 'Active' = transmet le trafic.",
  },
];

export default function QuizHsrp() {
  return <QuizEngine questions={questions} title="HSRP" courseLink="/cours/networking/services-reseau/hsrp" />;
}

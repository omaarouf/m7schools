import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "STP (Spanning Tree Protocol) est defini par la norme IEEE 802.1D.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. STP classique est defini par IEEE 802.1D. Les versions ameliorees sont RSTP (802.1w - convergence rapide) et MST (802.1s - Multiple Spanning Tree).",
  },
  {
    id: 2, type: "vf",
    question: "Sans STP, des boucles de commutation peuvent provoquer des tempetes de diffusion qui saturent completement le reseau.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Sans STP, les trames de broadcast sont dupliquees infiniment entre les switches redondants, saturant la bande passante et les tables MAC. STP desactive logiquement les liens redondants pour eviter ces boucles.",
  },
  {
    id: 3, type: "vf",
    question: "Le switch avec la priorite STP la plus elevee devient le Root Bridge.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. C'est le switch avec la PRIORITE LA PLUS BASSE qui devient Root Bridge (valeur par defaut : 32768). En cas d'egalite de priorite, le switch avec l'adresse MAC la plus basse est elu.",
  },
  {
    id: 4, type: "vf",
    question: "La commande `spanning-tree vlan 10 root primary` fixe la priorite exactement a 24576.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `root primary` ne fixe pas une valeur exacte - il reduit la priorite a 24576 OU a une valeur inferieure de 4096 a la priorite du Root Bridge actuel, pour etre sur de gagner l'election.",
  },
  {
    id: 5, type: "vf",
    question: "PortFast doit etre active sur tous les ports d'un switch, y compris les ports trunk vers d'autres switches.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. PortFast est UNIQUEMENT pour les ports connectes a des equipements terminaux (PC, imprimantes). L'activer sur un port trunk peut creer des boucles immediates car le port passe en Forwarding sans passer par les etats STP.",
  },
  {
    id: 6, type: "vf",
    question: "BPDUGuard desactive automatiquement un port PortFast si un BPDU est recu sur ce port.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. BPDUGuard protege contre la connexion accidentelle d'un switch sur un port PortFast. Si un BPDU est recu, le port passe en etat `err-disabled` et doit etre reactives manuellement.",
  },
  {
    id: 7, type: "vf",
    question: "Rapid PVST+ (IEEE 802.1w) converge en 30 a 50 secondes, comme le PVST+ classique.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Rapid PVST+ converge en 1 a 2 secondes. C'est le PVST+ classique (802.1D) qui necessite 30 a 50 secondes (15 sec Listening + 15 sec Learning). C'est pourquoi Rapid PVST+ est recommande.",
  },
  {
    id: 8, type: "vf",
    question: "Un port en etat `Blocking` dans STP peut tout de meme recevoir des BPDUs.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. En etat Blocking, le port recoit les BPDUs (pour maintenir la topologie STP) mais ne transmet pas de trames de donnees. C'est un etat de securite qui evite les boucles.",
  },
  {
    id: 9, type: "vf",
    question: "La priorite STP doit etre un multiple de 4096, sinon IOS la rejette.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. La priorite STP doit etre un multiple de 4096 (0, 4096, 8192, 12288, ..., 61440). IOS rejette toute valeur qui n'est pas un multiple de 4096. La valeur par defaut est 32768.",
  },
  {
    id: 10, type: "vf",
    question: "Pour reactiver un port en etat `err-disabled` suite a BPDUGuard, il suffit de le brancher/debrancher physiquement.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Un port err-disabled doit etre reactives logiquement : `shutdown` puis `no shutdown` en mode configuration d'interface. Le debrancher/rebrancher physiquement ne suffit pas. Il existe une option de recuperation automatique via `errdisable recovery`.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande configure un switch pour qu'il devienne le Root Bridge principal du VLAN 10 ?",
    options: [
      "spanning-tree vlan 10 priority 0",
      "spanning-tree vlan 10 root primary",
      "stp root vlan 10 primary",
      "spanning-tree priority 0",
    ],
    correct: 1,
    explanation: "`spanning-tree vlan 10 root primary` est la commande simplifiee. Elle ajuste automatiquement la priorite pour garantir que ce switch gagne l'election STP du VLAN 10. Equivalent manuel : `spanning-tree vlan 10 priority 4096` (ou moins).",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle est la priorite STP configuree par `spanning-tree vlan 10 root secondary` ?",
    options: [
      "24576",
      "28672",
      "32768",
      "4096",
    ],
    correct: 1,
    explanation: "`root secondary` fixe la priorite a 28672. Cela garantit que ce switch devient Root Bridge si le primary (priorite 24576 ou moins) tombe, mais pas en operation normale.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande bascule vers Rapid PVST+ sur un switch Cisco ?",
    options: [
      "spanning-tree mode rstp",
      "spanning-tree mode rapid-pvst",
      "spanning-tree rapid-pvst enable",
      "stp mode 802.1w",
    ],
    correct: 1,
    explanation: "`spanning-tree mode rapid-pvst` active Rapid PVST+ (une instance par VLAN avec convergence rapide). `spanning-tree mode pvst` est le mode classique, `spanning-tree mode mst` est Multiple Spanning Tree.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle combinaison de commandes configure PortFast ET BPDUGuard sur le port Fa0/1 ?",
    options: [
      "spanning-tree portfast / spanning-tree bpduguard enable (en mode interface)",
      "portfast enable / bpduguard enable",
      "spanning-tree portfast bpduguard",
      "spanning-tree fast / spanning-tree bpdu-guard",
    ],
    correct: 0,
    explanation: "Deux commandes separees en mode configuration d'interface : `spanning-tree portfast` (passe immediatement en Forwarding) et `spanning-tree bpduguard enable` (desactive si BPDU recu). La combinaison est la recommandation en production.",
  },
  {
    id: 15, type: "qcm",
    question: "Dans l'ordre des etats STP classiques, quelle sequence est correcte pour un port qui passe a l'etat Forwarding ?",
    options: [
      "Blocking → Forwarding → Learning → Listening",
      "Disabled → Blocking → Learning → Listening → Forwarding",
      "Blocking → Listening → Learning → Forwarding",
      "Listening → Blocking → Learning → Forwarding",
    ],
    correct: 2,
    explanation: "L'ordre STP classique : Blocking (stable) → Listening (15 sec, election) → Learning (15 sec, apprentissage MAC) → Forwarding (stable, trafic normal). Total : ~30 secondes avant de transmettre.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle commande affiche l'etat STP detaille pour le VLAN 10, incluant le Root Bridge et les ports ?",
    options: [
      "show stp vlan 10",
      "show spanning-tree vlan 10",
      "show spanning-tree detail",
      "show root bridge vlan 10",
    ],
    correct: 1,
    explanation: "`show spanning-tree vlan 10` affiche le Root Bridge, la priorite, les ports et leur etat (Root, Designated, Blocked) pour le VLAN 10. `show spanning-tree brief` donne une vue condensee.",
  },
  {
    id: 17, type: "qcm",
    question: "Que fait `spanning-tree portfast default` en mode de configuration globale ?",
    options: [
      "Active PortFast uniquement sur le port specifie",
      "Active PortFast globalement sur tous les ports en mode access",
      "Active PortFast sur tous les ports du switch, y compris les trunks",
      "Desactive STP sur tous les ports",
    ],
    correct: 1,
    explanation: "`spanning-tree portfast default` active PortFast sur TOUS les ports configurés en mode access automatiquement. Les ports trunk ne sont pas affectes. C'est plus pratique que de configurer port par port.",
  },
  {
    id: 18, type: "qcm",
    question: "Quel est l'avantage principal du MST (Multiple Spanning Tree) par rapport a PVST+ ?",
    options: [
      "MST converge plus rapidement que PVST+",
      "MST regroupe plusieurs VLANs dans une meme instance STP, reduisant les ressources CPU",
      "MST est un standard Cisco proprietaire plus fiable",
      "MST supporte plus de 255 VLANs par instance",
    ],
    correct: 1,
    explanation: "MST (802.1s) regroupe plusieurs VLANs dans une meme instance STP. PVST+ cree une instance STP par VLAN, ce qui peut surcharger le CPU sur des reseaux avec beaucoup de VLANs. MST est plus scalable.",
  },
  {
    id: 19, type: "qcm",
    question: "Comment reactiver manuellement un port en etat `err-disabled` ?",
    options: [
      "spanning-tree enable (en mode interface)",
      "no err-disabled (en mode interface)",
      "shutdown puis no shutdown (en mode interface)",
      "errdisable recovery (en mode global)",
    ],
    correct: 2,
    explanation: "Pour reactiver un port err-disabled : entrer en mode interface, `shutdown`, puis `no shutdown`. La cause de la violation doit etre resolue avant de reactiver, sinon le port repassera en err-disabled.",
  },
  {
    id: 20, type: "qcm",
    question: "Quelle est la valeur par defaut de la priorite STP sur un switch Cisco ?",
    options: ["0", "4096", "24576", "32768"],
    correct: 3,
    explanation: "La priorite STP par defaut est 32768 (= 32768 + numero de VLAN systeme). Pour gagner l'election du Root Bridge, reduire cette priorite. La valeur 0 garantit de devenir Root Bridge mais doit etre utilisee avec precaution.",
  },
];

export default function QuizStp() {
  return <QuizEngine questions={questions} title="Spanning Tree Protocol (STP)" courseLink="/cours/networking/switching/stp" />;
}

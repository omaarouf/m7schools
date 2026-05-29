import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "PAT (Port Address Translation) permet a plusieurs hotes internes de partager une seule adresse IP publique en utilisant des ports differents.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. PAT (ou NAT Overload) traduit plusieurs adresses IP privees vers une seule IP publique en differenciant les sessions par les numeros de port source. C'est la methode la plus utilisee pour l'acces Internet des PME.",
  },
  {
    id: 2, type: "vf",
    question: "Le NAT Statique cree une traduction permanente 1:1 entre une adresse privee et une adresse publique.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. NAT Statique = 1 IP privee ↔ 1 IP publique fixe. Utilise pour les serveurs accessibles depuis Internet (serveur web, mail, FTP). La traduction est permanente et bidirectionnelle.",
  },
  {
    id: 3, type: "vf",
    question: "L'interface LAN d'un routeur NAT doit etre configuree avec `ip nat outside`.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. L'interface LAN (reseau prive) recoit `ip nat inside`. L'interface WAN (vers Internet/ISP) recoit `ip nat outside`. Sans ces deux marqueurs sur les bonnes interfaces, NAT ne fonctionne pas.",
  },
  {
    id: 4, type: "vf",
    question: "Le mot-cle `overload` dans la commande NAT active PAT (traduction des ports).",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `ip nat inside source list 1 interface serial 0/0/0 overload` : sans `overload`, c'est du NAT dynamique (1 IP privee par IP publique du pool). Avec `overload`, c'est PAT - de nombreuses IPs privees partagent une seule IP publique via les ports.",
  },
  {
    id: 5, type: "vf",
    question: "NAT Dynamique avec un pool de 10 adresses publiques peut supporter jusqu'a 10 connexions simultanees.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. En NAT Dynamique (sans `overload`), chaque hote interne actif consomme une adresse publique du pool. Si le pool est epuise (10 adresses utilisees), les nouvelles connexions sont refusees jusqu'a la liberation d'une adresse.",
  },
  {
    id: 6, type: "vf",
    question: "La commande `clear ip nat translation *` supprime definitivement les traductions NAT statiques.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `clear ip nat translation *` efface uniquement les traductions DYNAMIQUES actives. Les traductions NAT statiques (configurees avec `ip nat inside source static`) persistent car elles sont dans la configuration, pas juste dans la table de traduction.",
  },
  {
    id: 7, type: "vf",
    question: "L'Inside Local est l'adresse IP publique qui represente l'hote interne sur Internet.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Inside Local = adresse IP PRIVEE de l'hote interne (ex: 192.168.1.10). Inside Global = adresse IP PUBLIQUE representant l'hote interne sur Internet (ex: 200.1.1.10). Outside Global = adresse reelle du serveur distant.",
  },
  {
    id: 8, type: "vf",
    question: "Le NAT Statique permet les connexions entrantes depuis Internet vers un serveur interne.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. NAT Statique est bidirectionnel : les connexions sortantes ET entrantes sont traduites. C'est pourquoi on l'utilise pour les serveurs (web, mail, FTP) - les clients Internet peuvent initier des connexions vers l'adresse publique statique.",
  },
  {
    id: 9, type: "vf",
    question: "Une entree avec port (ex: `tcp 200.1.1.1:1025`) dans `show ip nat translations` indique une traduction PAT.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Dans `show ip nat translations` : une entree AVEC port (`:1025`) = traduction PAT. Une entree SANS port (`---`) = traduction NAT statique ou dynamique classique (1:1 sans multiplexage de ports).",
  },
  {
    id: 10, type: "vf",
    question: "PAT (NAT Overload) peut supporter plus de 65000 connexions simultanees avec une seule adresse IP publique.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. PAT utilise les numeros de port (1 a 65535) pour differentier les sessions. En pratique, des dizaines de milliers de connexions simultanees sont possibles avec une seule IP publique - c'est ce qui permet aux FAI de connecter des milliers de clients.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande configure une traduction NAT statique entre l'IP privee 192.168.1.10 et l'IP publique 203.0.113.10 ?",
    options: [
      "ip nat inside source 192.168.1.10 203.0.113.10",
      "ip nat inside source static 192.168.1.10 203.0.113.10",
      "ip nat static 192.168.1.10 to 203.0.113.10",
      "nat inside static 192.168.1.10 203.0.113.10",
    ],
    correct: 1,
    explanation: "`ip nat inside source static 192.168.1.10 203.0.113.10` cree une traduction permanente 1:1. Le mot-cle `static` est indispensable. Sans lui, c'est du NAT dynamique qui necessite aussi un pool et une ACL.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle sequence configure PAT avec l'adresse IP de l'interface Serial 0/0/0 comme IP publique ?",
    options: [
      "ip nat inside source list 1 interface serial 0/0/0 / interface gi0/0 / ip nat inside / interface serial 0/0/0 / ip nat outside",
      "ip nat outside source list 1 interface serial 0/0/0 overload",
      "ip nat inside source list 1 interface serial 0/0/0 overload / marquer gi0/0 nat inside et serial 0/0/0 nat outside",
      "pat enable / interface serial 0/0/0 / source list 1",
    ],
    correct: 2,
    explanation: "Pour PAT : 1) ACL 1 definissant les hotes internes, 2) `ip nat inside source list 1 interface serial 0/0/0 overload` (lie l'ACL a l'interface WAN avec PAT), 3) `ip nat inside` sur le LAN, 4) `ip nat outside` sur le WAN.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande affiche toutes les traductions NAT actives sur le routeur ?",
    options: [
      "show ip nat",
      "show ip nat translations",
      "show nat table",
      "show ip nat statistics",
    ],
    correct: 1,
    explanation: "`show ip nat translations` affiche toutes les traductions actives avec : protocole, Inside global (IP publique), Inside local (IP privee), Outside local et Outside global. `show ip nat statistics` donne les compteurs de traductions.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle est la difference entre NAT Dynamique et PAT ?",
    options: [
      "Le NAT Dynamique est plus rapide que PAT",
      "NAT Dynamique : 1 IP privee -> 1 IP publique du pool ; PAT : N IP privees -> 1 seule IP publique (avec multiplexage de ports)",
      "PAT necessite plus d'adresses IP publiques que NAT Dynamique",
      "NAT Dynamique supporte IPv6, PAT uniquement IPv4",
    ],
    correct: 1,
    explanation: "NAT Dynamique (sans overload) : chaque hote actif utilise une IP publique differente du pool (N IPs privees -> N IPs publiques). PAT (avec overload) : toutes les IP privees partagent UNE seule IP publique via les ports (N:1).",
  },
  {
    id: 15, type: "qcm",
    question: "Comment marquer l'interface Gi0/0 (LAN) comme interface 'inside' pour NAT ?",
    options: [
      "ip nat inside (en mode global)",
      "interface gi0/0 / ip nat inside",
      "interface gi0/0 / nat inside enable",
      "ip nat inside source interface gi0/0",
    ],
    correct: 1,
    explanation: "`ip nat inside` se configure EN MODE INTERFACE, apres `interface gi0/0`. De meme, `ip nat outside` se configure sur l'interface WAN. Ces deux marqueurs sont indispensables pour que NAT fonctionne.",
  },
  {
    id: 16, type: "qcm",
    question: "Pour le NAT Dynamique, quelle est la sequence correcte de configuration ?",
    options: [
      "Creer le pool -> Lier ACL au pool -> Creer ACL -> Marquer interfaces",
      "Creer ACL -> Creer pool -> Lier ACL au pool -> Marquer interfaces inside/outside",
      "Marquer interfaces -> Creer pool -> Creer ACL -> Lier",
      "Creer pool -> Marquer interfaces -> Creer ACL -> Lier",
    ],
    correct: 1,
    explanation: "Sequence NAT Dynamique : 1) `access-list 1 permit [reseau]` (hotes a traduire), 2) `ip nat pool PUBLIC_POOL [debut] [fin] netmask [masque]` (pool d'adresses publiques), 3) `ip nat inside source list 1 pool PUBLIC_POOL` (lier), 4) Marquer les interfaces.",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle commande cree un pool d'adresses publiques de 200.1.1.1 a 200.1.1.10 nomme 'PUBLIC' ?",
    options: [
      "ip nat pool PUBLIC 200.1.1.1 200.1.1.10 255.255.255.0",
      "ip nat pool PUBLIC 200.1.1.1 200.1.1.10 netmask 255.255.255.0",
      "nat pool PUBLIC 200.1.1.1 - 200.1.1.10 /24",
      "ip nat outside pool PUBLIC 200.1.1.1 200.1.1.10",
    ],
    correct: 1,
    explanation: "`ip nat pool PUBLIC 200.1.1.1 200.1.1.10 netmask 255.255.255.0` : le mot-cle `netmask` (pas `subnet-mask`) est obligatoire. Ce pool de 10 adresses peut supporter 10 connexions simultanees en NAT Dynamique.",
  },
  {
    id: 18, type: "qcm",
    question: "Que signifie le terme 'Inside Global' dans la terminologie NAT ?",
    options: [
      "L'adresse IP privee de l'hote interne",
      "L'adresse IP publique representant l'hote interne sur Internet",
      "L'adresse IP du serveur DNS interne",
      "L'adresse IP de la passerelle Internet",
    ],
    correct: 1,
    explanation: "Inside Global = adresse IP PUBLIQUE qui represente l'hote interne sur Internet (la traduction). Inside Local = IP privee de l'hote. Outside Global = IP reelle du serveur distant. Outside Local = IP du serveur vue depuis l'interieur.",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande efface toutes les traductions NAT dynamiques actives ?",
    options: [
      "no ip nat translations",
      "clear ip nat translation *",
      "reset ip nat table",
      "ip nat clear all",
    ],
    correct: 1,
    explanation: "`clear ip nat translation *` efface toutes les traductions dynamiques actives. Utile pour le diagnostic ou apres un changement de configuration. Les traductions statiques (`static`) ne sont pas effacees - elles sont dans la configuration.",
  },
  {
    id: 20, type: "qcm",
    question: "Quel type de NAT est le plus adapte pour rendre un serveur web interne accessible depuis Internet ?",
    options: [
      "PAT (NAT Overload)",
      "NAT Dynamique avec pool",
      "NAT Statique",
      "NAT Bidirectionnel",
    ],
    correct: 2,
    explanation: "NAT Statique est le seul type qui permet les connexions ENTRANTES depuis Internet. PAT et NAT Dynamique sont unidirectionnels (sortant uniquement) - les connexions sont initiees de l'interieur. Pour un serveur accessible depuis Internet, une IP publique fixe et permanente est necessaire.",
  },
];

export default function QuizNat() {
  return <QuizEngine questions={questions} title="NAT & PAT" courseLink="/cours/networking/services-reseau/nat" />;
}

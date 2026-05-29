import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "Sur un routeur Cisco, les interfaces sont desactivees par defaut et necessitent la commande `no shutdown` pour etre actives.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Contrairement aux ports d'un switch (actifs par defaut), les interfaces d'un routeur sont en etat `administratively down` et doivent etre activees avec `no shutdown`.",
  },
  {
    id: 2, type: "vf",
    question: "La commande `clock rate` doit etre configuree sur les deux routeurs d'une liaison Serial.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `clock rate` est necessaire uniquement sur le routeur qui joue le role DCE (Data Circuit-terminating Equipment). Le routeur DTE n'en a pas besoin. En lab, un cable Serial a une extremite DCE et une extremite DTE.",
  },
  {
    id: 3, type: "vf",
    question: "La route par defaut `ip route 0.0.0.0 0.0.0.0 10.0.0.2` capture tout le trafic sans route specifique et l'envoie vers 10.0.0.2.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. La route `0.0.0.0/0` est appelee 'Gateway of last resort' ou route par defaut. Elle correspond a toutes les destinations non connues et est indispensable pour l'acces Internet.",
  },
  {
    id: 4, type: "vf",
    question: "Sur un routeur, `line vty 0 4` configure 4 sessions VTY simultanees.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `line vty 0 4` configure les lignes de 0 a 4 inclus, soit 5 sessions simultanees. Sur un switch, `line vty 0 15` donne 16 sessions.",
  },
  {
    id: 5, type: "vf",
    question: "La commande `do show ip interface brief` permet d'executer une commande EXEC depuis un mode de configuration.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le prefixe `do` permet d'executer n'importe quelle commande EXEC (show, ping, debug...) depuis un sous-mode de configuration sans avoir a quitter avec `exit` ou `end`.",
  },
  {
    id: 6, type: "vf",
    question: "Un etat `up/down` dans `show ip interface brief` indique que l'interface est physiquement connectee mais a un probleme de protocole.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `up/down` signifie : couche physique OK, mais probleme de couche 2 (encapsulation incompatible, clock rate manquant sur Serial DCE, etc.). `down/down` = probleme physique. `up/up` = interface fonctionnelle.",
  },
  {
    id: 7, type: "vf",
    question: "Sur une liaison Ethernet multi-acces, il est preferable de specifier le next-hop IP plutot que l'interface de sortie dans une route statique.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Sur Ethernet (multi-acces), specifier uniquement l'interface force le routeur a faire une resolution ARP pour chaque destination, ce qui est inefficace. Sur Serial (point-a-point), les deux methodes fonctionnent bien.",
  },
  {
    id: 8, type: "vf",
    question: "La commande `show running-config` affiche la configuration sauvegardee en NVRAM.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `show running-config` affiche la configuration active en RAM (celle en cours d'execution). `show startup-config` affiche la configuration sauvegardee en NVRAM (celle chargee au demarrage).",
  },
  {
    id: 9, type: "vf",
    question: "Pour activer SSH sur un routeur, la taille de la cle RSA recommandee est de 2048 bits.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `crypto key generate rsa modulus 2048` genere des cles RSA de 2048 bits. SSH v2 necessite un minimum de 768 bits. 2048 bits est le standard moderne pour la securite.",
  },
  {
    id: 10, type: "vf",
    question: "La commande `description` sur une interface affecte le routage et la connectivite.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `description` est purement documentaire - elle n'affecte ni le routage ni la connectivite. Elle sert uniquement a identifier le role de l'interface dans la configuration.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande configure une interface GigabitEthernet 0/0 avec l'IP 192.168.1.1/24 et l'active ?",
    options: [
      "ip address 192.168.1.1 255.255.255.0 / no shutdown (en mode global)",
      "interface gi0/0 / ip address 192.168.1.1 /24 / no shutdown",
      "interface gigabitethernet 0/0 / ip address 192.168.1.1 255.255.255.0 / no shutdown",
      "set interface gi0/0 ip 192.168.1.1/24 up",
    ],
    correct: 2,
    explanation: "La sequence correcte : entrer en mode interface avec `interface gigabitethernet 0/0`, puis `ip address 192.168.1.1 255.255.255.0` (avec masque complet, pas notation CIDR), puis `no shutdown`.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle commande est necessaire sur un routeur DCE d'une liaison Serial ?",
    options: [
      "bandwidth 64000",
      "clock rate 64000",
      "serial-speed 64000",
      "line rate 64000",
    ],
    correct: 1,
    explanation: "`clock rate 64000` configure l'horloge sur l'interface Serial du routeur DCE. La valeur commune en lab est 64000 ou 128000 bps. Sans cette commande, l'interface reste en etat `up/down`.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande affiche la table de routage complete du routeur ?",
    options: [
      "show ip route",
      "show routing table",
      "show routes",
      "show ip routing",
    ],
    correct: 0,
    explanation: "`show ip route` affiche la table de routage complete avec tous les codes : C (connected), L (local), S (static), R (RIP), O (OSPF), D (EIGRP), B (BGP), etc.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle sequence configure correctement SSH v2 sur un routeur Cisco ?",
    options: [
      "ip ssh enable / ip ssh version 2",
      "ip domain-name m7.local / crypto key generate rsa modulus 2048 / ip ssh version 2",
      "ssh version 2 / generate rsa 2048",
      "ip ssh 2 / crypto rsa 2048",
    ],
    correct: 1,
    explanation: "La sequence : 1) `ip domain-name` (requis pour nommer les cles), 2) `crypto key generate rsa modulus 2048` (genere les cles), 3) `ip ssh version 2` (force SSH v2). Puis configurer les VTY avec `login local` et `transport input ssh`.",
  },
  {
    id: 15, type: "qcm",
    question: "Que signifie l'etat `administratively down` dans la sortie de `show ip interface brief` ?",
    options: [
      "L'interface a ete desactivee par un probleme materiel",
      "L'interface a ete desactivee manuellement avec la commande `shutdown`",
      "L'interface n'a pas d'adresse IP configuree",
      "L'interface a perdu son cable",
    ],
    correct: 1,
    explanation: "`administratively down` signifie que l'interface a ete explicitement desactivee avec la commande `shutdown`. Pour la reactiver, utiliser `no shutdown` en mode configuration d'interface.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle commande configure une route par defaut vers le next-hop 203.0.113.1 ?",
    options: [
      "ip route default 203.0.113.1",
      "ip route 0.0.0.0 0.0.0.0 203.0.113.1",
      "ip default-route 203.0.113.1",
      "route default-gateway 203.0.113.1",
    ],
    correct: 1,
    explanation: "`ip route 0.0.0.0 0.0.0.0 203.0.113.1` configure la route par defaut. Le reseau `0.0.0.0` avec le masque `0.0.0.0` signifie 'toutes les destinations'. Elle apparait en table de routage avec le code `S*`.",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle commande cree un utilisateur 'admin' avec le mot de passe chiffre 'Admin@2025' ?",
    options: [
      "username admin password Admin@2025",
      "username admin secret Admin@2025",
      "user admin encrypted Admin@2025",
      "create user admin Admin@2025",
    ],
    correct: 1,
    explanation: "`username admin secret Admin@2025` cree l'utilisateur avec un mot de passe chiffre en MD5 (type 5). `username admin password` stocke le mot de passe en clair ou avec le chiffrement faible type 7.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande affiche les details complets d'une interface specifique, incluant les compteurs d'erreurs ?",
    options: [
      "show ip interface brief",
      "show interfaces gigabitethernet 0/0",
      "show interface status",
      "debug interface gi0/0",
    ],
    correct: 1,
    explanation: "`show interfaces gigabitethernet 0/0` affiche les details complets : MTU, debit, duplex, compteurs d'erreurs (CRC, input errors, output drops). `show ip interface brief` ne montre que le resume (IP + etat).",
  },
  {
    id: 19, type: "qcm",
    question: "Pour securiser la console du routeur avec un mot de passe et un timeout de 5 minutes, quelle sequence est correcte ?",
    options: [
      "line console 0 / password cisco123 / login / exec-timeout 5 0",
      "console 0 / password cisco123 / timeout 300",
      "interface console / password cisco123 / login",
      "line vty 0 / password cisco123 / exec-timeout 5",
    ],
    correct: 0,
    explanation: "La sequence correcte : `line console 0` (entrer en mode ligne console), `password cisco123` (definir le mot de passe), `login` (activer la demande du mot de passe), `exec-timeout 5 0` (timeout 5 min 0 sec).",
  },
  {
    id: 20, type: "qcm",
    question: "Quelle commande permet de voir les sessions SSH actives sur le routeur ?",
    options: [
      "show ip ssh",
      "show ssh",
      "show vty sessions",
      "show line vty",
    ],
    correct: 1,
    explanation: "`show ssh` affiche les sessions SSH actives avec le numero de connexion, l'adresse IP source et le nom d'utilisateur. `show ip ssh` affiche la version SSH et les parametres (timeout, retries).",
  },
];

export default function QuizRouter() {
  return <QuizEngine questions={questions} title="Configuration de Base - Routeur" courseLink="/cours/networking/configuration-de-base/router" />;
}

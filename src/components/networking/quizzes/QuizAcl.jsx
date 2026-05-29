import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "Toute ACL se termine implicitement par une regle 'deny any' qui bloque tout trafic non explicitement autorise.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le 'deny any implicite' est invisible dans la configuration mais est toujours present a la fin de toute ACL. C'est pourquoi il faut toujours ajouter `permit any` ou `permit ip any any` si necessaire.",
  },
  {
    id: 2, type: "vf",
    question: "Une ACL standard (numerotee 1-99) peut filtrer sur l'adresse IP source, la destination et le port.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Une ACL standard filtre UNIQUEMENT sur l'adresse IP source. Pour filtrer sur la source, la destination, le protocole ET le port, il faut une ACL etendue (100-199).",
  },
  {
    id: 3, type: "vf",
    question: "Une ACL etendue doit etre placee le plus pres possible de la source pour bloquer le trafic au plus tot.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. L'ACL etendue filtre precisement (source + destination + port), donc on peut la placer pres de la source sans bloquer tout le trafic. L'ACL standard (source uniquement) doit etre pres de la destination pour eviter de bloquer trop de trafic.",
  },
  {
    id: 4, type: "vf",
    question: "On peut appliquer deux ACLs 'in' sur la meme interface en meme temps.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Une seule ACL par interface par direction (in OU out). Cependant, on peut avoir une ACL `in` ET une ACL `out` sur la meme interface (deux directions differentes). Pour avoir plusieurs regles, les regrouper dans la meme ACL.",
  },
  {
    id: 5, type: "vf",
    question: "Le masque wildcard 0.0.0.0 correspond au mot-cle 'host' et force la correspondance sur une adresse IP unique.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `0.0.0.0` = tous les bits doivent correspondre = host unique. `access-list 10 permit host 192.168.1.10` est equivalent a `access-list 10 permit 192.168.1.10 0.0.0.0`. Le wildcard `255.255.255.255` = `any`.",
  },
  {
    id: 6, type: "vf",
    question: "La commande `ip access-group` applique une ACL sur les lignes VTY (acces SSH/Telnet).",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `ip access-group` s'applique sur les INTERFACES physiques. Pour les lignes VTY, utiliser `access-class X in` (en mode line vty). Cette distinction est importante : meme ACL, deux commandes differentes selon le contexte.",
  },
  {
    id: 7, type: "vf",
    question: "Les ACL nommees permettent de supprimer des regles individuelles sans effacer toute l'ACL.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Avec les ACL nommees (`ip access-list standard/extended NAME`), on peut supprimer une regle specfique avec `no permit/deny X`. Avec les ACL numerotees, la seule option etait de supprimer toute l'ACL (sauf en IOS moderne avec les numeros de sequence).",
  },
  {
    id: 8, type: "vf",
    question: "Le trafic entrant (`in`) sur une interface est filtre APRES le routage du paquet.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `in` filtre le trafic AVANT le routage (a l'entree de l'interface). `out` filtre APRES le routage (a la sortie de l'interface). L'ordre est important : une ACL `in` peut bloquer des paquets avant meme qu'ils ne soient routes.",
  },
  {
    id: 9, type: "vf",
    question: "Les compteurs de correspondances dans `show access-lists` permettent de verifier quelles regles sont effectivement utilisees.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Chaque regle ACL a un compteur `(X matches)`. Un compteur a 0 peut indiquer que la regle n'est jamais atteinte (regles precedentes capturent tout le trafic) ou que le trafic suppose ne passe pas.",
  },
  {
    id: 10, type: "vf",
    question: "Les ACL etendues sont numerotees dans la plage 1 a 99 sur les routeurs Cisco.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. ACL standard = 1-99 (et 1300-1999). ACL etendue = 100-199 (et 2000-2699). Les plages etendues permettent plus d'ACL sur un meme routeur.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande cree une ACL standard numerotee 10 qui autorise uniquement le reseau 192.168.1.0/24 ?",
    options: [
      "access-list 10 permit 192.168.1.0 255.255.255.0",
      "access-list 10 permit 192.168.1.0 0.0.0.255",
      "ip access-list 10 permit 192.168.1.0/24",
      "acl 10 permit 192.168.1.0 /24",
    ],
    correct: 1,
    explanation: "`access-list 10 permit 192.168.1.0 0.0.0.255` : utilise le masque WILDCARD (0.0.0.255 pour /24). Le masque wildcard est l'inverse du masque normal. 255.255.255.255 - 255.255.255.0 = 0.0.0.255.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle commande applique l'ACL 100 en entree sur l'interface Gi0/0 ?",
    options: [
      "ip access-list 100 in (en mode interface)",
      "access-class 100 in (en mode interface)",
      "ip access-group 100 in (en mode interface)",
      "apply access-list 100 inbound",
    ],
    correct: 2,
    explanation: "`ip access-group 100 in` applique l'ACL 100 sur le trafic entrant de l'interface. `access-class` est pour les lignes VTY. `in` = trafic entrant (avant routage), `out` = trafic sortant (apres routage).",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle ACL etendue autorise le trafic HTTP (port 80) du reseau 10.0.0.0/24 vers 192.168.1.0/24 ?",
    options: [
      "access-list 100 permit http 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255",
      "access-list 100 permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 80",
      "access-list 100 permit 10.0.0.0 192.168.1.0 port 80",
      "access-list 100 permit udp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 80",
    ],
    correct: 1,
    explanation: "`access-list 100 permit tcp ... eq 80` : HTTP utilise TCP port 80. La syntaxe etendue : `access-list X permit [protocole] [source wildcard] [destination wildcard] eq [port]`. HTTP = TCP/80, HTTPS = TCP/443.",
  },
  {
    id: 14, type: "qcm",
    question: "Comment creer une ACL etendue NOMMEE 'FILTRAGE_WEB' et l'entrer en mode de configuration ?",
    options: [
      "access-list FILTRAGE_WEB extended",
      "ip access-list extended FILTRAGE_WEB",
      "named access-list extended FILTRAGE_WEB",
      "ip acl FILTRAGE_WEB extended",
    ],
    correct: 1,
    explanation: "`ip access-list extended FILTRAGE_WEB` entre dans le mode de configuration de l'ACL nommee etendue. Pour une ACL standard nommee : `ip access-list standard NOM`. Ensuite, les regles s'entrent directement sans numero d'ACL.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande restreint l'acces SSH aux lignes VTY uniquement pour le reseau 192.168.1.0/24 ?",
    options: [
      "ip access-group 5 in (sur l'interface)",
      "access-class 5 in (sur les lignes VTY) apres avoir cree ACL 5",
      "ip access-list ssh 192.168.1.0/24",
      "line vty 0 4 / permit 192.168.1.0 0.0.0.255",
    ],
    correct: 1,
    explanation: "Sur les lignes VTY : `access-class 5 in`. Cela necessite d'abord de creer l'ACL : `access-list 5 permit 192.168.1.0 0.0.0.255`, puis en mode `line vty 0 4` : `access-class 5 in`. `ip access-group` ne fonctionne pas sur les VTY.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle commande affiche toutes les ACL configurees avec leurs compteurs de correspondances ?",
    options: [
      "show ip access-lists",
      "show access-lists",
      "show acl",
      "show running-config access-list",
    ],
    correct: 1,
    explanation: "`show access-lists` affiche toutes les ACL (IP et non-IP) avec les compteurs de correspondances. `show ip access-lists` n'affiche que les ACL IP. Les compteurs sont utiles pour le diagnostic.",
  },
  {
    id: 17, type: "qcm",
    question: "Dans une ACL, que signifie le masque wildcard 255.255.255.255 ?",
    options: [
      "L'hote unique 255.255.255.255",
      "Tous les hotes (equivalent a 'any')",
      "Le reseau de broadcast",
      "Aucune correspondance possible",
    ],
    correct: 1,
    explanation: "`255.255.255.255` = tous les bits peuvent etre differents = n'importe quelle adresse = `any`. `access-list 10 permit any` est equivalent a `access-list 10 permit 0.0.0.0 255.255.255.255`.",
  },
  {
    id: 18, type: "qcm",
    question: "Comment supprimer la regle `permit tcp 10.0.0.0 0.0.0.255 any eq 23` de l'ACL nommee 'FILTRAGE_TRAFIC' ?",
    options: [
      "no access-list FILTRAGE_TRAFIC permit tcp 10.0.0.0 0.0.0.255 any eq 23",
      "ip access-list extended FILTRAGE_TRAFIC / no permit tcp 10.0.0.0 0.0.0.255 any eq 23",
      "delete access-list FILTRAGE_TRAFIC rule tcp 23",
      "remove FILTRAGE_TRAFIC tcp 23",
    ],
    correct: 1,
    explanation: "Pour supprimer une regle d'une ACL nommee : `ip access-list extended FILTRAGE_TRAFIC` (entre en mode ACL) puis `no permit tcp 10.0.0.0 0.0.0.255 any eq 23`. Avantage des ACL nommees : on supprime une regle individuelle sans effacer toute l'ACL.",
  },
  {
    id: 19, type: "qcm",
    question: "Sur quel port TCP fonctionne le protocole SSH (Secure Shell) ?",
    options: ["21", "22", "23", "80"],
    correct: 1,
    explanation: "SSH = TCP port 22. FTP = TCP 20/21. Telnet = TCP 23. HTTP = TCP 80. HTTPS = TCP 443. DNS = UDP/TCP 53. DHCP = UDP 67/68. Ces numeros de ports sont essentiels pour la configuration des ACL etendues.",
  },
  {
    id: 20, type: "qcm",
    question: "Une ACL standard doit etre placee pres de la DESTINATION car...",
    options: [
      "Elle est plus rapide a traiter pres de la destination",
      "Elle ne filtre que sur la source - placee pres de la source, elle bloquerait tout le trafic de cet hote vers toutes les destinations",
      "Les ACL standard n'ont d'effet que sur le trafic local",
      "La destination est toujours connue avant la source",
    ],
    correct: 1,
    explanation: "Une ACL standard filtre uniquement sur la SOURCE. Si on la place pres de la source pour bloquer l'acces a un serveur specifique, elle bloquerait tout le trafic de cette source (y compris vers d'autres destinations). Pres de la destination, l'impact est limite au bon trafic.",
  },
];

export default function QuizAcl() {
  return <QuizEngine questions={questions} title="Access Control Lists (ACL)" courseLink="/cours/networking/securite/acl" />;
}

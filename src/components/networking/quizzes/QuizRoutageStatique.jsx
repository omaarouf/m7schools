import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "Une route statique est apprise automatiquement par le routeur via un protocole de routage dynamique.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Une route statique est configuree MANUELLEMENT par l'administrateur avec la commande `ip route`. Elle ne s'adapte pas automatiquement aux changements de topologie, contrairement aux protocoles dynamiques (OSPF, EIGRP, RIP).",
  },
  {
    id: 2, type: "vf",
    question: "La distance administrative d'une route statique est 1 par defaut, ce qui la rend plus fiable qu'une route OSPF (DA=110).",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. La DA d'une route statique est 1 (seule une route directement connectee DA=0 est plus fiable). OSPF=110, EIGRP=90, RIP=120. Si une route statique et une route OSPF existent pour le meme reseau, la statique est preferee.",
  },
  {
    id: 3, type: "vf",
    question: "La route par defaut `ip route 0.0.0.0 0.0.0.0 next-hop` apparait dans la table de routage avec le code `S*`.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `S*` signifie route Statique par defaut (gateway of last resort). Une route statique normale apparait avec `S`, et la route par defaut avec `S*`. Le message `Gateway of last resort is X` indique la route par defaut.",
  },
  {
    id: 4, type: "vf",
    question: "Une route statique flottante (avec une DA de 150) remplace immediatement la route principale si cette derniere est configuree.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. La route flottante (DA plus elevee) n'est ACTIVE que si la route principale disparait de la table de routage. En presence de la route principale (DA=1), la flottante est invisible dans `show ip route`.",
  },
  {
    id: 5, type: "vf",
    question: "La commande `ipv6 unicast-routing` est necessaire pour activer le routage IPv6 sur un routeur Cisco.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Par defaut, le routage IPv6 est desactive. `ipv6 unicast-routing` l'active globalement. Sans cette commande, le routeur ne peut pas transmettre des paquets IPv6 entre ses interfaces.",
  },
  {
    id: 6, type: "vf",
    question: "La syntaxe correcte d'une route statique IPv6 par defaut est `ipv6 route ::/0 [next-hop]`.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `::/0` est l'equivalent IPv6 de `0.0.0.0/0` en IPv4. C'est la route par defaut IPv6 qui capture tout le trafic sans route specifique.",
  },
  {
    id: 7, type: "vf",
    question: "Sur une liaison Ethernet, il est preferable de specifier l'interface de sortie plutot que le next-hop IP dans une route statique.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Sur Ethernet (multi-acces), il faut specifier le next-hop IP. Specifier uniquement l'interface force une resolution ARP pour chaque destination, surchargeant la table ARP. Sur Serial (point-a-point), les deux methodes sont acceptables.",
  },
  {
    id: 8, type: "vf",
    question: "La commande `show ip route static` affiche uniquement les routes apprises via des protocoles de routage dynamiques.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `show ip route static` affiche UNIQUEMENT les routes statiques (code `S`). Pour toutes les routes, utiliser `show ip route`. Pour un protocole specifique : `show ip route ospf`, `show ip route eigrp`, etc.",
  },
  {
    id: 9, type: "vf",
    question: "Dans la table de routage, `[1/0]` signifie que la distance administrative est 1 et la metrique est 0.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. La notation `[DA/Metrique]` : `[1/0]` = DA de 1 (route statique) et metrique de 0. `[110/20]` = DA de 110 (OSPF) et cout de 20. La DA determine quelle source de route est preferee.",
  },
  {
    id: 10, type: "vf",
    question: "Une route statique est scalable et peut gerer efficacement des reseaux de grande taille.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Le routage statique n'est pas scalable : chaque route doit etre configuree manuellement, et il n'y a pas d'adaptation automatique aux pannes. Pour les grands reseaux, utiliser OSPF ou EIGRP.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande configure une route statique vers le reseau 172.16.0.0/16 via le next-hop 192.168.1.2 ?",
    options: [
      "ip route 172.16.0.0 255.255.0.0 192.168.1.2",
      "ip route 172.16.0.0/16 192.168.1.2",
      "route add 172.16.0.0 255.255.0.0 via 192.168.1.2",
      "ip static-route 172.16.0.0 /16 192.168.1.2",
    ],
    correct: 0,
    explanation: "`ip route 172.16.0.0 255.255.0.0 192.168.1.2` : le masque doit etre en notation decimale complete (pas CIDR). La syntaxe est `ip route [reseau] [masque] [next-hop ou interface]`.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle est la distance administrative par defaut d'une route statique sur un routeur Cisco ?",
    options: ["0", "1", "90", "110"],
    correct: 1,
    explanation: "La DA d'une route statique est 1. Seule une route directement connectee (DA=0) est plus fiable. EIGRP=90, OSPF=110, RIP=120. La DA determine quelle source de route est installee dans la table de routage.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande configure une route flottante vers 10.0.0.0/24 via 192.168.1.2 qui ne s'active qu'en cas de panne de la route principale ?",
    options: [
      "ip route 10.0.0.0 255.255.255.0 192.168.1.2 standby",
      "ip route 10.0.0.0 255.255.255.0 192.168.1.2 backup",
      "ip route 10.0.0.0 255.255.255.0 192.168.1.2 150",
      "ip route 10.0.0.0 255.255.255.0 192.168.1.2 floating",
    ],
    correct: 2,
    explanation: "`ip route 10.0.0.0 255.255.255.0 192.168.1.2 150` : le chiffre 150 est la DA personnalisee. La route flottante n'apparat dans la table que si la route principale (DA=1 par defaut) disparait.",
  },
  {
    id: 14, type: "qcm",
    question: "Quel code dans `show ip route` identifie une route directement connectee ?",
    options: ["S", "C", "D", "O"],
    correct: 1,
    explanation: "`C` = reseau directement connecte. `L` = adresse IP locale de l'interface. `S` = statique. `D` = EIGRP. `O` = OSPF. `R` = RIP. `B` = BGP. `S*` = route par defaut statique.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande configure la route par defaut IPv4 vers le next-hop 10.0.0.1 ?",
    options: [
      "ip route default 10.0.0.1",
      "ip default-route 10.0.0.1",
      "ip route 0.0.0.0 0.0.0.0 10.0.0.1",
      "ip gateway 10.0.0.1",
    ],
    correct: 2,
    explanation: "`ip route 0.0.0.0 0.0.0.0 10.0.0.1` : le reseau `0.0.0.0` avec masque `0.0.0.0` signifie 'toutes les destinations'. C'est la route par defaut (gateway of last resort). Unique syntaxe valide en IOS.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle commande affiche la table de routage en filtrant uniquement les routes statiques ?",
    options: [
      "show ip route",
      "show ip route static",
      "show static routes",
      "show ip route | include S",
    ],
    correct: 1,
    explanation: "`show ip route static` filtre et affiche uniquement les routes avec le code `S` (statiques). `show ip route` affiche toutes les routes. Le filtrage par code peut aussi se faire avec `| include S` mais risque d'inclure d'autres lignes.",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle est la notation correcte d'une route IPv6 vers le reseau 2001:db8:2::/64 via le next-hop 2001:db8:1::2 ?",
    options: [
      "ip route 2001:db8:2:: /64 2001:db8:1::2",
      "ipv6 route 2001:db8:2::/64 2001:db8:1::2",
      "ipv6 static-route 2001:db8:2::/64 via 2001:db8:1::2",
      "route ipv6 2001:db8:2:: 64 2001:db8:1::2",
    ],
    correct: 1,
    explanation: "`ipv6 route 2001:db8:2::/64 2001:db8:1::2` est la syntaxe correcte. Pour IPv6, `ip route` devient `ipv6 route`. La notation CIDR (`/64`) est utilisee directement, pas de masque decimal.",
  },
  {
    id: 18, type: "qcm",
    question: "Que signifie `Gateway of last resort is 192.168.1.1 to network 0.0.0.0` dans la table de routage ?",
    options: [
      "Il y a un probleme avec le routeur 192.168.1.1",
      "La route par defaut envoie tout le trafic non reconnu vers 192.168.1.1",
      "192.168.1.1 est la seule route connue",
      "Le routeur ne connait que le reseau 0.0.0.0",
    ],
    correct: 1,
    explanation: "`Gateway of last resort` indique la route par defaut active. Tout le trafic dont la destination ne correspond a aucune route specifique sera envoye vers 192.168.1.1 (next-hop de la route 0.0.0.0/0).",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande supprime la route statique vers 192.168.2.0/24 via 10.0.0.2 ?",
    options: [
      "delete ip route 192.168.2.0 255.255.255.0 10.0.0.2",
      "no ip route 192.168.2.0 255.255.255.0 10.0.0.2",
      "remove route 192.168.2.0/24",
      "ip route 192.168.2.0 255.255.255.0 10.0.0.2 remove",
    ],
    correct: 1,
    explanation: "`no ip route 192.168.2.0 255.255.255.0 10.0.0.2` supprime la route. En IOS, `no` devant n'importe quelle commande de configuration annule cette commande.",
  },
  {
    id: 20, type: "qcm",
    question: "Dans un reseau avec deux routeurs R1 et R2 relies par le reseau 10.0.0.0/30, R1 a le LAN 192.168.1.0/24 et R2 a le LAN 192.168.2.0/24. Quelle route statique configurer sur R1 pour atteindre le LAN de R2 ?",
    options: [
      "ip route 192.168.2.0 255.255.255.0 10.0.0.1",
      "ip route 192.168.2.0 255.255.255.0 10.0.0.2",
      "ip route 0.0.0.0 0.0.0.0 10.0.0.2",
      "ip route 192.168.1.0 255.255.255.0 10.0.0.2",
    ],
    correct: 1,
    explanation: "Sur R1, pour atteindre 192.168.2.0/24 : `ip route 192.168.2.0 255.255.255.0 10.0.0.2` - le next-hop est l'adresse de R2 sur le lien inter-routeurs. 10.0.0.2 est l'adresse de R2 dans le reseau 10.0.0.0/30.",
  },
];

export default function QuizRoutageStatique() {
  return <QuizEngine questions={questions} title="Routage Statique" courseLink="/cours/networking/routing/routage-statique" />;
}

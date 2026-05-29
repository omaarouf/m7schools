import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "BGP (Border Gateway Protocol) est le protocole de routage utilise sur Internet pour echanger des routes entre Systemes Autonomes.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. BGP est le protocole inter-domaines (EGP) qui fait fonctionner Internet. Il echange des routes entre AS (Autonomous Systems) distincts. A l'interieur d'un AS, on utilise des protocoles IGP comme OSPF ou EIGRP.",
  },
  {
    id: 2, type: "vf",
    question: "BGP utilise UDP port 179 pour transporter ses messages.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. BGP utilise TCP port 179. TCP garantit la livraison fiable des messages BGP. Cette dependance a TCP signifie que la session BGP necessite une connectivite IP entre les voisins.",
  },
  {
    id: 3, type: "vf",
    question: "eBGP est utilise entre deux routeurs du meme Systeme Autonome.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. eBGP (external BGP) est utilise entre des AS DIFFERENTS. iBGP (internal BGP) est utilise DANS le meme AS. La distance administrative eBGP = 20, iBGP = 200.",
  },
  {
    id: 4, type: "vf",
    question: "La distance administrative d'eBGP (20) est plus basse que celle d'iBGP (200), ce qui signifie qu'eBGP est prefere.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. eBGP DA=20 est preferee a iBGP DA=200. Cela reflete le fait que les routes eBGP (apprises directement d'un AS voisin) sont considerees plus fiables que les routes iBGP (propagees dans l'AS).",
  },
  {
    id: 5, type: "vf",
    question: "L'attribut AS-PATH liste tous les Systemes Autonomes traverses et BGP prefere le chemin le plus court.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. AS-PATH est une liste des numeros AS traverses. BGP prefere le chemin avec le moins d'AS dans l'AS-PATH. Un AS-PATH plus court = route preferee. C'est aussi le mecanisme de prevention des boucles de routage.",
  },
  {
    id: 6, type: "vf",
    question: "BGP annonce automatiquement tous les reseaux present dans la table de routage du routeur.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. BGP annonce UNIQUEMENT les reseaux explicitement configures avec la commande `network mask`. De plus, ces reseaux doivent exister dans la table de routage IP (via route statique ou IGP). BGP ne fait pas d'annonce automatique.",
  },
  {
    id: 7, type: "vf",
    question: "L'attribut Weight BGP est un standard ouvert defini par la RFC, reconnu par tous les constructeurs.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Weight est un attribut PROPRIETAIRE CISCO, local au routeur et non transmis aux voisins BGP. Il est utilise uniquement pour influencer le routage sortant sur ce routeur specifique. Tous les autres attributs BGP sont standardises.",
  },
  {
    id: 8, type: "vf",
    question: "Pour les sessions iBGP, il est recommande d'utiliser des interfaces loopback comme source pour la stabilite.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Les loopbacks sont toujours actives tant qu'une route vers elles existe. Si une interface physique tombe mais qu'un chemin alternatif existe, la session iBGP reste etablie via la loopback. Cela est configure avec `update-source loopback 0`.",
  },
  {
    id: 9, type: "vf",
    question: "Un etat BGP 'Active' signifie que la session est pleinement etablie et que BGP echange des routes.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. L'etat 'Active' signifie que BGP TENTE d'etablir la session TCP mais que le voisin est inaccessible. L'etat 'Established' (ou un nombre dans State/PfxRcd) signifie que la session est etablie et les routes sont echangees.",
  },
  {
    id: 10, type: "vf",
    question: "L'attribut LOCAL_PREF est echange entre les routeurs iBGP du meme AS pour influencer le routage sortant.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. LOCAL_PREF est communique entre tous les routeurs iBGP du meme AS. Une valeur plus elevee est preferee. Il permet d'influencer par quel lien sortant le trafic d'un AS quitte vers l'Internet. Non echange avec les voisins eBGP.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande configure une session eBGP avec le voisin 203.0.113.2 qui appartient a l'AS 65002 ?",
    options: [
      "router bgp 65001 / neighbor 203.0.113.2 remote-as 65002",
      "router bgp 65001 / neighbor 203.0.113.2 as 65002",
      "bgp peer 203.0.113.2 as 65002",
      "router bgp / peer 203.0.113.2 external-as 65002",
    ],
    correct: 0,
    explanation: "`router bgp 65001` (entre dans BGP AS 65001), puis `neighbor 203.0.113.2 remote-as 65002` (definit le voisin et son AS). Si l'AS du voisin est different du notre, c'est une session eBGP.",
  },
  {
    id: 12, type: "qcm",
    question: "Dans la plage des numeros AS BGP, quelle plage est reservee aux AS prives ?",
    options: [
      "1 - 1000",
      "1000 - 64511",
      "64512 - 65535",
      "65536 - 131072",
    ],
    correct: 2,
    explanation: "Les AS prives sont 64512 - 65535. Les AS publics (assignes par l'IANA/RIR) sont 1 - 64511. Les AS prives ne sont pas routes sur Internet et sont utilises pour les configurations internes (iBGP, MPLS L3VPN).",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande annonce le reseau 198.51.100.0/24 dans BGP (le reseau doit exister dans la table de routage) ?",
    options: [
      "network 198.51.100.0 (sous router bgp)",
      "network 198.51.100.0 mask 255.255.255.0 (sous router bgp)",
      "advertise 198.51.100.0/24",
      "redistribute network 198.51.100.0",
    ],
    correct: 1,
    explanation: "BGP necessite le masque exact avec le mot-cle `mask` : `network 198.51.100.0 mask 255.255.255.0`. Sans `mask`, BGP utilise le masque classful (ex: /24 pour une adresse de classe C). Le reseau doit exister dans la table de routage.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle commande affiche le resume des sessions BGP avec leur etat et le nombre de prefixes recus ?",
    options: [
      "show ip bgp",
      "show ip bgp summary",
      "show ip bgp neighbors",
      "show ip route bgp",
    ],
    correct: 1,
    explanation: "`show ip bgp summary` affiche un tableau de toutes les sessions BGP avec : AS du voisin, duree de la session (Up/Down), etat (State) ou nombre de prefixes recus (un nombre = session etablie). Premiere commande de diagnostic BGP.",
  },
  {
    id: 15, type: "qcm",
    question: "Un routeur BGP en etat 'Idle' signifie que...",
    options: [
      "La session est etablie et en attente de trafic",
      "BGP ne tente pas d'etablir la connexion TCP",
      "BGP tente d'etablir la connexion mais le voisin est injoignable",
      "La session a ete suspendue manuellement",
    ],
    correct: 1,
    explanation: "L'etat `Idle` signifie que BGP NE TENTE PAS d'etablir la connexion. Cela peut etre du a une configuration incorrecte, une ACL bloquant TCP/179, ou le routeur attend une reconnexion apres un echec. `Active` = tente de se connecter mais echec.",
  },
  {
    id: 16, type: "qcm",
    question: "Comment configurer une session iBGP avec le voisin 10.0.0.2 (meme AS 65001) en utilisant la loopback comme source ?",
    options: [
      "neighbor 10.0.0.2 remote-as 65001 / neighbor 10.0.0.2 update-source loopback 0",
      "neighbor 10.0.0.2 internal-as 65001 / source loopback 0",
      "ibgp peer 10.0.0.2 / update-source lo0",
      "neighbor 10.0.0.2 as 65001 internal / loopback source",
    ],
    correct: 0,
    explanation: "Deux commandes sous `router bgp 65001` : `neighbor 10.0.0.2 remote-as 65001` (meme AS = iBGP) et `neighbor 10.0.0.2 update-source loopback 0` (utilise la loopback comme source de la session TCP).",
  },
  {
    id: 17, type: "qcm",
    question: "Dans la selection du meilleur chemin BGP, quel attribut est evalue EN PREMIER ?",
    options: [
      "AS-PATH (plus court = prefere)",
      "LOCAL_PREF (plus eleve = prefere)",
      "Weight (plus eleve = prefere) - proprietaire Cisco",
      "MED (plus bas = prefere)",
    ],
    correct: 2,
    explanation: "L'ordre de preference BGP : Weight > LOCAL_PREF > Route originee localement > AS-PATH > Origin > MED > eBGP sur iBGP > IGP metric > Router-ID. Weight (Cisco proprietaire) est toujours le premier attribut evalue.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande annonce la route par defaut a un voisin BGP specifique ?",
    options: [
      "network 0.0.0.0 mask 0.0.0.0",
      "default-information originate",
      "neighbor 203.0.113.2 default-originate",
      "redistribute default",
    ],
    correct: 2,
    explanation: "`neighbor X.X.X.X default-originate` annonce la route par defaut vers CE voisin specifique, sans avoir besoin que la route par defaut existe dans la table de routage locale. `network 0.0.0.0 mask 0.0.0.0` l'annonce a tous les voisins mais necessite la route dans la table.",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande affiche les routes que le routeur annonce a un voisin BGP specifique ?",
    options: [
      "show ip bgp summary",
      "show ip bgp neighbors 192.168.1.2 advertised-routes",
      "show ip bgp 192.168.1.2 sent",
      "show ip bgp neighbors 192.168.1.2 routes",
    ],
    correct: 1,
    explanation: "`show ip bgp neighbors X.X.X.X advertised-routes` affiche les routes envoyees a ce voisin. `show ip bgp neighbors X.X.X.X received-routes` montre les routes recues. `show ip bgp` montre toute la table BGP.",
  },
  {
    id: 20, type: "qcm",
    question: "Dans la sortie de `show ip bgp summary`, que signifie une valeur numerique (ex: 5) dans la colonne State/PfxRcd ?",
    options: [
      "La session BGP a 5 erreurs",
      "5 routes ont ete refusees",
      "La session est etablie et 5 prefixes ont ete recus",
      "Le voisin a ete contacte 5 fois",
    ],
    correct: 2,
    explanation: "Un NOMBRE dans State/PfxRcd signifie que la session BGP est etablie (Established) et que ce nombre de prefixes (routes) a ete recu du voisin. Un MOT (Idle, Active, Connect...) signifie que la session n'est pas etablie.",
  },
];

export default function QuizBgp() {
  return <QuizEngine questions={questions} title="BGP" courseLink="/cours/networking/routing/bgp" />;
}

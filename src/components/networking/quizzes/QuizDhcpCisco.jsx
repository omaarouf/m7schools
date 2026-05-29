import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "Le processus DORA (Discover, Offer, Request, Acknowledge) decrit les 4 etapes de l'attribution d'adresse DHCP.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. DORA : 1) Discover (client diffuse), 2) Offer (serveur propose une adresse), 3) Request (client accepte), 4) Acknowledge (serveur confirme). Ces etapes s'effectuent via broadcast avant que le client ait une adresse IP.",
  },
  {
    id: 2, type: "vf",
    question: "Les adresses exclues du pool DHCP doivent etre configurees APRES la creation du pool.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Les exclusions doivent idealement etre configurees AVANT la creation du pool (meme si l'ordre n'est pas strictement impose par IOS). Les adresses exclues s'appliquent globalement a tous les pools. Toujours exclure les adresses fixes (routeurs, serveurs, imprimantes).",
  },
  {
    id: 3, type: "vf",
    question: "La commande `ip helper-address` sur une interface transforme les broadcasts DHCP en unicast vers un serveur DHCP distant.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `ip helper-address X.X.X.X` sur l'interface LAN convertit les broadcasts DHCP (qui ne traversent pas les routeurs) en unicast vers le serveur DHCP distant. L'interface doit etre celle faisant face aux clients.",
  },
  {
    id: 4, type: "vf",
    question: "En DHCPv6 stateless, le serveur attribue l'adresse IPv6 complete aux clients.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. En mode STATELESS, les clients GENERENT leur propre adresse IPv6 via SLAAC (basee sur le prefixe du routeur et leur adresse MAC). DHCPv6 stateless fournit uniquement les informations supplementaires (DNS, domaine) via le flag O des RA.",
  },
  {
    id: 5, type: "vf",
    question: "La duree de bail DHCP `lease 7 0 0` signifie 7 jours, 0 heure, 0 minute.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `lease [jours] [heures] [minutes]` : `lease 7 0 0` = bail de 7 jours. `lease 1 12 0` = 1 jour 12 heures. `lease infinite` = bail permanent (non recommande en production).",
  },
  {
    id: 6, type: "vf",
    question: "Le flag 'M' (Managed) dans les RA IPv6 indique aux clients d'utiliser DHCPv6 pour obtenir leur adresse complete.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Flag M (Managed) = utiliser DHCPv6 stateful pour obtenir l'adresse IPv6 complete (SLAAC desactive). Flag O (Other) = utiliser DHCPv6 pour les informations supplementaires (DNS, domaine) tout en generant l'adresse via SLAAC.",
  },
  {
    id: 7, type: "vf",
    question: "Un pool DHCP peut fournir jusqu'a 2 serveurs DNS aux clients.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. La commande `dns-server` peut specifier jusqu'a 8 adresses de serveurs DNS. Exemple : `dns-server 8.8.8.8 8.8.4.4 1.1.1.1`. Les clients utilisent les serveurs dans l'ordre specifie.",
  },
  {
    id: 8, type: "vf",
    question: "La commande `show ip dhcp binding` affiche les adresses IP attribuees aux clients avec leurs adresses MAC.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `show ip dhcp binding` affiche toutes les attributions DHCP actives : adresse IP, adresse MAC du client, expiration du bail et type d'attribution. Utile pour verifier quels clients ont recu quelle adresse.",
  },
  {
    id: 9, type: "vf",
    question: "En DHCPv6, la configuration du pool se fait sous le mode `dhcp-config` comme en DHCPv4.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. En DHCPv6, on entre dans `ipv6 dhcp pool NOM` (mode `dhcpv6-config`), non `dhcp-config`. La syntaxe est differente : `address prefix 2001:db8::/64` (stateful) ou `dns-server` et `domain-name` (stateless).",
  },
  {
    id: 10, type: "vf",
    question: "La commande `ipv6 unicast-routing` est indispensable avant de configurer DHCPv6 sur un routeur.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `ipv6 unicast-routing` active le routage IPv6 sur le routeur. Sans cette commande, le routeur ne peut pas transmettre les paquets IPv6 entre les interfaces ni envoyer les RA (Router Advertisement) necessaires a SLAAC et DHCPv6.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande exclut les adresses 192.168.1.1 a 192.168.1.10 du pool DHCP ?",
    options: [
      "ip dhcp pool / exclude 192.168.1.1 192.168.1.10",
      "ip dhcp excluded-address 192.168.1.1 192.168.1.10",
      "no ip dhcp 192.168.1.1 192.168.1.10",
      "dhcp exclude 192.168.1.1 - 192.168.1.10",
    ],
    correct: 1,
    explanation: "`ip dhcp excluded-address 192.168.1.1 192.168.1.10` exclut la plage de 192.168.1.1 a .10. Pour une seule adresse : `ip dhcp excluded-address 192.168.1.254`. Ces commandes sont en mode de configuration GLOBALE.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle commande configure un pool DHCP nomme 'LAN_POOL' pour le reseau 192.168.1.0/24 avec passerelle 192.168.1.1 ?",
    options: [
      "ip dhcp pool LAN_POOL / network 192.168.1.0 255.255.255.0 / default-router 192.168.1.1",
      "ip dhcp LAN_POOL / subnet 192.168.1.0/24 / gateway 192.168.1.1",
      "dhcp pool LAN_POOL / address 192.168.1.0 /24 / router 192.168.1.1",
      "ip dhcp-server LAN_POOL / network 192.168.1.0 / default-gateway 192.168.1.1",
    ],
    correct: 0,
    explanation: "`ip dhcp pool LAN_POOL` entre dans le mode dhcp-config. Puis : `network 192.168.1.0 255.255.255.0` (plage du pool), `default-router 192.168.1.1` (passerelle), `dns-server X.X.X.X`, `lease X`.",
  },
  {
    id: 13, type: "qcm",
    question: "Sur quelle interface configurer `ip helper-address` pour relayer DHCP vers un serveur distant ?",
    options: [
      "Sur l'interface WAN (vers le serveur DHCP)",
      "Sur l'interface LAN (face aux clients DHCP)",
      "Sur l'interface loopback",
      "Sur toutes les interfaces du routeur",
    ],
    correct: 1,
    explanation: "`ip helper-address` doit etre configure sur l'interface LAN qui recoit les broadcasts DHCP des clients. Le routeur relaie ces broadcasts en unicast vers le serveur DHCP. L'interface WAN (vers le serveur) n'a pas besoin de cette commande.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle commande affiche les conflits d'adresses DHCP detectes sur le routeur ?",
    options: [
      "show ip dhcp pool",
      "show ip dhcp binding",
      "show ip dhcp conflict",
      "show ip dhcp statistics",
    ],
    correct: 2,
    explanation: "`show ip dhcp conflict` affiche les adresses IP pour lesquelles un conflit a ete detecte (l'adresse est deja utilisee par un autre equipement). Ces adresses sont automatiquement retirees du pool jusqu'a resolution.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande cree un pool DHCPv6 STATEFUL qui attribue des adresses du prefixe 2001:db8:1::/64 ?",
    options: [
      "ipv6 dhcp pool POOL_V6 / network 2001:db8:1::/64",
      "ipv6 dhcp pool POOL_V6 / address prefix 2001:db8:1::/64",
      "ipv6 dhcp pool POOL_V6 / prefix 2001:db8:1:: /64",
      "ip dhcp pool POOL_V6 / ipv6-network 2001:db8:1::/64",
    ],
    correct: 1,
    explanation: "`ipv6 dhcp pool POOL_V6` entre en mode dhcpv6-config, puis `address prefix 2001:db8:1::/64` definit le prefixe pour les attributions stateful. En mode stateless, on n'utilise pas `address prefix` - seulement `dns-server` et `domain-name`.",
  },
  {
    id: 16, type: "qcm",
    question: "Pour DHCPv6 stateless, quelle commande activer sur l'interface LAN du routeur ?",
    options: [
      "ipv6 nd managed-config-flag",
      "ipv6 nd other-config-flag",
      "ipv6 dhcp stateless",
      "ipv6 slaac enable",
    ],
    correct: 1,
    explanation: "`ipv6 nd other-config-flag` active le flag O dans les RA, indiquant aux clients d'utiliser DHCPv6 pour les informations supplementaires (DNS, domaine) tout en generant leur adresse via SLAAC. Pour stateful (adresse complete via DHCP), utiliser `ipv6 nd managed-config-flag`.",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle commande affiche tous les pools DHCP configures et leur utilisation (adresses libres/utilisees) ?",
    options: [
      "show ip dhcp binding",
      "show ip dhcp statistics",
      "show ip dhcp pool",
      "show ip dhcp server",
    ],
    correct: 2,
    explanation: "`show ip dhcp pool` affiche tous les pools avec leur plage, exclusions et nombre d'adresses disponibles/utilisees. `show ip dhcp binding` liste les attributions actives. `show ip dhcp statistics` donne les compteurs de messages DORA.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle est la commande pour appliquer un pool DHCPv6 sur l'interface Gi0/0 (en mode serveur DHCPv6) ?",
    options: [
      "ip dhcp server POOL_V6 (en mode interface)",
      "ipv6 dhcp server POOL_V6 (en mode interface)",
      "dhcpv6 pool POOL_V6 apply",
      "standby dhcpv6 POOL_V6",
    ],
    correct: 1,
    explanation: "`ipv6 dhcp server POOL_V6` en mode interface applique le pool DHCPv6 sur cette interface. Le routeur repond aux sollicitations DHCPv6 recues sur cette interface. Combiner avec `ipv6 nd other-config-flag` ou `managed-config-flag` selon le mode.",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande affiche les attributions DHCPv6 actives (equivalente a `show ip dhcp binding` pour IPv6) ?",
    options: [
      "show ipv6 dhcp pool",
      "show ipv6 dhcp binding",
      "show ipv6 dhcp lease",
      "show ip dhcp ipv6 binding",
    ],
    correct: 1,
    explanation: "`show ipv6 dhcp binding` affiche les attributions DHCPv6 stateful actives avec les adresses IPv6 attribuees et les DUID des clients. `show ipv6 dhcp pool` affiche la configuration des pools DHCPv6.",
  },
  {
    id: 20, type: "qcm",
    question: "Quand un client DHCP renouvelle son bail, quel message envoie-t-il au serveur ?",
    options: [
      "Discover",
      "Request (en unicast directement au serveur)",
      "Offer",
      "Discover puis Request",
    ],
    correct: 1,
    explanation: "Pour un renouvellement de bail, le client envoie un message Request en UNICAST directement au serveur DHCP (pas de broadcast). Le serveur repond avec Acknowledge. Le processus complet DORA (avec broadcast) ne se produit qu'a la premiere attribution.",
  },
];

export default function QuizDhcpCisco() {
  return <QuizEngine questions={questions} title="DHCP v4 & v6" courseLink="/cours/networking/services-reseau/dhcp" />;
}

import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "GRE (Generic Routing Encapsulation) chiffre automatiquement le trafic qu'il encapsule.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. GRE encapsule le trafic dans des paquets IP mais NE CHIFFRE PAS les donnees. Pour la securite, il faut combiner GRE avec IPsec (GRE over IPsec). GRE seul est utile pour le routage dynamique (OSPF, EIGRP) a travers un tunnel.",
  },
  {
    id: 2, type: "vf",
    question: "IPsec seul (sans GRE) peut transporter des protocoles de routage dynamique comme OSPF.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. IPsec ne supporte pas nativement les protocoles multicast necessaires au routage dynamique (OSPF utilise 224.0.0.5/6). GRE peut encapsuler les paquets multicast. C'est pourquoi GRE over IPsec est la solution complete : routage dynamique (GRE) + chiffrement (IPsec).",
  },
  {
    id: 3, type: "vf",
    question: "Dans un tunnel GRE, le champ `tunnel source` indique l'adresse IP publique du routeur local.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `tunnel source X.X.X.X` definit l'adresse IP publique de l'extremite locale du tunnel. `tunnel destination Y.Y.Y.Y` definit l'IP publique du routeur distant. Ces adresses sont les adresses physiques WAN, pas les adresses du tunnel.",
  },
  {
    id: 4, type: "vf",
    question: "ISAKMP Phase 1 etablit le canal securise utilise pour negocier les parametres de la Phase 2.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. IPsec fonctionne en deux phases : Phase 1 (ISAKMP/IKE) etablit un canal securise bidirectionnel (SA - Security Association) pour negocier en securite. Phase 2 (IPsec) utilise ce canal pour negocier les parametres de protection du trafic de donnees.",
  },
  {
    id: 5, type: "vf",
    question: "Dans IPsec, l'authentification par cle pre-partagee (PSK) necessite que la meme cle soit configuree sur les deux routeurs.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. La cle pre-partagee (pre-shared key) doit etre IDENTIQUE sur les deux routeurs IPsec. Si les cles different, la Phase 1 ISAKMP echoue. Utiliser une cle complexe (majuscules, chiffres, caracteres speciaux).",
  },
  {
    id: 6, type: "vf",
    question: "La crypto map doit etre appliquee sur l'interface LAN du routeur pour que IPsec fonctionne.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. La crypto map s'applique sur l'interface WAN (l'interface par laquelle le trafic chiffre sort). C'est l'interface qui connecte au reseau public (Internet). `interface serial 0/0/0 / crypto map VPN_MAP`.",
  },
  {
    id: 7, type: "vf",
    question: "L'etat `QM_IDLE` dans `show crypto isakmp sa` indique que la Phase 1 IPsec est etablie et le tunnel est actif.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `QM_IDLE` (Quick Mode IDLE) signifie que la Phase 1 est etablie et en attente du trafic interessant pour declencher la Phase 2. `MM_NO_STATE` indique que la Phase 1 a echoue (verifier la cle PSK et la politique ISAKMP).",
  },
  {
    id: 8, type: "vf",
    question: "L'ACL definissant le 'trafic interessant' IPsec doit etre miroir (symetrique) sur les deux routeurs.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. L'ACL de 'trafic interessant' definit quel trafic sera chiffre. Sur R1 : source=192.168.1.0, dest=192.168.2.0. Sur R2 : source=192.168.2.0, dest=192.168.1.0. Les ACL doivent etre symetriques (miroir) pour que le trafic dans les deux sens soit chiffre.",
  },
  {
    id: 9, type: "vf",
    question: "GRE utilise le protocole IP numero 47.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. GRE est le protocole IP numero 47. IPsec utilise ESP (protocole IP 50) et AH (protocole IP 51). Ces numeros de protocole sont importants pour les ACL qui autorisent le trafic VPN.",
  },
  {
    id: 10, type: "vf",
    question: "Le groupe Diffie-Hellman 14 utilise des cles de 1024 bits pour l'echange de cles ISAKMP.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Le groupe DH 14 utilise des cles de 2048 bits. Groupe 1 = 768 bits, Groupe 2 = 1024 bits, Groupe 14 = 2048 bits, Groupe 24 = 2048 bits avec courbe elliptique. Le groupe 14 est recommande pour la securite moderne.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande cree l'interface tunnel 0 du cote R1 (IP publique 200.1.1.1) vers R2 (200.1.1.2) ?",
    options: [
      "interface tunnel 0 / ip address 10.0.0.1 255.255.255.252 / tunnel source 200.1.1.1 / tunnel destination 200.1.1.2 / tunnel mode gre ip",
      "interface tunnel / source 200.1.1.1 / dest 200.1.1.2 / ip 10.0.0.1/30",
      "gre tunnel 0 / source 200.1.1.1 / destination 200.1.1.2 / address 10.0.0.1/30",
      "create tunnel 0 gre / local 200.1.1.1 / remote 200.1.1.2",
    ],
    correct: 0,
    explanation: "Sequence pour tunnel GRE : `interface tunnel 0` (cree l'interface), `ip address 10.0.0.1 255.255.255.252` (IP interne du tunnel), `tunnel source 200.1.1.1` (IP WAN locale), `tunnel destination 200.1.1.2` (IP WAN distante), `tunnel mode gre ip`.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle commande configure la politique ISAKMP Phase 1 avec AES-256 et SHA-256 ?",
    options: [
      "crypto isakmp policy 10 / authentication pre-share / encryption aes 256 / hash sha256 / group 14",
      "ipsec isakmp / encryption aes-256 / hash sha256",
      "crypto phase1 / aes 256 / sha256 / dh 14",
      "ip security policy 10 / aes256 / sha256",
    ],
    correct: 0,
    explanation: "Sous `crypto isakmp policy 10` : `authentication pre-share` (PSK), `encryption aes 256` (AES-256), `hash sha256` (hachage), `group 14` (DH 2048 bits), `lifetime 86400` (24h). Ces parametres doivent correspondre sur les deux routeurs.",
  },
  {
    id: 13, type: "qcm",
    question: "Quelle commande configure la cle pre-partagee 'MonVPN@2025' pour le voisin IPsec 203.0.113.2 ?",
    options: [
      "crypto isakmp key MonVPN@2025 peer 203.0.113.2",
      "crypto isakmp key MonVPN@2025 address 203.0.113.2",
      "ipsec psk MonVPN@2025 neighbor 203.0.113.2",
      "crypto pre-shared-key MonVPN@2025 203.0.113.2",
    ],
    correct: 1,
    explanation: "`crypto isakmp key [cle] address [IP-voisin]` configure la cle PSK pour ce voisin specifique. La cle doit etre IDENTIQUE sur les deux routeurs. Le mot-cle est `address` (pas `peer` ou `neighbor`).",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle commande cree le Transform Set Phase 2 avec chiffrement ESP-AES-256 et authentification ESP-SHA256-HMAC en mode tunnel ?",
    options: [
      "crypto ipsec transform-set VPN_TS esp-aes 256 esp-sha256-hmac / mode tunnel",
      "ipsec transform VPN_TS aes-256 sha256 tunnel",
      "crypto transform-set VPN_TS / encryption aes256 / authentication sha256",
      "ip security transform VPN_TS aes256 hmac-sha256",
    ],
    correct: 0,
    explanation: "`crypto ipsec transform-set VPN_TS esp-aes 256 esp-sha256-hmac` definit les algorithmes de chiffrement (ESP-AES-256) et d'integrite (ESP-SHA256-HMAC). Puis `mode tunnel` pour le mode tunnel (vs mode transport). Le nom VPN_TS est reference dans la crypto map.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande affiche les sessions IPsec (Phase 2) actives avec les compteurs de paquets chiffres/dechiffres ?",
    options: [
      "show crypto isakmp sa",
      "show crypto ipsec sa",
      "show vpn sessions",
      "show crypto map",
    ],
    correct: 1,
    explanation: "`show crypto ipsec sa` affiche les SAs Phase 2 avec les compteurs de paquets chiffres, dechiffres et les parametres de securite. `show crypto isakmp sa` affiche la Phase 1 (etat QM_IDLE ou MM_NO_STATE).",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle est la procedure pour verifier qu'un tunnel IPsec est actif s'il n'y a pas de sessions dans `show crypto isakmp sa` ?",
    options: [
      "Redemarrer le routeur",
      "Envoyer du trafic 'interessant' (defini par l'ACL) : `ping [IP distante] source [IP locale]`",
      "Executer `ip ipsec connect`",
      "Appliquer a nouveau la crypto map",
    ],
    correct: 1,
    explanation: "IPsec est declenche par le trafic interessant (defini par l'ACL Phase 2). S'il n'y a pas de session, envoyer : `ping 192.168.2.1 source 192.168.1.1 repeat 10`. Cela declenche la negociation. Si la Phase 1 echoue, verifier PSK et politique ISAKMP.",
  },
  {
    id: 17, type: "qcm",
    question: "Dans une configuration IPsec, que contient l'ACL 'trafic interessant' ?",
    options: [
      "Le trafic a bloquer sur l'interface WAN",
      "Le trafic a autoriser sur les VTY",
      "Le trafic entre les LANs des deux sites qui doit etre chiffre",
      "Les adresses des serveurs NTP",
    ],
    correct: 2,
    explanation: "L'ACL 'trafic interessant' definit quel trafic sera chiffre par IPsec. Exemple : `access-list 110 permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255` = tout le trafic entre les deux LANs sera chiffre dans le tunnel IPsec.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande applique la crypto map 'VPN_MAP' sur l'interface WAN ?",
    options: [
      "crypto-map VPN_MAP apply (en mode global)",
      "interface serial 0/0/0 / crypto map VPN_MAP",
      "ip ipsec map VPN_MAP (en mode interface)",
      "apply crypto-map VPN_MAP wan",
    ],
    correct: 1,
    explanation: "En mode interface WAN : `crypto map VPN_MAP`. Cette commande active IPsec sur l'interface et associe la crypto map au trafic entrant/sortant. La crypto map doit etre appliquee sur l'interface vers Internet.",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle est la principale difference entre GRE et IPsec ?",
    options: [
      "GRE chiffre le trafic, IPsec encapsule sans chiffrement",
      "GRE encapsule sans chiffrement (supporte le routage dynamique), IPsec chiffre mais ne supporte pas nativement le multicast",
      "Les deux font la meme chose mais avec des performances differentes",
      "GRE est pour IPv6, IPsec pour IPv4",
    ],
    correct: 1,
    explanation: "GRE : encapsulation sans chiffrement, supporte le routage dynamique (multicast OSPF/EIGRP). IPsec : chiffrement fort, mais ne supporte pas nativement le multicast. La combinaison GRE over IPsec offre le meilleur des deux : routage dynamique + securite.",
  },
  {
    id: 20, type: "qcm",
    question: "Quelle commande verifie l'etat d'un tunnel GRE ?",
    options: [
      "show crypto isakmp sa",
      "show interface tunnel 0",
      "show gre tunnel 0",
      "show ip tunnel 0",
    ],
    correct: 1,
    explanation: "`show interface tunnel 0` affiche l'etat du tunnel GRE (up/up ou down), l'adresse IP, le tunnel source/destination et les statistiques. Si le tunnel est `down/down`, verifier la connectivite IP entre les adresses source et destination.",
  },
];

export default function QuizVpn() {
  return <QuizEngine questions={questions} title="VPN (GRE & IPsec)" courseLink="/cours/networking/services-reseau/vpn" />;
}

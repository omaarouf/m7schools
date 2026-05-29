import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "Cisco CME (Communications Manager Express) transforme un routeur Cisco en serveur de telephonie IP.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. CME (Unified Communications Manager Express) est une solution de telephonie IP integree directement dans IOS. Elle gere les telephones IP (ePhones) et les extensions (ePhone-DN) sans serveur telephonie dedie.",
  },
  {
    id: 2, type: "vf",
    question: "SCCP (Skinny Client Control Protocol) est utilise pour la signalisation entre les telephones IP Cisco et le serveur CME.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. SCCP (aussi appele Skinny) est le protocole Cisco de signalisation VoIP. Il gere les fonctions telles que le decrochage, la sonnerie, le transfert d'appel et la mise en attente entre les telephones IP et CME.",
  },
  {
    id: 3, type: "vf",
    question: "L'option DHCP 150 indique aux telephones IP l'adresse du serveur DNS.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. L'option DHCP 150 indique l'adresse du serveur TFTP (ou CME). Les telephones IP utilisent TFTP pour telecharger leur fichier de configuration au demarrage. L'option 66 (standard) indique aussi un serveur TFTP mais en format chaine.",
  },
  {
    id: 4, type: "vf",
    question: "ePhone represente un telephone IP physique enregistre sur CME, identifie par son adresse MAC.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Un ePhone correspond a un telephone IP physique unique, identifie par son adresse MAC (`mac-address`). ePhone-DN (Directory Number) represente l'extension (numero de telephone) logique. Un ePhone peut avoir plusieurs boutons (ePhone-DN).",
  },
  {
    id: 5, type: "vf",
    question: "La commande `max-dn` dans telephony-service definit le nombre maximum de telephones IP.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `max-dn` definit le nombre maximum d'extensions (Directory Numbers). `max-ephones` definit le nombre maximum de telephones IP physiques. Il est recommande de configurer `max-dn` >= `max-ephones` car chaque telephone a besoin d'au moins une extension.",
  },
  {
    id: 6, type: "vf",
    question: "Un ePhone-DN avec `dual-line` permet d'avoir deux appels simultanement sur le meme numero.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `ephone-dn 1 dual-line` cree une extension avec deux lignes : la ligne principale peut recevoir un second appel pendant qu'un appel est en cours. Sans `dual-line`, l'extension ne supporte qu'un seul appel a la fois.",
  },
  {
    id: 7, type: "vf",
    question: "La commande `auto assign 1 to 20` dans telephony-service assigne manuellement chaque telephone a un ePhone-DN.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `auto assign 1 to 20` effectue une assignation AUTOMATIQUE des ePhone-DN 1 a 20 aux ePhones qui se connectent. L'assignation manuelle utilise la commande `button X:Y` dans chaque configuration ePhone.",
  },
  {
    id: 8, type: "vf",
    question: "La commande `ip source-address 192.168.100.1 port 2000` configure l'adresse IP et le port SCCP du serveur CME.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `ip source-address` dans telephony-service indique l'adresse IP sur laquelle CME ecoute les connexions SCCP des telephones IP. Le port par defaut est 2000 (SCCP). Les telephones se connectent a cette adresse pour s'enregistrer.",
  },
  {
    id: 9, type: "vf",
    question: "Un telephone affichant 'UNREGISTERED' dans `show ephone` est correctement enregistre sur CME.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. 'UNREGISTERED' signifie que le telephone n'a PAS reussi a s'enregistrer. Causes possibles : option DHCP 150 incorrecte, port SCCP 2000 incorrect, adresse MAC dans ephone ne correspondant pas au telephone physique.",
  },
  {
    id: 10, type: "vf",
    question: "TFTP est utilise par les telephones IP pour telecharger leur fichier de configuration depuis le serveur CME.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Au demarrage, un telephone IP Cisco : 1) obtient son IP via DHCP (option 150 pour l'adresse TFTP), 2) se connecte au serveur TFTP pour telecharger sa configuration, 3) se connecte au serveur CME via SCCP port 2000.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande configure le pool DHCP avec l'option 150 pointant vers le CME a 192.168.100.1 ?",
    options: [
      "ip dhcp pool VOICE / tftp-server 192.168.100.1",
      "ip dhcp pool VOICE / option 150 ip 192.168.100.1",
      "ip dhcp pool VOICE / option 66 192.168.100.1",
      "ip dhcp pool VOICE / voip-server 192.168.100.1",
    ],
    correct: 1,
    explanation: "`option 150 ip 192.168.100.1` configure l'option DHCP Cisco 150 (adresse du serveur TFTP CME). `option 66` est le standard (chaine de texte, non IP). Les telephones Cisco utilisent l'option 150 en priorite.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle sequence configure le telephony-service pour 10 telephones et 10 extensions maximum ?",
    options: [
      "telephony-service / max-ephones 10 / max-dn 10 / ip source-address 192.168.100.1 port 2000",
      "voice-service / ephones 10 / extensions 10 / source 192.168.100.1",
      "cme configure / phones 10 / dns 10 / address 192.168.100.1",
      "telephony-service / phones 10 / dn 10 / ip 192.168.100.1:2000",
    ],
    correct: 0,
    explanation: "Sous `telephony-service` : `max-ephones 10` (limite de telephones), `max-dn 10` (limite d'extensions), `ip source-address 192.168.100.1 port 2000` (adresse et port SCCP CME). Optionnel : `auto assign 1 to 10`.",
  },
  {
    id: 13, type: "qcm",
    question: "Comment creer l'extension (ePhone-DN) numero 2 avec le numero de telephone 1002 ?",
    options: [
      "ephone-dn 2 number 1002",
      "ephone-dn 2 / number 1002",
      "extension 2 / number 1002",
      "dn 2 / phone-number 1002",
    ],
    correct: 1,
    explanation: "`ephone-dn 2` entre dans le mode de configuration de l'extension 2, puis `number 1002` lui attribue le numero de telephone. Sans `number`, l'extension existe mais n'a pas de numero assignable.",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle commande assigne le bouton 1 d'un ePhone a l'ePhone-DN 3 ?",
    options: [
      "button 1 to dn 3",
      "button 1:3",
      "assign button 1 dn 3",
      "button 3 position 1",
    ],
    correct: 1,
    explanation: "`button 1:3` : syntaxe `button [numero-bouton]:[numero-dn]`. Bouton 1 du telephone physique assigne a ePhone-DN 3. Pour plusieurs boutons : `button 1:2 2:3` (bouton 1 = DN 2, bouton 2 = DN 3).",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande affiche la liste de tous les telephones IP enregistres sur CME ?",
    options: [
      "show ephone",
      "show telephony-service",
      "show ephone-dn",
      "show voice phones",
    ],
    correct: 0,
    explanation: "`show ephone` affiche tous les telephones IP avec leur adresse MAC, adresse IP, type, etat (REGISTERED/UNREGISTERED) et les boutons assignes. `show telephony-service` affiche la configuration CME globale.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle est la signification de `button 1:2 2:3` dans la configuration d'un ePhone ?",
    options: [
      "Bouton 1 du DN 2, Bouton 2 du DN 3",
      "Bouton physique 1 assigne a ePhone-DN 2, Bouton physique 2 assigne a ePhone-DN 3",
      "2 boutons au total, 3 DNs disponibles",
      "Premier groupe de 2 boutons, second groupe de 3",
    ],
    correct: 1,
    explanation: "`button [position]:[dn]` : `button 1:2` = le bouton physique 1 du telephone est assigne a ePhone-DN 2. `button 1:2 2:3` = bouton 1 -> DN 2 ET bouton 2 -> DN 3. Un telephone peut ainsi avoir plusieurs extensions.",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle est la difference entre l'option DHCP 150 et l'option 66 pour les telephones IP ?",
    options: [
      "Aucune difference - les deux configurent l'adresse du serveur TFTP",
      "Option 150 est Cisco proprietaire (liste d'IPs), option 66 est le standard (chaine de texte)",
      "Option 66 est plus recente et remplace l'option 150",
      "Option 150 est pour IPv6, option 66 pour IPv4",
    ],
    correct: 1,
    explanation: "Option 150 est specifique Cisco : elle supporte une liste d'adresses IP de serveurs TFTP. Option 66 est le standard RFC : elle accepte une seule valeur (nom ou adresse du serveur TFTP) en format chaine. Les telephones Cisco utilisent l'option 150 en priorite.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande affiche tous les appels VoIP actifs en cours sur CME ?",
    options: [
      "show ephone active",
      "show call active voice",
      "show voice active",
      "show ephone calls",
    ],
    correct: 1,
    explanation: "`show call active voice` affiche les appels VoIP actifs avec les details de chaque appel : codec, bande passante, duree, numeros des parties. `show voice call summary` donne un resume plus concis.",
  },
  {
    id: 19, type: "qcm",
    question: "Dans `show ephone`, que signifie l'etat 'IDLE' pour une extension ?",
    options: [
      "Le telephone est en panne",
      "L'extension est disponible - aucun appel en cours",
      "Le telephone n'est pas encore configure",
      "L'extension a ete desactivee",
    ],
    correct: 1,
    explanation: "'IDLE' dans `show ephone` signifie que l'extension est DISPONIBLE et n'a pas d'appel en cours. 'CONNECTED' = appel actif. 'RINGING' = telephone qui sonne. 'OFFHOOK' = combine decroché sans appel etabli.",
  },
  {
    id: 20, type: "qcm",
    question: "Quelle commande dans telephony-service permet l'attribution automatique des DNs 1 a 10 aux ePhones qui se connectent ?",
    options: [
      "auto-assign 1 10",
      "auto assign 1 to 10",
      "assign dn 1 to 10 auto",
      "auto-provision dn 1 10",
    ],
    correct: 1,
    explanation: "`auto assign 1 to 10` dans telephony-service attribue automatiquement les ePhone-DN 1 a 10 aux ePhones qui se connectent au CME, dans l'ordre de connexion. Pour les attributions specifiques (direction, accueil), utiliser `button X:Y` dans chaque ePhone.",
  },
];

export default function QuizVoip() {
  return <QuizEngine questions={questions} title="VoIP (CME)" courseLink="/cours/networking/services-reseau/voip" />;
}

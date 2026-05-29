import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "Port-Security peut etre active sur un port en mode dynamique (DTP auto ou desirable).",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Port-Security ne fonctionne que sur les ports en mode access STATIQUE ou trunk STATIQUE. Il ne peut pas etre active sur un port en mode dynamique. Il faut configurer `switchport mode access` avant d'activer Port-Security.",
  },
  {
    id: 2, type: "vf",
    question: "Par defaut, Port-Security autorise jusqu'a 1 adresse MAC sur un port securise.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. La valeur par defaut apres activation de `switchport port-security` est 1 adresse MAC maximum. Pour augmenter ce nombre, utiliser `switchport port-security maximum X`.",
  },
  {
    id: 3, type: "vf",
    question: "Le mode de violation 'protect' enregistre un message syslog et desactive le port en cas de violation.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Le mode 'protect' ignore silencieusement les trames violatrices sans aucun log ni desactivation. 'restrict' = log syslog + blocage (port reste actif). 'shutdown' = log + port err-disabled (le mode par defaut).",
  },
  {
    id: 4, type: "vf",
    question: "L'apprentissage 'sticky' apprend les adresses MAC dynamiquement et les sauvegarde dans la running-config.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `switchport port-security mac-address sticky` apprend dynamiquement les adresses MAC lors des premieres connexions et les ecrit dans la running-config. Si la config est sauvegardee, ces adresses persistent apres un redemarrage.",
  },
  {
    id: 5, type: "vf",
    question: "Le mode de violation par defaut de Port-Security est 'restrict'.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Le mode de violation par defaut est 'shutdown'. Un port en violation passe immediatement en etat err-disabled et genere un message syslog. Il doit etre reactive manuellement.",
  },
  {
    id: 6, type: "vf",
    question: "Port-Security protege contre les attaques de type MAC flooding qui saturent la table CAM du switch.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Une attaque MAC flooding envoie des milliers de trames avec des adresses MAC aleatoires pour saturer la table CAM. Port-Security limite le nombre d'adresses MAC par port, empechant cette attaque.",
  },
  {
    id: 7, type: "vf",
    question: "Pour reactiver un port err-disabled, il suffit de debrancher et rebrancher le cable Ethernet.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Un port err-disabled doit etre reactive logiquement : `shutdown` puis `no shutdown` en mode configuration d'interface. Le debrancher physiquement ne change pas l'etat logique. Une recuperation automatique peut etre configuree avec `errdisable recovery`.",
  },
  {
    id: 8, type: "vf",
    question: "Le vieillissement de type 'inactivity' expire une adresse MAC uniquement si aucun trafic n'est detecte pendant le delai configure.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `aging type inactivity` : l'adresse expire seulement si inactive pendant le delai. `aging type absolute` : l'adresse expire systematiquement apres le delai, qu'elle soit active ou non.",
  },
  {
    id: 9, type: "vf",
    question: "La commande `show port-security interface fa0/1` affiche le nombre de violations detectees sur ce port.",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. La sortie de `show port-security interface` inclut : Port Status, Violation Mode, Maximum MAC, Sticky MAC, Last Source Address et Security Violation Count (compteur de violations).",
  },
  {
    id: 10, type: "vf",
    question: "Une adresse MAC statique configuree avec `switchport port-security mac-address XXXX` persiste apres un redemarrage sans qu'il soit necessaire de sauvegarder la configuration.",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. L'adresse MAC statique est dans la running-config (RAM). Pour persister apres un redemarrage, il faut sauvegarder avec `copy running-config startup-config`. Sans sauvegarde, la config est perdue au redemarrage.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle sequence active correctement Port-Security sur le port Fa0/1 ?",
    options: [
      "interface fa0/1 / switchport port-security",
      "interface fa0/1 / switchport mode access / switchport port-security",
      "switchport port-security fa0/1 enable",
      "interface fa0/1 / port-security enable",
    ],
    correct: 1,
    explanation: "Sequence obligatoire : 1) `switchport mode access` (force le mode access statique), 2) `switchport port-security` (active Port-Security). Sans le mode access statique, la commande port-security echoue.",
  },
  {
    id: 12, type: "qcm",
    question: "Quelle commande configure Port-Security pour autoriser maximum 3 adresses MAC avec apprentissage sticky ?",
    options: [
      "switchport port-security max 3 sticky",
      "switchport port-security maximum 3 / switchport port-security mac-address sticky",
      "switchport port-security 3 mac-address sticky",
      "port-security maximum 3 / port-security sticky",
    ],
    correct: 1,
    explanation: "Deux commandes separees : `switchport port-security maximum 3` (limite a 3 MAC) et `switchport port-security mac-address sticky` (active l'apprentissage automatique). Les adresses apprises sont sauvegardees dans la running-config.",
  },
  {
    id: 13, type: "qcm",
    question: "Quel mode de violation bloque les trames non autorisees ET enregistre un message syslog, sans desactiver le port ?",
    options: [
      "Mode protect",
      "Mode restrict",
      "Mode shutdown",
      "Mode warning",
    ],
    correct: 1,
    explanation: "Mode 'restrict' : bloque les trames en violation + genere un log syslog + incrémente le compteur de violations, MAIS le port reste actif. Mode 'protect' : bloque sans log. Mode 'shutdown' : bloque + log + port err-disabled.",
  },
  {
    id: 14, type: "qcm",
    question: "Comment configurer une recuperation automatique d'un port err-disabled apres 5 minutes (300 secondes) ?",
    options: [
      "interface fa0/1 / auto-recovery 300",
      "errdisable recovery cause psecure-violation / errdisable recovery interval 300",
      "port-security recovery 300",
      "errdisable recovery 300 port-security",
    ],
    correct: 1,
    explanation: "`errdisable recovery cause psecure-violation` active la recuperation automatique pour les violations Port-Security, et `errdisable recovery interval 300` fixe le delai a 300 secondes (5 min). Le port est reactives automatiquement apres ce delai.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle commande affiche un resume de Port-Security sur TOUS les ports du switch ?",
    options: [
      "show port-security interface",
      "show port-security address",
      "show port-security",
      "show switchport port-security",
    ],
    correct: 2,
    explanation: "`show port-security` (sans argument) affiche un resume global : tous les ports securises avec leur maximum MAC, adresses actuelles, violations et mode. `show port-security interface fa0/1` donne les details d'un port specifique.",
  },
  {
    id: 16, type: "qcm",
    question: "Dans la sortie de `show port-security interface`, que signifie le statut 'Secure-shutdown' ?",
    options: [
      "Port-Security est active et le port est en mode shutdown volontaire",
      "Le port a ete desactive par une violation Port-Security (err-disabled)",
      "Le port est securise et en cours de shutdown",
      "Port-Security bloque activement les trames non autorisees",
    ],
    correct: 1,
    explanation: "'Secure-shutdown' signifie que le port est en etat err-disabled suite a une violation Port-Security. 'Secure-up' signifie que Port-Security est actif et le port fonctionne normalement.",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle est la difference entre les adresses MAC 'statique' et 'sticky' dans Port-Security ?",
    options: [
      "Statique = configuree manuellement, Sticky = apprise automatiquement et sauvegardee en config",
      "Statique = apprise automatiquement, Sticky = configuree manuellement",
      "Aucune difference - les deux sont sauvegardees automatiquement",
      "Statique = temporaire, Sticky = permanente",
    ],
    correct: 0,
    explanation: "Adresse statique : configuree manuellement par l'admin (`mac-address XXXX`). Adresse sticky : apprise automatiquement lors des premieres connexions ET sauvegardee dans la running-config. Sticky est plus pratique pour le deploiement rapide.",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande affiche toutes les adresses MAC apprises ou configurees par Port-Security sur le switch ?",
    options: [
      "show mac address-table",
      "show port-security address",
      "show port-security mac",
      "show arp port-security",
    ],
    correct: 1,
    explanation: "`show port-security address` affiche toutes les adresses MAC associees a Port-Security : leur type (sticky, static, dynamic), le VLAN et l'interface. `show mac address-table` montre la table CAM complete du switch.",
  },
  {
    id: 19, type: "qcm",
    question: "Quel type d'attaque Port-Security ne peut PAS empecher directement ?",
    options: [
      "MAC flooding (saturation de la table CAM)",
      "Connexion d'equipements non autorises",
      "Attaques de type VLAN hopping",
      "Usurpation d'adresse MAC",
    ],
    correct: 2,
    explanation: "Port-Security ne protege pas contre le VLAN hopping (qui exploite DTP ou le VLAN natif). Port-Security se concentre sur les adresses MAC autorisees par port. Pour contrer le VLAN hopping : desactiver DTP, changer le VLAN natif.",
  },
  {
    id: 20, type: "qcm",
    question: "Apres une violation en mode 'shutdown', comment reactiver manuellement le port Fa0/1 ?",
    options: [
      "no port-security violation (en mode interface)",
      "switchport port-security reset (en mode interface)",
      "interface fa0/1 / shutdown / no shutdown",
      "clear port-security fa0/1",
    ],
    correct: 2,
    explanation: "Pour reactiver un port err-disabled : entrer en mode interface (`interface fa0/1`), puis `shutdown`, puis `no shutdown`. La cause de la violation doit etre resolue avant la reactivation, sinon le port repassera immediatement en err-disabled.",
  },
];

export default function QuizPortSecurity() {
  return <QuizEngine questions={questions} title="Port-Security" courseLink="/cours/networking/securite/port-security" />;
}

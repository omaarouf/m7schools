import React, { useState } from "react";

const questions = [
  // --- QCM ---
  {
    id: 1,
    type: "qcm",
    question: "Quelle commande permet de changer le hostname de maniere permanente ?",
    options: ["hostname srv1", "hostnamectl set-hostname srv1.ofppt.local", "nano /etc/hostname", "nmcli hostname srv1"],
    correct: 1,
    explanation: "hostnamectl set-hostname modifie /etc/hostname de maniere permanente. La commande hostname seule est temporaire.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Quel fichier Ubuntu utilise pour la configuration reseau permanente ?",
    options: ["/etc/sysconfig/network-scripts/ifcfg-ens33", "/etc/network/interfaces", "/etc/netplan/*.yaml", "/etc/NetworkManager/system-connections/"],
    correct: 2,
    explanation: "Ubuntu Server utilise Netplan. Les fichiers de configuration se trouvent dans /etc/netplan/ avec l extension .yaml.",
  },
  {
    id: 3,
    type: "qcm",
    question: "Quelle commande applique la configuration Netplan ?",
    options: ["netplan start", "netplan reload", "netplan apply", "systemctl restart netplan"],
    correct: 2,
    explanation: "netplan apply est la commande qui lit le fichier YAML et applique la configuration reseau.",
  },
  {
    id: 4,
    type: "qcm",
    question: "Quelle permission est requise pour un fichier Netplan afin d eviter les avertissements ?",
    options: ["chmod 644", "chmod 777", "chmod 755", "chmod 600"],
    correct: 3,
    explanation: "chmod 600 donne lecture/ecriture au proprietaire uniquement. Netplan refuse d appliquer un fichier avec des permissions trop ouvertes.",
  },
  {
    id: 5,
    type: "qcm",
    question: "Quelle commande nmcli configure une IP statique sur ens33 ?",
    options: [
      "nmcli connection set ens33 ipv4.addresses 192.168.1.10/24",
      "nmcli connection modify ens33 ipv4.addresses 192.168.1.10/24",
      "nmcli interface modify ens33 ip 192.168.1.10",
      "nmcli ip set ens33 192.168.1.10/24",
    ],
    correct: 1,
    explanation: "La syntaxe correcte est nmcli connection modify suivi du nom de l interface et du parametre a modifier.",
  },
  {
    id: 6,
    type: "qcm",
    question: "Quelle commande configure une interface en DHCP via nmcli ?",
    options: [
      "nmcli connection modify ens33 ipv4.method dhcp",
      "nmcli connection modify ens33 ipv4.method dynamic",
      "nmcli connection modify ens33 ipv4.method auto",
      "nmcli connection modify ens33 ipv4.method automatic",
    ],
    correct: 2,
    explanation: "ipv4.method auto active le DHCP. ipv4.method manual active l IP statique.",
  },
  {
    id: 7,
    type: "qcm",
    question: "Quel fichier contient la configuration reseau sur Fedora (methode ancienne) ?",
    options: [
      "/etc/netplan/ifcfg-eth0",
      "/etc/sysconfig/network-scripts/ifcfg-eth0",
      "/etc/network/interfaces",
      "/etc/NetworkManager/ifcfg-eth0",
    ],
    correct: 1,
    explanation: "Sur Red Hat / Fedora (ancienne methode), les fichiers de configuration reseau se trouvent dans /etc/sysconfig/network-scripts/.",
  },
  {
    id: 8,
    type: "qcm",
    question: "Quelle commande affiche les parametres reseau des interfaces (equivalent de ipconfig) ?",
    options: ["ip config", "netstat -i", "ifconfig", "route -n"],
    correct: 2,
    explanation: "ifconfig est l equivalent Linux de ipconfig sous Windows. Il affiche les parametres reseau de toutes les interfaces.",
  },
  {
    id: 9,
    type: "qcm",
    question: "Quelle commande affiche la table de routage (equivalent de route print) ?",
    options: ["ifconfig -r", "netstat -i", "ip neigh", "route"],
    correct: 3,
    explanation: "route affiche la table de routage. Elle est l equivalent de route print sous Windows. route -n affiche les adresses en numerique.",
  },
  {
    id: 10,
    type: "qcm",
    question: "Quelle commande rpm installe un fichier .rpm ?",
    options: ["rpm -e fichier.rpm", "rpm -qa fichier.rpm", "rpm -ivh fichier.rpm", "rpm -uvh fichier.rpm"],
    correct: 2,
    explanation: "rpm -ivh : i = install, v = verbose, h = affiche la progression. rpm -uvh met a jour, rpm -e desinstalle.",
  },
  {
    id: 11,
    type: "qcm",
    question: "Quelle commande rpm liste tous les packages installes ?",
    options: ["rpm -q", "rpm -qa", "rpm -l", "rpm -list"],
    correct: 1,
    explanation: "rpm -qa (query all) liste tous les packages installes sur le systeme. rpm -q nompackage verifie un package specifique.",
  },
  {
    id: 12,
    type: "qcm",
    question: "Quelle commande netstat affiche les applications qui ouvrent un port ?",
    options: ["netstat -an", "netstat -i", "netstat -nr", "netstat -anp"],
    correct: 3,
    explanation: "netstat -anp affiche les sockets actifs avec les processus (PID et nom) associes a chaque port ouvert.",
  },
  {
    id: 13,
    type: "qcm",
    question: "Quelle commande nmap teste un port specifique (ex: port 22) ?",
    options: ["nmap -sT 192.168.1.1", "nmap -p 22 192.168.1.1", "nmap -a 22 192.168.1.1", "nmap -scan 22 192.168.1.1"],
    correct: 1,
    explanation: "nmap -p 22 teste uniquement le port 22 sur la cible. nmap -sT scanne tous les ports TCP actifs.",
  },
  {
    id: 14,
    type: "qcm",
    question: "Quelle commande affiche la table ARP ?",
    options: ["netstat -nr", "ip route", "arp -a", "ifconfig -a"],
    correct: 2,
    explanation: "arp -a affiche la table ARP (correspondance IP / adresse MAC). L equivalent moderne est ip neigh.",
  },
  {
    id: 15,
    type: "qcm",
    question: "Quel gestionnaire de packages est utilise sur Ubuntu ?",
    options: ["rpm", "dnf", "yum", "apt"],
    correct: 3,
    explanation: "Ubuntu utilise apt (Advanced Package Tool). Fedora/Red Hat utilise dnf ou rpm.",
  },
  {
    id: 16,
    type: "qcm",
    question: "Quelle commande demarre le service SSH sur Ubuntu ?",
    options: ["systemctl start sshd", "service ssh start", "systemctl start ssh", "systemctl enable ssh"],
    correct: 2,
    explanation: "Sur Ubuntu le service s appelle ssh. Sur Fedora/Red Hat il s appelle sshd. systemctl enable l active au demarrage.",
  },
  {
    id: 17,
    type: "qcm",
    question: "Quel fichier faut-il modifier pour securiser la configuration SSH ?",
    options: ["/etc/ssh/ssh_config", "/etc/ssh/sshd_config", "/etc/sshd/config", "/etc/network/ssh"],
    correct: 1,
    explanation: "/etc/ssh/sshd_config est le fichier de configuration du serveur SSH. ssh_config concerne le client SSH.",
  },
  {
    id: 18,
    type: "qcm",
    question: "Quelle commande ajoute un utilisateur au groupe sudo sur Ubuntu ?",
    options: ["adduser user1 sudo", "groupadd sudo user1", "usermod -aG sudo user1", "usermod -G sudo user1"],
    correct: 2,
    explanation: "usermod -aG : -a = append (ne retire pas des autres groupes), -G = groupe supplementaire. Sans -a, l utilisateur est retire de tous ses autres groupes.",
  },
  {
    id: 19,
    type: "qcm",
    question: "Quelle commande affiche les sockets actifs ?",
    options: ["netstat -nr", "netstat -i", "netstat -an", "netstat -tulnp"],
    correct: 2,
    explanation: "netstat -an affiche toutes les connexions et sockets actifs. -a = all, -n = numerique (sans resolution DNS).",
  },
  {
    id: 20,
    type: "qcm",
    question: "Sur Fedora, quel groupe est equivalent au groupe sudo d Ubuntu ?",
    options: ["admin", "root", "sudoers", "wheel"],
    correct: 3,
    explanation: "Le groupe wheel sur Fedora/Red Hat donne les privileges sudo. Sur Ubuntu c est le groupe sudo.",
  },
  // --- VRAI / FAUX ---
  {
    id: 21,
    type: "vf",
    question: "La commande ip addr add est permanente apres redemarrage.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. ip addr add est temporaire. Apres redemarrage la configuration est perdue. Pour une config permanente : Netplan (Ubuntu) ou ifcfg (Fedora).",
  },
  {
    id: 22,
    type: "vf",
    question: "nmcli sauvegarde la configuration reseau de maniere permanente.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. nmcli modifie les fichiers de NetworkManager qui sont charges automatiquement au demarrage du systeme.",
  },
  {
    id: 23,
    type: "vf",
    question: "Sur Fedora, les fichiers NetworkManager n ont pas besoin de chmod 600 pour fonctionner.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. NetworkManager sur Fedora est strict sur les permissions. Sans chmod 600, le fichier de connexion est ignore.",
  },
  {
    id: 24,
    type: "vf",
    question: "ifconfig est l equivalent Linux de ipconfig sous Windows.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. Les deux affichent les parametres reseau des interfaces (adresse IP, masque, MAC, etc.).",
  },
  {
    id: 25,
    type: "vf",
    question: "La commande route affiche la table de routage.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. route est l equivalent de route print sous Windows. route -n affiche les adresses en format numerique.",
  },
  {
    id: 26,
    type: "vf",
    question: "rpm -e installe un package sur Fedora.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. rpm -e desinstalle un package. Pour installer : rpm -ivh fichier.rpm. Pour mettre a jour : rpm -uvh fichier.rpm.",
  },
  {
    id: 27,
    type: "vf",
    question: "netstat -nr affiche les applications qui ouvrent un port.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. netstat -nr affiche la table de routage. Pour les applications qui ouvrent un port, utiliser netstat -anp.",
  },
  {
    id: 28,
    type: "vf",
    question: "Sur Ubuntu Netplan, un fichier yaml avec permissions 644 peut causer un avertissement.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. Netplan exige chmod 600 sur ses fichiers YAML. Avec 644, il affiche un avertissement et peut refuser d appliquer la config.",
  },
  {
    id: 29,
    type: "vf",
    question: "nmap -sT permet de scanner les ports TCP actifs.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. nmap -sT effectue un scan TCP connect sur la cible et liste les ports TCP ouverts.",
  },
  {
    id: 30,
    type: "vf",
    question: "arp -a et ip neigh affichent la meme information.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. Les deux affichent la table ARP (correspondance IP / MAC). ip neigh est la commande moderne, arp -a est la commande legacy.",
  },
  // --- COMMANDE A COMPLETER ---
  {
    id: 31,
    type: "qcm",
    question: "Pour recharger la config nmcli apres chmod sur Fedora, quelle commande utiliser ?",
    options: ["nmcli connection restart", "nmcli connection reload", "nmcli connection refresh", "nmcli connection apply"],
    correct: 1,
    explanation: "nmcli connection reload force NetworkManager a relire les fichiers de connexion apres une modification manuelle ou un chmod.",
  },
  {
    id: 32,
    type: "qcm",
    question: "Quelle option ip addr permet de supprimer toute la configuration IP d une interface ?",
    options: ["ip addr del dev ens33", "ip addr remove dev ens33", "ip addr flush dev ens33", "ip addr reset dev ens33"],
    correct: 2,
    explanation: "ip addr flush dev ens33 supprime toutes les adresses IP configurees sur l interface ens33.",
  },
  {
    id: 33,
    type: "qcm",
    question: "Quelle commande configure l interface eth0 avec l IP 192.168.0.1 et l active ?",
    options: [
      "ifconfig eth0 192.168.0.1 up",
      "ifconfig eth0 192.168.0.1 netmask 255.255.255.0 up",
      "ifconfig eth0 set 192.168.0.1/24 up",
      "ifconfig eth0 addr 192.168.0.1 mask 255.255.255.0",
    ],
    correct: 1,
    explanation: "La syntaxe complete est ifconfig interface IP netmask MASQUE up. Le mot-cle up active l interface apres la configuration.",
  },
  {
    id: 34,
    type: "qcm",
    question: "Quelle commande rpm verifie l existence du package dhcp ?",
    options: ["rpm -qa dhcp", "rpm -check dhcp", "rpm -q dhcp", "rpm -verify dhcp"],
    correct: 2,
    explanation: "rpm -q nompackage verifie si un package est installe. S il est present, il affiche la version. Sinon il indique qu il n est pas installe.",
  },
  {
    id: 35,
    type: "qcm",
    question: "Pour afficher les statistiques des interfaces reseau avec netstat, quelle option utiliser ?",
    options: ["netstat -nr", "netstat -an", "netstat -i", "netstat -anp"],
    correct: 2,
    explanation: "netstat -i affiche les statistiques de chaque interface reseau (paquets recus, envoyes, erreurs, etc.).",
  },
  {
    id: 36,
    type: "qcm",
    question: "Quelle est l ancienne syntaxe pour demarrer le service network sur Fedora ?",
    options: ["systemctl start network", "service network start", "start network service", "network start service"],
    correct: 1,
    explanation: "L ancienne syntaxe Red Hat est service nomservice start|stop|restart. Elle est encore valide sur les systemes modernes.",
  },
  {
    id: 37,
    type: "qcm",
    question: "Quelle commande installe un package sur Ubuntu avec confirmation automatique ?",
    options: ["sudo apt install nompackage", "sudo apt install nompackage -y", "sudo apt-get add nompackage -y", "sudo apt add nompackage -y"],
    correct: 1,
    explanation: "L option -y repond automatiquement oui a toutes les confirmations. Sans -y, apt demande confirmation avant chaque installation.",
  },
  {
    id: 38,
    type: "qcm",
    question: "Pour lire le fichier de configuration interface sur Fedora sans l editer, quelle commande ?",
    options: [
      "cat /etc/sysconfig/network-scripts/ifcfg-eth0",
      "more /etc/sysconfig/network-scripts/ifcfg-eth0",
      "nano /etc/sysconfig/network-scripts/ifcfg-eth0",
      "A et B sont correctes",
    ],
    correct: 3,
    explanation: "cat et more affichent le contenu d un fichier sans le modifier. more permet une lecture page par page. nano ouvre l editeur.",
  },
  {
    id: 39,
    type: "qcm",
    question: "Quelle directive dans /etc/ssh/sshd_config interdit la connexion SSH directe en root ?",
    options: ["RootLogin no", "PermitRoot no", "PermitRootLogin no", "DenyRoot yes"],
    correct: 2,
    explanation: "PermitRootLogin no empeche toute connexion SSH directe avec le compte root. C est une bonne pratique de securite.",
  },
  {
    id: 40,
    type: "qcm",
    question: "Quelle commande affiche toutes les adresses IP configurees sur le systeme ?",
    options: ["ifconfig -a", "ip a", "ip addr show", "A, B et C sont correctes"],
    correct: 3,
    explanation: "ifconfig -a, ip a et ip addr show affichent toutes les interfaces et leurs adresses IP. ip a est la commande moderne recommandee.",
  },
];

const LETTERS = ["A", "B", "C", "D"];

const styleId = "l01-quiz-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .lq-wrap { padding-bottom: 40px; position: relative; }
    .lq-sticky {
      position: sticky; top: 60px; z-index: 50;
      background: var(--ifm-background-color);
      border-bottom: 2px solid var(--lq-accent, #1a3c8f);
      padding: 10px 20px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      margin-bottom: 24px; transition: border-color 0.4s;
    }
    .lq-sticky-title { font-weight: 700; font-size: 14px; color: var(--ifm-font-color-base); }
    .lq-badge {
      border-radius: 20px; padding: 2px 10px;
      font-size: 12px; font-weight: 600;
      background: color-mix(in srgb, var(--lq-accent, #1a3c8f) 12%, transparent);
      color: var(--lq-accent, #1a3c8f);
      border: 1px solid color-mix(in srgb, var(--lq-accent, #1a3c8f) 30%, transparent);
    }
    .lq-progress-track { width: 100px; height: 6px; background: var(--ifm-color-emphasis-200); border-radius: 99px; overflow: hidden; }
    .lq-progress-bar { height: 100%; border-radius: 99px; background: var(--lq-accent, #1a3c8f); transition: width 0.4s ease, background 0.4s; }
    .lq-score-num { font-weight: 800; font-size: 18px; color: var(--lq-accent, #1a3c8f); min-width: 48px; text-align: right; transition: color 0.4s; }
    .lq-btn-validate { border: none; border-radius: 6px; padding: 4px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .lq-btn-validate:disabled { background: var(--ifm-color-emphasis-200) !important; color: var(--ifm-color-emphasis-500) !important; cursor: not-allowed; }
    .lq-btn-outline { background: transparent; border: 1px solid var(--ifm-color-primary); color: var(--ifm-color-primary); border-radius: 6px; padding: 4px 14px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .lq-type-badge { font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .lq-type-qcm { background: color-mix(in srgb, #1a3c8f 12%, transparent); color: #1a3c8f; }
    .lq-type-vf  { background: color-mix(in srgb, #d97706 12%, transparent); color: #d97706; }
    .lq-card { border: 1px solid var(--ifm-color-emphasis-300); border-radius: 10px; padding: 18px 20px 14px; margin-bottom: 14px; background: var(--ifm-background-surface-color); transition: border-color 0.3s, background 0.3s; }
    .lq-card.correct { border-color: #16a34a55; background: color-mix(in srgb, #16a34a 6%, var(--ifm-background-surface-color)); }
    .lq-card.wrong   { border-color: #dc262655; background: color-mix(in srgb, #dc2626 6%, var(--ifm-background-surface-color)); }
    .lq-qnum { border-radius: 6px; padding: 1px 8px; font-size: 12px; font-weight: 700; flex-shrink: 0; line-height: 22px; background: color-mix(in srgb, #1a3c8f 15%, transparent); color: var(--ifm-color-primary); }
    .lq-qnum.correct { background: color-mix(in srgb, #16a34a 15%, transparent); color: #16a34a; }
    .lq-qnum.wrong   { background: color-mix(in srgb, #dc2626 15%, transparent); color: #dc2626; }
    .lq-qtext { font-weight: 600; font-size: 14px; line-height: 1.6; color: var(--ifm-font-color-base); }
    .lq-option { display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 6px; cursor: pointer; transition: background 0.15s; background: transparent; }
    .lq-option:hover { background: var(--ifm-color-emphasis-100); }
    .lq-option.selected   { background: color-mix(in srgb, var(--ifm-color-primary) 10%, transparent); }
    .lq-option.opt-correct { background: color-mix(in srgb, #16a34a 10%, transparent); cursor: default; }
    .lq-option.opt-wrong   { background: color-mix(in srgb, #dc2626 10%, transparent); cursor: default; }
    .lq-option.submitted   { cursor: default; }
    .lq-option.submitted:hover { background: transparent; }
    .lq-option.opt-correct:hover { background: color-mix(in srgb, #16a34a 10%, transparent); }
    .lq-option.opt-wrong:hover   { background: color-mix(in srgb, #dc2626 10%, transparent); }
    .lq-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--ifm-color-emphasis-400); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.2s; }
    .lq-radio-dot { width: 10px; height: 10px; border-radius: 50%; background: transparent; transition: background 0.2s; }
    .lq-option.selected    .lq-radio     { border-color: var(--ifm-color-primary); }
    .lq-option.selected    .lq-radio-dot { background: var(--ifm-color-primary); }
    .lq-option.opt-correct .lq-radio     { border-color: #16a34a; }
    .lq-option.opt-correct .lq-radio-dot { background: #16a34a; }
    .lq-option.opt-wrong   .lq-radio     { border-color: #dc2626; }
    .lq-option.opt-wrong   .lq-radio-dot { background: #dc2626; }
    .lq-letter { font-size: 12px; font-weight: 700; min-width: 16px; color: var(--ifm-color-emphasis-500); transition: color 0.2s; }
    .lq-option.selected    .lq-letter { color: var(--ifm-color-primary); }
    .lq-option.opt-correct .lq-letter { color: #16a34a; }
    .lq-option.opt-wrong   .lq-letter { color: #dc2626; }
    .lq-opttext { font-size: 14px; flex: 1; color: var(--ifm-font-color-base); transition: color 0.2s; }
    .lq-option.opt-correct .lq-opttext { color: #16a34a; }
    .lq-option.opt-wrong   .lq-opttext { color: #dc2626; }
    .lq-btn-hint { background: transparent; border: 1px solid var(--ifm-color-emphasis-300); color: var(--ifm-color-emphasis-600); border-radius: 6px; padding: 3px 12px; cursor: pointer; font-size: 12px; margin-top: 10px; }
    .lq-explain { margin-top: 8px; background: var(--ifm-color-emphasis-100); border: 1px solid var(--ifm-color-emphasis-300); border-left: 3px solid var(--ifm-color-primary); border-radius: 6px; padding: 10px 14px; font-size: 13px; color: var(--ifm-font-color-base); line-height: 1.7; }
    .lq-explain-label { color: var(--ifm-color-primary); font-weight: 700; }
    .lq-explain-ans   { color: #16a34a; font-weight: 700; }
    .lq-btn-submit { border: none; border-radius: 8px; padding: 11px 36px; font-size: 14px; font-weight: 700; transition: all 0.3s; cursor: pointer; display: block; margin: 8px auto 16px; }
    .lq-section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ifm-color-emphasis-500); margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 1px solid var(--ifm-color-emphasis-200); }
    .lq-final { text-align: center; padding: 28px 20px; background: var(--ifm-color-emphasis-100); border-radius: 12px; margin-top: 8px; border: 1px solid var(--ifm-color-emphasis-300); }
    .lq-final-score { font-size: 44px; font-weight: 800; margin-bottom: 6px; }
    .lq-final-label { font-size: 16px; font-weight: 600; color: var(--ifm-font-color-base); margin-bottom: 4px; }
    .lq-final-msg   { font-size: 13px; color: var(--ifm-color-emphasis-600); margin-bottom: 20px; }
    .lq-btn-reset { background: var(--ifm-color-primary); border: none; color: #fff; border-radius: 8px; padding: 10px 32px; cursor: pointer; font-size: 14px; font-weight: 600; }
    .lq-score-grid { display: flex; gap: 16px; justify-content: center; margin-bottom: 16px; flex-wrap: wrap; }
    .lq-score-item { background: var(--ifm-background-surface-color); border: 1px solid var(--ifm-color-emphasis-300); border-radius: 8px; padding: 10px 20px; font-size: 13px; }
    .lq-score-item span { font-weight: 800; font-size: 20px; display: block; }
  `;
  document.head.appendChild(style);
}

const qcmQuestions = questions.filter((q) => q.type === "qcm");
const vfQuestions  = questions.filter((q) => q.type === "vf");

export default function ConfigurationDeBaseLinuxServer() {
  const [answers, setAnswers]   = useState({});
  const [revealed, setRevealed] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total    = questions.length;
  const answered = Object.keys(answers).length;
  const score    = Object.entries(answers).filter(
    ([id, ans]) => questions.find((q) => q.id === parseInt(id))?.correct === ans
  ).length;

  const scoreQcm = submitted
    ? Object.entries(answers).filter(([id, ans]) => {
        const q = questions.find((q) => q.id === parseInt(id));
        return q?.type === "qcm" && q.correct === ans;
      }).length
    : 0;

  const scoreVf = submitted
    ? Object.entries(answers).filter(([id, ans]) => {
        const q = questions.find((q) => q.id === parseInt(id));
        return q?.type === "vf" && q.correct === ans;
      }).length
    : 0;

  const pct = submitted
    ? Math.round((score / total) * 100)
    : Math.round((answered / total) * 100);

  const accentColor = !submitted
    ? "#1a3c8f"
    : score / total >= 0.8
    ? "#16a34a"
    : score / total >= 0.5
    ? "#d97706"
    : "#dc2626";

  const scoreLabel = !submitted
    ? answered + "/" + total + " repondues"
    : score / total >= 0.8
    ? "Excellent !"
    : score / total >= 0.5
    ? "Bien !"
    : "A reviser";

  const handleSelect = (qId, idx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleReveal = (qId) => {
    setRevealed((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmit = () => {
    if (answered < total) return;
    setSubmitted(true);
    const all = {};
    questions.forEach((q) => { all[q.id] = true; });
    setRevealed(all);
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setSubmitted(false);
  };

  const renderQuestion = (q, qi) => {
    const userAnswer = answers[q.id];
    const isCorrect  = userAnswer === q.correct;
    const isRevealed = revealed[q.id];
    const cardClass  = "lq-card" + (submitted ? (isCorrect ? " correct" : " wrong") : "");
    const qnumClass  = "lq-qnum"  + (submitted ? (isCorrect ? " correct" : " wrong") : "");

    return (
      <div key={q.id} className={cardClass}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "flex-start" }}>
          <span className={qnumClass}>Q{qi + 1}</span>
          <span className={"lq-type-badge " + (q.type === "vf" ? "lq-type-vf" : "lq-type-qcm")}>
            {q.type === "vf" ? "Vrai / Faux" : "QCM"}
          </span>
          <span className="lq-qtext">{q.question}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 4 }}>
          {q.options.map((opt, idx) => {
            const isSelected = userAnswer === idx;
            const isRight    = idx === q.correct;
            let optClass = "lq-option";
            if (submitted) {
              optClass += " submitted";
              if (isRight) optClass += " opt-correct";
              else if (isSelected) optClass += " opt-wrong";
            } else if (isSelected) {
              optClass += " selected";
            }
            return (
              <div key={idx} className={optClass} onClick={() => handleSelect(q.id, idx)}>
                <div className="lq-radio"><div className="lq-radio-dot" /></div>
                <span className="lq-letter">{LETTERS[idx]}.</span>
                <span className="lq-opttext">{opt}</span>
                {submitted && isRight    && <span style={{ marginLeft: "auto", color: "#16a34a", fontWeight: 700 }}>✓</span>}
                {submitted && isSelected && !isRight && <span style={{ marginLeft: "auto", color: "#dc2626", fontWeight: 700 }}>✗</span>}
              </div>
            );
          })}
        </div>

        <div>
          {!submitted && (
            <button className="lq-btn-hint" onClick={() => handleReveal(q.id)}>
              {isRevealed ? "Masquer" : "Voir l'explication"}
            </button>
          )}
          {isRevealed && (
            <div className="lq-explain">
              <span className="lq-explain-label">Reponse : </span>
              <span className="lq-explain-ans">{LETTERS[q.correct]}</span>
              <br />
              <span>{q.explanation}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="lq-wrap" style={{ "--lq-accent": accentColor }}>

      <div className="lq-sticky">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="lq-sticky-title">Quiz — Configuration de Base Linux</span>
          <span className="lq-badge">{scoreLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="lq-progress-track">
            <div className="lq-progress-bar" style={{ width: pct + "%" }} />
          </div>
          <span className="lq-score-num">
            {submitted ? score + "/" + total : answered + "/" + total}
          </span>
          {submitted ? (
            <button className="lq-btn-outline" onClick={handleReset}>Recommencer</button>
          ) : (
            <button
              className="lq-btn-validate"
              onClick={handleSubmit}
              disabled={answered < total}
              style={{
                background: answered === total ? accentColor : undefined,
                color: answered === total ? "#fff" : undefined,
              }}
            >
              Valider
            </button>
          )}
        </div>
      </div>

      <div className="lq-section-title">Section 1 — QCM (Questions a Choix Multiple)</div>
      {qcmQuestions.map((q, i) => renderQuestion(q, i))}

      <div className="lq-section-title">Section 2 — Vrai / Faux</div>
      {vfQuestions.map((q, i) => renderQuestion(q, qcmQuestions.length + i))}

      {!submitted && (
        <button
          className="lq-btn-submit"
          onClick={handleSubmit}
          disabled={answered < total}
          style={{
            background: answered === total ? accentColor : undefined,
            color: answered === total ? "#fff" : undefined,
          }}
        >
          {answered < total
            ? "Repondre a toutes les questions (" + answered + "/" + total + ")"
            : "Valider le quiz"}
        </button>
      )}

      {submitted && (
        <div className="lq-final">
          <div className="lq-final-score" style={{ color: accentColor }}>{score}/{total}</div>
          <div className="lq-final-label">{scoreLabel}</div>
          <div className="lq-score-grid">
            <div className="lq-score-item">
              <span style={{ color: "#1a3c8f" }}>{scoreQcm}/{qcmQuestions.length}</span>
              QCM
            </div>
            <div className="lq-score-item">
              <span style={{ color: "#d97706" }}>{scoreVf}/{vfQuestions.length}</span>
              Vrai / Faux
            </div>
          </div>
          <div className="lq-final-msg">
            {score / total >= 0.8
              ? "Vous maitrisez la configuration de base Linux !"
              : score / total >= 0.5
              ? "Relisez les sections ou vous avez fait des erreurs."
              : "Recommencez apres avoir relu le cours lesson-01."}
          </div>
          <button className="lq-btn-reset" onClick={handleReset}>Recommencer</button>
        </div>
      )}
    </div>
  );
}
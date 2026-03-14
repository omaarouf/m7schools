import React, { useState } from "react";

const questions = [
  // --- QCM ---
  {
    id: 1,
    type: "qcm",
    question: "Que signifie l acronyme DHCP ?",
    options: [
      "Dynamic Host Configuration Protocol",
      "Dynamic Host Control Protocol",
      "Distributed Host Configuration Protocol",
      "Dynamic HTTP Configuration Protocol",
    ],
    correct: 0,
    explanation: "DHCP = Dynamic Host Configuration Protocol. Il permet l attribution automatique d adresses IP et parametres reseau aux clients.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Quelle est la sequence correcte du processus DORA ?",
    options: [
      "Discover, Offer, Request, Acknowledge",
      "Discover, Order, Request, Acknowledge",
      "Define, Offer, Request, Assign",
      "Discover, Offer, Reserve, Acknowledge",
    ],
    correct: 0,
    explanation: "DORA : Discover (client cherche un serveur), Offer (serveur propose une IP), Request (client demande l IP), Acknowledge (serveur confirme).",
  },
  {
    id: 3,
    type: "qcm",
    question: "Quelle commande installe le serveur DHCP sur Ubuntu ?",
    options: [
      "sudo apt install dhcp-server -y",
      "sudo apt install isc-dhcp-server -y",
      "sudo apt install dhcpd -y",
      "sudo apt install dhcp -y",
    ],
    correct: 1,
    explanation: "Sur Ubuntu/Debian, le package s appelle isc-dhcp-server. Sur Fedora/Red Hat c est dhcp-server.",
  },
  {
    id: 4,
    type: "qcm",
    question: "Quelle commande installe le serveur DHCP sur Fedora ?",
    options: [
      "sudo dnf install isc-dhcp-server -y",
      "sudo dnf install dhcpd -y",
      "sudo dnf install dhcp-server -y",
      "sudo dnf install dhcp -y",
    ],
    correct: 2,
    explanation: "Sur Fedora/Red Hat, le package s appelle dhcp-server. Sur Ubuntu c est isc-dhcp-server.",
  },
  {
    id: 5,
    type: "qcm",
    question: "Quel est le fichier principal de configuration DHCP (commun Ubuntu et Fedora) ?",
    options: [
      "/etc/dhcp/dhcpd.conf",
      "/etc/default/isc-dhcp-server",
      "/etc/sysconfig/dhcpd",
      "/var/lib/dhcp/dhcpd.leases",
    ],
    correct: 0,
    explanation: "/etc/dhcp/dhcpd.conf est le fichier principal sur les deux distributions. Il definit les pools d adresses, ranges, options reseau.",
  },
  {
    id: 6,
    type: "qcm",
    question: "Sur Ubuntu, quel fichier permet de definir l interface d ecoute DHCP ?",
    options: [
      "/etc/dhcp/dhcpd.conf",
      "/etc/sysconfig/dhcpd",
      "/etc/default/isc-dhcp-server",
      "/var/lib/dhcp/dhcpd.leases",
    ],
    correct: 2,
    explanation: "Sur Ubuntu, /etc/default/isc-dhcp-server contient la ligne INTERFACESv4='ens33' qui definit sur quelle interface DHCP ecoute.",
  },
  {
    id: 7,
    type: "qcm",
    question: "Sur Fedora, quel fichier permet de definir l interface d ecoute DHCP ?",
    options: [
      "/etc/dhcp/dhcpd.conf",
      "/etc/default/isc-dhcp-server",
      "/etc/sysconfig/dhcpd",
      "/var/lib/dhcpd/dhcpd.leases",
    ],
    correct: 2,
    explanation: "Sur Fedora/Red Hat, /etc/sysconfig/dhcpd contient la ligne DHCPDARGS=enp0s3 qui definit l interface d ecoute.",
  },
  {
    id: 8,
    type: "qcm",
    question: "Quel parametre dans dhcpd.conf definit la plage d adresses IP attribuables ?",
    options: ["subnet", "range", "option routers", "fixed-address"],
    correct: 1,
    explanation: "range definit la plage d IP distribuables. Exemple : range 192.168.10.100 192.168.10.200 attribue les IP de .100 a .200.",
  },
  {
    id: 9,
    type: "qcm",
    question: "Quel parametre envoie la passerelle par defaut aux clients DHCP ?",
    options: [
      "option domain-name-servers",
      "option routers",
      "option domain-name",
      "default-lease-time",
    ],
    correct: 1,
    explanation: "option routers envoie l adresse de la passerelle par defaut aux clients. Exemple : option routers 192.168.10.1.",
  },
  {
    id: 10,
    type: "qcm",
    question: "Que contient le fichier dhcpd.leases ?",
    options: [
      "La configuration des pools DHCP",
      "Les logs du service DHCP",
      "La liste des adresses IP attribuees avec MAC et dates",
      "La liste des interfaces reseau",
    ],
    correct: 2,
    explanation: "dhcpd.leases est la base de donnees des baux actifs. Il contient : IP assignee, adresse MAC, date debut/fin de bail, hostname client.",
  },
  {
    id: 11,
    type: "qcm",
    question: "Sur Ubuntu, ou se trouve le fichier des baux DHCP actifs ?",
    options: [
      "/var/lib/dhcpd/dhcpd.leases",
      "/var/lib/dhcp/dhcpd.leases",
      "/etc/dhcp/dhcpd.leases",
      "/var/log/dhcp/dhcpd.leases",
    ],
    correct: 1,
    explanation: "Sur Ubuntu, les baux sont dans /var/lib/dhcp/dhcpd.leases. Sur Fedora, le chemin est /var/lib/dhcpd/dhcpd.leases (avec un d a la fin de dhcpd).",
  },
  {
    id: 12,
    type: "qcm",
    question: "Sur Fedora, ou se trouve le fichier des baux DHCP actifs ?",
    options: [
      "/var/lib/dhcp/dhcpd.leases",
      "/var/lib/dhcpd/dhcpd.leases",
      "/etc/dhcp/dhcpd.leases",
      "/var/log/dhcpd.leases",
    ],
    correct: 1,
    explanation: "Sur Fedora, les baux sont dans /var/lib/dhcpd/dhcpd.leases. Sur Ubuntu, le chemin est /var/lib/dhcp/dhcpd.leases (sans d).",
  },
  {
    id: 13,
    type: "qcm",
    question: "Quelle commande redemarrer le service DHCP sur Ubuntu ?",
    options: [
      "sudo systemctl restart dhcpd",
      "sudo systemctl restart dhcp",
      "sudo systemctl restart isc-dhcp-server",
      "sudo service dhcp restart",
    ],
    correct: 2,
    explanation: "Sur Ubuntu, le service s appelle isc-dhcp-server. Sur Fedora, il s appelle dhcpd.",
  },
  {
    id: 14,
    type: "qcm",
    question: "Quelle commande teste la syntaxe du fichier dhcpd.conf ?",
    options: [
      "systemctl test isc-dhcp-server",
      "dhcpd --check",
      "sudo dhcpd -t",
      "dhcpd -verify",
    ],
    correct: 2,
    explanation: "sudo dhcpd -t teste la syntaxe du fichier de configuration sans demarrer le service. Utile pour detecter les erreurs avant redemarrage.",
  },
  {
    id: 15,
    type: "qcm",
    question: "Sur quel port UDP le serveur DHCP ecoute-t-il ?",
    options: ["UDP 53", "UDP 68", "UDP 67", "UDP 69"],
    correct: 2,
    explanation: "Le serveur DHCP ecoute sur UDP 67. Le client DHCP utilise UDP 68. Ces deux ports doivent etre ouverts dans le pare-feu.",
  },
  {
    id: 16,
    type: "qcm",
    question: "Comment autoriser DHCP dans le pare-feu sur Ubuntu (UFW) ?",
    options: [
      "sudo ufw allow dhcp",
      "sudo ufw allow 67/udp && sudo ufw allow 68/udp",
      "sudo ufw enable dhcp-server",
      "sudo ufw allow 67/tcp",
    ],
    correct: 1,
    explanation: "Il faut autoriser UDP 67 (serveur) et UDP 68 (client) dans UFW. DHCP utilise UDP, pas TCP.",
  },
  {
    id: 17,
    type: "qcm",
    question: "Comment autoriser DHCP dans le pare-feu sur Fedora (firewalld) ?",
    options: [
      "sudo firewall-cmd --add-port=67/udp --permanent",
      "sudo firewall-cmd --add-service=dhcp --permanent && sudo firewall-cmd --reload",
      "sudo firewall-cmd --enable dhcp",
      "sudo ufw allow 67/udp",
    ],
    correct: 1,
    explanation: "Sur Fedora, firewalld a un service predefined dhcp. On utilise --add-service=dhcp puis --reload pour appliquer.",
  },
  {
    id: 18,
    type: "qcm",
    question: "Comment reserver une IP fixe pour un client specifique dans dhcpd.conf ?",
    options: [
      "fixed-address { ip 192.168.1.50; mac 00:11:22:33:44:55; }",
      "host pc1 { hardware ethernet 00:11:22:33:44:55; fixed-address 192.168.1.50; }",
      "reserve { mac 00:11:22:33:44:55; ip 192.168.1.50; }",
      "static { ethernet 00:11:22:33:44:55; address 192.168.1.50; }",
    ],
    correct: 1,
    explanation: "La reservation utilise le bloc host avec hardware ethernet (adresse MAC) et fixed-address (IP reservee).",
  },
  {
    id: 19,
    type: "qcm",
    question: "Que signifie default-lease-time 600 dans dhcpd.conf ?",
    options: [
      "Le bail dure 600 minutes par defaut",
      "Le bail dure 600 heures par defaut",
      "Le bail dure 600 secondes par defaut",
      "Le bail dure 600 jours par defaut",
    ],
    correct: 2,
    explanation: "default-lease-time est en secondes. 600 secondes = 10 minutes. max-lease-time definit la duree maximale.",
  },
  {
    id: 20,
    type: "qcm",
    question: "Quelle commande surveille les logs DHCP en temps reel sur Ubuntu ?",
    options: [
      "tail -f /var/log/messages | grep dhcpd",
      "journalctl -f -u dhcpd",
      "tail -f /var/log/syslog | grep dhcpd",
      "watch cat /var/lib/dhcp/dhcpd.leases",
    ],
    correct: 2,
    explanation: "Sur Ubuntu, les logs DHCP sont dans /var/log/syslog. Sur Fedora ils sont dans /var/log/messages. tail -f affiche les nouvelles lignes en temps reel.",
  },
  // --- VRAI / FAUX ---
  {
    id: 21,
    type: "vf",
    question: "Le processus DORA commence par un message broadcast du client.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. Le client envoie un Discover en broadcast car il ne connait pas encore l adresse du serveur DHCP.",
  },
  {
    id: 22,
    type: "vf",
    question: "Sur Ubuntu et Fedora, le fichier principal de configuration DHCP est le meme.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. Les deux utilisent /etc/dhcp/dhcpd.conf comme fichier principal. Les differences sont dans le fichier d interface et le nom du service.",
  },
  {
    id: 23,
    type: "vf",
    question: "Sur Ubuntu, le service DHCP s appelle dhcpd.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. Sur Ubuntu, le service s appelle isc-dhcp-server. dhcpd est le nom du service sur Fedora/Red Hat.",
  },
  {
    id: 24,
    type: "vf",
    question: "Le fichier dhcpd.leases est mis a jour automatiquement a chaque attribution d IP.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. A chaque bail accorde, renouvelé ou expire, le serveur DHCP met a jour dhcpd.leases automatiquement.",
  },
  {
    id: 25,
    type: "vf",
    question: "DHCP utilise le protocole TCP pour la communication entre client et serveur.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. DHCP utilise UDP. Le serveur ecoute sur UDP 67, le client sur UDP 68. TCP n est pas utilise.",
  },
  {
    id: 26,
    type: "vf",
    question: "Un point-virgule manquant dans dhcpd.conf empeche le service de demarrer.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. dhcpd.conf est strict sur la syntaxe. Un point-virgule manquant cause une erreur de parsing et le service refuse de demarrer.",
  },
  {
    id: 27,
    type: "vf",
    question: "La commande dhcpd -t demarre le service DHCP en mode test.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. dhcpd -t teste uniquement la syntaxe du fichier de configuration sans demarrer le service.",
  },
  {
    id: 28,
    type: "vf",
    question: "option routers dans dhcpd.conf envoie l adresse DNS aux clients.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. option routers envoie la passerelle par defaut. C est option domain-name-servers qui envoie l adresse DNS aux clients.",
  },
  {
    id: 29,
    type: "vf",
    question: "Si le pool d adresses est epuise, le nouveau client ne recevra pas d IP.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. Quand toutes les IPs du range sont attribuees, le serveur n a plus d adresses disponibles et le client ne reçoit pas de bail.",
  },
  {
    id: 30,
    type: "vf",
    question: "Sur Fedora, les logs DHCP se trouvent dans /var/log/syslog.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. Sur Fedora/Red Hat, les logs sont dans /var/log/messages. /var/log/syslog est le fichier de logs sur Ubuntu/Debian.",
  },
  // --- QCM AVANCES ---
  {
    id: 31,
    type: "qcm",
    question: "Quel est le contenu de la ligne a modifier dans /etc/default/isc-dhcp-server sur Ubuntu ?",
    options: [
      "DHCPDARGS=ens33",
      "INTERFACES=ens33",
      "INTERFACESv4=ens33",
      "DHCP_INTERFACE=ens33",
    ],
    correct: 2,
    explanation: "La ligne est INTERFACESv4='ens33'. Elle indique a isc-dhcp-server sur quelle interface IPv4 ecouter.",
  },
  {
    id: 32,
    type: "qcm",
    question: "Quel est le contenu de la ligne a modifier dans /etc/sysconfig/dhcpd sur Fedora ?",
    options: [
      "INTERFACESv4=enp0s3",
      "INTERFACES=enp0s3",
      "DHCP_INTERFACE=enp0s3",
      "DHCPDARGS=enp0s3",
    ],
    correct: 3,
    explanation: "Sur Fedora, la ligne est DHCPDARGS=enp0s3. Elle specifie l interface sur laquelle dhcpd doit ecouter.",
  },
  {
    id: 33,
    type: "qcm",
    question: "Dans un bail DHCP, que represente hardware ethernet ?",
    options: [
      "L adresse IP du client",
      "L adresse MAC du client",
      "Le nom du client",
      "Le masque de sous-reseau",
    ],
    correct: 1,
    explanation: "hardware ethernet designe l adresse MAC de la carte reseau du client. Elle est utilisee pour les reservations d IP fixes.",
  },
  {
    id: 34,
    type: "qcm",
    question: "Quelle commande affiche les logs du service DHCP sur Fedora ?",
    options: [
      "journalctl -u isc-dhcp-server",
      "tail -f /var/log/syslog",
      "journalctl -u dhcpd",
      "cat /var/lib/dhcp/dhcpd.leases",
    ],
    correct: 2,
    explanation: "Sur Fedora le service s appelle dhcpd, donc journalctl -u dhcpd. Sur Ubuntu c est journalctl -u isc-dhcp-server.",
  },
  {
    id: 35,
    type: "qcm",
    question: "Que faire apres avoir modifie dhcpd.conf ?",
    options: [
      "Rebooter le serveur",
      "Tester la syntaxe avec dhcpd -t puis redemarrer le service",
      "Recharger uniquement avec systemctl reload",
      "Rien, les modifications sont appliquees automatiquement",
    ],
    correct: 1,
    explanation: "Bonne pratique : 1) tester la syntaxe avec sudo dhcpd -t, 2) si OK redemarrer le service. Cela evite d interrompre le service avec une config incorrecte.",
  },
  {
    id: 36,
    type: "qcm",
    question: "Un client DHCP ne reçoit pas d IP. Quelle est la premiere verification a faire ?",
    options: [
      "Verifier le fichier dhcpd.leases",
      "Verifier que le service DHCP est bien actif",
      "Verifier le pare-feu",
      "Verifier la connectivite L2",
    ],
    correct: 1,
    explanation: "La premiere etape est toujours de verifier que le service fonctionne avec systemctl status. Si le service est inactif, les autres verifications sont inutiles.",
  },
  {
    id: 37,
    type: "qcm",
    question: "Quelle est la valeur de max-lease-time 7200 en heures ?",
    options: ["1 heure", "2 heures", "7200 heures", "12 heures"],
    correct: 1,
    explanation: "7200 secondes / 3600 = 2 heures. max-lease-time est toujours en secondes dans dhcpd.conf.",
  },
  {
    id: 38,
    type: "qcm",
    question: "Quelle option dans dhcpd.conf envoie le serveur DNS aux clients ?",
    options: [
      "option routers",
      "option domain-name",
      "option domain-name-servers",
      "option dns-server",
    ],
    correct: 2,
    explanation: "option domain-name-servers envoie l IP du serveur DNS. option domain-name envoie le nom de domaine. option routers envoie la passerelle.",
  },
  {
    id: 39,
    type: "qcm",
    question: "Un serveur DHCP est sur un reseau different du client. Quel mecanisme est necessaire ?",
    options: [
      "DNS relay",
      "DHCP relay (agent relais)",
      "NAT",
      "VPN",
    ],
    correct: 1,
    explanation: "Le DHCP relay (agent relais) transfere les messages DHCP entre des reseaux differents. Sans lui, les broadcasts DHCP ne traversent pas les routeurs.",
  },
  {
    id: 40,
    type: "qcm",
    question: "Quelle commande verifie que le serveur DHCP ecoute bien sur le port 67 ?",
    options: [
      "nmap -p 67 localhost",
      "ss -tulnp | grep 67",
      "sudo netstat -uap | grep dhcpd",
      "B et C sont correctes",
    ],
    correct: 3,
    explanation: "Les deux commandes fonctionnent : netstat -uap | grep dhcpd (legacy) et ss -tulnp | grep 67 (moderne) affichent les ports UDP ouverts par dhcpd.",
  },
];

const LETTERS = ["A", "B", "C", "D"];

const styleId = "l02-quiz-styles";
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

export default function QuizzDhcp() {
  const [answers, setAnswers]     = useState({});
  const [revealed, setRevealed]   = useState({});
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

  const handleReveal = (qId) =>
    setRevealed((prev) => ({ ...prev, [qId]: !prev[qId] }));

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
                {submitted && isRight     && <span style={{ marginLeft: "auto", color: "#16a34a", fontWeight: 700 }}>✓</span>}
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
          <span className="lq-sticky-title">Quiz — Serveur DHCP</span>
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
              ? "Vous maitrisez le serveur DHCP !"
              : score / total >= 0.5
              ? "Relisez les sections ou vous avez fait des erreurs."
              : "Recommencez apres avoir relu le cours lesson-02."}
          </div>
          <button className="lq-btn-reset" onClick={handleReset}>Recommencer</button>
        </div>
      )}
    </div>
  );
}
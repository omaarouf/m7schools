import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "Un enregistrement A associe un nom d'hote a une adresse IPv4 ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. L'enregistrement A (Address) fait correspondre un nom de domaine a une adresse IPv4. L'enregistrement AAAA fait la meme chose pour IPv6.",
  },
  {
    id: 2, type: "vf",
    question: "Un enregistrement CNAME peut pointer directement vers une adresse IP ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Un CNAME (Canonical Name) pointe vers un autre **nom de domaine**, pas directement vers une adresse IP. Il faut un enregistrement A pour la resolution finale.",
  },
  {
    id: 3, type: "vf",
    question: "L'enregistrement PTR permet de resoudre une adresse IP en nom d'hote (resolution inverse) ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. L'enregistrement PTR (Pointer) se trouve dans la zone inversee et permet de retrouver le nom d'un hote a partir de son adresse IP.",
  },
  {
    id: 4, type: "vf",
    question: "Le parametre `-CreatePtr` de `Add-DnsServerResourceRecordA` cree automatiquement la zone inversee si elle n'existe pas ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `-CreatePtr` cree l'enregistrement PTR dans une zone inversee **existante**. Si la zone inversee n'existe pas, la commande echouera.",
  },
  {
    id: 5, type: "vf",
    question: "Dans un enregistrement MX, une priorite de 10 est plus haute qu'une priorite de 20 ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Pour les enregistrements MX, la valeur de priorite la plus **basse** indique le serveur le plus prioritaire.",
  },
  {
    id: 6, type: "vf",
    question: "`Add-DnsServerSecondaryZone` cree une zone DNS en lecture/ecriture sur un serveur secondaire ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. Une zone secondaire est en **lecture seule**. Elle recoit une copie de la zone principale par transfert de zone. Seul le serveur principal peut modifier les enregistrements.",
  },
  {
    id: 7, type: "vf",
    question: "L'enregistrement SOA (Start of Authority) est obligatoire dans toute zone DNS ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le SOA est le premier enregistrement de toute zone DNS. Il contient des informations sur l'administrateur, les delais de synchronisation et le numero de serie.",
  },
  {
    id: 8, type: "vf",
    question: "Pour la zone inversee de `192.168.10.0/24`, le nom de zone est `10.168.192.in-addr.arpa` ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Les zones inversees utilisent l'adresse IP a l'envers avec le suffixe `.in-addr.arpa`. Pour `192.168.10.0/24` c'est `10.168.192.in-addr.arpa`.",
  },
  {
    id: 9, type: "vf",
    question: "L'enregistrement NS designe le serveur web autoritaire d'une zone DNS ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. NS (Name Server) designe le **serveur DNS autoritaire** pour la zone, pas le serveur web. Le serveur web est pointe par un enregistrement A.",
  },
  {
    id: 10, type: "vf",
    question: "`-ReplicationScope Domain` replique la zone DNS sur tous les controleurs de domaine du domaine Active Directory ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. `-ReplicationScope Domain` replique la zone sur tous les DC du domaine. `Forest` replique sur tous les DC de la foret.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande cree une zone DNS principale pour `ofppt.local` ?",
    options: [
      "New-DnsZone -Name ofppt.local -Type Primary",
      "Add-DnsServerPrimaryZone -Name 'ofppt.local' -ReplicationScope Domain",
      "Create-DnsServerZone -Name ofppt.local -Primary",
      "Set-DnsServerZone -Name ofppt.local -Type Primary",
    ],
    correct: 1,
    explanation: "`Add-DnsServerPrimaryZone` est la commande correcte pour creer une zone principale.",
  },
  {
    id: 12, type: "qcm",
    question: "Quel parametre de `Add-DnsServerSecondaryZone` specifie l'adresse du serveur DNS maitre ?",
    options: ["-PrimaryServer", "-MasterServer", "-MasterServers", "-SourceServer"],
    correct: 2,
    explanation: "`-MasterServers` (au pluriel) accepte une ou plusieurs adresses IP des serveurs DNS primaires.",
  },
  {
    id: 13, type: "qcm",
    question: "Quel enregistrement DNS utilise-t-on pour associer un nom a une adresse IPv6 ?",
    options: ["A", "AAAA", "PTR6", "CNAME"],
    correct: 1,
    explanation: "L'enregistrement AAAA (quad-A) associe un nom de domaine a une adresse IPv6.",
  },
  {
    id: 14, type: "qcm",
    question: "Pour creer un enregistrement PTR pour l'adresse `192.168.10.50`, quelle valeur faut-il donner au parametre `-Name` ?",
    options: ["192.168.10.50", "50.10.168.192", "50", "10.50"],
    correct: 2,
    explanation: "Dans la zone `10.168.192.in-addr.arpa`, le `-Name` est simplement le **dernier octet** de l'adresse IP, soit `50`.",
  },
  {
    id: 15, type: "qcm",
    question: "Comment afficher tous les enregistrements de type A d'une zone DNS ?",
    options: [
      "Get-DnsServerResourceRecord -ZoneName 'ofppt.local' -Type A",
      "Get-DnsServerResourceRecord -ZoneName 'ofppt.local' -RRType A",
      "Show-DnsRecord -Zone 'ofppt.local' -RecordType A",
      "Get-DnsRecord -ZoneName 'ofppt.local' -Filter A",
    ],
    correct: 1,
    explanation: "`Get-DnsServerResourceRecord -ZoneName 'ofppt.local' -RRType A` filtre les enregistrements par type.",
  },
  {
    id: 16, type: "qcm",
    question: "Quel parametre de `Add-DnsServerResourceRecordCName` definit le nom de domaine cible ?",
    options: ["-Target", "-Alias", "-HostNameAlias", "-PointsTo"],
    correct: 2,
    explanation: "`-HostNameAlias` specifie le FQDN vers lequel le CNAME pointe (ex: `filesrv.ofppt.local`).",
  },
  {
    id: 17, type: "qcm",
    question: "Quelle commande PowerShell teste la resolution DNS d'un nom ?",
    options: [
      "nslookup www.ofppt.local",
      "Resolve-DnsName -Name www.ofppt.local",
      "Test-DnsName www.ofppt.local",
      "Get-DnsName www.ofppt.local",
    ],
    correct: 1,
    explanation: "`Resolve-DnsName` est la commande PowerShell native pour tester la resolution DNS. `nslookup` est un outil CMD classique qui fonctionne aussi.",
  },
  {
    id: 18, type: "qcm",
    question: "Dans l'enregistrement MX, que represente `-Name '.'` ?",
    options: [
      "Un serveur specifique nomme '.'",
      "La zone racine (le domaine lui-meme)",
      "Le serveur par defaut",
      "Une erreur de syntaxe",
    ],
    correct: 1,
    explanation: "Dans le contexte d'une zone DNS, `'.'` represente la **zone elle-meme** (la racine de la zone). Un MX avec `-Name '.'` s'applique au domaine principal.",
  },
  {
    id: 19, type: "qcm",
    question: "Quelle commande modifie les parametres SOA d'une zone DNS (RefreshInterval, RetryDelay...) ?",
    options: [
      "Set-DnsServerSOA -ZoneName 'ofppt.local'",
      "Set-DnsServerPrimaryZone -Name 'ofppt.local' -RefreshInterval ...",
      "Update-DnsServerZone -Name 'ofppt.local' -SOA",
      "Modify-DnsServerResourceRecord -ZoneName 'ofppt.local' -Type SOA",
    ],
    correct: 1,
    explanation: "`Set-DnsServerPrimaryZone` permet de modifier les parametres SOA comme `RefreshInterval`, `RetryDelay`, `ExpireInterval` et `ResponsiblePerson`.",
  },
  {
    id: 20, type: "qcm",
    question: "Que signifie TTL dans le contexte DNS ?",
    options: [
      "Total Transfer Limit",
      "Time To Live - duree pendant laquelle un enregistrement est mis en cache",
      "Type To Lookup",
      "Transfer To Local",
    ],
    correct: 1,
    explanation: "TTL (Time To Live) indique combien de temps (en secondes) un enregistrement DNS peut etre mis en cache par les resolvers avant d'etre redemande au serveur autoritaire.",
  },
];

export default function QuizDns() {
  return <QuizEngine questions={questions} title="DNS Windows Server" />;
}

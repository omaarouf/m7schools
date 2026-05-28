import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  // ── Vrai / Faux ──────────────────────────────────────────────────────────
  {
    id: 1, type: "vf",
    question: "DHCP signifie Dynamic Host Configuration Protocol et attribue automatiquement les adresses IP aux clients ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. DHCP attribue automatiquement l'IP, le masque, la passerelle et le DNS aux clients du reseau.",
  },
  {
    id: 2, type: "vf",
    question: "`Add-DhcpServerv4Scope` cree une etendue DHCP IPv4 ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Cette commande cree une etendue avec les parametres `-Name`, `-StartRange`, `-EndRange` et `-SubnetMask` obligatoires.",
  },
  {
    id: 3, type: "vf",
    question: "Le parametre `-ScopeId` correspond a la premiere adresse IP disponible de la plage ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `-ScopeId` est l'adresse reseau (Network ID) de l'etendue, par exemple `192.168.1.0` pour un reseau `192.168.1.0/24`.",
  },
  {
    id: 4, type: "vf",
    question: "L'option DHCP 3 configure les serveurs DNS des clients ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. L'option 3 configure la **passerelle par defaut** (Router). L'option 6 configure les serveurs DNS.",
  },
  {
    id: 5, type: "vf",
    question: "Un serveur DHCP principal doit avoir un delai (`-Delay`) de 0 ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Un delai de 0 ms signifie que le serveur repond immediatement, ce qui en fait le serveur principal. Le serveur backup aura un delai plus eleve (ex: 300 ms).",
  },
  {
    id: 6, type: "vf",
    question: "`Add-DhcpServerv4Reservation` reserve une adresse IP pour un client specifique identifie par son adresse MAC ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Le parametre `-ClientId` prend l'adresse MAC (ex: `AA-BB-CC-DD-EE-FF`) et `-IPAddress` l'adresse reservee.",
  },
  {
    id: 7, type: "vf",
    question: "`Get-DhcpServerv4Lease` affiche les etendues DHCP configurees ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. `Get-DhcpServerv4Lease` affiche les **baux actifs** (adresses attribuees aux clients). `Get-DhcpServerv4Scope` liste les etendues.",
  },
  {
    id: 8, type: "vf",
    question: "Un agent de relais DHCP est necessaire quand les clients et le serveur DHCP sont sur des sous-reseaux differents ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Les requetes DHCP DISCOVER sont des broadcasts qui ne traversent pas les routeurs. L'agent de relais les transfère au serveur DHCP.",
  },
  {
    id: 9, type: "vf",
    question: "`Add-DhcpServerv4ExclusionRange` exclut une plage d'adresses de la distribution automatique ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Les adresses de la plage d'exclusion ne seront pas attribuees par le serveur DHCP (utile pour les equipements avec IP fixe dans la plage).",
  },
  {
    id: 10, type: "vf",
    question: "Pour DHCPv6, le parametre `-Prefix` remplace `-ScopeId` pour identifier une etendue IPv6 ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Pour les etendues IPv6, on utilise `-Prefix '2001:db8::/64'` ou `-ScopeId` selon la commande.",
  },

  // ── QCM ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: "qcm",
    question: "Quelle commande autorise le serveur DHCP dans Active Directory ?",
    options: [
      "Enable-DhcpServer -InDC",
      "Add-DhcpServerInDC -DnsName srv.domain.com -IPAddress 192.168.1.10",
      "Register-DhcpServer -Domain domain.com",
      "Set-DhcpServer -Authorized $true",
    ],
    correct: 1,
    explanation: "`Add-DhcpServerInDC` avec le nom DNS et l'adresse IP du serveur autorise le serveur DHCP dans Active Directory.",
  },
  {
    id: 12, type: "qcm",
    question: "Quel OptionId DHCP correspond aux serveurs DNS ?",
    options: ["1", "3", "6", "15"],
    correct: 2,
    explanation: "Option 6 = DNS Servers. Option 1 = Subnet Mask. Option 3 = Router. Option 15 = DNS Domain Name.",
  },
  {
    id: 13, type: "qcm",
    question: "Quel est le format correct de `-LeaseDuration` pour un bail de 8 heures ?",
    options: ["8:00:00", "0.08:00:00", "08h00", "0:08:00:00"],
    correct: 1,
    explanation: "Le format PowerShell est `jours.heures:minutes:secondes`. 8 heures = `0.08:00:00` (0 jour, 8 heures).",
  },
  {
    id: 14, type: "qcm",
    question: "Quelle commande supprime une etendue DHCP sans confirmation ?",
    options: [
      "Delete-DhcpServerv4Scope -ScopeId 192.168.1.0",
      "Remove-DhcpServerv4Scope -ScopeId 192.168.1.0 -Force",
      "Remove-DhcpServerv4Scope -ScopeId 192.168.1.0 -Confirm",
      "Clear-DhcpServerv4Scope -ScopeId 192.168.1.0",
    ],
    correct: 1,
    explanation: "`Remove-DhcpServerv4Scope -ScopeId ... -Force` supprime l'etendue sans demander de confirmation.",
  },
  {
    id: 15, type: "qcm",
    question: "Quelle est la difference entre une exclusion et une reservation DHCP ?",
    options: [
      "Pas de difference, ce sont des synonymes",
      "L'exclusion reserve une IP pour un client specifique, la reservation exclut une plage entiere",
      "L'exclusion exclut une plage de la distribution automatique, la reservation attribue une IP fixe a un client par adresse MAC",
      "L'exclusion est pour IPv6 et la reservation pour IPv4",
    ],
    correct: 2,
    explanation: "L'exclusion empeche le serveur d'attribuer une plage d'adresses. La reservation attribue toujours la meme IP a un client specifique identifie par son adresse MAC.",
  },
  {
    id: 16, type: "qcm",
    question: "Quelle valeur de `-Delay` configurer sur un serveur DHCP de secours (backup) ?",
    options: ["0", "100", "300", "1000"],
    correct: 2,
    explanation: "Un delai de 300 ms sur le serveur backup lui permet d'attendre que le serveur principal reponde. Si le principal est hors service, le backup prend le relais.",
  },
  {
    id: 17, type: "qcm",
    question: "Comment configurer la passerelle par defaut via `Set-DhcpServerv4OptionValue` ?",
    options: [
      "Set-DhcpServerv4OptionValue -ScopeId ... -Gateway 192.168.1.1",
      "Set-DhcpServerv4OptionValue -ScopeId ... -Router 192.168.1.1",
      "Set-DhcpServerv4OptionValue -ScopeId ... -DefaultGateway 192.168.1.1",
      "Set-DhcpServerv4OptionValue -ScopeId ... -OptionId 3 -Route 192.168.1.1",
    ],
    correct: 1,
    explanation: "Le parametre `-Router` de `Set-DhcpServerv4OptionValue` configure la passerelle par defaut (option 3).",
  },
  {
    id: 18, type: "qcm",
    question: "Quelle commande ajoute un agent de relais DHCP IPv4 ?",
    options: [
      "New-DhcpRelay -IPAddress 192.168.2.1 -Server 192.168.1.1",
      "Add-DhcpServerv4RelayAgent -IPAddress 192.168.2.1 -Server 192.168.1.1",
      "Set-DhcpRelay -AgentIP 192.168.2.1 -ServerIP 192.168.1.1",
      "Enable-DhcpRelay -Interface 192.168.2.1",
    ],
    correct: 1,
    explanation: "`Add-DhcpServerv4RelayAgent` avec `-IPAddress` (adresse de l'agent/routeur) et `-Server` (adresse du serveur DHCP cible).",
  },
  {
    id: 19, type: "qcm",
    question: "Comment afficher les baux actifs d'une etendue sous forme de tableau ?",
    options: [
      "Get-DhcpServerv4Lease -ScopeId 192.168.1.0",
      "Get-DhcpServerv4Lease -ScopeId 192.168.1.0 | Format-Table",
      "Show-DhcpServerv4Lease -ScopeId 192.168.1.0",
      "Get-DhcpServerv4Scope -ScopeId 192.168.1.0 -Leases",
    ],
    correct: 1,
    explanation: "`Get-DhcpServerv4Lease -ScopeId ...` retourne les baux, puis `| Format-Table` les affiche sous forme de tableau lisible.",
  },
  {
    id: 20, type: "qcm",
    question: "Quel parametre de `Set-DhcpServerv4OptionValue` permet de specifier le nom de domaine DNS distribue aux clients ?",
    options: ["-Domain", "-DnsDomain", "-DnsName", "-SearchDomain"],
    correct: 1,
    explanation: "`-DnsDomain 'contoso.com'` configure l'option 15 (DNS Domain Name) qui sera distribuee aux clients DHCP.",
  },

  // ── IPv6 ─────────────────────────────────────────────────────────────────
  {
    id: 21, type: "vf",
    question: "`Add-DhcpServerv6Scope` requiert le parametre `-PrefixLength` en plus de `-StartRange` et `-EndRange` ?",
    options: ["Vrai", "Faux"], correct: 0,
    explanation: "VRAI. Pour IPv6, `-PrefixLength` (ex: `64`) est obligatoire car il remplace le masque de sous-reseau (`-SubnetMask`) utilise en IPv4.",
  },
  {
    id: 22, type: "vf",
    question: "Pour une reservation DHCPv6, le client est identifie par son adresse MAC via `-ClientId` comme en IPv4 ?",
    options: ["Vrai", "Faux"], correct: 1,
    explanation: "FAUX. En DHCPv6, le client est identifie par son **DUID** (DHCP Unique Identifier), pas par l'adresse MAC. Le format du `-ClientId` est different : `00:03:00:01:AA:BB:CC:DD:EE:FF`.",
  },
  {
    id: 23, type: "qcm",
    question: "Quelle commande cree une etendue DHCPv6 active de `2001:db8::1` a `2001:db8::ffff` avec un prefixe /64 ?",
    options: [
      "Add-DhcpServerv6Scope -Name 'IPv6' -StartRange 2001:db8::1 -EndRange 2001:db8::ffff -SubnetMask 64 -State Active",
      "Add-DhcpServerv6Scope -Name 'IPv6' -StartRange 2001:db8::1 -EndRange 2001:db8::ffff -PrefixLength 64 -State Active",
      "New-DhcpServerv6Scope -Prefix 2001:db8::/64 -State Active",
      "Add-DhcpServerv6Scope -Network 2001:db8::/64 -State Active",
    ],
    correct: 1,
    explanation: "`Add-DhcpServerv6Scope` avec `-PrefixLength 64` est la syntaxe correcte. `-SubnetMask` n'existe pas pour IPv6.",
  },
  {
    id: 24, type: "qcm",
    question: "Comment supprimer une reservation DHCPv6 ?",
    options: [
      "Remove-DhcpServerv6Reservation -ScopeId 2001:db8::/64 -IPAddress 2001:db8::100",
      "Remove-DhcpServerv6Reservation -ScopeId 2001:db8::/64 -ClientId '00:03:00:01:AA:BB:CC:DD:EE:FF'",
      "Delete-DhcpServerv6Reservation -Prefix 2001:db8:: -ClientId '...'",
      "Remove-DhcpServerv6Lease -ScopeId 2001:db8::/64 -ClientId '...'",
    ],
    correct: 1,
    explanation: "`Remove-DhcpServerv6Reservation` utilise `-ScopeId` et `-ClientId` (DUID). En IPv6, on supprime par identifiant client, pas par adresse IP.",
  },
  {
    id: 25, type: "qcm",
    question: "Quelle commande configure le serveur DNS distribue aux clients via DHCPv6 ?",
    options: [
      "Set-DhcpServerv6OptionValue -ScopeId 2001:db8:: -DnsServer 2001:db8::53",
      "Set-DhcpServerv6OptionValue -ScopeId 2001:db8:: -OptionId 6 -Value 2001:db8::53",
      "Add-DhcpServerv6Option -ScopeId 2001:db8:: -DNS 2001:db8::53",
      "Set-DhcpServerv6DnsServer -ScopeId 2001:db8:: -Address 2001:db8::53",
    ],
    correct: 0,
    explanation: "`Set-DhcpServerv6OptionValue` avec `-DnsServer` configure le serveur DNS pour les clients IPv6. Le `-ScopeId` est l'adresse reseau du scope (sans le prefixe).",
  },

  // ── Maitrise des commandes ────────────────────────────────────────────────
  {
    id: 26, type: "qcm",
    question: "Quelle commande affiche le taux de saturation (IPs libres vs occupees) d'une etendue ?",
    options: [
      "Get-DhcpServerv4Scope -ScopeId 192.168.1.0 -Statistics",
      "Get-DhcpServerv4ScopeStatistics -ScopeId 192.168.1.0",
      "Show-DhcpServerv4Usage -ScopeId 192.168.1.0",
      "Get-DhcpServerv4Lease -ScopeId 192.168.1.0 -Count",
    ],
    correct: 1,
    explanation: "`Get-DhcpServerv4ScopeStatistics -ScopeId` retourne les statistiques d'utilisation : nombre d'adresses totales, utilisees, libres et en cours d'utilisation.",
  },
  {
    id: 27, type: "qcm",
    question: "Completer la commande : `Add-DhcpServerv4ExclusionRange ___ 192.168.1.0 -StartRange 192.168.1.1 -EndRange 192.168.1.10`",
    options: ["-ScopeId", "-NetworkId", "-Scope", "-Range"],
    correct: 0,
    explanation: "Le parametre `-ScopeId` identifie l'etendue a laquelle appartient la plage d'exclusion. Il prend l'adresse reseau (Network ID).",
  },
  {
    id: 28, type: "qcm",
    question: "Quelle commande liste toutes les etendues IPv4 configurees sur le serveur ?",
    options: [
      "Get-DhcpServerv4Scope -All",
      "Get-DhcpServerv4Scope",
      "Show-DhcpServerv4Scope",
      "Get-DhcpServerv4Scope -List",
    ],
    correct: 1,
    explanation: "`Get-DhcpServerv4Scope` sans parametre liste toutes les etendues. `-ScopeId` est optionnel pour filtrer une etendue specifique.",
  },
  {
    id: 29, type: "qcm",
    question: "Comment modifier uniquement le nom d'une etendue existante (ScopeId 192.168.2.0) en 'LAN-RDC' ?",
    options: [
      "Rename-DhcpServerv4Scope -ScopeId 192.168.2.0 -Name 'LAN-RDC'",
      "Set-DhcpServerv4Scope -ScopeId 192.168.2.0 -Name 'LAN-RDC'",
      "Edit-DhcpServerv4Scope -ScopeId 192.168.2.0 -NewName 'LAN-RDC'",
      "Update-DhcpServerv4Scope -ScopeId 192.168.2.0 -Name 'LAN-RDC'",
    ],
    correct: 1,
    explanation: "`Set-DhcpServerv4Scope` modifie les proprietes d'une etendue existante. `-ScopeId` identifie l'etendue, `-Name` definit le nouveau nom.",
  },
  {
    id: 30, type: "qcm",
    question: "Quelle ligne manque dans cette reservation : `Add-DhcpServerv4Reservation -ScopeId 192.168.1.0 -IPAddress 192.168.1.50 -Description 'Imprimante'` ?",
    options: [
      "-MacAddress 'AA-BB-CC-DD-EE-FF'",
      "-ClientId 'AA-BB-CC-DD-EE-FF'",
      "-HardwareAddress 'AA:BB:CC:DD:EE:FF'",
      "-DeviceId 'AA-BB-CC-DD-EE-FF'",
    ],
    correct: 1,
    explanation: "`-ClientId` est obligatoire pour une reservation. Il prend l'adresse MAC du client au format `AA-BB-CC-DD-EE-FF` pour lier l'IP a cet equipement specifique.",
  },
];

export default function QuizDhcp() {
  return <QuizEngine questions={questions} title="DHCP Windows Server" />;
}

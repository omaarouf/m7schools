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
];

export default function QuizDhcp() {
  return <QuizEngine questions={questions} title="DHCP Windows Server" />;
}

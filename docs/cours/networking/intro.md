---
id: intro
title: Conception Reseau - Introduction
sidebar_label: Introduction
---


> Ce module couvre la configuration des equipements reseau Cisco en utilisant Cisco Packet Tracer comme environnement de simulation.

## Presentation du module

Ce module est consacre a l'administration et la configuration des reseaux bases sur les equipements Cisco. Il couvre l'ensemble des notions essentielles allant de la configuration de base jusqu'aux services reseau avances.

Chaque lecon presente les commandes Cisco IOS avec des explications, des exemples pratiques et des tableaux de verification.

---



## Contenu du module

| Groupe | Themes couverts |
|---|---|
| **Configuration de Base** | Modes CLI, hostname, passwords, SSH, SVI, interfaces |
| **Switching** | VLANs, VTP, Trunk, STP, EtherChannel |
| **Routage** | Routes statiques, RIP, OSPF, EIGRP, BGP |
| **Securite** | Port-Security, ACL standard et etendue |
| **Gestion & Monitoring** | CDP, LLDP, NTP, sauvegarde IOS et configuration |
| **Services Reseau** | HSRP, DHCP v4/v6, NAT, VoIP CME, VPN GRE/IPsec |

---



## Conventions utilisees

Dans ce module, les invites de commande indiquent le mode de configuration actif :

| Invite | Mode |
|---|---|
| `Router>` | EXEC utilisateur |
| `Router#` | EXEC privilegie |
| `Router(config)#` | Configuration globale |
| `Router(config-if)#` | Configuration d'interface |
| `Router(config-router)#` | Configuration protocole de routage |

:::tip
La commande `do` permet d'executer une commande EXEC depuis n'importe quel sous-mode de configuration. Par exemple : `Router(config)# do show ip interface brief`
:::

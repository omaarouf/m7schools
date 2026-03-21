---
id: dhcp
title: DHCP v4 & v6
sidebar_label: DHCP v4 & v6
---

> Configurer un serveur DHCP sur un routeur Cisco pour distribuer automatiquement les parametres reseau aux hotes en IPv4 et IPv6.

## 1. Principe de DHCP

DHCP (Dynamic Host Configuration Protocol) attribue automatiquement aux hotes :
- Une adresse IP
- Un masque de sous-reseau
- Une passerelle par defaut
- Un serveur DNS
- D'autres parametres optionnels (nom de domaine, serveur TFTP...)

**Processus DORA (DHCPv4) :**
1. **Discover** : le client diffuse une demande
2. **Offer** : le serveur propose une adresse
3. **Request** : le client accepte l'offre
4. **Acknowledge** : le serveur confirme l'attribution

---

## 2. DHCPv4 — Adresses exclues

Les adresses reservees (routeurs, serveurs, imprimantes) doivent etre exclues du pool avant sa creation.

```bash title="Exclure des adresses du pool DHCP"
Router(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10
Router(config)# ip dhcp excluded-address 192.168.1.254
```

:::tip
Toujours exclure les adresses avant de creer le pool — les adresses exclues s'appliquent globalement a tous les pools.
:::

---

## 3. DHCPv4 — Creation du pool

```bash title="Créer un pool DHCP complet"
Router(config)# ip dhcp pool LAN_POOL
Router(dhcp-config)# network 192.168.1.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.1.1
Router(dhcp-config)# dns-server 8.8.8.8 8.8.4.4
Router(dhcp-config)# domain-name m7schools.local
Router(dhcp-config)# lease 7 0 0
Router(dhcp-config)# exit
```

| Parametre | Description |
|---|---|
| `network` | Reseau et masque du pool |
| `default-router` | Passerelle par defaut des clients |
| `dns-server` | Serveurs DNS (jusqu'a 8) |
| `domain-name` | Suffixe DNS |
| `lease` | Duree du bail (jours heures minutes) |

```bash title="Plusieurs pools pour plusieurs VLANs"
Router(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.10
Router(config)# ip dhcp pool VLAN10_POOL
Router(dhcp-config)# network 192.168.10.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.10.1
Router(dhcp-config)# dns-server 8.8.8.8
Router(dhcp-config)# exit

Router(config)# ip dhcp excluded-address 192.168.20.1 192.168.20.10
Router(config)# ip dhcp pool VLAN20_POOL
Router(dhcp-config)# network 192.168.20.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.20.1
Router(dhcp-config)# dns-server 8.8.8.8
Router(dhcp-config)# exit
```

---

## 4. DHCPv4 — Relai DHCP (Helper Address)

Quand le serveur DHCP est sur un reseau different des clients, le routeur doit relayer les requetes DHCP.

```bash title="Configurer un relai DHCP sur l'interface LAN"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip helper-address 192.168.100.10
Router(config-if)# no shutdown
Router(config-if)# exit
```

:::info
`ip helper-address` transforme les broadcasts DHCP en unicast vers le serveur DHCP distant. L'interface doit etre celle qui fait face aux clients, pas celle qui fait face au serveur.
:::

---

## 5. DHCPv6 — Routage IPv6

```bash title="Activer le routage IPv6 (obligatoire)"
Router(config)# ipv6 unicast-routing
```

---

## 6. DHCPv6 — Mode SLAAC + Stateless

En mode stateless, les clients generent leur propre adresse IPv6 via SLAAC. DHCPv6 fournit uniquement les informations supplementaires (DNS, domaine).

```bash title="Créer un pool DHCPv6 stateless"
Router(config)# ipv6 dhcp pool POOL_V6_STATELESS
Router(config-dhcpv6)# dns-server 2001:4860:4860::8888
Router(config-dhcpv6)# domain-name m7schools.local
Router(config-dhcpv6)# exit
```

```bash title="Appliquer sur l'interface — mode stateless"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ipv6 address 2001:db8:1::1/64
Router(config-if)# ipv6 nd other-config-flag
Router(config-if)# ipv6 dhcp server POOL_V6_STATELESS
Router(config-if)# no shutdown
Router(config-if)# exit
```

:::info other-config-flag
Le flag `O` (Other) dans les RA (Router Advertisement) indique aux clients d'utiliser DHCPv6 pour obtenir des informations supplementaires (DNS, domaine) tout en generant leur adresse via SLAAC.
:::

---

## 7. DHCPv6 — Mode Stateful

En mode stateful, DHCPv6 attribue l'adresse IPv6 complete (comme DHCPv4).

```bash title="Créer un pool DHCPv6 stateful"
Router(config)# ipv6 dhcp pool POOL_V6_STATEFUL
Router(config-dhcpv6)# address prefix 2001:db8:1::/64
Router(config-dhcpv6)# dns-server 2001:4860:4860::8888
Router(config-dhcpv6)# domain-name m7schools.local
Router(config-dhcpv6)# exit
```

```bash title="Appliquer sur l'interface — mode stateful"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ipv6 address 2001:db8:1::1/64
Router(config-if)# ipv6 nd managed-config-flag
Router(config-if)# ipv6 nd other-config-flag
Router(config-if)# ipv6 dhcp server POOL_V6_STATEFUL
Router(config-if)# no shutdown
Router(config-if)# exit
```

:::info managed-config-flag
Le flag `M` (Managed) dans les RA indique aux clients d'utiliser DHCPv6 pour obtenir leur adresse complete — SLAAC est desactive.
:::

---

## 8. Comparaison des modes IPv6

| Mode | Adresse IP | DNS/Domaine | Flag RA |
|---|---|---|---|
| **SLAAC seul** | Auto-configuree | Non fourni | Aucun flag |
| **SLAAC + Stateless** | Auto-configuree | Via DHCPv6 | Flag `O` |
| **DHCPv6 Stateful** | Attribuee par DHCP | Via DHCPv6 | Flags `M` + `O` |

---

## 9. Verification

### DHCPv4

| Commande | Description |
|---|---|
| `show ip dhcp pool` | Tous les pools DHCP et leur utilisation |
| `show ip dhcp binding` | Adresses IP attribuees aux clients |
| `show ip dhcp statistics` | Statistiques DHCP |
| `show ip dhcp conflict` | Conflits d'adresses detectes |
| `debug ip dhcp server events` | Debug DHCP en temps reel |

```bash title="Vérifications DHCPv4"
Router# show ip dhcp pool
Router# show ip dhcp binding
Router# show ip dhcp statistics
```

### DHCPv6

| Commande | Description |
|---|---|
| `show ipv6 dhcp pool` | Pools DHCPv6 |
| `show ipv6 dhcp binding` | Attributions DHCPv6 |
| `show ipv6 interface gigabitethernet 0/0` | Flags RA sur l'interface |

```bash title="Vérifications DHCPv6"
Router# show ipv6 dhcp pool
Router# show ipv6 dhcp binding
Router# show ipv6 interface gigabitethernet 0/0
```

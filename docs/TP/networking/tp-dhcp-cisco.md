---
id: tp-dhcp-cisco
title: TP - DHCP v4 & v6 (Cisco IOS)
---

# TP - DHCP v4 & v6 (Cisco IOS)

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Pool DHCP Simple (Facile)

**Objectif :** Configurer un serveur DHCP de base sur un routeur Cisco.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Reseau | `192.168.1.0/24` |
| Exclusions | `192.168.1.1` a `192.168.1.10` |
| Passerelle | `192.168.1.1` |
| DNS | `8.8.8.8`, `8.8.4.4` |
| Duree bail | 7 jours |

---

**1. Exclure les adresses fixes du pool.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10
```

</details>

---

**2. Creer le pool DHCP LAN_POOL.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip dhcp pool LAN_POOL
R1(dhcp-config)# network 192.168.1.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.1.1
R1(dhcp-config)# dns-server 8.8.8.8 8.8.4.4
R1(dhcp-config)# domain-name m7schools.local
R1(dhcp-config)# lease 7 0 0
R1(dhcp-config)# exit
```

</details>

---

**3. Verifier le pool et les attributions.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip dhcp pool
R1# show ip dhcp binding
R1# show ip dhcp statistics
```

</details>

---

## TP n°2 - Plusieurs Pools pour Plusieurs VLANs (Facile-Moyen)

**Objectif :** Configurer un routeur comme serveur DHCP pour deux VLANs distincts.

**Contexte :**
| VLAN | Reseau | Exclusions | Passerelle |
|---|---|---|---|
| 10 | `192.168.10.0/24` | `.1` a `.10` | `192.168.10.1` |
| 20 | `192.168.20.0/24` | `.1` a `.10` | `192.168.20.1` |

---

**1. Configurer les exclusions et le pool pour VLAN 10.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.10
R1(config)# ip dhcp pool VLAN10_POOL
R1(dhcp-config)# network 192.168.10.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.10.1
R1(dhcp-config)# dns-server 8.8.8.8
R1(dhcp-config)# lease 1 0 0
R1(dhcp-config)# exit
```

</details>

---

**2. Configurer les exclusions et le pool pour VLAN 20.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip dhcp excluded-address 192.168.20.1 192.168.20.10
R1(config)# ip dhcp pool VLAN20_POOL
R1(dhcp-config)# network 192.168.20.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.20.1
R1(dhcp-config)# dns-server 8.8.8.8
R1(dhcp-config)# lease 1 0 0
R1(dhcp-config)# exit
```

</details>

---

**3. Verifier tous les pools et les baux actifs.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip dhcp pool
R1# show ip dhcp binding | include 192.168.10
R1# show ip dhcp binding | include 192.168.20
```

</details>

---

## TP n°3 - Relai DHCP (Helper Address) (Moyen)

**Objectif :** Configurer un relai DHCP pour distribuer des adresses depuis un serveur distant.

**Topologie :**
```
[LAN clients: 192.168.2.0/24] -- [R1 Gi0/1] -- [R1 Gi0/0] -- [Serveur DHCP: 192.168.1.100]
```

---

**1. Configurer l adresse d assistance DHCP sur l interface LAN de R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/1
R1(config-if)# ip helper-address 192.168.1.100
R1(config-if)# no shutdown
R1(config-if)# exit
```

Note : `ip helper-address` se configure sur l interface FACE AUX CLIENTS (pas face au serveur).

</details>

---

**2. Verifier que les clients obtiennent bien une IP via le relai.**

<details>
<summary>Voir la reponse</summary>

Depuis un PC du LAN, tenter un `ipconfig /renew` (Windows) ou `dhclient` (Linux). L adresse obtenue doit etre du pool configure sur le serveur distant 192.168.1.100.

</details>

---

## TP n°4 - DHCPv6 Stateless (Moyen-Difficile)

**Objectif :** Configurer DHCPv6 stateless pour fournir DNS sans attribuer d adresse.

**Contexte :** Prefixe LAN `2001:db8:1::/64`, les clients utilisent SLAAC pour leur adresse.

---

**1. Activer le routage IPv6 et creer le pool DHCPv6 stateless.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ipv6 unicast-routing
R1(config)# ipv6 dhcp pool POOL_STATELESS
R1(config-dhcpv6)# dns-server 2001:4860:4860::8888
R1(config-dhcpv6)# domain-name m7schools.local
R1(config-dhcpv6)# exit
```

</details>

---

**2. Configurer l interface LAN avec le flag O et appliquer le pool.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ipv6 address 2001:db8:1::1/64
R1(config-if)# ipv6 nd other-config-flag
R1(config-if)# ipv6 dhcp server POOL_STATELESS
R1(config-if)# no shutdown
R1(config-if)# exit
```

</details>

---

**3. Verifier le pool DHCPv6 et les attributions.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ipv6 dhcp pool
R1# show ipv6 dhcp binding
R1# show ipv6 interface gigabitethernet 0/0
```

</details>

---

## TP n°5 - DHCPv6 Stateful (Difficile)

**Objectif :** Configurer DHCPv6 stateful pour attribuer des adresses IPv6 completes.

---

**1. Creer le pool DHCPv6 stateful.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ipv6 dhcp pool POOL_STATEFUL
R1(config-dhcpv6)# address prefix 2001:db8:1::/64
R1(config-dhcpv6)# dns-server 2001:4860:4860::8888
R1(config-dhcpv6)# domain-name m7schools.local
R1(config-dhcpv6)# exit
```

</details>

---

**2. Configurer l interface LAN avec les flags M+O et appliquer le pool.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ipv6 address 2001:db8:1::1/64
R1(config-if)# ipv6 nd managed-config-flag
R1(config-if)# ipv6 nd other-config-flag
R1(config-if)# ipv6 dhcp server POOL_STATEFUL
R1(config-if)# no shutdown
R1(config-if)# exit
```

</details>

---

**3. Comparer les trois modes DHCPv6.**

<details>
<summary>Voir la reponse</summary>

| Mode | Adresse IP | DNS/Domaine | Flags RA |
|---|---|---|---|
| SLAAC seul | Auto (prefix + MAC) | Non fourni | Aucun |
| SLAAC + Stateless | Auto (prefix + MAC) | Via DHCPv6 | Flag O |
| Stateful | Attribuee par DHCP | Via DHCPv6 | Flags M + O |

</details>

---
id: rip
title: RIP & RIPng
sidebar_label: RIP & RIPng
---

> Configurer le protocole de routage RIP version 2 pour IPv4 et RIPng pour IPv6 sur des reseaux de petite taille.

## 1. Presentation de RIP

RIP (Routing Information Protocol) est un protocole de routage a vecteur de distance. Il utilise le nombre de sauts (hops) comme metrique.

| Caracteristique | Valeur |
|---|---|
| Type | Vecteur de distance |
| Metrique | Nombre de sauts (hop count) |
| Limite | 15 sauts maximum (16 = inaccessible) |
| Mise a jour | Toutes les 30 secondes (broadcast/multicast) |
| Distance administrative | 120 |
| Standard | RFC 2453 |

:::warning Limite de RIP
RIP est limite a 15 sauts — il ne convient pas aux reseaux de grande taille. Pour les reseaux d'entreprise, utiliser OSPF ou EIGRP.
:::

---

## 2. RIPv2 — Configuration de base

```bash title="Activer RIPv2 et annoncer les réseaux"
Router(config)# router rip
Router(config-router)# version 2
Router(config-router)# no auto-summary
Router(config-router)# network 192.168.1.0
Router(config-router)# network 192.168.2.0
Router(config-router)# network 10.0.0.0
Router(config-router)# exit
```

:::info RIPv1 vs RIPv2
| Critere | RIPv1 | RIPv2 |
|---|---|---|
| Masque dans les mises a jour | Non (classful) | Oui (classless) |
| Multicast | Non (broadcast) | Oui (224.0.0.9) |
| Authentification | Non | Oui (MD5) |
| VLSM / CIDR | Non | Oui |

Toujours utiliser **RIPv2** — RIPv1 est obsolete.
:::

:::warning no auto-summary
La commande `no auto-summary` est indispensable avec RIPv2 pour eviter la summarisation automatique des routes au niveau des frontieres de classes. Sans elle, des reseaux VLSM peuvent etre mal annonces.
:::

---

## 3. Interface passive

Une interface passive recoit les mises a jour RIP mais n'en envoie pas. A utiliser sur les interfaces connectees aux reseaux d'extremite (LAN).

```bash title="Désactiver les mises à jour RIP sur une interface LAN"
Router(config)# router rip
Router(config-router)# passive-interface gigabitethernet 0/0
Router(config-router)# exit
```

:::tip Bonne pratique
Rendre passive toute interface qui ne connecte pas a un autre routeur RIP. Cela reduit le trafic inutile et empeche les hotes du LAN de recevoir des mises a jour de routage.
:::

---

## 4. Redistribution de la route par defaut

```bash title="Annoncer la route par défaut via RIP"
Router(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1
Router(config)# router rip
Router(config-router)# default-information originate
Router(config-router)# exit
```

---

## 5. RIPng — Configuration IPv6

RIPng (RIP next generation) est la version IPv6 de RIP. La configuration differe — RIPng est active directement sur les interfaces.

### Activer le routage IPv6

```bash title="Activer le routage IPv6"
Router(config)# ipv6 unicast-routing
```

### Activer RIPng

```bash title="Créer le processus RIPng"
Router(config)# ipv6 router rip RIPNG_PROCESS
Router(config-rtr)# exit
```

### Configurer les interfaces

```bash title="Activer RIPng sur chaque interface"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ipv6 address 2001:db8:1::1/64
Router(config-if)# ipv6 rip RIPNG_PROCESS enable
Router(config-if)# no shutdown
Router(config-if)# exit

Router(config)# interface serial 0/0/0
Router(config-if)# ipv6 address 2001:db8:12::1/64
Router(config-if)# ipv6 rip RIPNG_PROCESS enable
Router(config-if)# no shutdown
Router(config-if)# exit
```

### Interface passive RIPng

```bash title="Interface passive pour RIPng"
Router(config)# ipv6 router rip RIPNG_PROCESS
Router(config-rtr)# passive-interface gigabitethernet 0/0
Router(config-rtr)# exit
```

---

## 6. Comparaison RIPv2 vs RIPng

| Critere | RIPv2 | RIPng |
|---|---|---|
| Version IP | IPv4 | IPv6 |
| Multicast | 224.0.0.9 | FF02::9 |
| Configuration | Sous `router rip` | Sur chaque interface |
| Authentification | MD5 | IPsec (integre a IPv6) |
| Metrique max | 15 sauts | 15 sauts |

---

## 7. Verification

| Commande | Description |
|---|---|
| `show ip rip database` | Base de donnees RIP (IPv4) |
| `show ip route rip` | Routes apprises via RIP |
| `show ip protocols` | Parametres RIP actifs |
| `debug ip rip` | Mises a jour RIP en temps reel |
| `show ipv6 route rip` | Routes RIPng (IPv6) |
| `show ipv6 protocols` | Parametres RIPng |

```bash title="Vérifications essentielles"
Router# show ip route rip
Router# show ip protocols
Router# show ip rip database
```

:::warning debug ip rip
La commande `debug ip rip` genere beaucoup de messages. Toujours desactiver le debug apres utilisation avec `no debug ip rip` ou `undebug all`.
:::

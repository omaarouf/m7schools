---
id: tp-ospf
title: TP - OSPF & OSPFv3
---

# TP - OSPF & OSPFv3

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - OSPF de Base (Facile)

**Objectif :** Configurer OSPF entre deux routeurs dans la zone 0.

**Topologie :**
```
[LAN-A: 192.168.1.0/24] -- [R1: 10.0.0.1/30] == [R2: 10.0.0.2/30] -- [LAN-B: 192.168.2.0/24]
```

---

**1. Configurer OSPF sur R1 avec le Router-ID 1.1.1.1 et annoncer les reseaux en zone 0.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 10.0.0.0 0.0.0.3 area 0
R1(config-router)# exit
```

</details>

---

**2. Configurer OSPF sur R2 avec le Router-ID 2.2.2.2.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# router ospf 1
R2(config-router)# router-id 2.2.2.2
R2(config-router)# network 192.168.2.0 0.0.0.255 area 0
R2(config-router)# network 10.0.0.0 0.0.0.3 area 0
R2(config-router)# exit
```

</details>

---

**3. Verifier les voisins OSPF et l etat de la relation (doit etre FULL).**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip ospf neighbors
```

L etat doit etre `FULL` dans la colonne State. Si l etat reste `INIT` ou `2-WAY`, verifier la connectivite et les intervalles Hello/Dead.

</details>

---

**4. Verifier les routes OSPF apprises.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route ospf
```

La route `O 192.168.2.0/24 [110/X] via 10.0.0.2` doit apparaitre avec le code `O`.

</details>

---

## TP n°2 - Loopback, Router-ID et Interface Passive (Facile-Moyen)

**Objectif :** Configurer un Router-ID stable via loopback et les interfaces passives.

---

**1. Creer une interface loopback sur R1 et l utiliser comme Router-ID.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface loopback 0
R1(config-if)# ip address 1.1.1.1 255.255.255.255
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# exit
```

</details>

---

**2. Configurer l interface LAN (Gi0/0) comme passive.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router ospf 1
R1(config-router)# passive-interface gigabitethernet 0/0
R1(config-router)# exit
```

</details>

---

**3. Changer la bande passante de reference a 1000 Mbps.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router ospf 1
R1(config-router)# auto-cost reference-bandwidth 1000
R1(config-router)# exit
```

Appliquer la meme commande sur TOUS les routeurs OSPF du domaine.

</details>

---

## TP n°3 - Couts et Diagnostics OSPF (Moyen)

**Objectif :** Modifier les couts OSPF et diagnostiquer les problemes de voisinage.

---

**1. Afficher les interfaces OSPF et leur cout.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip ospf interface brief
```

</details>

---

**2. Modifier manuellement le cout de l interface Gi0/0 a 50.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ip ospf cost 50
R1(config-if)# exit
```

</details>

---

**3. Modifier les intervalles Hello=5sec et Dead=20sec sur S0/0/0.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface serial 0/0/0
R1(config-if)# ip ospf hello-interval 5
R1(config-if)# ip ospf dead-interval 20
R1(config-if)# exit
```

Appliquer les memes valeurs sur R2 sur la meme interface, sinon le voisinage ne s etablit pas.

</details>

---

**4. Afficher la base de donnees LSDB.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip ospf database
```

</details>

---

## TP n°4 - Route par Defaut et Redistribution OSPF (Moyen-Difficile)

**Objectif :** Distribuer la route par defaut via OSPF et redistribuer des routes statiques.

---

**1. Configurer une route par defaut et la distribuer via OSPF.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
R1(config)# router ospf 1
R1(config-router)# default-information originate
R1(config-router)# exit
```

</details>

---

**2. Redistribuer les routes statiques dans OSPF.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router ospf 1
R1(config-router)# redistribute static subnets
R1(config-router)# exit
```

</details>

---

**3. Verifier que R2 a recu la route par defaut en OSPF.**

<details>
<summary>Voir la reponse</summary>

```
R2# show ip route
```

La route `O*E2 0.0.0.0/0 [110/1] via 10.0.0.1` doit apparaitre. `E2` = route externe de type 2 OSPF.

</details>

---

## TP n°5 - OSPFv3 pour IPv6 (Difficile)

**Objectif :** Configurer OSPFv3 pour le routage IPv6.

**Contexte :**
| Routeur | Interface | Adresse IPv6 |
|---|---|---|
| R1 | Gi0/0 | `2001:db8:1::1/64` |
| R1 | S0/0/0 | `2001:db8:12::1/64` |
| R2 | S0/0/0 | `2001:db8:12::2/64` |
| R2 | Gi0/0 | `2001:db8:2::1/64` |

---

**1. Activer le routage IPv6 et configurer le processus OSPFv3 sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ipv6 unicast-routing
R1(config)# ipv6 router ospf 1
R1(config-rtr)# router-id 1.1.1.1
R1(config-rtr)# exit
```

</details>

---

**2. Activer OSPFv3 sur les interfaces de R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ipv6 address 2001:db8:1::1/64
R1(config-if)# ipv6 ospf 1 area 0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface serial 0/0/0
R1(config-if)# ipv6 address 2001:db8:12::1/64
R1(config-if)# ipv6 ospf 1 area 0
R1(config-if)# no shutdown
R1(config-if)# exit
```

</details>

---

**3. Configurer R2 de la meme facon et verifier les voisins OSPFv3.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# ipv6 unicast-routing
R2(config)# ipv6 router ospf 1
R2(config-rtr)# router-id 2.2.2.2
R2(config-rtr)# exit
R2(config)# interface gigabitethernet 0/0
R2(config-if)# ipv6 address 2001:db8:2::1/64
R2(config-if)# ipv6 ospf 1 area 0
R2(config-if)# no shutdown
R2(config-if)# exit
R2(config)# interface serial 0/0/0
R2(config-if)# ipv6 address 2001:db8:12::2/64
R2(config-if)# ipv6 ospf 1 area 0
R2(config-if)# no shutdown
R2(config-if)# exit
```

Verification :
```
R1# show ipv6 ospf neighbors
R1# show ipv6 route ospf
```

</details>

---
id: tp-routage-statique
title: TP - Routage Statique
---

# TP - Routage Statique

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Route Statique Simple (Facile)

**Objectif :** Configurer des routes statiques entre deux routeurs.

**Topologie :**
```
[PC-A: 192.168.1.0/24] -- [R1: 10.0.0.1/30] == [R2: 10.0.0.2/30] -- [PC-B: 192.168.2.0/24]
```

---

**1. Configurer la route statique sur R1 vers le LAN de R2.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
```

</details>

---

**2. Configurer la route statique sur R2 vers le LAN de R1.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1
```

</details>

---

**3. Verifier la table de routage sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route
```

La route `S 192.168.2.0/24 [1/0] via 10.0.0.2` doit apparaitre avec le code `S` (statique).

</details>

---

**4. Tester la connectivite avec un ping.**

<details>
<summary>Voir la reponse</summary>

```
R1# ping 192.168.2.1
R1# ping 192.168.2.1 source 192.168.1.1
```

</details>

---

## TP n°2 - Route par Defaut (Facile-Moyen)

**Objectif :** Configurer une route par defaut pour l acces Internet.

**Contexte :** R1 (reseau interne) est connecte a un ISP via Serial 0/0/0. ISP next-hop : `203.0.113.1`.

---

**1. Configurer la route par defaut sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
```

</details>

---

**2. Verifier que la route par defaut est presente dans la table de routage.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route
```

Chercher :
- `Gateway of last resort is 203.0.113.1 to network 0.0.0.0`
- `S* 0.0.0.0/0 [1/0] via 203.0.113.1`

</details>

---

**3. Afficher uniquement les routes statiques.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route static
```

</details>

---

## TP n°3 - Route Flottante (Moyen)

**Objectif :** Configurer une route de secours qui s active uniquement si la route principale tombe.

**Contexte :**
- Route principale vers 192.168.2.0/24 via 10.0.0.2 (Serial)
- Route de secours via 10.0.0.6 (lien de secours)

---

**1. Configurer la route principale (DA par defaut = 1).**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
```

</details>

---

**2. Configurer la route flottante avec une DA de 150.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.6 150
```

</details>

---

**3. Verifier que seule la route principale est active.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route 192.168.2.0
```

Seule la route via `10.0.0.2` doit apparaitre. La route flottante (DA 150) n est pas visible tant que la principale est active.

</details>

---

**4. Simuler la panne de la route principale et verifier le basculement.**

<details>
<summary>Voir la reponse</summary>

Supprimer la route principale :
```
R1(config)# no ip route 192.168.2.0 255.255.255.0 10.0.0.2
```

Verifier que la route flottante est maintenant active :
```
R1# show ip route 192.168.2.0
```

La route via `10.0.0.6 [150/0]` doit maintenant apparaitre.

</details>

---

## TP n°4 - Routage Statique IPv6 (Moyen-Difficile)

**Objectif :** Configurer des routes statiques IPv6 entre deux routeurs.

**Contexte :**
| Routeur | Interface | Adresse IPv6 |
|---|---|---|
| R1 | Gi0/0 | `2001:db8:1::1/64` (LAN A) |
| R1 | S0/0/0 | `2001:db8:12::1/64` |
| R2 | S0/0/0 | `2001:db8:12::2/64` |
| R2 | Gi0/0 | `2001:db8:2::1/64` (LAN B) |

---

**1. Activer le routage IPv6 sur les deux routeurs.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ipv6 unicast-routing
R2(config)# ipv6 unicast-routing
```

</details>

---

**2. Configurer une route statique IPv6 sur R1 vers le LAN B.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ipv6 route 2001:db8:2::/64 2001:db8:12::2
```

</details>

---

**3. Configurer la route par defaut IPv6 sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ipv6 route ::/0 2001:db8:12::2
```

</details>

---

**4. Verifier la table de routage IPv6.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ipv6 route
R1# show ipv6 route static
```

</details>

---

## TP n°5 - Scenario de Routage Complet (Difficile)

**Objectif :** Configurer un reseau a trois routeurs avec routes statiques et route flottante.

**Topologie :**
```
[LAN-A: 192.168.1.0/24] -- [R1] -- [R2] -- [LAN-B: 192.168.2.0/24]
                                 \         /
                                  [R3] (lien de secours)
```

**Adressage inter-routeurs :**
- R1-R2 : `10.0.12.0/30` (R1=.1, R2=.2)
- R1-R3 : `10.0.13.0/30` (R1=.1, R3=.2)
- R3-R2 : `10.0.23.0/30` (R3=.1, R2=.2)

---

**1. Configurer les routes statiques sur R1 (principale via R2, flottante via R3).**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.12.2
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.13.2 150
```

</details>

---

**2. Configurer les routes sur R2 et R3.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.12.1
R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.23.1 150

R3(config)# ip route 192.168.1.0 255.255.255.0 10.0.13.1
R3(config)# ip route 192.168.2.0 255.255.255.0 10.0.23.2
```

</details>

---

**3. Verifier la connectivite et tester le failover.**

<details>
<summary>Voir la reponse</summary>

Test normal :
```
R1# ping 192.168.2.1 source 192.168.1.1
```

Simuler une panne du lien R1-R2 (shutdown de l interface) et retester :
```
R1(config)# interface serial 0/0/0
R1(config-if)# shutdown
R1# ping 192.168.2.1 source 192.168.1.1
```

Le trafic doit passer via R3 (route flottante activee).

</details>

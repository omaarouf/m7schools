---
id: tp-rip
title: TP - RIP & RIPng
---

# TP - RIP & RIPng

4 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Configuration RIPv2 de Base (Facile)

**Objectif :** Configurer RIPv2 sur deux routeurs et verifier l echange de routes.

**Topologie :**
```
[LAN-A: 192.168.1.0/24] -- [R1: 10.0.0.1/30] == [R2: 10.0.0.2/30] -- [LAN-B: 192.168.2.0/24]
```

---

**1. Activer RIPv2 sur R1 et annoncer ses reseaux.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router rip
R1(config-router)# version 2
R1(config-router)# no auto-summary
R1(config-router)# network 192.168.1.0
R1(config-router)# network 10.0.0.0
R1(config-router)# exit
```

</details>

---

**2. Activer RIPv2 sur R2 et annoncer ses reseaux.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# router rip
R2(config-router)# version 2
R2(config-router)# no auto-summary
R2(config-router)# network 192.168.2.0
R2(config-router)# network 10.0.0.0
R2(config-router)# exit
```

</details>

---

**3. Verifier les routes RIP apprises sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route rip
```

La route `R 192.168.2.0/24 [120/1] via 10.0.0.2` doit apparaitre avec le code `R`.

</details>

---

**4. Afficher les parametres RIP actifs.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip protocols
```

</details>

---

## TP n°2 - Interface Passive et Route par Defaut (Facile-Moyen)

**Objectif :** Optimiser la configuration RIP avec les interfaces passives et annoncer la route par defaut.

---

**1. Configurer l interface LAN de R1 comme passive (ne pas envoyer de mises a jour RIP vers les PCs).**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router rip
R1(config-router)# passive-interface gigabitethernet 0/0
R1(config-router)# exit
```

</details>

---

**2. Configurer une route par defaut sur R1 et la distribuer via RIP.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
R1(config)# router rip
R1(config-router)# default-information originate
R1(config-router)# exit
```

</details>

---

**3. Verifier que R2 a appris la route par defaut via RIP.**

<details>
<summary>Voir la reponse</summary>

```
R2# show ip route
```

La route `R* 0.0.0.0/0 [120/1] via 10.0.0.1` doit apparaitre.

</details>

---

## TP n°3 - Base de Donnees RIP et Debug (Moyen)

**Objectif :** Examiner la base de donnees RIP et utiliser le debug pour diagnostiquer.

---

**1. Afficher la base de donnees RIP complete.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip rip database
```

</details>

---

**2. Activer le debug RIP pour voir les mises a jour en temps reel.**

<details>
<summary>Voir la reponse</summary>

```
R1# debug ip rip
```

Observer les mises a jour periodiques (toutes les 30 sec). Desactiver apres observation :
```
R1# no debug ip rip
```

Ou desactiver tous les debugs :
```
R1# undebug all
```

</details>

---

**3. Afficher les routes RIP pour IPv6 (RIPng).**

<details>
<summary>Voir la reponse</summary>

```
R1# show ipv6 route rip
R1# show ipv6 protocols
```

</details>

---

## TP n°4 - RIPng pour IPv6 (Difficile)

**Objectif :** Configurer RIPng sur deux routeurs IPv6.

**Contexte :**
| Routeur | Interface | Adresse IPv6 |
|---|---|---|
| R1 | Gi0/0 | `2001:db8:1::1/64` |
| R1 | S0/0/0 | `2001:db8:12::1/64` |
| R2 | S0/0/0 | `2001:db8:12::2/64` |
| R2 | Gi0/0 | `2001:db8:2::1/64` |

---

**1. Activer le routage IPv6 et creer le processus RIPng sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ipv6 unicast-routing
R1(config)# ipv6 router rip RIP_V6
R1(config-rtr)# exit
```

</details>

---

**2. Activer RIPng sur les interfaces de R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ipv6 address 2001:db8:1::1/64
R1(config-if)# ipv6 rip RIP_V6 enable
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface serial 0/0/0
R1(config-if)# ipv6 address 2001:db8:12::1/64
R1(config-if)# ipv6 rip RIP_V6 enable
R1(config-if)# no shutdown
R1(config-if)# exit
```

</details>

---

**3. Faire la meme configuration sur R2 et verifier les routes apprises.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# ipv6 unicast-routing
R2(config)# ipv6 router rip RIP_V6
R2(config-rtr)# exit
R2(config)# interface gigabitethernet 0/0
R2(config-if)# ipv6 address 2001:db8:2::1/64
R2(config-if)# ipv6 rip RIP_V6 enable
R2(config-if)# no shutdown
R2(config-if)# exit
R2(config)# interface serial 0/0/0
R2(config-if)# ipv6 address 2001:db8:12::2/64
R2(config-if)# ipv6 rip RIP_V6 enable
R2(config-if)# no shutdown
R2(config-if)# exit
```

Verification :
```
R1# show ipv6 route rip
R2# show ipv6 route rip
```

</details>

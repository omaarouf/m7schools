---
id: tp-eigrp
title: TP - EIGRP
---

# TP - EIGRP

4 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - EIGRP de Base (Facile)

**Objectif :** Configurer EIGRP AS 10 entre deux routeurs.

**Topologie :**
```
[LAN-A: 192.168.1.0/24] -- [R1: 10.0.0.1/30] == [R2: 10.0.0.2/30] -- [LAN-B: 192.168.2.0/24]
```

---

**1. Configurer EIGRP AS 10 sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router eigrp 10
R1(config-router)# no auto-summary
R1(config-router)# network 192.168.1.0 0.0.0.255
R1(config-router)# network 10.0.0.0 0.0.0.3
R1(config-router)# exit
```

</details>

---

**2. Configurer EIGRP AS 10 sur R2.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# router eigrp 10
R2(config-router)# no auto-summary
R2(config-router)# network 192.168.2.0 0.0.0.255
R2(config-router)# network 10.0.0.0 0.0.0.3
R2(config-router)# exit
```

</details>

---

**3. Verifier les voisins EIGRP.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip eigrp neighbors
```

Le voisin `10.0.0.2` doit apparaitre avec un Hold time > 0 et Q Cnt = 0.

</details>

---

**4. Verifier les routes EIGRP apprises.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route eigrp
```

La route `D 192.168.2.0/24 [90/X] via 10.0.0.2` doit apparaitre avec le code `D`.

</details>

---

## TP n°2 - Router-ID et Interface Passive (Facile-Moyen)

**Objectif :** Configurer un Router-ID stable et les interfaces passives.

---

**1. Configurer le Router-ID EIGRP via une loopback sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface loopback 0
R1(config-if)# ip address 1.1.1.1 255.255.255.255
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# router eigrp 10
R1(config-router)# eigrp router-id 1.1.1.1
R1(config-router)# exit
```

</details>

---

**2. Rendre toutes les interfaces passives sauf Serial 0/0/0.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router eigrp 10
R1(config-router)# passive-interface default
R1(config-router)# no passive-interface serial 0/0/0
R1(config-router)# exit
```

</details>

---

**3. Configurer la redistribution de la route statique par defaut.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
R1(config)# router eigrp 10
R1(config-router)# redistribute static
R1(config-router)# exit
```

</details>

---

## TP n°3 - Tables EIGRP et Diagnostic (Moyen)

**Objectif :** Analyser les tables EIGRP pour comprendre les successeurs.

---

**1. Afficher la table de topologie EIGRP.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip eigrp topology
```

Identifier les successeurs (meilleur chemin) et les successeurs feasibles (chemin de secours).

</details>

---

**2. Afficher toutes les routes EIGRP y compris celles sans successeur feasible.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip eigrp topology all-links
```

</details>

---

**3. Verifier les parametres EIGRP actifs.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip protocols
```

</details>

---

**4. Afficher les details du voisin 10.0.0.2 (SRTT, Q Cnt).**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip eigrp neighbors
```

| Colonne | Description |
|---|---|
| Hold | Temps avant timeout (reinitialise a chaque Hello) |
| SRTT | Temps aller-retour moyen (ms) |
| Q Cnt | 0 = normal, >0 = probleme possible |

</details>

---

## TP n°4 - Scenario EIGRP a Trois Routeurs (Difficile)

**Objectif :** Configurer EIGRP sur un reseau a trois routeurs et analyser la convergence.

**Topologie :**
```
[LAN-A] -- [R1] -- [R2] -- [LAN-B]
                 \        /
                  [R3] --
```

**Adressage :**
- R1-R2 : `10.1.12.0/30`
- R1-R3 : `10.1.13.0/30`
- R2-R3 : `10.1.23.0/30`
- LAN-A : `172.16.1.0/24` (sur R1)
- LAN-B : `172.16.2.0/24` (sur R2)

---

**1. Configurer EIGRP AS 100 sur les trois routeurs.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router eigrp 100
R1(config-router)# no auto-summary
R1(config-router)# eigrp router-id 1.1.1.1
R1(config-router)# network 172.16.1.0 0.0.0.255
R1(config-router)# network 10.1.12.0 0.0.0.3
R1(config-router)# network 10.1.13.0 0.0.0.3
R1(config-router)# exit

R2(config)# router eigrp 100
R2(config-router)# no auto-summary
R2(config-router)# eigrp router-id 2.2.2.2
R2(config-router)# network 172.16.2.0 0.0.0.255
R2(config-router)# network 10.1.12.0 0.0.0.3
R2(config-router)# network 10.1.23.0 0.0.0.3
R2(config-router)# exit

R3(config)# router eigrp 100
R3(config-router)# no auto-summary
R3(config-router)# eigrp router-id 3.3.3.3
R3(config-router)# network 10.1.13.0 0.0.0.3
R3(config-router)# network 10.1.23.0 0.0.0.3
R3(config-router)# exit
```

</details>

---

**2. Verifier que R1 a deux chemins vers LAN-B et identifier le successeur.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip eigrp topology
```

R1 doit avoir deux entrees pour 172.16.2.0 : via R2 (direct) et via R3 (plus long). Le chemin via R2 sera le successeur (FD plus basse).

</details>

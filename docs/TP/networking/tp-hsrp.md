---
id: tp-hsrp
title: TP - HSRP
---

# TP - HSRP

4 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - HSRP de Base (Facile)

**Objectif :** Configurer HSRP entre deux routeurs avec une IP virtuelle.

**Topologie :**
```
[LAN: 192.168.1.0/24]
     |           |
    [R1]        [R2]
  192.168.1.2  192.168.1.3
     IP Virtuelle: 192.168.1.1 (passerelle des hotes)
```

---

**1. Configurer R1 comme routeur Active HSRP (priorite 110, groupe 1).**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ip address 192.168.1.2 255.255.255.0
R1(config-if)# standby 1 ip 192.168.1.1
R1(config-if)# standby 1 priority 110
R1(config-if)# standby 1 preempt
R1(config-if)# no shutdown
R1(config-if)# exit
```

</details>

---

**2. Configurer R2 comme routeur Standby HSRP (priorite 90, groupe 1).**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# interface gigabitethernet 0/0
R2(config-if)# ip address 192.168.1.3 255.255.255.0
R2(config-if)# standby 1 ip 192.168.1.1
R2(config-if)# standby 1 priority 90
R2(config-if)# no shutdown
R2(config-if)# exit
```

</details>

---

**3. Verifier l etat HSRP sur R1 et R2.**

<details>
<summary>Voir la reponse</summary>

```
R1# show standby
R2# show standby brief
```

R1 doit afficher `Active` et R2 doit afficher `Standby`.

</details>

---

## TP n°2 - Preemption et Timers (Facile-Moyen)

**Objectif :** Configurer la preemption avec delai et ajuster les timers HSRP.

---

**1. Configurer la preemption avec un delai de 30 secondes sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# standby 1 preempt delay minimum 30
R1(config-if)# exit
```

</details>

---

**2. Reduire les timers Hello a 2 secondes et Hold a 6 secondes.**

<details>
<summary>Voir la reponse</summary>

Appliquer sur R1 ET R2 (les timers doivent etre identiques) :
```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# standby 1 timers 2 6
R1(config-if)# exit

R2(config)# interface gigabitethernet 0/0
R2(config-if)# standby 1 timers 2 6
R2(config-if)# exit
```

</details>

---

**3. Simuler la panne de R1 et observer le basculement sur R2.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# shutdown
```

Verifier sur R2 :
```
R2# show standby brief
```

R2 doit maintenant afficher `Active`. Quand R1 revient (`no shutdown`), il doit reprendre le role Active grace a `preempt`.

</details>

---

## TP n°3 - HSRP Version 2 (Moyen)

**Objectif :** Migrer vers HSRP version 2 pour supporter plus de groupes et IPv6.

---

**1. Activer HSRP version 2 sur R1 et R2.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# standby version 2
R1(config-if)# exit

R2(config)# interface gigabitethernet 0/0
R2(config-if)# standby version 2
R2(config-if)# exit
```

</details>

---

**2. Verifier que la version est bien v2 dans l etat HSRP.**

<details>
<summary>Voir la reponse</summary>

```
R1# show standby
```

La ligne `Version 2` doit apparaitre dans la sortie.

</details>

---

**3. Comparer les adresses multicast HSRP v1 vs v2.**

<details>
<summary>Voir la reponse</summary>

| Version | Multicast | Groupes | MAC virtuelle |
|---|---|---|---|
| HSRP v1 | `224.0.0.2` | 0-255 | `0000.0c07.acXX` |
| HSRP v2 | `224.0.0.102` | 0-4095 | `0000.0c9f.fXXX` |

</details>

---

## TP n°4 - HSRP Double Groupe (Difficile)

**Objectif :** Configurer deux groupes HSRP pour repartir la charge (Active/Active sur deux groupes).

**Contexte :**
- Groupe 1 : R1 Active (passerelle VLAN 10), R2 Standby
- Groupe 2 : R2 Active (passerelle VLAN 20), R1 Standby

---

**1. Configurer R1 avec deux groupes HSRP.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ip address 192.168.10.2 255.255.255.0
R1(config-if)# standby version 2
R1(config-if)# standby 1 ip 192.168.10.1
R1(config-if)# standby 1 priority 110
R1(config-if)# standby 1 preempt
R1(config-if)# standby 2 ip 192.168.20.1
R1(config-if)# standby 2 priority 90
R1(config-if)# no shutdown
R1(config-if)# exit
```

</details>

---

**2. Configurer R2 avec les priorites inversees.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# interface gigabitethernet 0/0
R2(config-if)# ip address 192.168.10.3 255.255.255.0
R2(config-if)# standby version 2
R2(config-if)# standby 1 ip 192.168.10.1
R2(config-if)# standby 1 priority 90
R2(config-if)# standby 2 ip 192.168.20.1
R2(config-if)# standby 2 priority 110
R2(config-if)# standby 2 preempt
R2(config-if)# no shutdown
R2(config-if)# exit
```

</details>

---

**3. Verifier que R1 est Active sur groupe 1 et R2 est Active sur groupe 2.**

<details>
<summary>Voir la reponse</summary>

```
R1# show standby brief
R2# show standby brief
```

R1 : groupe 1 = Active, groupe 2 = Standby.
R2 : groupe 1 = Standby, groupe 2 = Active.

</details>

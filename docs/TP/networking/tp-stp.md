---
id: tp-stp
title: TP - Spanning Tree Protocol (STP)
---

# TP - Spanning Tree Protocol (STP)

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Observation de STP (Facile)

**Objectif :** Observer l election du Root Bridge et l etat des ports STP.

---

**1. Afficher l etat STP complet sur le switch.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show spanning-tree
```

</details>

---

**2. Afficher l etat STP pour le VLAN 1 uniquement.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show spanning-tree vlan 1
```

Identifier dans la sortie : Root Bridge (Root ID), priorite locale (Bridge ID), et l etat de chaque port (Root, Designated, Altn/Blocked).

</details>

---

**3. Afficher un resume court de l etat STP.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show spanning-tree brief
```

</details>

---

**4. Afficher l etat STP sur un port specifique (Fa0/1).**

<details>
<summary>Voir la reponse</summary>

```
Switch# show spanning-tree interface fastethernet 0/1
```

</details>

---

## TP n°2 - Election du Root Bridge (Facile-Moyen)

**Objectif :** Controler l election du Root Bridge en modifiant les priorites.

**Contexte :** Trois switches SW1, SW2, SW3 connectes. SW1 doit devenir Root Primary, SW2 Root Secondary.

---

**1. Configurer SW1 comme Root Bridge primaire du VLAN 10.**

<details>
<summary>Voir la reponse</summary>

```
SW1(config)# spanning-tree vlan 10 root primary
```

Cette commande fixe la priorite a 24576 (ou moins si necessaire).

</details>

---

**2. Configurer SW2 comme Root Bridge secondaire du VLAN 10.**

<details>
<summary>Voir la reponse</summary>

```
SW2(config)# spanning-tree vlan 10 root secondary
```

Cette commande fixe la priorite a 28672.

</details>

---

**3. Configurer manuellement la priorite de SW3 a 32768 (valeur par defaut).**

<details>
<summary>Voir la reponse</summary>

```
SW3(config)# spanning-tree vlan 10 priority 32768
```

</details>

---

**4. Verifier que SW1 est bien le Root Bridge.**

<details>
<summary>Voir la reponse</summary>

```
SW1# show spanning-tree vlan 10
```

Dans la sortie, verifier `This bridge is the root` sous `Root ID`.

</details>

---

## TP n°3 - PortFast et BPDUGuard (Moyen)

**Objectif :** Configurer PortFast et BPDUGuard sur les ports d extremite.

---

**1. Activer PortFast sur le port Fa0/1 (connecte a un PC).**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface fastethernet 0/1
Switch(config-if)# spanning-tree portfast
Switch(config-if)# exit
```

</details>

---

**2. Activer BPDUGuard sur le meme port.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface fastethernet 0/1
Switch(config-if)# spanning-tree bpduguard enable
Switch(config-if)# exit
```

</details>

---

**3. Activer PortFast globalement sur tous les ports access.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# spanning-tree portfast default
```

</details>

---

**4. Activer BPDUGuard globalement sur tous les ports PortFast.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# spanning-tree portfast bpduguard default
```

</details>

---

**5. Simuler une violation BPDUGuard, puis reactiver le port Fa0/1.**

<details>
<summary>Voir la reponse</summary>

Si un switch est connecte sur Fa0/1, le port passe en `err-disabled`. Pour le reactiver :

```
Switch(config)# interface fastethernet 0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
Switch(config-if)# exit
```

Verifier l etat :
```
Switch# show interfaces fastethernet 0/1 status
```

</details>

---

## TP n°4 - Modes STP et Convergence (Moyen-Difficile)

**Objectif :** Comparer PVST+ et Rapid PVST+ en termes de convergence.

---

**1. Verifier le mode STP actuel.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show spanning-tree | include Mode
```

Ou :
```
Switch# show spanning-tree summary
```

</details>

---

**2. Basculer vers Rapid PVST+ (recommande en production).**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# spanning-tree mode rapid-pvst
```

</details>

---

**3. Verifier le nouveau mode STP.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show spanning-tree summary
```

La ligne `Switch is in rapid-pvst mode` confirme le changement.

</details>

---

## TP n°5 - Scenario STP Complet (Difficile)

**Objectif :** Configurer STP sur un reseau a trois switches pour garantir une topologie sans boucle avec la bonne election du Root Bridge.

**Topologie :**
```
SW-CORE ---- SW-DIST-A
    |              |
    +------ SW-DIST-B
```

**Objectif :** SW-CORE = Root Bridge VLAN 10, SW-DIST-A = secondaire, BPDUGuard sur tous les ports access.

---

**1. Configurer SW-CORE comme Root Bridge VLAN 10 et 20.**

<details>
<summary>Voir la reponse</summary>

```
SW-CORE(config)# spanning-tree mode rapid-pvst
SW-CORE(config)# spanning-tree vlan 10 root primary
SW-CORE(config)# spanning-tree vlan 20 root primary
```

</details>

---

**2. Configurer SW-DIST-A comme secondaire et activer PortFast+BPDUGuard sur ses ports access.**

<details>
<summary>Voir la reponse</summary>

```
SW-DIST-A(config)# spanning-tree mode rapid-pvst
SW-DIST-A(config)# spanning-tree vlan 10 root secondary
SW-DIST-A(config)# spanning-tree vlan 20 root secondary
SW-DIST-A(config)# spanning-tree portfast default
SW-DIST-A(config)# spanning-tree portfast bpduguard default
```

</details>

---

**3. Verifier la topologie STP finale depuis SW-CORE.**

<details>
<summary>Voir la reponse</summary>

```
SW-CORE# show spanning-tree vlan 10
SW-CORE# show spanning-tree brief
```

SW-CORE doit afficher `This bridge is the root` pour VLAN 10 et 20.

</details>

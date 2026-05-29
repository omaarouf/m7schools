---
id: tp-etherchannel
title: TP - EtherChannel
---

# TP - EtherChannel

4 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - EtherChannel LACP (Facile-Moyen)

**Objectif :** Configurer un EtherChannel LACP entre deux switches.

**Contexte :** Ports Fa0/1 et Fa0/2 entre SW1 et SW2.

---

**1. Configurer les ports Fa0/1-2 de SW1 en EtherChannel LACP mode actif (groupe 1).**

<details>
<summary>Voir la reponse</summary>

```
SW1(config)# interface range fastethernet 0/1 - 2
SW1(config-if-range)# channel-group 1 mode active
SW1(config-if-range)# no shutdown
SW1(config-if-range)# exit
```

</details>

---

**2. Configurer les ports Fa0/1-2 de SW2 en EtherChannel LACP mode passif (groupe 1).**

<details>
<summary>Voir la reponse</summary>

```
SW2(config)# interface range fastethernet 0/1 - 2
SW2(config-if-range)# channel-group 1 mode passive
SW2(config-if-range)# no shutdown
SW2(config-if-range)# exit
```

</details>

---

**3. Configurer le Port-Channel 1 en mode trunk sur SW1.**

<details>
<summary>Voir la reponse</summary>

```
SW1(config)# interface port-channel 1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk allowed vlan 10,20,30
SW1(config-if)# exit
```

</details>

---

**4. Verifier l etat de l EtherChannel.**

<details>
<summary>Voir la reponse</summary>

```
SW1# show etherchannel summary
SW1# show interfaces port-channel 1
SW1# show lacp neighbor
```

Dans `show etherchannel summary`, les ports doivent afficher le flag `P` (bundled) et le Port-Channel `SU` (Switched, Up).

</details>

---

## TP n°2 - EtherChannel PAgP (Facile-Moyen)

**Objectif :** Configurer un EtherChannel PAgP (proprietaire Cisco).

**Contexte :** Ports Fa0/3-4 entre SW1 et SW2.

---

**1. Configurer les ports Fa0/3-4 de SW1 en mode PAgP desirable.**

<details>
<summary>Voir la reponse</summary>

```
SW1(config)# interface range fastethernet 0/3 - 4
SW1(config-if-range)# channel-group 2 mode desirable
SW1(config-if-range)# no shutdown
SW1(config-if-range)# exit
```

</details>

---

**2. Configurer les ports correspondants de SW2 en mode PAgP auto.**

<details>
<summary>Voir la reponse</summary>

```
SW2(config)# interface range fastethernet 0/3 - 4
SW2(config-if-range)# channel-group 2 mode auto
SW2(config-if-range)# no shutdown
SW2(config-if-range)# exit
```

</details>

---

**3. Verifier les voisins PAgP et l etat du groupe.**

<details>
<summary>Voir la reponse</summary>

```
SW1# show pagp neighbor
SW1# show etherchannel summary
```

</details>

---

## TP n°3 - Diagnostic EtherChannel (Moyen)

**Objectif :** Identifier et corriger des problemes EtherChannel.

---

**1. Afficher les details complets du groupe EtherChannel 1.**

<details>
<summary>Voir la reponse</summary>

```
SW1# show etherchannel 1 detail
```

</details>

---

**2. Interpreter les flags de `show etherchannel summary`.**

<details>
<summary>Voir la reponse</summary>

```
SW1# show etherchannel summary
```

| Flag | Signification |
|---|---|
| `P` | Port bundle dans le Port-Channel - **normal** |
| `D` | Port down - **probleme physique** |
| `I` | Stand-alone - **incoherence de config** |
| `SU` | Switched (L2) + Up - **Port-Channel fonctionnel** |

Si un port affiche `I`, verifier que la vitesse, le duplex et la configuration VLAN sont identiques sur les deux extremites.

</details>

---

**3. Corriger une incoherence : le port Fa0/2 est en mode access vlan 10 alors que les autres sont en trunk.**

<details>
<summary>Voir la reponse</summary>

Retirer d abord le port du groupe, corriger, puis re-ajouter :
```
SW1(config)# interface fastethernet 0/2
SW1(config-if)# no channel-group 1
SW1(config-if)# no switchport access vlan
SW1(config-if)# channel-group 1 mode active
SW1(config-if)# exit
```

</details>

---

## TP n°4 - EtherChannel Complet en Production (Difficile)

**Objectif :** Configurer un EtherChannel LACP trunk avec VLAN natif et verifications completes.

**Contexte :**
- 4 ports (Gi0/1-4) entre SW-CORE et SW-DIST
- EtherChannel LACP, groupe 1
- Trunk : VLANs 10, 20, 30, 40 autorises, VLAN natif 99
- DTP desactive

---

**1. Configurer l EtherChannel sur SW-CORE (LACP active).**

<details>
<summary>Voir la reponse</summary>

```
SW-CORE(config)# interface range gigabitethernet 0/1 - 4
SW-CORE(config-if-range)# channel-group 1 mode active
SW-CORE(config-if-range)# no shutdown
SW-CORE(config-if-range)# exit
SW-CORE(config)# interface port-channel 1
SW-CORE(config-if)# switchport mode trunk
SW-CORE(config-if)# switchport trunk allowed vlan 10,20,30,40
SW-CORE(config-if)# switchport trunk native vlan 99
SW-CORE(config-if)# switchport nonegotiate
SW-CORE(config-if)# exit
```

</details>

---

**2. Configurer l EtherChannel sur SW-DIST (LACP passive).**

<details>
<summary>Voir la reponse</summary>

```
SW-DIST(config)# interface range gigabitethernet 0/1 - 4
SW-DIST(config-if-range)# channel-group 1 mode passive
SW-DIST(config-if-range)# no shutdown
SW-DIST(config-if-range)# exit
SW-DIST(config)# interface port-channel 1
SW-DIST(config-if)# switchport mode trunk
SW-DIST(config-if)# switchport trunk allowed vlan 10,20,30,40
SW-DIST(config-if)# switchport trunk native vlan 99
SW-DIST(config-if)# switchport nonegotiate
SW-DIST(config-if)# exit
```

</details>

---

**3. Effectuer toutes les verifications necessaires.**

<details>
<summary>Voir la reponse</summary>

```
SW-CORE# show etherchannel summary
SW-CORE# show etherchannel 1 detail
SW-CORE# show interfaces port-channel 1
SW-CORE# show lacp neighbor
SW-CORE# show interfaces trunk
```

Le Port-Channel doit afficher `SU` et les 4 ports membres `P`.

</details>

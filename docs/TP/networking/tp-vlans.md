---
id: tp-vlans
title: TP - Configuration des VLANs
---

# TP - Configuration des VLANs

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Creation et Assignation de VLANs (Facile)

**Objectif :** Creer des VLANs et assigner des ports en mode access.

**Contexte :**
| VLAN | Nom | Ports Access |
|---|---|---|
| 10 | INFORMATIQUE | Fa0/1 - Fa0/5 |
| 20 | ADMINISTRATION | Fa0/6 - Fa0/10 |
| 30 | SERVEURS | Fa0/11 - Fa0/15 |

---

**1. Creer les trois VLANs avec leurs noms.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# vlan 10
Switch(config-vlan)# name INFORMATIQUE
Switch(config-vlan)# exit
Switch(config)# vlan 20
Switch(config-vlan)# name ADMINISTRATION
Switch(config-vlan)# exit
Switch(config)# vlan 30
Switch(config-vlan)# name SERVEURS
Switch(config-vlan)# exit
```

</details>

---

**2. Assigner les ports Fa0/1 a Fa0/5 au VLAN 10.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface range fastethernet 0/1 - 5
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# exit
```

</details>

---

**3. Assigner les ports Fa0/6-10 au VLAN 20 et Fa0/11-15 au VLAN 30.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface range fastethernet 0/6 - 10
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
Switch(config-if-range)# exit
Switch(config)# interface range fastethernet 0/11 - 15
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 30
Switch(config-if-range)# exit
```

</details>

---

**4. Verifier la liste des VLANs et leurs ports.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show vlan brief
```

</details>

---

## TP n°2 - Liaison Trunk (Facile-Moyen)

**Objectif :** Configurer une liaison trunk entre deux switches.

**Contexte :** Gi0/1 est le lien uplink vers le switch de distribution.

---

**1. Configurer le port Gi0/1 en mode trunk avec les VLANs 10, 20, 30.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface gigabitethernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
Switch(config-if)# exit
```

</details>

---

**2. Changer le VLAN natif du trunk a 99 (securite).**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface gigabitethernet 0/1
Switch(config-if)# switchport trunk native vlan 99
Switch(config-if)# exit
```

</details>

---

**3. Desactiver DTP sur le port trunk.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface gigabitethernet 0/1
Switch(config-if)# switchport nonegotiate
Switch(config-if)# exit
```

</details>

---

**4. Ajouter le VLAN 40 a la liste trunk sans supprimer les autres.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface gigabitethernet 0/1
Switch(config-if)# switchport trunk allowed vlan add 40
Switch(config-if)# exit
```

</details>

---

**5. Verifier les interfaces trunk et les VLANs autorises.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show interfaces trunk
```

</details>

---

## TP n°3 - VTP (Moyen)

**Objectif :** Configurer VTP pour synchroniser les VLANs entre switches.

**Contexte :** SW1 est serveur VTP, SW2 et SW3 sont clients.

---

**1. Configurer SW1 comme serveur VTP du domaine OFPPT.**

<details>
<summary>Voir la reponse</summary>

```
SW1(config)# vtp domain OFPPT
SW1(config)# vtp password ofppt123
SW1(config)# vtp mode server
SW1(config)# vtp version 2
```

</details>

---

**2. Configurer SW2 et SW3 comme clients VTP.**

<details>
<summary>Voir la reponse</summary>

```
SW2(config)# vtp domain OFPPT
SW2(config)# vtp password ofppt123
SW2(config)# vtp mode client

SW3(config)# vtp domain OFPPT
SW3(config)# vtp password ofppt123
SW3(config)# vtp mode client
```

</details>

---

**3. Verifier le statut VTP sur chaque switch.**

<details>
<summary>Voir la reponse</summary>

```
SW1# show vtp status
SW2# show vtp status
```

Verifier que `VTP Operating Mode` correspond au mode configure et que le `Configuration Revision` est identique sur les clients apres synchronisation.

</details>

---

## TP n°4 - Routage Inter-VLAN Router-on-a-Stick (Moyen-Difficile)

**Objectif :** Configurer le routage inter-VLAN avec un routeur et des sous-interfaces.

**Topologie :**
```
[R1 Gi0/0] ---- trunk (802.1Q) ---- [SW1]
```

**Contexte :**
| VLAN | Reseau | Passerelle (sous-interface) |
|---|---|---|
| 10 | `192.168.10.0/24` | `192.168.10.1` (Gi0/0.10) |
| 20 | `192.168.20.0/24` | `192.168.20.1` (Gi0/0.20) |
| 30 | `192.168.30.0/24` | `192.168.30.1` (Gi0/0.30) |

---

**1. Configurer le port SW1 connecte au routeur en mode trunk.**

<details>
<summary>Voir la reponse</summary>

```
SW1(config)# interface gigabitethernet 0/24
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk allowed vlan 10,20,30
SW1(config-if)# exit
```

</details>

---

**2. Configurer les sous-interfaces sur R1 pour chaque VLAN.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface gigabitethernet 0/0.10
R1(config-subif)# encapsulation dot1q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0
R1(config-subif)# exit
R1(config)# interface gigabitethernet 0/0.20
R1(config-subif)# encapsulation dot1q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0
R1(config-subif)# exit
R1(config)# interface gigabitethernet 0/0.30
R1(config-subif)# encapsulation dot1q 30
R1(config-subif)# ip address 192.168.30.1 255.255.255.0
R1(config-subif)# exit
```

</details>

---

**3. Verifier que les sous-interfaces sont actives.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip interface brief
R1# show ip route
```

Chaque sous-interface doit etre en etat `up/up` et apparaitre comme reseau directement connecte dans la table de routage.

</details>

---

## TP n°5 - Scenario Complet Multi-VLAN (Difficile)

**Objectif :** Concevoir et configurer un reseau multi-VLAN complet avec VTP, trunks et routage inter-VLAN.

**Contexte :**
- 2 switches (SW-ACCESS et SW-DIST)
- 1 routeur (R1)
- VLANs : 10 (RH), 20 (IT), 30 (Direction), 99 (Gestion)
- VTP : SW-DIST = serveur, SW-ACCESS = client

---

**1. Configurer le switch de distribution SW-DIST (serveur VTP, VLANs, trunk).**

<details>
<summary>Voir la reponse</summary>

```
SW-DIST(config)# hostname SW-DIST
SW-DIST(config)# vtp domain ENTREPRISE
SW-DIST(config)# vtp mode server
SW-DIST(config)# vlan 10
SW-DIST(config-vlan)# name RH
SW-DIST(config-vlan)# exit
SW-DIST(config)# vlan 20
SW-DIST(config-vlan)# name IT
SW-DIST(config-vlan)# exit
SW-DIST(config)# vlan 30
SW-DIST(config-vlan)# name DIRECTION
SW-DIST(config-vlan)# exit
SW-DIST(config)# vlan 99
SW-DIST(config-vlan)# name GESTION
SW-DIST(config-vlan)# exit
SW-DIST(config)# interface gigabitethernet 0/1
SW-DIST(config-if)# switchport mode trunk
SW-DIST(config-if)# switchport trunk allowed vlan 10,20,30,99
SW-DIST(config-if)# switchport trunk native vlan 99
SW-DIST(config-if)# exit
SW-DIST(config)# interface gigabitethernet 0/24
SW-DIST(config-if)# switchport mode trunk
SW-DIST(config-if)# switchport trunk allowed vlan 10,20,30
SW-DIST(config-if)# exit
```

</details>

---

**2. Configurer SW-ACCESS (client VTP, ports access).**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS(config)# hostname SW-ACCESS
SW-ACCESS(config)# vtp domain ENTREPRISE
SW-ACCESS(config)# vtp mode client
SW-ACCESS(config)# interface range fastethernet 0/1 - 8
SW-ACCESS(config-if-range)# switchport mode access
SW-ACCESS(config-if-range)# switchport access vlan 10
SW-ACCESS(config-if-range)# exit
SW-ACCESS(config)# interface range fastethernet 0/9 - 16
SW-ACCESS(config-if-range)# switchport mode access
SW-ACCESS(config-if-range)# switchport access vlan 20
SW-ACCESS(config-if-range)# exit
```

</details>

---

**3. Configurer le routage inter-VLAN sur R1 (Router-on-a-Stick).**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface gigabitethernet 0/0.10
R1(config-subif)# encapsulation dot1q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0
R1(config-subif)# exit
R1(config)# interface gigabitethernet 0/0.20
R1(config-subif)# encapsulation dot1q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0
R1(config-subif)# exit
R1(config)# interface gigabitethernet 0/0.30
R1(config-subif)# encapsulation dot1q 30
R1(config-subif)# ip address 192.168.30.1 255.255.255.0
R1(config-subif)# exit
```

</details>

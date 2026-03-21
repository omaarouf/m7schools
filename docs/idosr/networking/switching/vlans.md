---
id: vlans
title: Configuration des VLANs
sidebar_label: Configuration des VLANs
---

> Comprendre et configurer les VLANs pour segmenter un reseau commuté : creation, assignation des ports, liaisons trunk, et routage inter-VLAN.

## 1. VTP (VLAN Trunking Protocol)

VTP permet de synchroniser automatiquement la base de donnees VLAN entre plusieurs switches d'un meme domaine.

### Modes VTP

| Mode | Description |
|---|---|
| `server` | Cree, modifie et supprime des VLANs — synchronise les clients |
| `client` | Recoit les VLANs du serveur — ne peut pas en creer |
| `transparent` | Ignore VTP — gere ses propres VLANs localement |

```bash title="Configuration VTP"
Switch(config)# vtp domain OFPPT
Switch(config)# vtp password ofppt123
Switch(config)# vtp mode server
Switch(config)# vtp version 2
Switch(config)# vtp pruning
```

```bash title="Vérification VTP"
Switch# show vtp status
```

:::warning
Avant de connecter un nouveau switch, verifier son numero de revision VTP. Un switch client avec un numero de revision plus eleve peut ecraser la base VLAN du serveur.
:::

---

## 2. Creation et gestion des VLANs

```bash title="Créer un VLAN et lui attribuer un nom"
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

```bash title="Supprimer un VLAN"
Switch(config)# no vlan 10
```

:::danger
Supprimer un VLAN ne desassigne pas automatiquement les ports — les ports resteront dans un VLAN inexistant et perdront toute connectivite. Reassigner les ports avant de supprimer un VLAN.
:::

---

## 3. Assignation des ports (mode access)

Un port en mode access appartient a un seul VLAN.

```bash title="Assigner un port à un VLAN"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# exit
```

```bash title="Assigner une plage de ports"
Switch(config)# interface range fastethernet 0/1 - 10
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# exit
```

### VLAN voix

Sur un port connecte a un telephone IP, deux VLANs coexistent : un VLAN donnees et un VLAN voix.

```bash title="Configurer un port avec VLAN voix"
Switch(config)# interface fastethernet 0/5
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20
Switch(config-if)# switchport voice vlan 150
Switch(config-if)# exit
```

---

## 4. Liaisons Trunk

Un port trunk transporte le trafic de plusieurs VLANs entre switches ou vers un routeur.

```bash title="Configurer un port trunk"
Switch(config)# interface gigabitethernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
Switch(config-if)# exit
```

```bash title="Ajouter un VLAN à la liste trunk"
Switch(config)# interface gigabitethernet 0/1
Switch(config-if)# switchport trunk allowed vlan add 40
Switch(config-if)# exit
```

:::info VLAN natif
Le VLAN natif (par defaut VLAN 1) est transporte sans tag 802.1Q sur un trunk. Il est recommande de le changer pour des raisons de securite :
```
Switch(config-if)# switchport trunk native vlan 99
```
:::

---

## 5. DTP (Dynamic Trunking Protocol)

DTP negocie automatiquement le mode trunk entre deux switches.

| Mode | Comportement |
|---|---|
| `dynamic desirable` | Tente activement de negocier le trunk |
| `dynamic auto` | Accepte le trunk si l'autre cote le demande |

```bash title="Configurer DTP"
Switch(config)# interface fastethernet 0/24
Switch(config-if)# switchport mode dynamic desirable
```

```bash title="Désactiver DTP (recommandé en production)"
Switch(config)# interface fastethernet 0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport nonegotiate
```

:::warning Securite
DTP peut etre exploite pour des attaques de type VLAN hopping. Toujours desactiver DTP sur les ports d'extremite avec `switchport nonegotiate`.
:::

---

## 6. Routage inter-VLAN

### Methode 1 — Router-on-a-Stick

Utilise une seule interface physique du routeur avec des sous-interfaces (subinterfaces). Chaque sous-interface est associee a un VLAN.

```bash title="Configuration du routeur (Router-on-a-Stick)"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# no shutdown
Router(config-if)# exit
Router(config)# interface gigabitethernet 0/0.10
Router(config-subif)# encapsulation dot1q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
Router(config-subif)# exit
Router(config)# interface gigabitethernet 0/0.20
Router(config-subif)# encapsulation dot1q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0
Router(config-subif)# exit
Router(config)# interface gigabitethernet 0/0.30
Router(config-subif)# encapsulation dot1q 30
Router(config-subif)# ip address 192.168.30.1 255.255.255.0
Router(config-subif)# exit
```

:::info
Le port du switch connecte au routeur doit etre configure en mode trunk pour transporter les VLANs 10, 20 et 30.
:::

### Methode 2 — Routage sur Switch Layer 3 (SVI)

Utilise un switch de couche 3 avec des interfaces virtuelles commutees (SVI). Plus performant car le routage est fait en materiel.

```bash title="Configuration du switch Layer 3"
Switch(config)# ip routing
Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit
Switch(config)# interface vlan 20
Switch(config-if)# ip address 192.168.20.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit
Switch(config)# interface vlan 30
Switch(config-if)# ip address 192.168.30.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit
```

### Comparaison des deux methodes

| Critere | Router-on-a-Stick | Switch Layer 3 (SVI) |
|---|---|---|
| Materiel requis | Routeur + Switch L2 | Switch Layer 3 uniquement |
| Performances | Limitees (goulot d'etranglement) | Elevees (routage materiel) |
| Scalabilite | Faible | Elevee |
| Cout | Moins cher | Plus cher |
| Usage | Lab / petits reseaux | Reseaux d'entreprise |

---

## 7. Verification

| Commande | Description |
|---|---|
| `show vlan brief` | Liste tous les VLANs et leurs ports access |
| `show interfaces trunk` | Interfaces trunk et VLANs autorises |
| `show interfaces switchport` | Mode et VLAN de chaque interface |
| `show vtp status` | Etat VTP du switch |
| `show dtp interface fa0/1` | Etat DTP d'une interface |

```bash title="Vérifications essentielles"
Switch# show vlan brief
Switch# show interfaces trunk
Switch# show interfaces fastethernet 0/1 switchport
```
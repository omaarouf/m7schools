---
id: stp
title: Spanning Tree Protocol (STP)
sidebar_label: Spanning Tree Protocol (STP)
---

> Comprendre le fonctionnement du Spanning Tree Protocol et le configurer pour eviter les boucles reseau tout en garantissant la redondance.

## 1. Pourquoi STP ?

Dans un reseau commuté redondant, plusieurs chemins existent entre les switches. Sans STP, ces boucles causent :

- Des **tempetes de diffusion** (broadcast storms) qui saturent le reseau
- Des **tables MAC instables** (le meme MAC appris sur plusieurs ports)
- Des **trames dupliquees** recues plusieurs fois par les hotes

STP desactive logiquement les liens redondants et les reactive automatiquement en cas de panne.

:::info
STP est defini par la norme **IEEE 802.1D**. Les versions ameliorees sont RSTP (802.1w) et MST (802.1s).
:::

---

## 2. Election du Root Bridge

STP elit un switch racine (Root Bridge) par VLAN. Tous les autres switches calculent le chemin le plus court vers ce root bridge.

**Criteres d'election (dans l'ordre) :**
1. Priorite la plus basse (par defaut : 32768)
2. En cas d'egalite : adresse MAC la plus basse

```bash title="Vérifier le Root Bridge actuel"
Switch# show spanning-tree vlan 10
Switch# show spanning-tree brief
```

---

## 3. Configurer la priorite STP

### Root Primary et Root Secondary

```bash title="Configurer un switch comme Root Primary"
Switch(config)# spanning-tree vlan 10 root primary
```

```bash title="Configurer un switch comme Root Secondary"
Switch(config)# spanning-tree vlan 10 root secondary
```

:::info
`root primary` force la priorite a **24576** (ou suffisamment basse pour gagner l'election).
`root secondary` fixe la priorite a **28672**.
:::

### Priorite manuelle

La priorite doit toujours etre un multiple de 4096.

```bash title="Configurer la priorité manuellement"
Switch(config)# spanning-tree vlan 10 priority 4096
```

| Valeur | Usage typique |
|---|---|
| `0` | Root Bridge garanti |
| `4096` | Root Bridge prioritaire |
| `28672` | Root Bridge secondaire |
| `32768` | Valeur par defaut |

:::warning
Une priorite incorrecte (non multiple de 4096) sera rejetee par IOS.
:::

---

## 4. Modes STP

| Mode | Norme | Description |
|---|---|---|
| `pvst` | 802.1D | PVST+ : une instance STP par VLAN (Cisco) |
| `rapid-pvst` | 802.1w | Rapid PVST+ : convergence rapide (recommande) |
| `mst` | 802.1s | Multiple Spanning Tree : regroupe plusieurs VLANs |

```bash title="Basculer vers Rapid PVST+ (recommandé)"
Switch(config)# spanning-tree mode rapid-pvst
```

```bash title="Basculer vers MST"
Switch(config)# spanning-tree mode mst
```

:::tip
En production, utiliser **Rapid PVST+** — il converge en quelques secondes contre 30 a 50 secondes pour PVST+ classique.
:::

---

## 5. PortFast

PortFast place immediatement un port en etat forwarding sans passer par les etats STP (Listening, Learning). A utiliser uniquement sur les ports connectes a des equipements terminaux (PC, imprimantes).

```bash title="Activer PortFast sur un port access"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# spanning-tree portfast
Switch(config-if)# exit
```

```bash title="Activer PortFast globalement sur tous les ports access"
Switch(config)# spanning-tree portfast default
```

:::danger Ne jamais activer PortFast sur un port trunk
Si un switch est connecte a un port PortFast, des boucles peuvent se former immediatement. PortFast est reserve aux ports d'extremite uniquement.
:::

---

## 6. BPDUGuard

BPDUGuard desactive automatiquement un port PortFast si un BPDU est recu (ce qui signifie qu'un switch a ete connecte par erreur).

```bash title="Activer BPDUGuard sur un port"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# spanning-tree bpduguard enable
Switch(config-if)# exit
```

```bash title="Activer BPDUGuard globalement (sur tous les ports PortFast)"
Switch(config)# spanning-tree portfast bpduguard default
```

```bash title="Combinaison PortFast + BPDUGuard (recommandée)"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# spanning-tree portfast
Switch(config-if)# spanning-tree bpduguard enable
Switch(config-if)# exit
```

:::info Reactiver un port err-disabled
Quand BPDUGuard desactive un port, il passe en etat `err-disabled`. Pour le reactiver :
```
Switch(config)# interface fastethernet 0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
```
:::

---

## 7. Etats STP des ports

| Etat | Duree | Description |
|---|---|---|
| **Blocking** | — | Recoit les BPDUs, ne transmet pas de trames |
| **Listening** | 15 sec | Participe a l'election STP |
| **Learning** | 15 sec | Apprend les adresses MAC |
| **Forwarding** | — | Transmet normalement le trafic |
| **Disabled** | — | Port desactive administrativement |

:::info Rapid PVST+
Avec Rapid PVST+, les etats Listening et Learning sont quasi instantanes — la convergence passe de ~50 secondes a 1-2 secondes.
:::

---

## 8. Verification

| Commande | Description |
|---|---|
| `show spanning-tree` | STP de tous les VLANs |
| `show spanning-tree vlan 10` | STP d'un VLAN specifique |
| `show spanning-tree brief` | Vue resumee |
| `show spanning-tree interface fa0/1` | STP sur une interface |

```bash title="Vérifications essentielles"
Switch# show spanning-tree vlan 10
Switch# show spanning-tree brief
Switch# show spanning-tree interface fastethernet 0/1
```
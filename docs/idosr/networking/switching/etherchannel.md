---
id: etherchannel
title: EtherChannel
sidebar_label: EtherChannel
---

> Regrouper plusieurs liens physiques en un seul lien logique pour augmenter la bande passante et assurer la redondance entre switches.

## 1. Principe de l'EtherChannel

L'EtherChannel (aussi appele Link Aggregation) combine 2 a 8 interfaces physiques en une seule interface logique appelee **Port-Channel**.

**Avantages :**
- Bande passante agregee (ex: 4 x 1 Gbps = 4 Gbps logique)
- Redondance — si un lien tombe, le trafic bascule sur les autres
- STP voit le Port-Channel comme un seul lien — pas de blocage

:::info
Tous les ports d'un EtherChannel doivent avoir la meme vitesse, le meme mode duplex et la meme configuration VLAN.
:::

---

## 2. Protocoles de negociation

| Protocole | Standard | Modes |
|---|---|---|
| **PAgP** | Cisco propriétaire | `desirable` (actif) / `auto` (passif) |
| **LACP** | IEEE 802.3ad (ouvert) | `active` (actif) / `passive` (passif) |
| **Static** | Aucun | `on` (force sans negociation) |

:::tip Recommandation
Utiliser **LACP** — c'est un standard ouvert compatible avec tous les equipements reseau.
:::

---

## 3. Configuration PAgP

PAgP est le protocole proprietaire Cisco.

```bash title="EtherChannel PAgP — mode desirable (actif)"
Switch(config)# interface range fastethernet 0/1 - 2
Switch(config-if-range)# channel-group 1 mode desirable
Switch(config-if-range)# no shutdown
Switch(config-if-range)# exit
```

```bash title="EtherChannel PAgP — mode auto (passif)"
Switch(config)# interface range fastethernet 0/3 - 4
Switch(config-if-range)# channel-group 2 mode auto
Switch(config-if-range)# no shutdown
Switch(config-if-range)# exit
```

:::info Compatibilite PAgP
| Switch A | Switch B | Resultat |
|---|---|---|
| `desirable` | `desirable` | EtherChannel forme |
| `desirable` | `auto` | EtherChannel forme |
| `auto` | `auto` | Pas d'EtherChannel |
:::

---

## 4. Configuration LACP

LACP est le standard IEEE 802.3ad, compatible avec tous les constructeurs.

```bash title="EtherChannel LACP — mode active (actif)"
Switch(config)# interface range fastethernet 0/1 - 2
Switch(config-if-range)# channel-group 1 mode active
Switch(config-if-range)# no shutdown
Switch(config-if-range)# exit
```

```bash title="EtherChannel LACP — mode passive (passif)"
Switch(config)# interface range fastethernet 0/3 - 4
Switch(config-if-range)# channel-group 2 mode passive
Switch(config-if-range)# no shutdown
Switch(config-if-range)# exit
```

:::info Compatibilite LACP
| Switch A | Switch B | Resultat |
|---|---|---|
| `active` | `active` | EtherChannel forme |
| `active` | `passive` | EtherChannel forme |
| `passive` | `passive` | Pas d'EtherChannel |
:::

---

## 5. Configuration du Port-Channel

Apres la creation de l'EtherChannel, configurer l'interface logique Port-Channel.

```bash title="Configurer le Port-Channel en mode trunk"
Switch(config)# interface port-channel 1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
Switch(config-if)# exit
```

```bash title="Configurer le Port-Channel avec VLAN natif"
Switch(config)# interface port-channel 1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk native vlan 99
Switch(config-if)# exit
```

:::warning
La configuration du Port-Channel s'applique automatiquement a tous les ports membres. Ne pas configurer les ports physiques individuellement apres creation du groupe — cela provoquerait des incoherences.
:::

---

## 6. Comparaison PAgP vs LACP vs Static

| Critere | PAgP | LACP | Static (`on`) |
|---|---|---|---|
| Standard | Cisco uniquement | IEEE 802.3ad | Aucun |
| Negociation | Oui | Oui | Non |
| Interoperabilite | Cisco seulement | Tous constructeurs | Tous |
| Recommande | Lab Cisco | Production | Deconseille |

---

## 7. Verification

| Commande | Description |
|---|---|
| `show etherchannel summary` | Resume de tous les EtherChannels |
| `show etherchannel 1 detail` | Details du groupe 1 |
| `show interfaces port-channel 1` | Etat du Port-Channel |
| `show lacp neighbor` | Voisins LACP detectes |
| `show pagp neighbor` | Voisins PAgP detectes |

```bash title="Vérifications essentielles"
Switch# show etherchannel summary
Switch# show etherchannel 1 detail
Switch# show lacp neighbor
```

### Interpretation de `show etherchannel summary`

```
Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
        U - in use      f - failed to allocate aggregator

Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP      Fa0/1(P)  Fa0/2(P)
```

:::info Lecture des flags
- `SU` sur le Port-Channel : **S**witched (Layer 2) + **U**tilise — fonctionnel
- `P` sur les ports membres : **P**orte bundlee — incluse dans le groupe
- `D` : port down — probleme physique ou de configuration
:::
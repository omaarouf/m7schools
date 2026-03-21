---
id: hsrp
title: HSRP
sidebar_label: HSRP
---

> Configurer HSRP pour assurer la haute disponibilite de la passerelle par defaut en cas de panne d'un routeur.

## 1. Principe de HSRP

HSRP (Hot Standby Router Protocol) est un protocole Cisco de redondance de passerelle. Il permet a plusieurs routeurs de partager une adresse IP virtuelle — les hotes du reseau utilisent cette IP virtuelle comme passerelle par defaut.

**Fonctionnement :**
- Le routeur **Active** transmet tout le trafic
- Le routeur **Standby** surveille l'Active via des messages Hello
- Si l'Active tombe, le Standby prend le relais en quelques secondes
- Les hotes ne voient aucune interruption — la passerelle virtuelle reste la meme

:::info
HSRP est defini par la norme Cisco. Le standard ouvert equivalent est **VRRP** (Virtual Router Redundancy Protocol — RFC 5798).
:::

---

## 2. Configuration du routeur Active

```bash title="Configurer HSRP sur le routeur primaire (Active)"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip address 192.168.1.2 255.255.255.0
Router(config-if)# standby 1 ip 192.168.1.1
Router(config-if)# standby 1 priority 110
Router(config-if)# standby 1 preempt
Router(config-if)# no shutdown
Router(config-if)# exit
```

| Commande | Description |
|---|---|
| `standby 1 ip 192.168.1.1` | Adresse IP virtuelle du groupe HSRP 1 |
| `standby 1 priority 110` | Priorite (defaut 100) — plus elevee = prefere |
| `standby 1 preempt` | Reprend le role Active si priorite meilleure |

---

## 3. Configuration du routeur Standby

```bash title="Configurer HSRP sur le routeur secondaire (Standby)"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip address 192.168.1.3 255.255.255.0
Router(config-if)# standby 1 ip 192.168.1.1
Router(config-if)# standby 1 priority 90
Router(config-if)# no shutdown
Router(config-if)# exit
```

:::info
Les deux routeurs partagent la meme IP virtuelle (`192.168.1.1`). Chaque routeur a sa propre IP reelle (`192.168.1.2` et `192.168.1.3`).
:::

---

## 4. Preemption

Sans `preempt`, si le routeur Active tombe puis revient, il ne reprend pas automatiquement son role — le Standby reste Active.

```bash title="Activer la preemption"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# standby 1 preempt
Router(config-if)# exit
```

```bash title="Preemption avec délai (recommandé)"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# standby 1 preempt delay minimum 30
Router(config-if)# exit
```

:::tip
Configurer un delai de preemption (`delay minimum 30`) pour laisser le temps aux protocoles de routage de converger avant que le routeur reprenne le role Active.
:::

---

## 5. Timers HSRP

```bash title="Modifier les timers Hello et Hold"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# standby 1 timers 2 6
Router(config-if)# exit
```

| Timer | Defaut | Description |
|---|---|---|
| Hello | 3 sec | Intervalle d'envoi des messages Hello |
| Hold | 10 sec | Delai avant de declarer l'Active comme indisponible |

:::warning
Les timers doivent etre identiques sur tous les routeurs du meme groupe HSRP.
:::

---

## 6. HSRP version 2

HSRP v2 supporte IPv6, les groupes de 0 a 4095 (vs 0 a 255 pour v1) et utilise un multicast different.

```bash title="Activer HSRP version 2"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# standby version 2
Router(config-if)# standby 1 ip 192.168.1.1
Router(config-if)# standby 1 priority 110
Router(config-if)# standby 1 preempt
Router(config-if)# exit
```

| Critere | HSRP v1 | HSRP v2 |
|---|---|---|
| Groupes | 0 — 255 | 0 — 4095 |
| Multicast | 224.0.0.2 | 224.0.0.102 |
| IPv6 | Non | Oui |
| MAC virtuelle | 0000.0c07.acXX | 0000.0c9f.fXXX |

---

## 7. Etats HSRP

| Etat | Description |
|---|---|
| `Initial` | HSRP vient de demarrer |
| `Learn` | En attente de l'IP virtuelle |
| `Listen` | Recoit les Hello mais n'est ni Active ni Standby |
| `Speak` | Participe a l'election |
| `Standby` | Routeur de secours — surveille l'Active |
| `Active` | Transmet le trafic pour l'IP virtuelle |

---

## 8. Verification

| Commande | Description |
|---|---|
| `show standby` | Etat detaille de tous les groupes HSRP |
| `show standby brief` | Resume des groupes HSRP |
| `show standby gigabitethernet 0/0` | HSRP sur une interface specifique |

```bash title="Vérifications essentielles"
Router# show standby
Router# show standby brief
```

### Lecture de `show standby brief`

```
                     P indicates configured to preempt.
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Gi0/0       1    110 P Active   local           192.168.1.3     192.168.1.1
```

| Colonne | Description |
|---|---|
| `Grp` | Numero du groupe HSRP |
| `Pri` | Priorite configuree |
| `P` | Preemption activee |
| `State` | Etat HSRP (Active / Standby) |
| `Active` | IP du routeur Active (`local` = ce routeur) |
| `Virtual IP` | Adresse IP virtuelle partagee |

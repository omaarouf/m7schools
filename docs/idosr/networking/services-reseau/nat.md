---
id: nat
title: NAT & PAT
sidebar_label: NAT & PAT
---

> Configurer la traduction d'adresses reseau sur un routeur Cisco pour permettre aux reseaux prives d'acceder a Internet.

## 1. Principe de NAT

NAT (Network Address Translation) traduit les adresses IP privees en adresses IP publiques. Il permet a plusieurs hotes d'un reseau prive de partager une ou plusieurs adresses IP publiques.

**Terminologie NAT :**

| Terme | Description |
|---|---|
| **Inside Local** | Adresse IP privee de l'hote interne |
| **Inside Global** | Adresse IP publique representant l'hote interne |
| **Outside Local** | Adresse IP vue depuis l'interieur pour un hote externe |
| **Outside Global** | Adresse IP reelle de l'hote externe |

### Types de NAT

| Type | Traduction | Usage |
|---|---|---|
| **NAT Statique** | 1 IP privee ↔ 1 IP publique fixe | Serveurs accessibles depuis Internet |
| **NAT Dynamique** | N IP privees ↔ pool d'IP publiques | Groupes d'utilisateurs |
| **PAT (NAT Overload)** | N IP privees ↔ 1 seule IP publique | Acces Internet standard |

---

## 2. NAT Statique (1-to-1)

Chaque hote interne a une adresse publique fixe dediee. Utilise pour les serveurs web, mail, etc.

```bash title="Configurer une entrée NAT statique"
Router(config)# ip nat inside source static 192.168.1.10 200.1.1.10
Router(config)# ip nat inside source static 192.168.1.20 200.1.1.20
```

```bash title="Appliquer NAT sur les interfaces"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip nat inside
Router(config-if)# exit

Router(config)# interface serial 0/0/0
Router(config-if)# ip nat outside
Router(config-if)# exit
```

:::warning inside vs outside
- `ip nat inside` : interface connectee au reseau **prive** (LAN)
- `ip nat outside` : interface connectee au reseau **public** (Internet/ISP)
Ces deux marqueurs sont obligatoires — sans eux, NAT ne fonctionne pas.
:::

---

## 3. NAT Dynamique (Many-to-Many)

Un pool d'adresses publiques est utilise. Chaque hote interne recoit une adresse publique differente du pool a la demande.

```bash title="Étape 1 — ACL définissant les hôtes à traduire"
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255
```

```bash title="Étape 2 — Créer le pool d'adresses publiques"
Router(config)# ip nat pool PUBLIC_POOL 200.1.1.1 200.1.1.10 netmask 255.255.255.0
```

```bash title="Étape 3 — Lier l'ACL au pool"
Router(config)# ip nat inside source list 1 pool PUBLIC_POOL
```

```bash title="Étape 4 — Appliquer sur les interfaces"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip nat inside
Router(config-if)# exit

Router(config)# interface serial 0/0/0
Router(config-if)# ip nat outside
Router(config-if)# exit
```

:::info
Si le pool est epuise (toutes les adresses publiques sont utilisees), les nouvelles connexions sont refusees jusqu'a la liberation d'une adresse.
:::

---

## 4. PAT — Port Address Translation (NAT Overload)

PAT traduit plusieurs adresses privees vers une seule adresse publique en utilisant des numeros de port differents. C'est la methode la plus utilisee pour l'acces Internet.

### PAT avec l'adresse de l'interface

```bash title="PAT avec l'adresse IP de l'interface WAN"
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255
Router(config)# ip nat inside source list 1 interface serial 0/0/0 overload
```

```bash title="Appliquer sur les interfaces"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip nat inside
Router(config-if)# exit

Router(config)# interface serial 0/0/0
Router(config-if)# ip nat outside
Router(config-if)# exit
```

### PAT avec un pool d'adresses

```bash title="PAT avec un pool d'adresses publiques"
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255
Router(config)# ip nat pool PAT_POOL 200.1.1.1 200.1.1.5 netmask 255.255.255.0
Router(config)# ip nat inside source list 1 pool PAT_POOL overload
```

:::info Le mot cle overload
`overload` active PAT — sans ce mot cle, c'est du NAT dynamique classique (1 IP privee = 1 IP publique). Avec `overload`, des milliers d'hotes partagent une seule IP publique via des ports differents.
:::

---

## 5. Comparaison NAT Statique / Dynamique / PAT

| Critere | Statique | Dynamique | PAT |
|---|---|---|---|
| Rapport adresses | 1:1 | N:N | N:1 |
| IP publiques requises | 1 par hote | 1 par hote actif | 1 seule |
| Persistance | Permanente | Temporaire | Temporaire |
| Direction | Entrant + Sortant | Sortant uniquement | Sortant uniquement |
| Usage | Serveurs | Groupes | Acces Internet |

---

## 6. Verification

| Commande | Description |
|---|---|
| `show ip nat translations` | Toutes les traductions NAT actives |
| `show ip nat statistics` | Statistiques NAT |
| `show running-config \| include nat` | Configuration NAT |
| `debug ip nat` | Traductions en temps reel |
| `clear ip nat translation *` | Effacer toutes les traductions |

```bash title="Vérifications essentielles"
Router# show ip nat translations
Router# show ip nat statistics
```

### Lecture de `show ip nat translations`

```
Pro  Inside global     Inside local       Outside local      Outside global
tcp  200.1.1.1:1025   192.168.1.10:1025  8.8.8.8:53         8.8.8.8:53
tcp  200.1.1.1:1026   192.168.1.20:1026  8.8.8.8:80         8.8.8.8:80
---  200.1.1.10        192.168.1.30       ---                ---
```

| Colonne | Description |
|---|---|
| `Inside local` | Adresse IP privee de l'hote interne |
| `Inside global` | Adresse IP publique apres traduction |
| `Outside global` | Adresse IP du serveur distant |
| `Pro` | Protocole (tcp, udp) + port source |

:::tip
Une entree sans port (`---`) est une traduction NAT statique ou dynamique sans PAT. Une entree avec port (`:1025`) est une traduction PAT.
:::

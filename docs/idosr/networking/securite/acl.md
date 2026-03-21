---
id: acl
title: Access Control Lists (ACL)
sidebar_label: ACL
---

> Filtrer le trafic reseau sur un routeur Cisco en utilisant des listes de controle d'acces standard et etendues.

## 1. Principe des ACL

Une ACL est une liste de regles qui autorisent ou refusent le trafic reseau en fonction de criteres definis. Les ACL sont appliquees sur les interfaces des routeurs.

**Utilisations principales :**
- Filtrage du trafic entrant et sortant
- Restriction d'acces aux ressources reseau
- Controle de la qualite de service (QoS)
- Securisation des acces VTY (SSH/Telnet)

:::warning Regle implicite
Toute ACL se termine par un **deny any implicite** — tout trafic non explicitement autorise est bloque. Toujours ajouter une regle `permit any` si necessaire.
:::

---

## 2. Types d'ACL

| Type | Numero | Criteres de filtrage | Placement recommande |
|---|---|---|---|
| **Standard** | 1 — 99 | Adresse IP source uniquement | Pres de la destination |
| **Etendue** | 100 — 199 | Source, destination, protocole, port | Pres de la source |

:::tip Placement des ACL
- **ACL standard** : placer pres de la **destination** (filtre uniquement sur la source — bloquer trop tot couperait tout le trafic)
- **ACL etendue** : placer pres de la **source** (filtre precis — bloque le trafic le plus tot possible)
:::

---

## 3. ACL Standard Numerotee

```bash title="Créer une ACL standard numérotée"
Router(config)# access-list 10 permit 192.168.1.0 0.0.0.255
Router(config)# access-list 10 deny host 192.168.1.50
Router(config)# access-list 10 permit any
```

```bash title="Appliquer l'ACL sur une interface"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip access-group 10 in
Router(config-if)# exit
```

:::info Masque inverse (wildcard)
Le masque inverse est utilise dans les ACL pour definir les bits a ignorer :
- `0.0.0.255` → les 24 premiers bits doivent correspondre (reseau /24)
- `0.0.0.0` → tous les bits doivent correspondre (host unique) — equivalent de `host`
- `255.255.255.255` → aucun bit ne doit correspondre — equivalent de `any`
:::

---

## 4. ACL Standard Nommee

Les ACL nommees sont plus lisibles et permettent de supprimer des regles individuellement.

```bash title="Créer une ACL standard nommée"
Router(config)# ip access-list standard AUTORISER_LAN
Router(config-std-nacl)# permit 192.168.1.0 0.0.0.255
Router(config-std-nacl)# permit 192.168.2.0 0.0.0.255
Router(config-std-nacl)# deny any
Router(config-std-nacl)# exit
```

```bash title="Appliquer l'ACL nommée"
Router(config)# interface gigabitethernet 0/1
Router(config-if)# ip access-group AUTORISER_LAN out
Router(config-if)# exit
```

---

## 5. ACL Etendue Numerotee

Les ACL etendues filtrent sur la source, la destination, le protocole et le port.

```bash title="Créer une ACL étendue numérotée"
Router(config)# access-list 100 permit tcp 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255 eq 80
Router(config)# access-list 100 permit tcp 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255 eq 443
Router(config)# access-list 100 deny icmp any any
Router(config)# access-list 100 permit ip any any
```

```bash title="Appliquer l'ACL étendue"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip access-group 100 in
Router(config-if)# exit
```

### Ports courants

| Port | Service |
|---|---|
| `20 / 21` | FTP |
| `22` | SSH |
| `23` | Telnet |
| `25` | SMTP |
| `53` | DNS |
| `67 / 68` | DHCP |
| `80` | HTTP |
| `443` | HTTPS |

---

## 6. ACL Etendue Nommee

```bash title="Créer une ACL étendue nommée"
Router(config)# ip access-list extended FILTRAGE_TRAFIC
Router(config-ext-nacl)# permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 22
Router(config-ext-nacl)# permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 80
Router(config-ext-nacl)# permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 443
Router(config-ext-nacl)# deny ip any any
Router(config-ext-nacl)# exit
```

```bash title="Appliquer l'ACL étendue nommée"
Router(config)# interface serial 0/0/0
Router(config-if)# ip access-group FILTRAGE_TRAFIC out
Router(config-if)# exit
```

---

## 7. Direction in vs out

| Direction | Description |
|---|---|
| `in` | Filtre le trafic **entrant** sur l'interface (avant le routage) |
| `out` | Filtre le trafic **sortant** de l'interface (apres le routage) |

:::tip
Une seule ACL par interface par direction. Il est possible d'avoir une ACL `in` et une ACL `out` sur la meme interface.
:::

---

## 8. Securiser l'acces VTY avec une ACL

```bash title="Restreindre l'accès SSH aux seuls hôtes autorisés"
Router(config)# access-list 5 permit 192.168.1.0 0.0.0.255
Router(config)# line vty 0 4
Router(config-line)# access-class 5 in
Router(config-line)# exit
```

:::info access-class vs access-group
- `ip access-group` s'applique sur une interface physique
- `access-class` s'applique sur les lignes VTY (acces SSH/Telnet)
:::

---

## 9. Modifier une ACL nommee

Avec les ACL nommees, il est possible de supprimer une regle individuelle sans effacer toute l'ACL.

```bash title="Supprimer une règle spécifique"
Router(config)# ip access-list extended FILTRAGE_TRAFIC
Router(config-ext-nacl)# no permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 23
Router(config-ext-nacl)# exit
```

```bash title="Ajouter une règle avec numéro de séquence"
Router(config)# ip access-list extended FILTRAGE_TRAFIC
Router(config-ext-nacl)# 15 permit udp 10.0.0.0 0.0.0.255 any eq 53
Router(config-ext-nacl)# exit
```

---

## 10. Verification

| Commande | Description |
|---|---|
| `show access-lists` | Toutes les ACL avec compteurs |
| `show access-lists 10` | ACL numerotee specifique |
| `show ip access-lists` | ACL IP uniquement |
| `show ip interface gi0/0` | ACL appliquees sur une interface |
| `show running-config \| include access` | ACL dans la config |

```bash title="Vérifications essentielles"
Router# show access-lists
Router# show ip interface gigabitethernet 0/0
```

### Lecture de `show access-lists`

```
Extended IP access list FILTRAGE_TRAFIC
    10 permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 22 (15 matches)
    20 permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 80 (243 matches)
    30 deny ip any any (5 matches)
```

:::tip Compteurs de correspondances
Les compteurs `(X matches)` indiquent combien de paquets ont correspondu a chaque regle — utile pour le diagnostic et la verification que les regles fonctionnent correctement.
:::

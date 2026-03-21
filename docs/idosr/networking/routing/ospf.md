---
id: ospf
title: OSPF & OSPFv3
sidebar_label: OSPF & OSPFv3
---

> Configurer OSPF pour IPv4 et OSPFv3 pour IPv6 — un protocole de routage a etat de lien adapte aux reseaux d'entreprise de toute taille.

## 1. Presentation d'OSPF

OSPF (Open Shortest Path First) est un protocole de routage a etat de lien. Chaque routeur maintient une carte complete de la topologie reseau et calcule le chemin le plus court via l'algorithme Dijkstra (SPF).

| Caracteristique | Valeur |
|---|---|
| Type | Etat de lien (Link-State) |
| Metrique | Cout (basé sur la bande passante) |
| Mise a jour | Declenchee par evenement (pas periodique) |
| Distance administrative | 110 |
| Multicast | 224.0.0.5 (tous OSPF) / 224.0.0.6 (DR/BDR) |
| Standard | RFC 2328 |

---

## 2. Interface Loopback et Router-ID

Le Router-ID identifie uniquement chaque routeur OSPF. Il est choisi dans cet ordre : ID configure manuellement > IP loopback la plus haute > IP d'interface active la plus haute.

```bash title="Créer une interface loopback"
Router(config)# interface loopback 0
Router(config-if)# ip address 1.1.1.1 255.255.255.255
Router(config-if)# no shutdown
Router(config-if)# exit
```

```bash title="Configurer le Router-ID manuellement (recommandé)"
Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1
Router(config-router)# exit
```

:::tip
Toujours configurer le Router-ID manuellement — cela evite les changements d'ID au redemarrage si une interface disparait.
:::

---

## 3. Activation OSPF et annonce des reseaux

### Methode 1 — Commande network (classique)

```bash title="Activer OSPF et annoncer les réseaux"
Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1
Router(config-router)# network 192.168.1.0 0.0.0.255 area 0
Router(config-router)# network 192.168.2.0 0.0.0.255 area 0
Router(config-router)# network 10.0.0.0 0.0.0.255 area 10
Router(config-router)# exit
```

:::info Masque inverse (wildcard)
Le masque inverse est l'inverse du masque de sous-reseau :
- `/24` → `255.255.255.0` → wildcard `0.0.0.255`
- `/30` → `255.255.255.252` → wildcard `0.0.0.3`
- `/32` → `255.255.255.255` → wildcard `0.0.0.0`
:::

### Methode 2 — Activation sur interface

```bash title="Activer OSPF directement sur une interface"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip ospf 1 area 0
Router(config-if)# exit
```

---

## 4. Interface passive

```bash title="Ne pas envoyer de Hello OSPF sur une interface LAN"
Router(config)# router ospf 1
Router(config-router)# passive-interface gigabitethernet 0/0
Router(config-router)# exit
```

:::tip
Rendre passive toute interface connectee a un LAN sans autre routeur OSPF. Cela evite d'envoyer des Hello inutiles aux hotes.
:::

---

## 5. Modifier le cout OSPF

Le cout OSPF est calcule automatiquement : `cout = bande passante de reference / bande passante de l'interface`.

```bash title="Modifier la bande passante de référence (globalement)"
Router(config)# router ospf 1
Router(config-router)# auto-cost reference-bandwidth 1000
Router(config-router)# exit
```

:::warning
Par defaut, la bande passante de reference est 100 Mbps — toutes les interfaces >= 100 Mbps ont le meme cout (1). Changer la reference a 1000 Mbps (1 Gbps) pour differencier FastEthernet, GigabitEthernet et 10GigabitEthernet.
Appliquer ce changement sur **tous** les routeurs OSPF du domaine.
:::

```bash title="Modifier le coût manuellement sur une interface"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip ospf cost 50
Router(config-if)# exit
```

---

## 6. Type de reseau OSPF

```bash title="Configurer une liaison Serial en point-to-point"
Router(config)# interface serial 0/0/0
Router(config-if)# ip ospf network point-to-point
Router(config-if)# exit
```

:::info
Sur un reseau point-to-point, OSPF ne fait pas d'election DR/BDR — la convergence est plus rapide.
:::

---

## 7. Intervalles Hello et Dead

```bash title="Modifier les intervalles OSPF sur une interface"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip ospf hello-interval 10
Router(config-if)# ip ospf dead-interval 40
Router(config-if)# exit
```

:::warning
Les intervalles Hello et Dead doivent etre identiques sur les deux routeurs d'une meme liaison — sinon la relation de voisinage ne s'etablit pas.
:::

---

## 8. Redistribution et route par defaut

```bash title="Redistribuer les routes connectées dans OSPF"
Router(config)# router ospf 1
Router(config-router)# redistribute connected subnets
Router(config-router)# exit
```

```bash title="Redistribuer les routes statiques dans OSPF"
Router(config)# router ospf 1
Router(config-router)# redistribute static subnets
Router(config-router)# exit
```

```bash title="Annoncer la route par défaut via OSPF"
Router(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1
Router(config)# router ospf 1
Router(config-router)# default-information originate
Router(config-router)# exit
```

---

## 9. OSPFv3 — Configuration IPv6

OSPFv3 est la version d'OSPF pour IPv6. La configuration s'effectue directement sur les interfaces.

### Activer le routage IPv6

```bash title="Activer le routage IPv6"
Router(config)# ipv6 unicast-routing
```

### Interface Loopback pour OSPFv3

```bash title="Loopback IPv6 pour OSPFv3"
Router(config)# interface loopback 0
Router(config-if)# ipv6 address 2001:db8::1:1/128
Router(config-if)# no shutdown
Router(config-if)# exit
```

### Activer OSPFv3

```bash title="Créer le processus OSPFv3"
Router(config)# ipv6 router ospf 1
Router(config-rtr)# router-id 1.1.1.1
Router(config-rtr)# exit
```

:::info
Le Router-ID d'OSPFv3 garde le format IPv4 (ex: `1.1.1.1`) meme dans un environnement purement IPv6.
:::

### Configurer les interfaces

```bash title="Activer OSPFv3 sur les interfaces"
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ipv6 address 2001:db8:1::1/64
Router(config-if)# ipv6 ospf 1 area 0
Router(config-if)# no shutdown
Router(config-if)# exit

Router(config)# interface serial 0/0/0
Router(config-if)# ipv6 address 2001:db8:12::1/64
Router(config-if)# ipv6 ospf 1 area 0
Router(config-if)# no shutdown
Router(config-if)# exit
```

---

## 10. Comparaison OSPFv2 vs OSPFv3

| Critere | OSPFv2 | OSPFv3 |
|---|---|---|
| Version IP | IPv4 | IPv6 |
| Configuration reseaux | `network` sous `router ospf` | Sur chaque interface |
| Router-ID | Format IPv4 | Format IPv4 (obligatoire) |
| Authentification | MD5 dans OSPF | IPsec (integre IPv6) |
| Multicast | 224.0.0.5 / 224.0.0.6 | FF02::5 / FF02::6 |

---

## 11. Verification

| Commande | Description |
|---|---|
| `show ip ospf neighbors` | Liste des voisins OSPF |
| `show ip ospf database` | Base de donnees LSDB |
| `show ip route ospf` | Routes apprises via OSPF |
| `show ip ospf interface brief` | Resume des interfaces OSPF |
| `show ip ospf` | Parametres du processus OSPF |
| `show ipv6 ospf neighbors` | Voisins OSPFv3 |
| `show ipv6 route ospf` | Routes OSPFv3 |

```bash title="Vérifications essentielles"
Router# show ip ospf neighbors
Router# show ip route ospf
Router# show ip ospf interface brief
```

### Etats de voisinage OSPF

| Etat | Description |
|---|---|
| `DOWN` | Aucun Hello recu |
| `INIT` | Hello recu, pas encore bidirectionnel |
| `2-WAY` | Communication bidirectionnelle etablie |
| `EXSTART` | Debut de l'echange de la LSDB |
| `EXCHANGE` | Echange des DBD (Database Description) |
| `LOADING` | Demande des LSA manquants |
| `FULL` | Voisinage complet — synchronisation terminee |

:::tip
Un voisinage en etat `FULL` signifie que les deux routeurs ont la meme LSDB — le routage est operationnel.
:::

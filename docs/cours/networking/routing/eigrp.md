---
id: eigrp
title: EIGRP
sidebar_label: EIGRP
---

> Configurer EIGRP, le protocole de routage hybride Cisco, pour une convergence rapide et une gestion efficace des reseaux IPv4.

## 1. Presentation d'EIGRP

EIGRP (Enhanced Interior Gateway Routing Protocol) est un protocole de routage hybride developpe par Cisco. Il combine les avantages des protocoles a vecteur de distance et a etat de lien.

| Caracteristique | Valeur |
|---|---|
| Type | Hybride (vecteur de distance avance) |
| Metrique | Bande passante + delai (par defaut) |
| Mise a jour | Declenchee par evenement (partielle) |
| Distance administrative | 90 (interne) / 170 (externe) |
| Multicast | 224.0.0.10 |
| Convergence | Tres rapide (algorithme DUAL) |
| Standard | Propriete Cisco (ouvert depuis 2013) |

:::tip EIGRP vs OSPF
EIGRP converge plus rapidement qu'OSPF et est plus simple a configurer. Cependant, OSPF est prefere dans les environnements multi-constructeurs car il est un standard ouvert.
:::

---

## 2. Activer EIGRP

```bash title="Activer EIGRP (AS 10) et annoncer les réseaux"
Router(config)# router eigrp 10
Router(config-router)# no auto-summary
Router(config-router)# network 192.168.1.0 0.0.0.255
Router(config-router)# network 192.168.2.0 0.0.0.255
Router(config-router)# network 10.0.0.0 0.0.0.255
Router(config-router)# exit
```

:::warning Numero AS
Le numero AS (Autonomous System) doit etre identique sur tous les routeurs EIGRP qui doivent echanger des routes. Des AS differents ne forment pas de voisinage.
:::

:::info no auto-summary
Comme pour RIPv2, `no auto-summary` est obligatoire pour supporter le VLSM et eviter la summarisation automatique des routes.
:::

---

## 3. Router-ID EIGRP

EIGRP utilise un Router-ID pour identifier chaque routeur de maniere unique. La methode recommandee est de le definir via une interface loopback.

```bash title="Definir le Router-ID via loopback"
Router(config)# interface loopback 0
Router(config-if)# ip address 1.1.1.1 255.255.255.255
Router(config-if)# no shutdown
Router(config-if)# exit
```

L'adresse loopback la plus haute sera automatiquement utilisee comme Router-ID. Pour le forcer manuellement dans les versions recentes :

```bash title="Forcer le Router-ID manuellement"
Router(config)# router eigrp 10
Router(config-router)# eigrp router-id 1.1.1.1
Router(config-router)# exit
```

---

## 4. Interface passive

```bash title="Désactiver les Hello EIGRP sur une interface LAN"
Router(config)# router eigrp 10
Router(config-router)# passive-interface gigabitethernet 0/0
Router(config-router)# exit
```

:::tip
Utiliser `passive-interface default` pour rendre toutes les interfaces passives, puis activer EIGRP uniquement sur les interfaces qui connectent a d'autres routeurs :
```
Router(config-router)# passive-interface default
Router(config-router)# no passive-interface serial 0/0/0
```
:::

---

## 5. Redistribution de la route par defaut

```bash title="Annoncer la route par défaut via EIGRP"
Router(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1
Router(config)# router eigrp 10
Router(config-router)# redistribute static
Router(config-router)# exit
```

---

## 6. Tables EIGRP

EIGRP maintient trois tables distinctes :

| Table | Description |
|---|---|
| **Table de voisinage** | Liste des routeurs EIGRP adjacents |
| **Table de topologie** | Toutes les routes connues avec leurs metriques |
| **Table de routage** | Routes installees (successeurs uniquement) |

### Termes cles EIGRP

| Terme | Definition |
|---|---|
| **Successeur** | Meilleur chemin vers une destination (installe dans la table de routage) |
| **Successeur feasible** | Chemin de secours pre-calcule (bascule instantane si le successeur tombe) |
| **FD (Feasible Distance)** | Metrique totale du successeur depuis le routeur local |
| **AD (Advertised Distance)** | Metrique annoncee par le voisin vers la destination |

---

## 7. Verification

| Commande | Description |
|---|---|
| `show ip eigrp neighbors` | Liste des voisins EIGRP |
| `show ip eigrp topology` | Table de topologie complete |
| `show ip eigrp topology all-links` | Toutes les routes dont les successeurs feasibles |
| `show ip route eigrp` | Routes installees via EIGRP |
| `show ip protocols` | Parametres EIGRP actifs |

```bash title="Vérifications essentielles"
Router# show ip eigrp neighbors
Router# show ip route eigrp
Router# show ip eigrp topology
```

### Lecture de `show ip eigrp neighbors`

```
IP-EIGRP neighbors for process 10
H   Address         Interface   Hold  Uptime   SRTT   RTO   Q   Seq
                                (sec)           (ms)         Cnt  Num
0   192.168.1.2     Gi0/0         14  00:05:23    5   200   0   12
```

| Colonne | Description |
|---|---|
| `H` | Numero de sequence du voisin |
| `Address` | Adresse IP du voisin |
| `Hold` | Temps restant avant timeout (reinitialise a chaque Hello) |
| `SRTT` | Temps aller-retour moyen |
| `Q Cnt` | Nombre de paquets en attente (0 = normal) |

:::info
`Q Cnt` different de 0 peut indiquer un probleme de connexion avec le voisin.
:::

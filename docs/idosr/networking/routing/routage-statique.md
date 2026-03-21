---
id: routage-statique
title: Routage Statique
sidebar_label: Routage Statique
---

> Configurer manuellement les routes sur un routeur Cisco pour diriger le trafic IPv4 vers les reseaux de destination.

## 1. Principe du routage statique

Une route statique est une entree manuelle dans la table de routage. Le routeur ne l'apprend pas dynamiquement — c'est l'administrateur qui la definit.

**Avantages :**
- Simple a configurer sur de petits reseaux
- Aucune surcharge de bande passante (pas de protocole de routage)
- Comportement previsible et controle

**Inconvenients :**
- Non scalable sur de grands reseaux
- Pas d'adaptation automatique aux pannes
- Maintenance manuelle

---

## 2. Route statique simple

```bash title="Syntaxe"
Router(config)# ip route [reseau_dest] [masque] [next-hop ou interface]
```

```bash title="Route statique vers un réseau via next-hop"
Router(config)# ip route 192.168.2.0 255.255.255.0 192.168.1.2
```

```bash title="Route statique via interface de sortie"
Router(config)# ip route 192.168.2.0 255.255.255.0 serial 0/0/0
```

:::info Next-hop vs Interface de sortie
Sur une liaison point-a-point (Serial), les deux methodes fonctionnent. Sur une liaison Ethernet (multi-acces), toujours specifier le next-hop IP — sinon le routeur doit faire une resolution ARP pour chaque destination.
:::

---

## 3. Route par defaut

La route par defaut capture tout le trafic qui ne correspond a aucune route specifique. Elle est indispensable pour l'acces a Internet.

```bash title="Route par défaut (gateway of last resort)"
Router(config)# ip route 0.0.0.0 0.0.0.0 192.168.1.1
```

```bash title="Vérifier la route par défaut"
Router# show ip route
```

La route par defaut apparait dans la table de routage avec le marqueur `S*` :

```
Gateway of last resort is 192.168.1.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 192.168.1.1
```

---

## 4. Route statique flottante

Une route flottante est une route de secours avec une distance administrative plus elevee. Elle n'est activee que si la route principale disparait.

```bash title="Route principale (distance administrative par défaut = 1)"
Router(config)# ip route 192.168.2.0 255.255.255.0 192.168.1.2
```

```bash title="Route flottante (distance administrative = 150)"
Router(config)# ip route 192.168.2.0 255.255.255.0 192.168.3.2 150
```

:::info Distance administrative
La distance administrative (DA) mesure la fiabilite d'une source de routage. La route avec la DA la plus basse est preferee.

| Source | Distance administrative |
|---|---|
| Directement connecte | 0 |
| Route statique | 1 |
| EIGRP | 90 |
| OSPF | 110 |
| RIP | 120 |
| Route flottante | 150+ (definie manuellement) |
:::

---

## 5. Routes statiques IPv6

```bash title="Activer le routage IPv6"
Router(config)# ipv6 unicast-routing
```

```bash title="Route statique IPv6"
Router(config)# ipv6 route 2001:db8:2::/64 2001:db8:1::2
```

```bash title="Route par défaut IPv6"
Router(config)# ipv6 route ::/0 2001:db8:1::1
```

---

## 6. Verification

| Commande | Description |
|---|---|
| `show ip route` | Table de routage complete |
| `show ip route static` | Routes statiques uniquement |
| `show ip route 192.168.2.0` | Detail d'une route specifique |
| `show running-config \| include ip route` | Routes dans la config |

```bash title="Vérifications essentielles"
Router# show ip route
Router# show ip route static
```

### Lecture de la table de routage

```
     192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
C       192.168.1.0/24 is directly connected, GigabitEthernet0/0
L       192.168.1.1/32 is directly connected, GigabitEthernet0/0
S    192.168.2.0/24 [1/0] via 192.168.1.2
S*   0.0.0.0/0 [1/0] via 10.0.0.1
```

| Code | Signification |
|---|---|
| `C` | Reseau directement connecte |
| `L` | Adresse IP locale de l'interface |
| `S` | Route statique |
| `S*` | Route statique par defaut |
| `[1/0]` | Distance administrative / Metrique |

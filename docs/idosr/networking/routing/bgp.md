---
id: bgp
title: BGP
sidebar_label: BGP
---

> Configurer BGP pour echanger des routes entre systemes autonomes — le protocole de routage qui fait fonctionner Internet.

## 1. Presentation de BGP

BGP (Border Gateway Protocol) est le protocole de routage inter-domaines utilise sur Internet. Il echange des routes entre Systemes Autonomes (AS) distincts.

| Caracteristique | Valeur |
|---|---|
| Type | Vecteur de chemin (Path Vector) |
| Metrique | Attributs multiples (AS-PATH, LOCAL_PREF, MED...) |
| Transport | TCP port 179 |
| Distance administrative | 20 (eBGP) / 200 (iBGP) |
| Mise a jour | Declenchee par evenement |
| Standard | RFC 4271 |

### eBGP vs iBGP

| Type | Description | Distance AD |
|---|---|---|
| **eBGP** | Entre deux AS differents | 20 |
| **iBGP** | A l'interieur du meme AS | 200 |

:::info Quand utiliser BGP ?
BGP est utilise pour connecter un reseau d'entreprise a un ou plusieurs fournisseurs d'acces Internet (ISP). Pour le routage interne, utiliser OSPF ou EIGRP.
:::

---

## 2. Configuration eBGP

```bash title="Activer BGP et configurer les voisins eBGP"
Router(config)# router bgp 65001
Router(config-router)# neighbor 192.168.1.2 remote-as 65002
Router(config-router)# neighbor 192.168.1.3 remote-as 65003
Router(config-router)# network 192.168.10.0 mask 255.255.255.0
Router(config-router)# network 10.0.0.0 mask 255.0.0.0
Router(config-router)# exit
```

:::info Numeros AS
Les numeros AS sont divises en deux categories :
- **AS publics** : 1 — 64511 (assignes par l'IANA/RIR)
- **AS prives** : 64512 — 65535 (usage interne, non routes sur Internet)
:::

---

## 3. Configuration iBGP

Les voisins iBGP sont dans le meme AS. Il est recommande d'utiliser les interfaces loopback pour la stabilite de la session.

```bash title="Configurer des voisins iBGP"
Router(config)# router bgp 65001
Router(config-router)# neighbor 10.0.0.2 remote-as 65001
Router(config-router)# neighbor 10.0.0.2 update-source loopback 0
Router(config-router)# neighbor 10.0.0.3 remote-as 65001
Router(config-router)# neighbor 10.0.0.3 update-source loopback 0
Router(config-router)# exit
```

:::tip Loopback pour iBGP
Utiliser les interfaces loopback comme source pour les sessions iBGP — la session reste stable meme si une interface physique tombe (tant qu'une route vers le loopback existe).
:::

---

## 4. Annoncer des reseaux

```bash title="Annoncer des réseaux dans BGP"
Router(config)# router bgp 65001
Router(config-router)# network 192.168.10.0 mask 255.255.255.0
Router(config-router)# network 172.16.0.0 mask 255.255.0.0
Router(config-router)# exit
```

:::warning
BGP annonce uniquement les reseaux qui existent dans la table de routage. S'assurer que le reseau est present (via une route statique ou un protocole IGP) avant de l'annoncer.
:::

---

## 5. Route par defaut via BGP

```bash title="Annoncer la route par défaut à un voisin BGP"
Router(config)# router bgp 65001
Router(config-router)# neighbor 192.168.1.2 default-originate
Router(config-router)# exit
```

---

## 6. Attributs BGP principaux

BGP utilise des attributs pour selectionner le meilleur chemin :

| Attribut | Description | Preference |
|---|---|---|
| **Weight** | Cisco proprietaire — local au routeur | Plus eleve = prefere |
| **LOCAL_PREF** | Preference dans le meme AS | Plus eleve = prefere |
| **AS-PATH** | Liste des AS traverses | Plus court = prefere |
| **MED** | Metrique vers le voisin externe | Plus bas = prefere |

:::info
L'ordre de selection BGP suit la mnemonique : **W**e **L**ove **O**ranges **A**s **O**ranges **M**ean **P**ure **R**efreshment — Weight, Local_pref, Originated, AS-path, Origin, MED, Paths, Router-ID.
:::

---

## 7. Verification

| Commande | Description |
|---|---|
| `show ip bgp summary` | Resume des sessions BGP |
| `show ip bgp neighbors` | Details des voisins BGP |
| `show ip bgp` | Table BGP complete |
| `show ip route bgp` | Routes installees via BGP |
| `show ip bgp neighbors 192.168.1.2 advertised-routes` | Routes annoncees au voisin |
| `show ip bgp neighbors 192.168.1.2 received-routes` | Routes recues du voisin |

```bash title="Vérifications essentielles"
Router# show ip bgp summary
Router# show ip bgp
Router# show ip route bgp
```

### Lecture de `show ip bgp summary`

```
Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
192.168.1.2     4 65002      45      43        8    0    0 00:30:12        5
```

| Colonne | Description |
|---|---|
| `V` | Version BGP (4) |
| `AS` | Numero AS du voisin |
| `Up/Down` | Duree de la session |
| `State/PfxRcd` | Etat ou nombre de prefixes recus |

:::info Etats BGP
Si `State/PfxRcd` affiche un mot (ex: `Active`, `Idle`) plutot qu'un nombre, la session n'est pas etablie :
- `Idle` : BGP ne tente pas de connexion
- `Active` : BGP tente d'etablir la session TCP — voisin injoignable
- Un nombre (ex: `5`) : session etablie, 5 prefixes recus
:::

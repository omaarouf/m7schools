---
id: vpn
title: VPN
sidebar_label: VPN
---

> Configurer des tunnels VPN sur un routeur Cisco pour interconnecter des sites distants de maniere securisee via Internet.

## 1. Principe du VPN

Un VPN (Virtual Private Network) cree un tunnel logique chiffre entre deux sites distants via un reseau public (Internet). Les donnees transitent de maniere securisee comme si les deux sites etaient directement connectes.

| Type | Protocole | Chiffrement | Usage |
|---|---|---|---|
| **GRE** | IP proto 47 | Non (encapsulation uniquement) | Interconnexion de sites avec routage |
| **IPsec** | ESP / AH | Oui (AES, 3DES) | Securisation du trafic |
| **GRE over IPsec** | GRE + ESP | Oui | Routage dynamique + securite |

:::tip GRE + IPsec
GRE seul n'offre pas de chiffrement. IPsec seul ne supporte pas le routage dynamique (OSPF, EIGRP). La combinaison GRE over IPsec est la solution la plus complete.
:::

---

## 2. Tunnel GRE

GRE (Generic Routing Encapsulation) encapsule n'importe quel protocole de couche 3 dans un tunnel IP. Il permet de faire passer du routage dynamique entre deux sites distants.

### Topologie de reference

```
[Site A]──192.168.1.0/24──[R1: 200.1.1.1]═══Internet═══[R2: 200.1.1.2]──192.168.2.0/24──[Site B]
                                          tunnel 10.0.0.0/30
```

### Configuration Routeur 1 (R1)

```bash title="Créer le tunnel GRE sur R1"
Router1(config)# interface tunnel 0
Router1(config-if)# ip address 10.0.0.1 255.255.255.252
Router1(config-if)# tunnel source 200.1.1.1
Router1(config-if)# tunnel destination 200.1.1.2
Router1(config-if)# tunnel mode gre ip
Router1(config-if)# no shutdown
Router1(config-if)# exit
```

### Configuration Routeur 2 (R2)

```bash title="Créer le tunnel GRE sur R2"
Router2(config)# interface tunnel 0
Router2(config-if)# ip address 10.0.0.2 255.255.255.252
Router2(config-if)# tunnel source 200.1.1.2
Router2(config-if)# tunnel destination 200.1.1.1
Router2(config-if)# tunnel mode gre ip
Router2(config-if)# no shutdown
Router2(config-if)# exit
```

### Routage via le tunnel

```bash title="OSPF sur le tunnel GRE"
Router1(config)# router ospf 1
Router1(config-router)# network 10.0.0.0 0.0.0.3 area 0
Router1(config-router)# network 192.168.1.0 0.0.0.255 area 0
Router1(config-router)# exit
```

:::info
L'interface tunnel doit etre incluse dans les annonces OSPF pour que les routes des deux sites s'echangent a travers le tunnel.
:::

### Verification GRE

```bash title="Vérifier le tunnel GRE"
Router# show interface tunnel 0
Router# ping 10.0.0.2
Router# ping 192.168.2.1 source 192.168.1.1
```

---

## 3. IPsec — Phase 1 (ISAKMP)

IPsec fonctionne en deux phases. La Phase 1 etablit un canal securise pour negocier les parametres de la Phase 2.

```bash title="Créer la politique ISAKMP (Phase 1)"
Router(config)# crypto isakmp policy 10
Router(config-isakmp)# authentication pre-share
Router(config-isakmp)# encryption aes 256
Router(config-isakmp)# hash sha256
Router(config-isakmp)# group 14
Router(config-isakmp)# lifetime 86400
Router(config-isakmp)# exit
```

| Parametre | Valeur | Description |
|---|---|---|
| `authentication pre-share` | — | Cle pre-partagee (PSK) |
| `encryption aes 256` | AES-256 | Algorithme de chiffrement |
| `hash sha256` | SHA-256 | Algorithme de hachage |
| `group 14` | DH 2048 bits | Groupe Diffie-Hellman |
| `lifetime 86400` | 24 heures | Duree de validite de la SA Phase 1 |

```bash title="Configurer la clé pré-partagée"
Router(config)# crypto isakmp key M7Schools@VPN! address 200.1.1.2
```

:::warning
La cle pre-partagee doit etre identique sur les deux routeurs. Utiliser une cle complexe (majuscules, minuscules, chiffres, caracteres speciaux).
:::

---

## 4. IPsec — Phase 2 (Transform Set + Crypto Map)

La Phase 2 definit comment le trafic de donnees est chiffre.

```bash title="Créer le Transform Set (Phase 2)"
Router(config)# crypto ipsec transform-set VPN_TRANSFORM esp-aes 256 esp-sha256-hmac
Router(cfg-crypto-trans)# mode tunnel
Router(cfg-crypto-trans)# exit
```

```bash title="ACL définissant le trafic à chiffrer"
Router(config)# access-list 110 permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255
```

```bash title="Créer la Crypto Map"
Router(config)# crypto map VPN_MAP 10 ipsec-isakmp
Router(config-crypto-map)# match address 110
Router(config-crypto-map)# set peer 200.1.1.2
Router(config-crypto-map)# set transform-set VPN_TRANSFORM
Router(config-crypto-map)# set pfs group14
Router(config-crypto-map)# set security-association lifetime seconds 3600
Router(config-crypto-map)# exit
```

```bash title="Appliquer la Crypto Map sur l'interface WAN"
Router(config)# interface serial 0/0/0
Router(config-if)# crypto map VPN_MAP
Router(config-if)# exit
```

---

## 5. Configuration complete IPsec — Resume

```bash title="Configuration IPsec complète sur R1 (200.1.1.1)"
Router1(config)# crypto isakmp policy 10
Router1(config-isakmp)# authentication pre-share
Router1(config-isakmp)# encryption aes 256
Router1(config-isakmp)# hash sha256
Router1(config-isakmp)# group 14
Router1(config-isakmp)# lifetime 86400
Router1(config-isakmp)# exit
Router1(config)# crypto isakmp key M7Schools@VPN! address 200.1.1.2
Router1(config)# crypto ipsec transform-set VPN_TRANSFORM esp-aes 256 esp-sha256-hmac
Router1(cfg-crypto-trans)# mode tunnel
Router1(cfg-crypto-trans)# exit
Router1(config)# access-list 110 permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255
Router1(config)# crypto map VPN_MAP 10 ipsec-isakmp
Router1(config-crypto-map)# match address 110
Router1(config-crypto-map)# set peer 200.1.1.2
Router1(config-crypto-map)# set transform-set VPN_TRANSFORM
Router1(config-crypto-map)# set pfs group14
Router1(config-crypto-map)# exit
Router1(config)# interface serial 0/0/0
Router1(config-if)# crypto map VPN_MAP
Router1(config-if)# exit
```

:::info Sur R2
Repeter la meme configuration sur R2 en inversant les adresses :
- `crypto isakmp key` → adresse `200.1.1.1`
- `set peer` → `200.1.1.1`
- ACL : source `192.168.2.0`, destination `192.168.1.0`
:::

---

## 6. Verification

| Commande | Description |
|---|---|
| `show crypto isakmp sa` | Sessions ISAKMP (Phase 1) |
| `show crypto ipsec sa` | Sessions IPsec (Phase 2) + compteurs |
| `show crypto map` | Crypto maps configurees |
| `show interface tunnel 0` | Etat du tunnel GRE |
| `debug crypto isakmp` | Negociation Phase 1 en temps reel |
| `debug crypto ipsec` | Negociation Phase 2 en temps reel |

```bash title="Vérifications essentielles"
Router# show crypto isakmp sa
Router# show crypto ipsec sa
```

### Lecture de `show crypto isakmp sa`

```
dst         src         state          conn-id  slot  status
200.1.1.2   200.1.1.1   QM_IDLE           1001     0 ACTIVE
```

| Champ | Description |
|---|---|
| `QM_IDLE` | Phase 1 etablie — tunnel actif |
| `MM_NO_STATE` | Phase 1 echouee — verifier cle PSK et politique |
| `ACTIVE` | SA active |

:::tip Tunnel IPsec inactif
Si `show crypto isakmp sa` ne montre aucune SA, envoyer du trafic interessant (defini par l'ACL 110) pour declencher la negociation :
```
Router1# ping 192.168.2.1 source 192.168.1.1 repeat 10
```
:::

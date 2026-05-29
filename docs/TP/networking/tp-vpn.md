---
id: tp-vpn
title: TP - VPN (GRE & IPsec)
---

# TP - VPN (GRE & IPsec)

4 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Tunnel GRE (Facile-Moyen)

**Objectif :** Creer un tunnel GRE entre deux sites distants.

**Topologie :**
```
[Site A: 192.168.1.0/24] -- [R1: WAN 200.1.1.1] == Internet == [R2: WAN 200.1.1.2] -- [Site B: 192.168.2.0/24]
                                  Tunnel: 10.0.0.1/30 ====== 10.0.0.2/30
```

---

**1. Creer le tunnel GRE sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface tunnel 0
R1(config-if)# ip address 10.0.0.1 255.255.255.252
R1(config-if)# tunnel source 200.1.1.1
R1(config-if)# tunnel destination 200.1.1.2
R1(config-if)# tunnel mode gre ip
R1(config-if)# no shutdown
R1(config-if)# exit
```

</details>

---

**2. Creer le tunnel GRE sur R2.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# interface tunnel 0
R2(config-if)# ip address 10.0.0.2 255.255.255.252
R2(config-if)# tunnel source 200.1.1.2
R2(config-if)# tunnel destination 200.1.1.1
R2(config-if)# tunnel mode gre ip
R2(config-if)# no shutdown
R2(config-if)# exit
```

</details>

---

**3. Ajouter des routes statiques via le tunnel.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1
```

</details>

---

**4. Verifier l etat du tunnel et tester la connectivite.**

<details>
<summary>Voir la reponse</summary>

```
R1# show interface tunnel 0
R1# ping 10.0.0.2
R1# ping 192.168.2.1 source 192.168.1.1
```

L interface tunnel doit etre en etat `up/up`. Si elle est `down`, verifier la connectivite entre les adresses `tunnel source` et `tunnel destination`.

</details>

---

## TP n°2 - OSPF sur Tunnel GRE (Moyen)

**Objectif :** Faire tourner OSPF a travers le tunnel GRE pour le routage dynamique.

---

**1. Activer OSPF sur les interfaces tunnel et LAN de R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 10.0.0.0 0.0.0.3 area 0
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# exit
```

</details>

---

**2. Activer OSPF sur R2.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# router ospf 1
R2(config-router)# router-id 2.2.2.2
R2(config-router)# network 10.0.0.0 0.0.0.3 area 0
R2(config-router)# network 192.168.2.0 0.0.0.255 area 0
R2(config-router)# exit
```

</details>

---

**3. Verifier que les routes OSPF passent a travers le tunnel.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip ospf neighbors
R1# show ip route ospf
```

R1 doit apprendre `192.168.2.0/24` via OSPF avec next-hop `10.0.0.2` (le tunnel).

</details>

---

## TP n°3 - IPsec Phase 1 et Phase 2 (Difficile)

**Objectif :** Configurer IPsec pour chiffrer le trafic entre deux sites.

**Contexte :**
- R1 WAN : `200.1.1.1`, LAN : `192.168.1.0/24`
- R2 WAN : `200.1.1.2`, LAN : `192.168.2.0/24`
- Cle PSK : `M7Schools@VPN!`
- Chiffrement : AES-256, Hachage : SHA-256, DH : groupe 14

---

**1. Configurer la politique ISAKMP Phase 1 sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# crypto isakmp policy 10
R1(config-isakmp)# authentication pre-share
R1(config-isakmp)# encryption aes 256
R1(config-isakmp)# hash sha256
R1(config-isakmp)# group 14
R1(config-isakmp)# lifetime 86400
R1(config-isakmp)# exit
R1(config)# crypto isakmp key M7Schools@VPN! address 200.1.1.2
```

</details>

---

**2. Configurer le Transform Set et la Crypto Map Phase 2 sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# crypto ipsec transform-set VPN_TS esp-aes 256 esp-sha256-hmac
R1(cfg-crypto-trans)# mode tunnel
R1(cfg-crypto-trans)# exit
R1(config)# access-list 110 permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255
R1(config)# crypto map VPN_MAP 10 ipsec-isakmp
R1(config-crypto-map)# match address 110
R1(config-crypto-map)# set peer 200.1.1.2
R1(config-crypto-map)# set transform-set VPN_TS
R1(config-crypto-map)# set pfs group14
R1(config-crypto-map)# set security-association lifetime seconds 3600
R1(config-crypto-map)# exit
R1(config)# interface serial 0/0/0
R1(config-if)# crypto map VPN_MAP
R1(config-if)# exit
```

</details>

---

**3. Repeter la configuration sur R2 avec les adresses inversees.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# crypto isakmp policy 10
R2(config-isakmp)# authentication pre-share
R2(config-isakmp)# encryption aes 256
R2(config-isakmp)# hash sha256
R2(config-isakmp)# group 14
R2(config-isakmp)# lifetime 86400
R2(config-isakmp)# exit
R2(config)# crypto isakmp key M7Schools@VPN! address 200.1.1.1
R2(config)# crypto ipsec transform-set VPN_TS esp-aes 256 esp-sha256-hmac
R2(cfg-crypto-trans)# mode tunnel
R2(cfg-crypto-trans)# exit
R2(config)# access-list 110 permit ip 192.168.2.0 0.0.0.255 192.168.1.0 0.0.0.255
R2(config)# crypto map VPN_MAP 10 ipsec-isakmp
R2(config-crypto-map)# match address 110
R2(config-crypto-map)# set peer 200.1.1.1
R2(config-crypto-map)# set transform-set VPN_TS
R2(config-crypto-map)# set pfs group14
R2(config-crypto-map)# exit
R2(config)# interface serial 0/0/0
R2(config-if)# crypto map VPN_MAP
R2(config-if)# exit
```

</details>

---

## TP n°4 - Verification et Diagnostic IPsec (Difficile)

**Objectif :** Verifier et diagnostiquer un tunnel IPsec.

---

**1. Declencher le tunnel en envoyant du trafic interessant.**

<details>
<summary>Voir la reponse</summary>

```
R1# ping 192.168.2.1 source 192.168.1.1 repeat 10
```

Ce ping genere du trafic qui correspond a l ACL 110, declenchant la negociation IPsec.

</details>

---

**2. Verifier les sessions ISAKMP Phase 1.**

<details>
<summary>Voir la reponse</summary>

```
R1# show crypto isakmp sa
```

L etat `QM_IDLE` confirme que la Phase 1 est etablie. `MM_NO_STATE` indique un echec : verifier la cle PSK et la politique ISAKMP.

</details>

---

**3. Verifier les sessions IPsec Phase 2 et les compteurs de paquets.**

<details>
<summary>Voir la reponse</summary>

```
R1# show crypto ipsec sa
```

Verifier les compteurs `pkts encaps` (paquets chiffres) et `pkts decaps` (paquets dechiffres). Des compteurs incrementants confirment que le trafic est bien chiffre.

</details>

---

**4. Tableau de diagnostic IPsec.**

<details>
<summary>Voir la reponse</summary>

| Symptome | Cause probable | Verification |
|---|---|---|
| `MM_NO_STATE` | Cle PSK differente ou politique ISAKMP incompatible | `show crypto isakmp policy` |
| Phase 1 OK mais pas Phase 2 | ACL trafic interessant incorrecte | `show access-lists 110` |
| Compteurs a 0 | Pas de trafic interessant genere | Ping depuis le bon sous-reseau |
| Tunnel GRE down | Connectivite IP manquante entre WAN | Ping entre IPs WAN |

</details>
